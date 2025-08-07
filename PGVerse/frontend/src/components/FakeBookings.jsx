import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const fakeBookingLocations = [
  { id: 1, position: [19.076, 72.8777], city: "Mumbai", bookings: 120 },
  { id: 2, position: [28.7041, 77.1025], city: "Delhi", bookings: 85 },
  { id: 3, position: [12.9716, 77.5946], city: "Bengaluru", bookings: 60 },
  { id: 4, position: [22.5726, 88.3639], city: "Kolkata", bookings: 40 },
];

const FakeBooking = () => {
  return (
    <div className="bg-white py-24 px-8 md:px-24 space-y-32">
      {/* ... your previous About Us content ... */}

      {/* Add Map Section */}
    <div className="bg-indigo-600 text-white text-center px-6 py-12 rounded-2xl shadow-lg">
      <div className="text-center">
        <h2 className="text-5xl font-bold text-White-900 mb-8">
          Bookings Across India
        </h2>
        <p className="mb-8 text-lg md:text-xl text-white-700 max-w-3xl mx-auto">
          See where our users have booked PGs! Our community is growing every day.
        </p>

        <div className="w-full h-96 rounded-xl overflow-hidden shadow-lg max-w-5xl mx-auto">
          <MapContainer
            center={[20.5937, 78.9629]} // Center of India
            zoom={5}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fakeBookingLocations.map(({ id, position, city, bookings }) => (
              <Marker key={id} position={position}>
                <Popup>
                  <strong>{city}</strong>
                  <br />
                  Bookings: {bookings}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          
        </div>
      </div>
    </div>
    
    </div>
  );
};

export default FakeBooking;
