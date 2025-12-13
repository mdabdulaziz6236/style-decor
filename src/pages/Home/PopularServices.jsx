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
      const res = await axiosPublic.get("/services?limit=10&sort=asc");
      return res.data.result;
    },
  });

  if (isLoading) return <Loading></Loading>;

  return (
    <section className="py-16 px-3 md:px-8 bg-base-200/50 font-display text-base-content">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary mb-2 drop-shadow-sm">
          Popular Services
        </h2>
        <p className="opacity-80 text-sm md:text-base max-w-2xl mx-auto">
          Explore our vibrant and top-rated decoration packages.
        </p>
      </div>

      {/* --- GRID LAYOUT --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 max-w-7xl mx-auto">
        {services.slice(0, 8).map((service) => (
          <div
            key={service._id}
            className="card bg-base-100 shadow-md hover:shadow-2xl transition-all duration-300 group overflow-hidden flex flex-col h-full rounded-2xl border border-base-200 hover:border-primary/50"
          >
            {/* Image Section */}
            <figure className="h-36 md:h-44 w-full overflow-hidden relative">
              <img
                src={service.service_image || service.image}
                alt={service.service_name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-60"></div>

              {/*  Colorful Badge */}
              <div className="absolute top-2 right-2">
                <span className="badge badge-xs md:badge-sm bg-linear-to-r from-violet-500 to-fuchsia-500 text-white border-none font-bold shadow-sm px-2 py-2">
                  {service.category}
                </span>
              </div>
            </figure>

            {/* Content Body */}
            <div className="card-body p-3 md:p-4 grow relative gap-1">
              {/* Rating Row */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 text-[10px] md:text-xs font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/20">
                  <FaStar /> <span>{service.rating || "New"}</span>
                </div>
                {service.duration && (
                  <div className="flex items-center gap-1 text-[10px] opacity-60 bg-base-200 px-1.5 py-0.5 rounded">
                    <FaClock /> {service.duration}
                  </div>
                )}
              </div>

              {/* Title */}
              <h2
                className="text-sm md:text-base font-bold line-clamp-1 text-base-content mt-1 group-hover:text-primary transition-colors"
                title={service.service_name}
              >
                {service.service_name}
              </h2>

              {/* Description */}
              <p className="opacity-70 text-[10px] md:text-xs line-clamp-2 leading-relaxed">
                {service.description}
              </p>

              {/* Price & Action Section */}
              <div className="mt-auto pt-3 border-t border-dashed border-base-300 flex flex-col gap-2">
                {/*  Colorful Price Text */}
                <div className="flex justify-between items-end">
                  <p className="text-[10px] opacity-50 mb-1">Starts from</p>
                  <div className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-red-500 font-black text-base md:text-lg flex items-baseline">
                    <span className="text-sm mr-0.5 text-orange-500">৳</span>
                    {service.cost?.toLocaleString()}
                  </div>
                </div>

                {/*  Colorful linear Button */}
                <Link
                  to={`/services/${service._id}`}
                  className="btn btn-xs md:btn-sm bg-linear-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 border-none w-full text-white font-bold rounded-lg shadow-md gap-1 h-8 min-h-0"
                >
                  View Details <FaArrowRight className="text-[10px]" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* See All Button */}
      <div className="text-center mt-10">
        <Link
          to="/services"
          className="btn btn-sm md:btn-md btn-outline border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8 font-bold hover:scale-105 transition-transform"
        >
          View All Services
        </Link>
      </div>
    </section>
  );
};

export default PopularServices;
