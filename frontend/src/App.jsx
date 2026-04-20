import { useState, useEffect } from "react";
import SeatMap from "./components/booking/SeatMap";

function App() {
  // Lấy showtimeId từ query string: localhost:5173?showtimeId=1
  const params = new URLSearchParams(window.location.search);
  const showtimeId = params.get("showtimeId");

  return showtimeId ? <SeatMap showtimeId={showtimeId} /> : <p>Thiếu showtimeId</p>;
}

export default App;