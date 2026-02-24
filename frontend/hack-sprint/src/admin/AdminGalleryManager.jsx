import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Upload, X, Trash2, Image as ImageIcon } from "lucide-react";

const AdminGalleryManager = ({ hackathonId }) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, [hackathonId]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}/gallery`
      );
      if (response.data.success) {
        setGallery(response.data.gallery || []);
      }
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > 10) {
      toast.error("Maximum 10 images allowed at once");
      return;
    }

    setFiles(selectedFiles);

    // Create previews
    const previewUrls = selectedFiles.map(file => URL.createObjectURL(file));
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select images to upload");
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append("images", file);
    });
    if (caption) {
      formData.append("caption", caption);
    }

    setUploading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}/gallery`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success("Images uploaded successfully!");
      setFiles([]);
      setPreviews([]);
      setCaption("");
      setGallery(response.data.gallery);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/hackathons/${hackathonId}/gallery/${imageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success("Image deleted successfully!");
      setGallery(response.data.gallery);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const clearSelection = () => {
    setFiles([]);
    setPreviews([]);
    setCaption("");
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-gray-800/50 border border-green-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5 text-green-400" />
          Upload Gallery Images
        </h3>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">
            Select Images (max 10)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none"
          />
        </div>

        {/* Caption Input */}
        <div className="mb-4">
          <label className="block text-gray-300 mb-2">
            Caption (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., Hackathon Day 1 - Team collaboration"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-green-400 focus:outline-none"
          />
        </div>

        {/* Preview */}
        {previews.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Preview</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {previews.map((preview, idx) => (
                <div key={idx} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-2">
              {files.length} image(s) selected
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={uploading || files.length === 0}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {uploading ? "Uploading..." : "Upload Images"}
          </button>
          {files.length > 0 && (
            <button
              onClick={clearSelection}
              className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-gray-800/50 border border-green-500/20 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-green-400" />
          Current Gallery ({gallery.length})
        </h3>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
          </div>
        ) : gallery.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No images in gallery yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {gallery.map((image) => (
              <div
                key={image._id}
                className="relative group aspect-square bg-gray-700 rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay with delete button */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(image._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/80 p-2">
                    <p className="text-white text-xs truncate">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGalleryManager;
