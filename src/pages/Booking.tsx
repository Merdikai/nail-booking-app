// src/pages/Booking.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import "./Booking.css";

type Design = {
  id: number;
  name: string;
  image_url: string;
};

export default function Booking() {
  const location = useLocation();
  const design = location.state as Design | null;
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { addBooking } = useBooking();

  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: profile?.full_name || "",
    phone: profile?.phone_number || "",
    date: "",
    time: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (!form.name || !form.phone || !form.date || !form.time) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error: bookingError } = await supabase.from("bookings").insert([
        {
          user_id: user.id,
          design_id: design?.id || null,
          customer_name: form.name,
          phone: form.phone,
          appointment_date: form.date,
          appointment_time: form.time,
          status: "pending",
        },
      ]);

      if (bookingError) throw bookingError;

      addBooking({
        name: form.name,
        phone: form.phone,
        date: form.date,
        time: form.time,
        design: design?.name || "No design selected",
      });

      setBooked(true);
      setTimeout(() => {
        navigate("/profile");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Booking failed");
      console.error("Booking error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Confirmation Screen
  if (booked) {
    return (
      <div className="booking-page">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="booking-confirmed-card">
                <div className="confetti-icon">🎉</div>
                <h2>Booking Confirmed!</h2>
                <p className="text-muted">We will contact you soon 💅</p>
                <button
                  className="btn-pink mt-3"
                  onClick={() => navigate("/designs")}
                >
                  Browse More Designs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Booking Form
  return (
    <div className="booking-page">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <h2>📅 Book Appointment</h2>

            {/* Selected Design Card */}
            {design && (
              <div className="selected-design-card mb-4">
                <div className="d-flex align-items-center">
                  <img
                    src={design.image_url}
                    alt={design.name}
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/80x80/f8d7da/721c24?text=Nail";
                    }}
                  />
                  <div className="ms-3">
                    <h5 className="mb-0">{design.name}</h5>
                    <p className="text-muted mb-0">Selected Design</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="alert-danger-custom mb-3">{error}</div>
            )}

            {/* Booking Form Card */}
            <div className="booking-form-card">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-control"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    className="form-control"
                    placeholder="Your phone number"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Appointment Date</label>
                  <input
                    className="form-control"
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    required
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Appointment Time</label>
                  <input
                    className="form-control"
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm({ ...form, time: e.target.value })
                    }
                    required
                  />
                </div>

                <button
                  className="booking-submit-btn"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Booking...
                    </>
                  ) : (
                    "✨ Confirm Booking"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}