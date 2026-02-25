import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Gallery = () => {
  const { id: hackathonId } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchGallery();
  }, [hackathonId]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/hackathons/${hackathonId}/gallery`
      );

      if (response.data.success) {
        setImages(response.data.gallery || []);
      }

      // console.log("Fetched gallery images:", response.data.gallery);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  };

  const imagesPerSlide = 3;
  const totalSlides = Math.ceil(images.length / imagesPerSlide);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!showLightbox) return;

      if (e.key === "ArrowLeft") prevLightboxImage();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "Escape") closeLightbox();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showLightbox, images.length]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400"></div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-800/50 border border-green-500/20 rounded-lg">
        <ImageIcon className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No images in gallery yet.</p>
        <p className="text-gray-500 text-sm mt-2">
          Check back later for event photos!
        </p>
      </div>
    );
  }

  const startIdx = currentIndex * imagesPerSlide;
  const visibleImages = images.slice(startIdx, startIdx + imagesPerSlide);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Event Gallery</h2>
        <p className="text-gray-400">
          {images.length} {images.length === 1 ? "photo" : "photos"} from the
          hackathon
        </p>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {visibleImages.map((image, idx) => {
            const actualIndex = startIdx + idx;

            return (
              <div
                key={actualIndex}
                className="relative group overflow-hidden rounded-lg aspect-video bg-gray-800"
                onClick={() => openLightbox(actualIndex)}
              >
                <img
                  src={image}
                  alt={`Gallery image ${actualIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                {/* <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                </div> */}
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {images.length > imagesPerSlide && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-gray-800/90 hover:bg-gray-700 border border-green-500/30 hover:border-green-400/50 text-white p-3 rounded-full transition-all duration-300 shadow-lg z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-gray-800/90 hover:bg-gray-700 border border-green-500/30 hover:border-green-400/50 text-white p-3 rounded-full transition-all duration-300 shadow-lg z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {images.length > imagesPerSlide && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-green-400"
                  : "w-2 bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {/* {showLightbox && (
        <div
          className="fixed inset-0 z-999999999 bg-black/95 flex flex-col items-center justify-center"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full max-w-6xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-6 z-[10000]">
              <div className="text-white text-sm">
                {lightboxIndex + 1} / {images.length}
              </div>

              <button
                onClick={closeLightbox}
                className="text-white hover:text-green-400 p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="w-full flex items-center justify-center h-[70vh] mt-10">
              <img
                src={images[lightboxIndex]}
                alt={`Image ${lightboxIndex + 1}`}
                className="max-h-full max-w-full object-contain rounded-lg"
              />
            </div>

            <button
              onClick={prevLightboxImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-[10000]"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextLightboxImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full z-[10000]"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div className="w-full mt-6 px-4 overflow-x-auto">
              <div className="flex gap-3 justify-center">
                {images.map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === lightboxIndex
                        ? "border-green-400 scale-105"
                        : "border-transparent opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={image} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Gallery;
