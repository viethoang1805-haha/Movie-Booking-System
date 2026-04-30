// src/hooks/useSocket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, //Không connect ngay — chỉ connect khi vào trang booking
});

socket.on("auth_error", (data) => {
  console.error("Socket auth error:", data.message);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
});

export default socket;