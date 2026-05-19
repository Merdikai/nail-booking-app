// src/pages/Admin.tsx
import { useState, useEffect, useRef, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";
import "./Admin.css";

type Design = {
  id: number;
  name: string;
  image_url: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  likes_count: number;
  created_at: string;
  company_id: string;
};

type Booking = {
  id: number;
  user_id: string;
  design_id: number;
  customer_name: string;
  phone: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
  company_id: string;
  designs?: {
    id: number;
    name: string;
    image_url: string;
    price: number;
  };
};

export default function Admin() {
  const { profile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [designs, setDesigns] = useState<Design[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "designs" | "add-design">("bookings");
  const [bookingFilter, setBookingFilter] = useState<"active" | "archived">("active");
  const [loading, setLoading] = useState(false);

  const [designName, setDesignName] = useState("");
  const [designImageUrl, setDesignImageUrl] = useState("");
  const [designDescription, setDesignDescription] = useState("");
  const [designBrand, setDesignBrand] = useState("");
  const [designCategory, setDesignCategory] = useState("");
  const [designPrice, setDesignPrice] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const activeBookings = useMemo(() => bookings.filter((b) => b.status === "pending" || b.status === "confirmed"), [bookings]);
  const archivedBookings = useMemo(() => bookings.filter((b) => b.status === "completed" || b.status === "cancelled"), [bookings]);
  const displayedBookings = bookingFilter === "active" ? activeBookings : archivedBookings;

  const fetchBookings = async () => {
    setLoading(true);
    let query = supabase.from("bookings").select(`*, designs(id, name, image_url, price)`);
    if (profile?.role !== "super_admin") {
      query = query.eq("company_id", profile?.company_id || "");
    }
    const { data } = await query.order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const fetchDesigns = async () => {
    setLoading(true);
    let query = supabase.from("designs").select("*");
    if (profile?.role !== "super_admin") {
      query = query.eq("company_id", profile?.company_id || "");
    }
    const { data } = await query.order("created_at", { ascending: false });
    setDesigns(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
    fetchDesigns();
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
      setDesignImageUrl("");
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (uploadMethod === "file" && selectedFile) {
      setUploadProgress("Uploading image...");
      const fileExt = selectedFile.name.split(".").pop()?.toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `designs/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("design-images").upload(filePath, selectedFile, { cacheControl: "3600", upsert: false });
      if (uploadError) { setUploadProgress("Upload failed: " + uploadError.message); return null; }
      const { data: urlData } = supabase.storage.from("design-images").getPublicUrl(filePath);
      setUploadProgress("Upload complete!");
      return urlData.publicUrl;
    }
    if (uploadMethod === "url" && designImageUrl) return designImageUrl;
    return null;
  };

  const handleAddDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (uploadMethod === "file" && !selectedFile) { alert("Please select an image"); setLoading(false); return; }
    if (uploadMethod === "url" && !designImageUrl) { alert("Please enter a URL"); setLoading(false); return; }
    if (!designName || !designBrand || !designCategory) { alert("Fill required fields"); setLoading(false); return; }

    try {
      const imageUrl = await uploadImage();
      if (!imageUrl) { alert("Failed to upload image"); setLoading(false); return; }
      const { error } = await supabase.from("designs").insert([{
        name: designName, image_url: imageUrl, description: designDescription || null,
        brand: designBrand, category: designCategory, price: parseFloat(designPrice) || 0,
        created_by: profile?.id,
        company_id: profile?.company_id
      }]);
      if (error) throw error;
      setUploadSuccess("Design added!");
      setDesignName(""); setDesignImageUrl(""); setDesignDescription(""); setDesignBrand(""); setDesignCategory(""); setDesignPrice("");
      setSelectedFile(null); setPreviewUrl(""); setUploadProgress("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchDesigns();
      setTimeout(() => setUploadSuccess(""), 5000);
    } catch (err: any) { alert("Failed to add design: " + err.message); }
    setLoading(false);
  };

  const handleDeleteDesign = async (id: number, imageUrl: string) => {
    if (!window.confirm("Delete this design?")) return;
    if (imageUrl.includes("supabase")) {
      try { const urlParts = imageUrl.split("/design-images/"); if (urlParts.length > 1) await supabase.storage.from("design-images").remove([urlParts[1]]); } catch {}
    }
    await supabase.from("designs").delete().eq("id", id);
    fetchDesigns();
  };

  const handleUpdateStatus = async (bookingId: number, newStatus: string) => {
    await supabase.from("bookings").update({ status: newStatus }).eq("id", bookingId);
    fetchBookings();
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "confirmed": return "badge-confirmed";
      case "pending": return "badge-pending";
      case "completed": return "badge-completed";
      case "cancelled": return "badge-cancelled";
      default: return "badge-default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return "✅"; case "pending": return "⏳";
      case "completed": return "🎉"; case "cancelled": return "❌";
      default: return "📋";
    }
  };

  const getBorderClass = (status: string) => {
    switch (status) {
      case "confirmed": return "border-confirmed"; case "pending": return "border-pending";
      case "completed": return "border-completed"; case "cancelled": return "border-cancelled";
      default: return "";
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  const companyName = profile?.company_name || "Admin";

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <div className="col-12 mb-3">
      <div className={`admin-booking-card card shadow-sm ${getBorderClass(booking.status)}`}>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-2 text-center">
              {booking.designs ? (
                <>
                  <img src={booking.designs.image_url} alt={booking.designs.name} className="booking-design-img" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  <div className="mt-1"><span className="badge booking-design-badge">💅 {booking.designs.name}</span></div>
                </>
              ) : (
                <div className="booking-no-design"><span className="text-muted small">No design</span></div>
              )}
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center mb-2">
                <h6 className="mb-0 me-2">{booking.customer_name}</h6>
                <span className={`badge ${getStatusBadgeClass(booking.status)}`}>{getStatusIcon(booking.status)} {booking.status}</span>
              </div>
              <div className="row">
                <div className="col-sm-6"><p className="mb-1 small">📞 {booking.phone}</p><p className="mb-1 small">📅 {formatDate(booking.appointment_date)}</p></div>
                <div className="col-sm-6"><p className="mb-1 small">⏰ {booking.appointment_time}</p>{booking.designs?.price && booking.designs.price > 0 && <p className="mb-1 small">💰 ${booking.designs.price}</p>}</div>
              </div>
              <small className="text-muted">Booked: {formatDate(booking.created_at)}</small>
            </div>
            <div className="col-md-4">
              <div className="admin-status-update-card">
                <label className="form-label small fw-bold mb-1">Update Status:</label>
                <select className="form-select form-select-sm admin-status-select" value={booking.status} onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}>
                  <option value="pending">⏳ Pending</option>
                  <option value="confirmed">✅ Confirmed</option>
                  <option value="completed">🎉 Completed</option>
                  <option value="cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="container-fluid py-4">
        <div className="row">
          <div className="col-12">
            <div className="admin-header">
              <div>
                <h1>🧑‍💼 Admin Dashboard</h1>
                <p className="text-muted">Welcome back, {profile?.full_name} — {companyName}</p>
              </div>
              <div className="admin-mode-badge">⚡ Admin Mode</div>
            </div>

            <ul className="admin-nav-tabs nav nav-tabs mb-4">
              <li className="nav-item"><button className={`nav-link ${activeTab === "bookings" ? "active" : ""}`} onClick={() => { setActiveTab("bookings"); fetchBookings(); }}>📅 Bookings <span className="badge admin-badge-count ms-2">{activeBookings.length}</span></button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab === "designs" ? "active" : ""}`} onClick={() => { setActiveTab("designs"); fetchDesigns(); }}>🎨 Designs ({designs.length})</button></li>
              <li className="nav-item"><button className={`nav-link ${activeTab === "add-design" ? "active" : ""}`} onClick={() => setActiveTab("add-design")}>➕ Add New Design</button></li>
            </ul>

            {activeTab === "bookings" && (
              <>
                <div className="admin-filter-buttons">
                  <button className={`admin-filter-btn ${bookingFilter === "active" ? "active" : ""}`} onClick={() => setBookingFilter("active")}>📋 Active <span className="badge ms-2">{activeBookings.length}</span></button>
                  <button className={`admin-filter-btn ${bookingFilter === "archived" ? "active" : ""}`} onClick={() => setBookingFilter("archived")}>📁 Archived <span className="badge ms-2">{archivedBookings.length}</span></button>
                </div>
                <div className="row">
                  {loading ? <div className="col-12 text-center py-5"><div className="spinner-border admin-spinner" role="status" /><p className="mt-2 text-muted">Loading...</p></div> :
                    displayedBookings.length === 0 ? <div className="col-12"><div className="admin-empty-state"><div className="admin-empty-icon">{bookingFilter === "active" ? "🎉" : "📭"}</div><h4>{bookingFilter === "active" ? "No Active Bookings!" : "No Archived Bookings"}</h4></div></div> :
                    displayedBookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
                  }
                </div>
              </>
            )}

            {activeTab === "designs" && (
              <div className="row">
                {loading ? <div className="col-12 text-center py-5"><div className="spinner-border admin-spinner" role="status" /></div> :
                  designs.length === 0 ? <div className="col-12 text-center py-5"><div className="admin-empty-icon">🎨</div><h4>No designs yet</h4><button className="btn btn-pink mt-2" onClick={() => setActiveTab("add-design")}>➕ Add First Design</button></div> :
                  designs.map((design) => (
                    <div key={design.id} className="col-md-4 col-lg-3 mb-4">
                      <div className="admin-design-card card h-100 shadow-sm">
                        <img src={design.image_url} alt={design.name} className="card-img-top" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300/f8d7da/721c24?text=Image+Not+Found"; }} />
                        <div className="card-body">
                          <h6 className="fw-bold">{design.name}</h6>
                          <p className="small text-muted mb-1">Brand: {design.brand}</p>
                          <p className="small text-muted mb-1">Category: {design.category}</p>
                          {design.price > 0 && <p className="small text-muted mb-1">Price: ${design.price}</p>}
                          <p className="small mb-2">❤️ {design.likes_count} likes</p>
                          <button className="btn admin-delete-btn btn-sm w-100" onClick={() => handleDeleteDesign(design.id, design.image_url)}>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            {activeTab === "add-design" && (
              <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                  <div className="card shadow-sm admin-form-card">
                    <div className="card-body p-4">
                      <h3>➕ Add New Design</h3>
                      {uploadSuccess && <div className="alert alert-success-custom">{uploadSuccess}</div>}
                      <form onSubmit={handleAddDesign}>
                        <div className="mb-3">
                          <label className="form-label fw-bold">Upload Method</label>
                          <div className="d-flex gap-2">
                            <button type="button" className={`btn flex-grow-1 ${uploadMethod === "file" ? "btn-pink" : "btn-outline-muted"}`} onClick={() => setUploadMethod("file")}>📁 Upload File</button>
                            <button type="button" className={`btn flex-grow-1 ${uploadMethod === "url" ? "btn-pink" : "btn-outline-muted"}`} onClick={() => setUploadMethod("url")}>🔗 URL</button>
                          </div>
                        </div>
                        {uploadMethod === "file" && (
                          <div className="mb-3">
                            <label className="form-label">Choose Image *</label>
                            <input ref={fileInputRef} type="file" className="form-control" accept="image/*" onChange={handleFileSelect} />
                            {previewUrl && <div className="mt-3 text-center"><img src={previewUrl} alt="Preview" className="admin-preview-img" /></div>}
                          </div>
                        )}
                        {uploadMethod === "url" && (
                          <div className="mb-3">
                            <label className="form-label">Image URL *</label>
                            <input type="url" className="form-control" placeholder="https://..." value={designImageUrl} onChange={(e) => setDesignImageUrl(e.target.value)} />
                          </div>
                        )}
                        {uploadProgress && <div className="alert alert-info-custom small py-2">{uploadProgress}</div>}
                        <div className="mb-3"><label className="form-label">Design Name *</label><input type="text" className="form-control" placeholder="e.g., Summer Floral" value={designName} onChange={(e) => setDesignName(e.target.value)} required /></div>
                        <div className="mb-3"><label className="form-label">Description</label><textarea className="form-control" rows={2} placeholder="Describe..." value={designDescription} onChange={(e) => setDesignDescription(e.target.value)} /></div>
                        <div className="row">
                          <div className="col-md-6 mb-3"><label className="form-label">Brand *</label><input type="text" className="form-control" placeholder="e.g., OPI" value={designBrand} onChange={(e) => setDesignBrand(e.target.value)} required /></div>
                          <div className="col-md-6 mb-3"><label className="form-label">Category *</label><select className="form-select" value={designCategory} onChange={(e) => setDesignCategory(e.target.value)} required><option value="">Select</option><option value="Gel">Gel</option><option value="Acrylic">Acrylic</option><option value="French">French</option><option value="Art">Nail Art</option><option value="Natural">Natural</option><option value="Other">Other</option></select></div>
                        </div>
                        <div className="mb-3"><label className="form-label">Price ($)</label><input type="number" className="form-control" placeholder="0.00" step="0.01" min="0" value={designPrice} onChange={(e) => setDesignPrice(e.target.value)} /></div>
                        <button type="submit" className="btn btn-pink w-100" disabled={loading}>{loading ? "Adding..." : "➕ Add Design"}</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}