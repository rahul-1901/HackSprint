import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Upload,
  Trash2,
  Image as ImageIcon,
  X,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Play,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isVideo = (url) => /\.(mp4|webm|ogg)$/i.test(url);
const getToken = () =>
  localStorage.getItem("adminToken") || localStorage.getItem("token");
const API = (id, path = "") =>
  `${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${id}/gallery${path}`;

// ─── Lazy Media ───────────────────────────────────────────────────────────────
const LazyMedia = ({ url, alt, className }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {visible &&
        (isVideo(url) ? (
          <video
            src={url}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            src={url}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ))}
    </div>
  );
};

// ─── Fullscreen Lightbox ──────────────────────────────────────────────────────
const Lightbox = ({ items, startIndex, onClose }) => {
  const [index, setIndex] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);
  const thumbsRef = useRef(null);

  const prev = () => {
    setLoaded(false);
    setIndex((i) => (i - 1 + items.length) % items.length);
  };
  const next = () => {
    setLoaded(false);
    setIndex((i) => (i + 1) % items.length);
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [index]);

  useEffect(() => {
    if (!thumbsRef.current) return;
    const active = thumbsRef.current.querySelector("[data-active='true']");
    if (active)
      active.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
  }, [index]);

  const url = items[index];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-white/40 text-xs font-mono tracking-widest uppercase">
            Gallery
          </span>
          <span className="w-px h-4 bg-white/20" />
          <span className="text-white/70 text-xs font-mono">
            {index + 1} / {items.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/8 hover:bg-white/15 text-white/70 hover:text-white text-xs font-medium transition-all cursor-pointer border border-white/10"
        >
          <X className="w-3.5 h-3.5" /> Close
        </button>
      </div>

      {/* Main image area */}
      <div className="flex-1 relative flex items-center justify-center min-h-0 px-16 py-6">
        {items.length > 1 && (
          <button
            onClick={prev}
            className="absolute left-4 z-10 p-2.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="relative flex items-center justify-center w-full h-full">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/70 rounded-full animate-spin" />
            </div>
          )}
          {isVideo(url) ? (
            <video
              key={url}
              src={url}
              controls
              autoPlay
              onLoadedData={() => setLoaded(true)}
              className="max-w-full max-h-full rounded-xl"
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.25s" }}
            />
          ) : (
            <img
              key={url}
              src={url}
              alt=""
              onLoad={() => setLoaded(true)}
              className="max-w-full max-h-full object-contain rounded-xl"
              style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.25s" }}
            />
          )}
        </div>

        {items.length > 1 && (
          <button
            onClick={next}
            className="absolute right-4 z-10 p-2.5 rounded-xl bg-white/8 hover:bg-white/18 border border-white/10 text-white/70 hover:text-white transition-all cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {items.length > 1 && (
        <div className="flex-shrink-0 border-t border-white/10 px-4 py-3">
          <div
            ref={thumbsRef}
            className="flex gap-2 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((thumbUrl, i) => (
              <button
                key={i}
                data-active={i === index ? "true" : "false"}
                onClick={() => {
                  setLoaded(false);
                  setIndex(i);
                }}
                className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2"
                style={{
                  borderColor:
                    i === index
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.1)",
                  opacity: i === index ? 1 : 0.45,
                }}
              >
                {isVideo(thumbUrl) ? (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white/60" />
                  </div>
                ) : (
                  <img
                    src={thumbUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminGalleryManager = ({ hackathonId }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]); // string[]
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  // Fetch gallery
  useEffect(() => {
    let cancelled = false;
    axios
      .get(API(hackathonId))
      .then(({ data }) => {
        if (!cancelled && data.success) setGallery(data.gallery || []);
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hackathonId]);

  // Revoke preview URLs on unmount
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  const handleFiles = useCallback((selected) => {
    const valid = selected.slice(0, 10);
    if (selected.length > 10) toast.warn("Only first 10 images will be used");
    setFiles(valid);
    setPreviews(valid.map((f) => URL.createObjectURL(f)));
  }, []);

  const clearSelection = () => {
    setFiles([]);
    setPreviews([]);
  };

  // Upload — backend expects req.files so we append with key "images"
  const handleUpload = async () => {
    if (!files.length) return;
    const formData = new FormData();
    files.forEach((f) => formData.append("image", f));
    setUploading(true);
    try {
      const { data } = await axios.post(API(hackathonId), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });
      toast.success(`${files.length} image(s) uploaded!`);
      setGallery(data.gallery); // string[]
      clearSelection();
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Delete — backend expects { imageUrl } in request body
  const handleDelete = async (imageUrl) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      const { data } = await axios.delete(API(hackathonId), {
        data: { imageUrl },
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // toast.success("Deleted");
      setGallery(data.gallery); // updated string[]
      // Close lightbox if the deleted item was being viewed
      if (lightboxIndex !== null && lightboxIndex >= data.gallery.length) {
        setLightboxIndex(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Upload ─────────────────────────────────────────────────────── */}
      <div className="bg-gray-900/60 border border-green-500/20 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-green-400" /> Upload Images
        </h3>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(
              Array.from(e.dataTransfer.files).filter((f) =>
                f.type.startsWith("image/")
              )
            );
          }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            dragging
              ? "border-green-400 bg-green-400/10"
              : "border-gray-600 hover:border-green-500/60 hover:bg-gray-700/20"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFiles(Array.from(e.target.files))}
          />
          <CloudUpload
            className={`w-9 h-9 mx-auto mb-2 transition-colors ${
              dragging ? "text-green-400" : "text-gray-500"
            }`}
          />
          <p className="text-gray-300 text-sm">
            Drop images or <span className="text-green-400">browse</span>
          </p>
          <p className="text-gray-600 text-xs mt-1">
            Max 10 images · JPEG, PNG, WEBP
          </p>
        </div>

        {previews.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="text-gray-400 text-xs">{files.length} selected</p>
              <button
                onClick={clearSelection}
                className="text-xs text-red-400 hover:text-red-300 cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="w-14 h-14 rounded-lg overflow-hidden bg-gray-800 shrink-0"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !files.length}
          className="w-full sm:w-auto px-5 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition cursor-pointer flex items-center justify-center gap-2 text-sm"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
              Uploading…
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" /> Upload
            </>
          )}
        </button>
      </div>

      {/* ── Gallery ────────────────────────────────────────────────────── */}
      <div className="bg-gray-900/60 border border-green-500/20 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-green-400" /> Gallery
          </h3>
          {gallery.length > 0 && (
            <span className="text-xs text-gray-500 font-mono bg-gray-800 px-2.5 py-1 rounded-full">
              {gallery.length} items
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-14 space-y-2">
            <ImageIcon className="w-12 h-12 text-gray-700 mx-auto" />
            <p className="text-gray-500 text-sm">No images yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {gallery.map((url, i) => (
              <div
                key={i}
                className="relative group aspect-square bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
              >
                <LazyMedia url={url} alt="" className="w-full h-full" />

                {isVideo(url) && (
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1 pointer-events-none">
                    <Play className="w-3 h-3" /> Video
                  </div>
                )}

                {/* Overlay — always visible on touch, hover-only on desktop */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 [@media(hover:none)]:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setLightboxIndex(i)}
                    className="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity p-2.5 bg-white/15 hover:bg-white/30 active:bg-white/40 text-white rounded-full cursor-pointer backdrop-blur-sm"
                  >
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(url)}
                    className="opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity p-2.5 bg-red-500/80 hover:bg-red-500 active:bg-red-600 text-white rounded-full cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          items={gallery}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default AdminGalleryManager;
