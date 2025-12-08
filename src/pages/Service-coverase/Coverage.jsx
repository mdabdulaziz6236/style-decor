import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useLoaderData } from "react-router";
import { FaSearch, FaLocationArrow, FaUndoAlt, FaCity, FaMapPin } from "react-icons/fa";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MapController = ({ selectPosition }) => {
  const map = useMap();
  React.useEffect(() => {
    if (selectPosition) {
      map.flyTo(
        [selectPosition.latitude, selectPosition.longitude],
        14,
        { animate: true, duration: 1.5 }
      );
    }
  }, [selectPosition, map]);
  return null;
};

const Coverage = () => {
  const warehouses = useLoaderData();
  const defaultPosition = [23.685, 90.3563];
  const [isListOpen, setIsListOpen] = useState(false);

  const formatInitialData = (data) => {
    return data.map((d) => ({
      name: d.district,
      latitude: d.latitude,
      longitude: d.longitude,
      type: "District",
      parent: null,
      covered_area: d.covered_area,
    }));
  };

  const [displayMarkers, setDisplayMarkers] = useState(() =>
    formatInitialData(warehouses)
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchText, setSearchText] = useState("");

  const handleSearch = (e) => {
    const text = e.target.value.toLowerCase();
    setSearchText(text);

    if (text === "") {
      setDisplayMarkers(formatInitialData(warehouses));
      return;
    }

    let results = [];
    warehouses.forEach((district) => {
      if (district.district.toLowerCase().includes(text)) {
        results.push({
          name: district.district,
          latitude: district.latitude,
          longitude: district.longitude,
          type: "District",
          parent: null,
          covered_area: district.covered_area,
        });
      }

      district.covered_area.forEach((area) => {
        if (area.name.toLowerCase().includes(text)) {
          results.push({
            name: area.name,
            latitude: area.latitude,
            longitude: area.longitude,
            type: "Area",
            parent: district.district,
            covered_area: [],
          });
        }
      });
    });

    setDisplayMarkers(results);
    if (window.innerWidth < 1024) setIsListOpen(true);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    if (window.innerWidth < 1024) setIsListOpen(false);
  };

  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const myLoc = {
          name: "Your Location",
          latitude,
          longitude,
          type: "User",
          parent: null,
        };
        setSelectedLocation(myLoc);
        setDisplayMarkers((prev) => [...prev, myLoc]);
        if (window.innerWidth < 1024) setIsListOpen(false);
      });
    } else {
      alert("Geolocation is not supported.");
    }
  };

  const handleReset = () => {
    setDisplayMarkers(formatInitialData(warehouses));
    setSearchText("");
    setSelectedLocation(null);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden bg-base-100 font-display">
      <div className="absolute inset-0 z-0 w-full h-full lg:w-2/3 lg:left-1/3">
        <MapContainer
          center={defaultPosition}
          zoom={7}
          zoomControl={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapController selectPosition={selectedLocation} />

          {displayMarkers.map((marker, index) => (
            <Marker
              key={index}
              position={[marker.latitude, marker.longitude]}
              eventHandlers={{ click: () => handleSelectLocation(marker) }}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-primary">{marker.name}</h3>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div
        className={`absolute z-20 bg-base-100 shadow-2xl transition-all duration-500 ease-in-out lg:static lg:w-1/3 lg:h-full lg:translate-y-0 lg:border-r border-base-300 left-0 right-0 bottom-0 rounded-t-3xl lg:rounded-none ${
          isListOpen ? "h-[80vh]" : "h-[180px]"
        }`}
      >
        <div
          onClick={() => setIsListOpen(!isListOpen)}
          className="lg:hidden w-full flex justify-center pt-3 pb-1 cursor-pointer"
        >
          <div className="w-12 h-1.5 bg-neutral/20 rounded-full mb-2"></div>
        </div>

        <div className="h-full flex flex-col p-4 pt-0 lg:p-6">
          <div className="pb-2">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-black text-primary">Coverage</h2>
              <button
                onClick={() => setIsListOpen(!isListOpen)}
                className="lg:hidden btn btn-xs btn-ghost"
              >
                {isListOpen ? "See Map" : "See List"}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchText}
                onClick={() => setIsListOpen(true)}
                onChange={handleSearch}
                className="input input-bordered w-full pl-10 rounded-full focus:input-primary bg-base-200"
                placeholder="Search district..."
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/50" />
            </div>

            <div
              className={`flex gap-2 mt-3 transition-opacity duration-300 ${
                !isListOpen && "lg:opacity-100 opacity-0 hidden lg:flex"
              }`}
            >
              <button
                onClick={handleMyLocation}
                className="btn btn-sm btn-outline btn-primary flex-1 rounded-lg"
              >
                <FaLocationArrow /> My Loc
              </button>
              <button
                onClick={handleReset}
                className="btn btn-sm btn-ghost flex-1 rounded-lg bg-base-200"
              >
                <FaUndoAlt /> Reset
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto mt-2 space-y-2 custom-scrollbar pb-20 lg:pb-0">
            {displayMarkers.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSelectLocation(item)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-colors ${
                  selectedLocation?.name === item.name
                    ? "border-primary bg-primary/10"
                    : "border-base-200 bg-base-50 hover:border-primary/50"
                }`}
              >
                <div
                  className={`p-2 rounded-full ${
                    selectedLocation?.name === item.name
                      ? "bg-primary text-white"
                      : "bg-base-200 text-primary"
                  }`}
                >
                  {item.type === "District" ? <FaCity /> : <FaMapPin />}
                </div>
                <div>
                  <h3 className="font-bold text-sm">{item.name}</h3>
                  <p className="text-xs text-neutral/60">
                    {item.type === "District"
                      ? `${item.covered_area?.length} areas`
                      : "Inside District"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coverage;
