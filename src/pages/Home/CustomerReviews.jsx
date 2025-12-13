import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaStar, FaQuoteRight } from "react-icons/fa";
import useAxios from "../../hooks/useAxios";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards, Autoplay } from "swiper/modules";

// --- Swiper Styles ---
import "swiper/css";
import "swiper/css/effect-cards";

// Colorful linears Array
const cardColors = [
  "bg-linear-to-br from-[#8EC5FC] to-[#E0C3FC]",
  "bg-linear-to-br from-[#ff9a9e] to-[#fecfef]",
  "bg-linear-to-br from-[#a18cd1] to-[#fbc2eb]",
  "bg-linear-to-br from-[#84fab0] to-[#8fd3f4]",
  "bg-linear-to-br from-[#cfd9df] to-[#e2ebf0]",
  "bg-linear-to-br from-[#fccb90] to-[#d57eeb]",
];

const CustomerReviews = () => {
  const axiosPublic = useAxios();

  const { data: reviews = [] } = useQuery({
    queryKey: ["top-reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/reviews/top");
      return res.data;
    },
  });

  if (reviews.length === 0) return null;

  return (
    <section className="py-10 bg-base-200/50 overflow-hidden">
      <div className="container mx-auto px-4 mb-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-primary mb-2 font-serif">
          What Clients Say
        </h2>
        <p className="text-base-content font-bold tracking-widest uppercase text-sm ">
          Testimonials
        </p>
      </div>

      {/* --- Cards Swiper Container --- */}
      <div className="flex justify-center items-center w-full px-4">
        <Swiper
          effect={"cards"}
          grabCursor={true}
          modules={[EffectCards, Autoplay]}
          className="w-[300px] md:w-[400px] h-[360px]"
          autoplay={{
            delay: 1500,
            disableOnInteraction: false,
          }}
          cardsEffect={{
            perSlideOffset: 10,
            perSlideRotate: 3,
            rotate: true,
            slideShadows: true,
          }}
        >
          {reviews.map((review, index) => {
            const currentColorClass = cardColors[index % cardColors.length];

            return (
              <SwiperSlide key={review._id} className="rounded-3xl">
                {/* --- Colorful Card --- */}
                <div
                  className={`${currentColorClass} p-8 rounded-3xl h-full flex flex-col justify-between shadow-xl relative border border-white/20`}
                >
                  {/* Glass Overlay for Texture ) */}
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] rounded-3xl z-0"></div>

                  {/* Header */}
                  <div className="flex items-center gap-4 z-10 relative">
                    <div className="avatar">
                      <div className="w-14 h-14 rounded-full ring-2 ring-white ring-offset-0 shadow-lg">
                        <img
                          src={review?.customerImage}
                          alt={review.customerName}
                          className="object-cover bg-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      {/* Text Color Dark for readability on pastel, or White for dark linears */}
                      <h4 className="font-bold text-lg text-gray-800 drop-shadow-sm">
                        {review.customerName}
                      </h4>
                      <div className="flex gap-1 text-white text-sm drop-shadow-md">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < review.rating
                                ? "text-yellow-500"
                                : "text-white/50"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quote Icon */}
                  <FaQuoteRight className="text-5xl text-white/40 absolute top-6 right-6 z-0" />

                  {/* Comment */}
                  <div className="z-10 relative">
                    <p className="text-gray-800 font-medium text-sm leading-relaxed italic line-clamp-4">
                      "{review.comment}"
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="mt-2 pt-4 border-t border-black/10 flex justify-between items-center z-10 relative">
                    <span className="bg-white/80 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {review.serviceName?.substring(0, 20)}..
                    </span>
                    <span className="text-xs text-gray-700 font-medium">
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
