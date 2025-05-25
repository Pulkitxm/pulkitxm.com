import express, { Request, Response, Application } from "express";
import { createServer } from "node:http";
import { Server, Socket } from "socket.io";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import { createHash, randomBytes } from "crypto";
import { ALLOWED_ORIGINS, IP_SALT, PORT, PROD_APP } from "./constants";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },

  maxHttpBufferSize: 1e6,
  pingTimeout: 60000,
  pingInterval: 25000,
});

const activeConnections = new Map<
  string,
  {
    socket: Socket;
    joinedAt: number;
    lastActivity: number;
    ipAddress: string;
    userAgent?: string;
  }
>();

const ipConnectionCount = new Map<string, number>();
const MAX_CONNECTIONS_PER_IP = 5;
const CONNECTION_TIMEOUT = 30 * 60 * 1000;

function generateSessionId(): string {
  return randomBytes(16).toString("hex");
}

function hashIP(ip: string): string {
  return createHash("sha256")
    .update(ip + IP_SALT)
    .digest("hex")
    .substring(0, 16);
}

function getClientIP(socket: Socket): string {
  const forwarded = socket.handshake.headers["x-forwarded-for"];
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0] || socket.handshake.address;
  return ip || "unknown";
}

function isValidUsername(username: unknown): username is string {
  if (typeof username !== "string") return false;
  const trimmed = username.trim();
  return trimmed.length > 0 && trimmed.length <= 30 && /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

function cleanupStaleConnections(): void {
  const now = Date.now();
  const staleConnections: string[] = [];

  for (const [sessionId, data] of activeConnections) {
    if (now - data.lastActivity > CONNECTION_TIMEOUT || !data.socket.connected) {
      staleConnections.push(sessionId);
    }
  }

  staleConnections.forEach((sessionId) => {
    const data = activeConnections.get(sessionId);
    if (data) {
      if (data.socket.connected) {
        data.socket.disconnect(true);
        console.log(`Explicitly disconnected stale socket: ${sessionId}`);
      }

      const hashedIP = hashIP(data.ipAddress);
      const currentCount = ipConnectionCount.get(hashedIP) || 0;
      if (currentCount > 0) {
        ipConnectionCount.set(hashedIP, currentCount - 1);
      } else {
        ipConnectionCount.delete(hashedIP);
      }
      activeConnections.delete(sessionId);
    }
  });

  if (staleConnections.length > 0) {
    console.log(`Cleaned up ${staleConnections.length} stale connections`);
    broadcastStats();
  }
}

function getActiveVisitorCount(): number {
  cleanupStaleConnections();
  return activeConnections.size;
}

function getUniqueIPCount(): number {
  const uniqueIPs = new Set<string>();
  for (const data of activeConnections.values()) {
    uniqueIPs.add(hashIP(data.ipAddress));
  }
  return uniqueIPs.size;
}

function broadcastStats(): void {
  const stats = {
    totalVisitors: getActiveVisitorCount(),
    uniqueIPs: getUniqueIPCount(),
    timestamp: Date.now(),
  };

  io.emit("visitorStats", stats);
}

io.use((socket, next) => {
  const clientIP = getClientIP(socket);
  const hashedIP = hashIP(clientIP);

  const currentConnections = ipConnectionCount.get(hashedIP) || 0;
  if (currentConnections >= MAX_CONNECTIONS_PER_IP) {
    return next(new Error("Too many connections from this IP"));
  }

  socket.data.clientIP = clientIP;
  socket.data.hashedIP = hashedIP;

  next();
});

io.on("connection", (socket) => {
  const sessionId = generateSessionId();
  const clientIP = socket.data.clientIP;
  const hashedIP = socket.data.hashedIP;
  const userAgent = socket.handshake.headers["user-agent"];

  console.log(`New connection: ${sessionId} from ${hashedIP}`);

  activeConnections.set(sessionId, {
    socket,
    joinedAt: Date.now(),
    lastActivity: Date.now(),
    ipAddress: clientIP,
    userAgent,
  });

  ipConnectionCount.set(hashedIP, (ipConnectionCount.get(hashedIP) || 0) + 1);

  socket.emit("connected", { sessionId });
  broadcastStats();

  socket.on("join", (data) => {
    try {
      const { username } = data || {};

      if (username && !isValidUsername(username)) {
        socket.emit("error", { message: "Invalid username format" });
        return;
      }

      const connectionData = activeConnections.get(sessionId);
      if (connectionData) {
        connectionData.lastActivity = Date.now();
      }

      socket.emit("joinSuccess", { username: username?.trim() });
      broadcastStats();
    } catch (error) {
      console.error("Error handling join event:", error);
      socket.emit("error", { message: "Failed to join" });
    }
  });

  socket.on("heartbeat", () => {
    const connectionData = activeConnections.get(sessionId);
    if (connectionData) {
      connectionData.lastActivity = Date.now();
    }
  });

  socket.on("pageView", (data) => {
    try {
      const { path } = data || {};
      const connectionData = activeConnections.get(sessionId);

      if (connectionData && path && typeof path === "string") {
        connectionData.lastActivity = Date.now();

        console.log(`Page view: ${path} from ${hashedIP}`);
      }
    } catch (error) {
      console.error("Error handling page view:", error);
    }
  });

  socket.on("disconnect", (reason) => {
    try {
      console.log(`Disconnection: ${sessionId} (${reason})`);

      const connectionData = activeConnections.get(sessionId);
      if (connectionData) {
        const ipToDecrement = socket.data.hashedIP || hashIP(connectionData.ipAddress);
        const currentCount = ipConnectionCount.get(ipToDecrement);

        if (typeof currentCount === "number" && currentCount > 0) {
          ipConnectionCount.set(ipToDecrement, currentCount - 1);
        } else if (typeof currentCount === "number" && currentCount <= 0) {
          ipConnectionCount.delete(ipToDecrement);
          console.warn(
            `IP count for ${ipToDecrement} was already ${currentCount} or less upon disconnect for ${sessionId}.`
          );
        }

        activeConnections.delete(sessionId);
      }

      broadcastStats();
    } catch (error) {
      console.error("Error handling disconnect event:", error);
    }
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${sessionId}:`, error);
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    activeConnections: getActiveVisitorCount(),
    uniqueIPs: getUniqueIPCount(),
    uptime: process.uptime(),
  });
});

app.all("*", (req: Request, res: Response) => {
  res.redirect(PROD_APP);
});

setInterval(cleanupStaleConnections, 5 * 60 * 1000);

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

server.listen(PORT, () => {
  console.log(`Portfolio visitor tracker running at http://localhost:${PORT}`);
});
