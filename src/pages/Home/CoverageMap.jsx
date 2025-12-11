import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const CoverageMap = ({ locations }) => {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto bg-base-200/50 font-display text-base-content">
      <div className="text-center mb-14">
        <h2 className="text-4xl font-black text-primary mb-3">We Serve Your Area</h2>
        <p className="opacity-70 text-lg">Check out our hubs across the country.</p>
      </div>

      <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-base-300 z-0 relative">
        <MapContainer 
          center={[23.8103, 90.4125]} 
          zoom={7} 
          scrollWheelZoom={true} 
          className="h-full w-full outline-none"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Dynamic Markers */}
          {locations?.map((location, idx) => (
              <Marker 
                  key={idx} 
                  position={[location.latitude, location.longitude]}
              >
                  <Popup className="font-sans min-w-[200px]">
                      {/* Hub Info */}
                      <div className="mb-2 border-b pb-2 border-base-200">
                        <strong className="text-primary text-base block">{location.city} Hub</strong>
                        <span className="text-xs text-neutral-500">District: {location.district}</span>
                      </div>
                      <div>
                        <p className="text-xs font-bold mb-1 text-gray-600">Covered Areas:</p>
                        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                            {location.covered_area?.map((area, i) => (
                                <span key={i} className="badge badge-xs badge-success border-gray-300 text-[10px]">
                                    {area.name}
                                </span>
                            ))}
                        </div>
                      </div>
                  </Popup>
              </Marker>
          ))}

        </MapContainer>
      </div>
      
      <div className="flex justify-center py-10 items-center">
        <Link to='/coverage' className="btn btn-accent text-white font-bold shadow-lg px-8">
            Explore Full Map
        </Link>
      </div>
    </section>
  );
};

export default CoverageMap;