import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { FaStar, FaClock, FaArrowRight } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import Loading from "../../Components/Loading/Loading";

const PopularServices = () => {
  const axiosPublic = useAxios();

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["home-services"],
    queryFn: async () => {
      const res = await axiosPublic.get("/services?limit=6&sort=asc");
      return res.data.result || res.data;
    },
  });

  if (isLoading) return <Loading></Loading>;

  return (
    <section className="py-20 px-4 md:px-8 bg-base-200/50 font-display text-base-content">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-primary mb-3 drop-shadow-sm">
          Our Popular Services
        </h2>
        <p className="opacity-80 text-lg max-w-2xl mx-auto">
          Discover our most sought-after decoration packages.
        </p>
      </div>

      {/* Grid: 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.slice(0, 6).map((service) => (
          <div
            key={service._id}
            className="card bg-base-100 shadow-lg hover:shadow-2xl border border-base-200 hover:border-primary/30 transition-all duration-300 group overflow-hidden flex flex-col h-full rounded-2xl"
          >
            {/* Image Section h-64 */}
            <figure className="h-64 w-full overflow-hidden relative">
              <img
                src={service.service_image || service.image}
                alt={service.service_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

              {/* Compact Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                <div className="badge bg-linear-to-r from-secondary to-pink-500 text-white border-none font-bold shadow-md">
                  {service.category}
                </div>
                {service.service_type && (
                  <div className="badge bg-linear-to-r from-accent to-teal-500 text-white border-none font-bold shadow-md">
                    {service.service_type}
                  </div>
                )}
              </div>
            </figure>

            {/* Card Content - Compact Padding */}
            <div className="card-body p-6 grow relative">
              {/* Title */}
              <h2
                className="card-title text-xl font-bold line-clamp-1 mb-2 text-base-content"
                title={service.service_name}
              >
                {service.service_name}
              </h2>

              {/* Rating & Duration Row */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-base-content/70 mb-3">
                <div className="flex items-center gap-1 text-warning bg-warning/10 px-2 py-1 rounded-md">
                  <FaStar /> <span>{service.rating || "New"}</span>
                </div>
                {service.duration && (
                  <div className="flex items-center gap-1 bg-base-200 px-2 py-1 rounded-md">
                    <FaClock /> <span>{service.duration}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="opacity-70 text-sm line-clamp-2 mb-2 leading-relaxed">
                {service.description}
              </p>

              {/* Price Section */}
              <div className="mt-auto pt-2 border-t border-base-200 flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-60 font-medium mb-0.5">
                    Starting from
                  </p>
                  <div className="text-primary font-black text-2xl flex items-baseline">
                    <span className="text-lg mr-0.5">৳</span>{" "}
                    {service.cost?.toLocaleString()}
                    <span className="text-xs font-bold text-base-content/50 ml-1">
                      / {service.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="card-actions mt-3">
                <Link
                  to={`/services/${service._id}`}
                  className="btn btn-sm btn-primary w-full text-white font-bold h-10 rounded-lg shadow-md hover:shadow-lg gap-2 group-hover:bg-primary-focus"
                >
                  View Details{" "}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform text-xs" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="text-center mt-12">
        <Link
          to="/services"
          className="btn bg-linear-to-r from-primary to-secondary border-none text-white btn-wide rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold"
        >
          See All Services
        </Link>
      </div>
    </section>
  );
};

export default PopularServices;
