import React from "react";

const FeaturedDestination = ({ destinations = [] }) => {
  // ✅ destinations is now ALWAYS an array

  if (destinations.length === 0) {
    return null; // or loading skeleton
  }

  return (
    <section className="featured-destination">
      <h2 className="section-title">Featured Destinations</h2>

      <div className="destination-grid">
        {destinations.map((item, index) => (
          <div key={index} className="destination-card">
            <img
              src={item.image}
              alt={item.city}
              className="destination-img"
            />
            <h3>{item.city}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedDestination;
