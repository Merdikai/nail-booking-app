// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import "./Profile.css";

type Booking = {
  id: number;
  design_id: number;
  customer_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
};

export default function Profile() {
  const { profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", profile.id)
        .order("appointment_date", { ascending: false });

      setBookings(data || []);
      setLoading(false);
    };

    fetchBookings();
  }, [profile]);

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.status === "completed").length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "confirmed").length;
  const progressPercent = Math.min((completedBookings / 15) * 100, 100);
  const remainingForReward = Math.max(15 - completedBookings, 0);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "confirmed": return "badge-confirmed";
      case "pending": return "badge-pending";
      case "completed": return "badge-completed";
      case "cancelled": return "badge-cancelled";
      default: return "badge-default";
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case "confirmed": return "✅";
      case "pending": return "⏳";
      case "completed": return "🎉";
      case "cancelled": return "❌";
      default: return "📋";
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h2>👤 My Profile</h2>

        <div className="row">
          <div className="col-lg-4 mb-4">
            <div className="profile-info-card">
              <div className="profile-avatar">
                <span>{profile?.full_name?.charAt(0)?.toUpperCase() || "👤"}</span>
              </div>
              <h5 className="text-center">{profile?.full_name || "User"}</h5>
              <p className="text-center text-muted">{profile?.email}</p>
              {profile?.phone_number && (
                <p className="text-center text-muted">📞 {profile.phone_number}</p>
              )}
            </div>

            <div className="loyalty-card mt-3">
              <h5>🎁 Loyalty Program</h5>

              <div className="row mb-3">
                <div className="col-6 mb-2">
                  <div className="stat-mini-card">
                    <span className="stat-mini-number">{totalBookings}</span>
                    <span className="stat-mini-label">Total</span>
                  </div>
                </div>
                <div className="col-6 mb-2">
                  <div className="stat-mini-card">
                    <span className="stat-mini-number">{pendingBookings}</span>
                    <span className="stat-mini-label">Pending</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-mini-card">
                    <span className="stat-mini-number">{confirmedBookings}</span>
                    <span className="stat-mini-label">Confirmed</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="stat-mini-card">
                    <span className="stat-mini-number">{completedBookings}</span>
                    <span className="stat-mini-label">Completed</span>
                  </div>
                </div>
              </div>

              <p className="mb-2">Progress to Free Service:</p>
              <div className="loyalty-progress mb-2">
                <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <p className="loyalty-info">{completedBookings} / 15 completed</p>

              {completedBookings >= 15 ? (
                <div className="loyalty-reward">
                  🎉 Congratulations! You've earned a free nail service!
                </div>
              ) : (
                <p className="loyalty-info">
                  {remainingForReward} more completed visits to unlock a free service 🎁
                </p>
              )}
            </div>
          </div>

          <div className="col-lg-8">
            <div className="bookings-card">
              <h5>📅 My Bookings</h5>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border profile-spinner" role="status" />
                  <p className="text-muted mt-2">Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="bookings-empty">
                  <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💅</div>
                  <p>No bookings yet</p>
                  <p className="text-muted small">Start by browsing our nail designs!</p>
                  <Link to="/designs" className="btn btn-pink mt-2">
                    Browse Designs
                  </Link>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="mb-1">{booking.customer_name}</h6>
                          <p className="mb-1 small text-muted">📅 {formatDate(booking.appointment_date)}</p>
                          <p className="mb-0 small text-muted">⏰ {booking.appointment_time}</p>
                        </div>
                        <span className={`badge ${getStatusClass(booking.status)}`}>
                          {getStatusEmoji(booking.status)} {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}