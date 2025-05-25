"use client";

import { UserIcon } from "lucide-react";
import { useFeatureFlagEnabled } from "posthog-js/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

import { WS_URL } from "@/lib/constants";

interface VisitorStats {
  totalVisitors: number;
  uniqueIPs: number;
  timestamp: number;
}

type ConnectionState = "connecting" | "connected" | "disconnected" | "error";

interface ActiveUsersProps {
  showUniqueIPs?: boolean;
  reconnectAttempts?: number;
  heartbeatInterval?: number;
  fallbackCount?: number;
}

export default function ActiveUsers() {
  const showActiveUsers = useFeatureFlagEnabled("active-users") !== false;
  if (!showActiveUsers) return null;

  return (
    <li className="flex cursor-text items-center space-x-1 select-none" title="Active Visitors">
      <div className="h-2 w-2 animate-pulse rounded-full bg-green-400 transition-all duration-[10ms] ease-in-out" />
      <ShowActiveUsers />
      <UserIcon className="ml-1 h-4 w-4" />
    </li>
  );
}

function ShowActiveUsers({
  showUniqueIPs = false,
  reconnectAttempts = 5,
  heartbeatInterval = 30000,
  fallbackCount = 1
}: ActiveUsersProps) {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisitors: 0,
    uniqueIPs: 0,
    timestamp: 0
  });
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== "undefined" ? navigator.onLine : true);

  const lastStatsRef = useRef<VisitorStats | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);

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

  const connectSocketRef = useRef(() => {});

  const handleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= reconnectAttempts) {
      console.log("Max reconnection attempts reached");
      setConnectionError("Failed to connect after multiple attempts");
      setConnectionState("error");
      return;
    }

    if (!isOnline) {
      console.log("Network offline, waiting for online status before reconnecting");
      return;
    }

    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    console.log(
      `Attempting to reconnect in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${reconnectAttempts})`
    );

    setConnectionState("connecting");
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttemptsRef.current++;
      if (connectSocketRef.current) {
        connectSocketRef.current();
      }
    }, delay);
  }, [reconnectAttempts, isOnline]);

  const connectSocket = useCallback(() => {
    if (socketRef.current?.connected) {
      return;
    }

    if (!isOnline) {
      console.log("Network is offline, delaying connection attempt");
      setConnectionState("disconnected");
      return;
    }

    setConnectionError(null);
    setConnectionState("connecting");
    console.log("Connecting to WebSocket:", WS_URL);

    try {
      const socket = io(WS_URL, {
        transports: ["websocket", "polling"],
        timeout: 10000,
        forceNew: true,
        reconnectionAttempts: 0,
        autoConnect: true
      });

      socketRef.current = socket;

      const connectionTimeoutId = setTimeout(() => {
        if (socketRef.current && !socketRef.current.connected) {
          console.error("Connection timeout");
          socket.disconnect();
          setConnectionError("Connection timeout - server not responding");
          setConnectionState("error");
          handleReconnect();
        }
      }, 15000);

      socket.on("connect", () => {
        console.log("Connected to WebSocket");
        clearTimeout(connectionTimeoutId);
        setConnectionState("connected");
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
        lastStatsRef.current = newStats;
      });

      socket.on("joinSuccess", (data) => {
        console.log("Join successful:", data);
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
        const errorMessage = error?.message || "Connection error occurred";
        setConnectionError(errorMessage);
        setConnectionState("error");

        if (errorMessage.includes("server") || errorMessage.includes("denied")) {
          const delay = Math.min(5000 * Math.pow(1.5, reconnectAttemptsRef.current), 60000);
          reconnectTimeoutRef.current = setTimeout(() => {
            handleReconnect();
          }, delay);
        } else {
          handleReconnect();
        }
      });

      socket.on("disconnect", (reason) => {
        console.log("Disconnected:", reason);
        setConnectionState("disconnected");

        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        if (reason === "io client disconnect" || reason === "io server disconnect") {
          console.log("Intentional disconnect, not attempting reconnection");
        } else if (reason === "ping timeout") {
          setConnectionError("Connection timed out - server not responding");
          handleReconnect();
        } else if (reason === "transport close" || reason === "transport error") {
          setConnectionError("Network connection lost");
          handleReconnect();
        } else {
          handleReconnect();
        }
      });

      socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        const errorMessage = error?.message || "Failed to connect to server";
        setConnectionError(errorMessage);
        setConnectionState("error");

        clearTimeout(connectionTimeoutId);

        if (errorMessage.includes("CORS") || errorMessage.includes("Unauthorized")) {
          console.error("CORS or authorization error - connection may not be possible");

          const delay = Math.min(8000 * Math.pow(1.5, reconnectAttemptsRef.current), 60000);
          reconnectTimeoutRef.current = setTimeout(() => {
            handleReconnect();
          }, delay);
        } else {
          handleReconnect();
        }
      });
    } catch (error) {
      console.error("Error initializing socket connection:", error);
      setConnectionError("Failed to initialize socket connection");
      setConnectionState("error");
      handleReconnect();
    }
  }, [startHeartbeat, handleReconnect, isOnline]);

  useEffect(() => {
    connectSocketRef.current = connectSocket;
  }, [connectSocket]);

  const lastPageViewRef = useRef<{ path: string; time: number } | null>(null);

  const trackPageView = useCallback((path: string) => {
    const now = Date.now();
    const minInterval = 500;

    if (
      lastPageViewRef.current &&
      lastPageViewRef.current.path === path &&
      now - lastPageViewRef.current.time < minInterval
    ) {
      return;
    }

    if (socketRef.current?.connected) {
      try {
        socketRef.current.emit("pageView", { path });
        console.log("Page view tracked:", path);
        lastPageViewRef.current = { path, time: now };
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    } else {
      console.warn("Cannot track page view: socket not connected");
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      console.log("Network is online");
      setIsOnline(true);

      if (connectionState === "disconnected" || connectionState === "error") {
        connectSocket();
      }
    };

    const handleOffline = () => {
      console.log("Network is offline");
      setIsOnline(false);
      setConnectionState("disconnected");
      setConnectionError("Network connection lost");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      }
    };
  }, [connectionState, connectSocket]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      connectSocket();

      trackPageView(window.location.pathname);

      const handlePopstate = () => {
        trackPageView(window.location.pathname);
      };

      const handleRouteChange = () => {
        trackPageView(window.location.pathname);
      };

      window.addEventListener("popstate", handlePopstate);

      if (typeof window !== "undefined" && (window as unknown as { __NEXT_DATA__?: unknown }).__NEXT_DATA__) {
        document.addEventListener("routeChangeComplete", handleRouteChange);
      }

      return () => {
        window.removeEventListener("popstate", handlePopstate);
        if (typeof window !== "undefined" && (window as unknown as { __NEXT_DATA__?: unknown }).__NEXT_DATA__) {
          document.removeEventListener("routeChangeComplete", handleRouteChange);
        }
        cleanup();
      };
    } catch (error) {
      console.error("Error in socket initialization:", error);
      setConnectionError("Failed to initialize socket");
      setConnectionState("error");
    }
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
    if (typeof window !== "undefined") {
      (window as unknown as { trackPageView?: typeof trackPageView }).trackPageView = trackPageView;

      return () => {
        delete (window as unknown as { trackPageView?: typeof trackPageView }).trackPageView;
      };
    }
  }, [trackPageView]);

  const visitorCount = showUniqueIPs ? stats.uniqueIPs : stats.totalVisitors;

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("ActiveUsers Debug:", {
        connectionState,
        connectionError,
        isOnline,
        stats,
        visitorCount,
        reconnectAttempts: reconnectAttemptsRef.current
      });
    }
  }, [connectionState, connectionError, isOnline, stats, visitorCount]);

  const displayCount =
    connectionState === "connected"
      ? visitorCount
      : connectionState === "connecting" && lastStatsRef.current
        ? showUniqueIPs
          ? lastStatsRef.current.uniqueIPs
          : lastStatsRef.current.totalVisitors
        : fallbackCount;

  return displayCount;
}
