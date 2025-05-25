"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import { WS_URL } from "@/lib/constants";

interface VisitorStats {
  totalVisitors: number;
  uniqueIPs: number;
  timestamp: number;
}

interface ActiveUsersProps {
  showUniqueIPs?: boolean;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
}

export default function ActiveUsers({
  showUniqueIPs = false,
  reconnectAttempts = 5,
  heartbeatInterval = 30000
}: ActiveUsersProps) {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisitors: 0,
    uniqueIPs: 0,
    timestamp: 0
  });
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const cleanup = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit("heartbeat");
      }
    }, heartbeatInterval);
  }, [heartbeatInterval]);

  const handleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= reconnectAttempts) {
      console.log("Max reconnection attempts reached");
      setConnectionError("Failed to connect after multiple attempts");
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${reconnectAttempts})`
    );

    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current++;
      connectSocket();
    }, delay);
  }, [reconnectAttempts]);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    console.log("Connecting to WebSocket:", WS_URL);

    const socket = io(WS_URL, {
      transports: ["websocket", "polling"],
      timeout: 10000,
      forceNew: true
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
      setConnectionError(null);
      reconnectAttemptsRef.current = 0;

      startHeartbeat();
    });

    socket.on("connected", (data) => {
      console.log("Connection confirmed with session:", data.sessionId);
    });

    socket.on("visitorStats", (newStats: VisitorStats) => {
      console.log("Visitor stats received:", newStats);
      setStats(newStats);
    });

    socket.on("joinSuccess", (data) => {
      console.log("Join successful:", data);
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
      setConnectionError(error.message || "Connection error occurred");
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
      setIsConnected(false);

      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }

      if (reason !== "io client disconnect") {
        handleReconnect();
      }
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setConnectionError("Failed to connect to server");
      setIsConnected(false);
      handleReconnect();
    });
  }, [startHeartbeat, handleReconnect]);

  const trackPageView = useCallback((path: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit("pageView", { path });
    }
  }, []);

  useEffect(() => {
    connectSocket();

    trackPageView(window.location.pathname);

    const handlePopstate = () => {
      trackPageView(window.location.pathname);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
      cleanup();
    };
  }, [connectSocket, trackPageView, cleanup]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
      } else {
        startHeartbeat();

        if (socketRef.current?.connected) {
          socketRef.current.emit("heartbeat");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [startHeartbeat]);

  useEffect(() => {
    // @ts-expect-error window.trackPageView
    window.trackPageView = trackPageView;

    return () => {
      // @ts-expect-error window.trackPageView
      delete window.trackPageView;
    };
  }, [trackPageView]);

  const visitorCount = showUniqueIPs ? stats.uniqueIPs : stats.totalVisitors;

  if (process.env.NODE_ENV === "development") {
    console.log("ActiveUsers Debug:", {
      isConnected,
      connectionError,
      stats,
      visitorCount
    });
  }

  return visitorCount;
}
