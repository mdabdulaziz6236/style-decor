import React, { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const ReviewModal = ({ booking, refetch, closeModal }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);   
  const [comment, setComment] = useState("");
  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      return Swal.fire({
        icon: "warning",
        title: "Rating Required",
        text: "Please select at least one star!",
      });
    }

    const reviewData = {
      bookingId: booking._id,
      serviceName: booking.service_name,
      decoratorId: booking.decoratorId, 
      decoratorEmail: booking.decoratorEmail ,
      customerName: booking.user_name,
      customerEmail: booking.user_email,
      customerImage: booking.user_image,
      rating: rating,
      comment: comment,
      date: new Date(),
    };
    console.log(reviewData)

    try {
      const res = await axiosSecure.post("/reviews", reviewData);
      
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Thank You!",
          text: "Your review has been submitted.",
          showConfirmButton: false,
          timer: 1500
        });
        
        refetch();  
        closeModal(); 
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      
      {/* modal box */}
      <div className="bg-base-100 w-full max-w-lg rounded-2xl shadow-2xl relative border border-gray-700 animate-zoomIn">
        
        {/* modal close  */}
        <button 
            onClick={closeModal} 
            className="absolute top-4 right-4 btn btn-sm btn-circle btn-ghost text-gray-400 hover:text-white hover:bg-red-500/20"
        >
            <FaTimes size={18} />
        </button>

        <div className="p-8">
            <h3 className="text-2xl font-bold text-center mb-2 text-white">Rate Your Experience</h3>
            <p className="text-center text-gray-400 mb-8 text-sm">
                How was the service provided for <br/> 
                <span className="text-primary font-bold text-lg">{booking?.service_name}</span>?
            </p>

            <form onSubmit={handleSubmit}>
            {/* --- STAR RATING SYSTEM --- */}
            <div className="flex justify-center gap-2 mb-8">
                {[...Array(5)].map((_, index) => {
                const currentRating = index + 1;
                return (
                    <label key={index} className="cursor-pointer group">
                    <input
                        type="radio"
                        name="rating"
                        className="hidden"
                        value={currentRating}
                        onClick={() => setRating(currentRating)}
                    />
                    <FaStar
                        size={45}
                        className="transition-all duration-200 transform group-hover:scale-110"
                        color={currentRating <= (hover || rating) ? "#fbbf24" : "#374151"} 
                        onMouseEnter={() => setHover(currentRating)}
                        onMouseLeave={() => setHover(null)}
                    />
                    </label>
                );
                })}
            </div>

            {/* --- COMMENT BOX --- */}
            <div className="form-control mb-6">
                <textarea
                    className="textarea textarea-bordered w-full h-32 bg-base-200 text-white focus:border-primary text-base"
                    placeholder="Write your feedback here (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
            </div>

            {/* --- SUBMIT BUTTON --- */}
            <button 
                type="submit" 
                className="btn btn-primary w-full text-white font-bold text-lg shadow-lg shadow-primary/30"
            >
                Submit Review
            </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;