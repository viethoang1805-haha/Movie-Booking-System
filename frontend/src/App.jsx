// src/App.jsx

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";

import Home from "./pages/Home";
import MovieDetail from "./pages/MovieDetail";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import History from "./pages/History";
import Booking from "./pages/Booking";
import SeatMap from "./components/booking/SeatMap";

import Dashboard from "./pages/admin/Dashboard";
import AdminMovies from "./pages/admin/Movies";
import AdminUsers from "./pages/admin/Users";
import AdminBookings from "./pages/admin/Bookings";
import AdminShowtimes from "./pages/admin/Showtimes";

import useAuthStore from "./store/auth.store";

/* ───────────────── PRIVATE ROUTE ───────────────── */

function PrivateRoute({ children }) {
  const { token } = useAuthStore();

  return token ? children : <Navigate to="/login" replace />;
}

/* ───────────────── ADMIN ROUTE ───────────────── */

function AdminRoute({ children }) {
  const { user, token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
}

/* ───────────────── BOOKING PAGE ───────────────── */

function BookingPage() {
  const { showtimeId } = useParams();

  return (
    <SeatMap showtimeId={showtimeId} />
  );
}

/* ───────────────── APP ───────────────── */

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />

        <Route
          path="/movies/:id"
          element={<MovieDetail />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />

        {/* PRIVATE */}
        <Route
          path="/booking/:showtimeId"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/movies"
          element={
            <AdminRoute>
              <AdminMovies />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/showtimes"
          element={
            <AdminRoute>
              <AdminShowtimes />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookings />
            </AdminRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;