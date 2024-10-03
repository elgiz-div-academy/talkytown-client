import { io, Socket } from "socket.io-client";

let socket: Socket;

export const initializeSocket = (token: string) => {
  if (socket) return socket;
  socket = io(process.env.NEXT_PUBLIC_API_URL, { transports: ["websocket"] });

  socket.on("connect", () => {
    console.log("Connected to socket server");
    socket.emit("auth", { token: token });
  });

  socket.on("authenticated", () => {
    console.log("Authenticated successfully");
  });

  socket.on("unauthorized", (error) => {
    console.error("Authentication failed:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.close();
  }
};
