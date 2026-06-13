 
// src/pages/Booking.jsx
import { useParams } from "react-router-dom";
import SeatMap from "../components/booking/SeatMap";

export default function Booking() {
  const { showtimeId } = useParams();
  return <SeatMap showtimeId={showtimeId} />;
}