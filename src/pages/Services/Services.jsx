import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  FaSearch,
  FaClock,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaArrowRight,
} from "react-icons/fa";

const Services = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      if (search) setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const {
    data: servicesData = {},
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["services", debouncedSearch, category, sortOrder, currentPage],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/services?search=${debouncedSearch}&category=${category}&sort=${sortOrder}&page=${currentPage}&limit=${itemsPerPage}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const services = Array.isArray(servicesData)
    ? servicesData
    : servicesData.result || [];
  const totalCount = servicesData.count || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-base-100 font-display px-4 py-5 md:px-12 text-base-content">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
        <h2 className="text-4xl md:text-5xl font-black text-primary drop-shadow-sm">
          Our Exclusive Services
        </h2>
        <p className="text-gray-400 hidden lg:flex text-lg">
          Explore our wide range of decoration services tailored to make your
          events and homes unforgettable.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-base-200 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg mb-10 border border-base-300">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search service name..."
            className="input input-bordered w-full pl-10 rounded-full focus:input-primary bg-base-100 text-base-content placeholder-gray-500"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
          <select
            onChange={handleCategoryChange}
            className="select select-bordered rounded-full focus:select-primary bg-base-100 text-base-content w-full md:w-auto"
          >
            <option value="">All Categories</option>
            <option value="Wedding">Wedding</option>
            <option value="Birthday">Birthday</option>
            <option value="Corporate">Corporate</option>
            <option value="Home">Home Decor</option>
          </select>

          <select
            onChange={handleSortChange}
            className="select select-bordered rounded-full focus:select-primary bg-base-100 text-base-content w-full md:w-auto"
          >
            <option value="">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {isLoading || isFetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="card bg-base-200 h-[450px] shadow-xl border border-base-300 animate-pulse"
            >
              <div className="h-60 bg-base-300 rounded-t-2xl w-full"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-base-300 rounded w-3/4"></div>
                <div className="h-4 bg-base-300 rounded w-full"></div>
                <div className="h-4 bg-base-300 rounded w-1/2"></div>
                <div className="flex justify-between pt-4">
                  <div className="h-8 bg-base-300 rounded w-1/3"></div>
                  <div className="h-8 bg-base-300 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service._id}
                className="card bg-base-200 shadow-xl border border-base-300 hover:-translate-y-2 transition-transform duration-300 group flex flex-col h-full"
              >
                <figure className="relative h-60 overflow-hidden shrink-0">
                  <img
                    src={service.image}
                    alt={service.service_name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 badge badge-secondary font-bold shadow-md text-white border-none">
                    {service.category}
                  </div>
                  <div className="absolute bottom-4 left-4 badge badge-accent font-bold shadow-md text-white border-none">
                    {service.service_type}
                  </div>
                </figure>

                <div className="card-body flex flex-col grow p-6">
                  <h2 className="card-title text-2xl font-bold text-primary">
                    {service.service_name}
                  </h2>

                  <p className="text-base-content/70 text-sm line-clamp-2 grow-0">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mt-2 font-medium">
                    <FaClock className="text-secondary" /> Duration:{" "}
                    <span className="text-base-content">
                      {service.duration}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1">
                    {service.features?.slice(0, 2).map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs text-gray-400"
                      >
                        <FaCheckCircle className="text-success size-3" /> {feat}
                      </div>
                    ))}
                  </div>

                  <div className="divider my-3 before:bg-base-300 after:bg-base-300"></div>

                  <div className="mt-auto flex justify-between items-center">
                    <div>
                      <div className="text-xl font-black text-white">
                        ৳ {service.cost}
                      </div>
                      <div className="text-xs font-normal text-gray-500 capitalize">
                        {service.unit}
                      </div>
                    </div>

                    <Link to={`/services/${service._id}`}>
                      <button className="btn btn-sm btn-outline btn-primary rounded-full px-4 text-white hover:text-white shadow-lg group-hover:bg-primary transition-all">
                        View Details <FaArrowRight />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="join shadow-lg border border-base-300">
                <button
                  className="join-item btn btn-md bg-base-200 hover:bg-primary hover:text-white border-base-300"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <FaChevronLeft />
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`join-item btn btn-md border-base-300 ${
                      currentPage === index + 1
                        ? "btn-primary text-white"
                        : "bg-base-200 hover:bg-base-300"
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  className="join-item btn btn-md bg-base-200 hover:bg-primary hover:text-white border-base-300"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <FaChevronRight />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-base-200 rounded-3xl border border-base-300">
          <h3 className="text-2xl font-bold text-gray-400">
            No services found.
          </h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default Services;
