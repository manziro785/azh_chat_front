import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuthStore } from "../store/useAuthStore";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  // The server broadcasts user_status {userId, status} to everyone on connect
  // and disconnect. There is no roster endpoint, so this only knows about
  // people who changed state while we were connected — members not in here
  // fall back to their last_seen timestamp.
  const [onlineUserIds, setOnlineUserIds] = useState(() => new Set());

  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token) return;

    const newSocket = io(
      import.meta.env.VITE_SOCKET_URL || "http://localhost:3000",
      {
        auth: { token },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      }
    );

    const handleStatus = ({ userId, status }) => {
      if (!userId) return;
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (status === "online") next.add(String(userId));
        else next.delete(String(userId));
        return next;
      });
    };

    newSocket.on("connect", () => setIsConnected(true));
    newSocket.on("disconnect", () => setIsConnected(false));
    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);
    });
    newSocket.on("error", (error) => console.error("Socket error:", error));
    newSocket.on("user_status", handleStatus);

    setSocket(newSocket);

    return () => {
      newSocket.off("user_status", handleStatus);
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setOnlineUserIds(new Set());
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket, isConnected, onlineUserIds }}>
      {children}
    </SocketContext.Provider>
  );
};
