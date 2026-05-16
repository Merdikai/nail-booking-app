// src/pages/Designs.tsx
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import "./Designs.css";

type Design = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  likes_count: number;
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1610992015732-2449b0c3f0f0?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop",
];

export default function Designs() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchDesigns = async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase
        .from("designs")
        .select("*")
        .order("likes_count", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setDesigns(data);
      } else {
        setDesigns([]);
        setError("No designs found. Add some designs through the admin panel!");
      }
    } catch (err: any) {
      console.error("Error fetching designs:", err);
      setError("Failed to load designs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesigns();
  }, []);

  const handleLike = useCallback(
    async (designId: number) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const { data: existingLike } = await supabase
          .from("design_likes")
          .select("*")
          .eq("design_id", designId)
          .eq("user_id", user.id)
          .single();

        if (existingLike) {
          await supabase
            .from("design_likes")
            .delete()
            .eq("design_id", designId)
            .eq("user_id", user.id);

          await supabase.rpc("decrement_likes", { design_id_param: designId });
        } else {
          await supabase.from("design_likes").insert([
            { design_id: designId, user_id: user.id },
          ]);

          await supabase.rpc("increment_likes", { design_id_param: designId });
        }

        fetchDesigns();
      } catch (err) {
        console.error("Error toggling like:", err);
      }
    },
    [user, navigate]
  );

  const handleBook = (design: Design) => {
    navigate("/booking", { state: design });
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, designId: number) => {
    const fallbackIndex = designId % FALLBACK_IMAGES.length;
    (e.target as HTMLImageElement).src = FALLBACK_IMAGES[fallbackIndex];
  };

  const trending = useMemo(() => {
    return [...designs].sort((a, b) => b.likes_count - a.likes_count).slice(0, 3);
  }, [designs]);

  // Loading State
  if (loading) {
    return (
      <div className="designs-page">
        <div className="container text-center py-5">
          <div className="spinner-border designs-loading" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading amazing designs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="designs-page">
      <div className="container">
        {/* HEADER */}
        <div className="designs-header mb-5">
          <h2>💅 Nail Designs</h2>
          <p>Browse our collection and book your favorite design</p>
        </div>

        {/* Error/Warning Alert */}
        {error && (
          <div className="designs-alert d-flex align-items-center mb-4" role="alert">
            <span className="me-2">⚠️</span>
            <div>{error}</div>
          </div>
        )}

        {/* TRENDING SECTION */}
        {trending.length > 0 && (
          <div className="trending-section mb-5">
            <h4>🔥 Trending Now</h4>
            <div className="row">
              {trending.map((design) => (
                <div key={design.id} className="col-md-4 mb-3">
                  <div
                    className="trending-card card p-3"
                    onClick={() => handleBook(design)}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={design.image_url}
                        alt={design.name}
                        style={{ width: "60px", height: "60px", objectFit: "cover" }}
                        onError={(e) => handleImageError(e, design.id)}
                      />
                      <div className="ms-3">
                        <p className="mb-0 fw-bold">{design.name}</p>
                        <small>
                          ❤️ {design.likes_count} likes
                          {design.price > 0 && ` • $${design.price}`}
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ALL DESIGNS GRID */}
        {designs.length === 0 && !loading && !error ? (
          <div className="text-center py-5">
            <div className="designs-empty">🎨</div>
            <h3>No designs available yet</h3>
            <p className="text-muted">Check back soon for new designs!</p>
          </div>
        ) : (
          <section className="row">
            {designs.map((design) => (
              <div key={design.id} className="col-md-4 col-lg-3 mb-4">
                <div className="design-card card h-100">
                  <div className="position-relative overflow-hidden">
                    <img
                      src={design.image_url}
                      alt={design.name}
                      className="card-img-top"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                      }}
                      onError={(e) => handleImageError(e, design.id)}
                    />
                    {design.price > 0 && (
                      <span className="price-badge">${design.price}</span>
                    )}
                  </div>

                  <div className="card-body">
                    <h5>{design.name}</h5>

                    {design.brand && (
                      <p className="text-muted small mb-1">
                        <strong>Brand:</strong> {design.brand}
                      </p>
                    )}

                    {design.category && (
                      <p className="text-muted small mb-2">
                        <strong>Category:</strong> {design.category}
                      </p>
                    )}

                    {design.description && (
                      <p className="small text-muted mb-3" style={{ lineHeight: "1.4" }}>
                        {design.description.length > 80
                          ? design.description.substring(0, 80) + "..."
                          : design.description}
                      </p>
                    )}

                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <p className="mb-0 small">❤️ {design.likes_count} Likes</p>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        className="like-btn flex-grow-1"
                        onClick={() => handleLike(design.id)}
                      >
                        ❤️ Like
                      </button>

                      <button
                        className="book-btn flex-grow-1"
                        onClick={() => handleBook(design)}
                      >
                        📅 Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}