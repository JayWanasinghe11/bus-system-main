"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const images = [
    "/buses/bus1.jpg",
    "/buses/bus2.jpg",
    "/buses/bus3.jpg",
  ]; // 👉 put your image files inside public/buses folder

  const [currentImage, setCurrentImage] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
        {/* Image slideshow background */}
        <div className="absolute inset-0">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Bus ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentImage ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black opacity-40"></div>
        </div>

        {/* Hero text */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center text-white z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 transform transition-all duration-500 hover:scale-105">
            Book Your Bus Journey Across Sri Lanka
          </h1>

          <p className="text-xl sm:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto transition-opacity duration-300 hover:opacity-90">
            Reliable, affordable, and convenient ticket booking for all major
            routes — from Colombo to Kandy and beyond.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-indigo-50">
              Book Now
            </button>
            <button className="bg-indigo-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-indigo-400">
              Help
            </button>
          </div>
          
        </div>
      </div>

      {/* Popular Routes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 transition-colors duration-300 hover:text-indigo-600">
            Popular Routes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { from: "Colombo", to: "Kandy", time: "3h 30m", color: "from-blue-500 to-cyan-500" },
            { from: "Galle", to: "Colombo", time: "2h 15m", color: "from-purple-500 to-pink-500" },
            { from: "Jaffna", to: "Colombo", time: "8h 00m", color: "from-indigo-500 to-blue-500" },
          ].map((route) => (
            <div
              key={route.from + route.to}
              className={`bg-gradient-to-br ${route.color} rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer`}
            >
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-2 transition-transform duration-300 hover:translate-x-2">
                  {route.from} → {route.to}
                </h3>
                <p className="text-indigo-100 transition-opacity duration-300 hover:opacity-80">
                  Approx. travel time: {route.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-12 transition-colors duration-300 hover:text-indigo-600">
            Why Travel With Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Trusted Operators",
                desc: "Partnered with verified and licensed bus services across the island.",
                icon: "🚌",
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Secure Payments",
                desc: "Book with confidence through our encrypted payment gateway.",
                icon: "💳",
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "24/7 Support",
                desc: "Our friendly team is ready to help whenever you need it.",
                icon: "📞",
                color: "from-indigo-500 to-purple-500",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-8 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group"
              >
                <div className="text-5xl mb-4 transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {f.icon}
                </div>
                <h3
                  className={`text-xl font-bold mb-3 bg-gradient-to-r ${f.color} bg-clip-text text-transparent transition-all duration-300`}
                >
                  {f.title}
                </h3>
                <p className="text-gray-600 transition-colors duration-300 group-hover:text-gray-800">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
