// hooks/useSocket.js
import { io } from "socket.io-client";

// ✅ Gắn vào window để đảm bảo chỉ có 1 instance duy nhất
if (!window._socket) {
  window._socket = io(import.meta.env.VITE_SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    transports: ["websocket"],
  });
}

export default window._socket;