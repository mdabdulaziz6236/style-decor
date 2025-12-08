import React from "react";
import { Link } from "react-router";
import { FaLightbulb, FaGem, FaCheckCircle, FaSlidersH } from "react-icons/fa";
import img1 from "../../assets/about-1.png";
import img2 from "../../assets/about-2.png";

const About = () => {
  return (
    <div className="bg-base-100 font-display text-base-content min-h-screen">
      {/* Hero Section */}
      <div
        className="relative m-10 rounded-3xl h-[500px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="absolute inset-0 rounded-3xl bg-black/30"></div>
        <div className="relative -top-15 z-10 text-center px-4 max-w-4xl mx-auto space-y-6 animate-fadeIn">
          <h1 className="text-4xl md:text-6xl font-black text-base-content leading-tight">
            About StyleDecor: Where Art <br /> Meets Automation
          </h1>
          <p className="text-green-500 text-lg md:text-xl font-semibold">
            Discover the story behind our passion for creating intelligent,
            beautiful spaces that elevate everyday living and celebrate life's
            most precious moments.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6 animate-fadeInLeft">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Our Mission
            </h2>
            <p className="text-secondary text-lg leading-relaxed text-justify">
              Our core purpose is to seamlessly integrate cutting-edge smart
              home technology with breathtaking decorative artistry, creating
              spaces that are not only beautiful but also intelligent and
              intuitive. We believe that a well-designed environment enhances
              quality of life, and we are dedicated to bringing this vision to
              homes and events with unparalleled creativity and precision.
            </p>
          </div>

          <div className="lg:w-1/2  relative animate-fadeInRight">
            <div className="bg-base-200 p-2  rounded-2xl shadow-xl hover:scale-105 transform transition duration-500">
              <img
                src={img2}
                alt="Smart Home Tablet"
                className="rounded-xl w-full h-auto lg:h-70 object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-base-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Our Core Values
            </h2>
            <p className="text-secondary mt-3 max-w-2xl mx-auto">
              The principles that guide our work, ensuring every project we
              undertake is a masterpiece of design and functionality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <FaLightbulb />,
                title: "Innovation",
                text: "We constantly explore the latest in smart technology to offer futuristic and convenient solutions.",
              },
              {
                icon: <FaGem />,
                title: "Elegance",
                text: "Our aesthetic is rooted in timeless design, ensuring your space is both modern and enduring.",
              },
              {
                icon: <FaCheckCircle />,
                title: "Reliability",
                text: "We deliver what we promise, with meticulous attention to detail and unwavering quality.",
              },
              {
                icon: <FaSlidersH />,
                title: "Personalization",
                text: "Every project is a unique collaboration, tailored to your individual style and needs.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-base-200 p-8 rounded-2xl text-center border border-base-300 hover:border-primary/50 transition-colors duration-300 hover:scale-105 transform"
              >
                <div className="flex justify-center mb-4">
                  <div className="text-5xl text-primary">{item.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-base-content mb-2">
                  {item.title}
                </h3>
                <p className="text-secondary text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-16 animate-fadeIn">
          Meet the Team
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              name: "Alex Johnson",
              role: "Founder & CEO",
              img: "https://img.freepik.com/free-photo/handsome-bearded-guy-posing-against-white-wall_273609-20597.jpg",
            },
            {
              name: "Maria Garcia",
              role: "Lead Designer",
              img: "https://img.freepik.com/free-photo/portrait-beautiful-face-young-woman-with-long-brown-hair_186202-4331.jpg",
            },
            {
              name: "David Chen",
              role: "Head of Technology",
              img: "https://img.freepik.com/free-photo/young-handsome-man-with-glasses_1187-2845.jpg",
            },
          ].map((member, i) => (
            <div
              key={i}
              className="flex flex-col items-center group animate-fadeInUp"
            >
              <div className="avatar mb-6">
                <div className="w-40 h-40 rounded-full ring ring-base-200 ring-offset-base-100 ring-offset-2 overflow-hidden transition-transform duration-500 group-hover:scale-105">
                  <img src={member.img} alt={member.name} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                {member.name}
              </h3>
              <p className="text-secondary text-sm font-semibold uppercase tracking-wider mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-6 pb-24">
        <div className="max-w-5xl mx-auto bg-base-200 rounded-2xl p-12 md:p-16 text-center shadow-lg border border-base-300 transform transition duration-500 hover:scale-105">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-secondary max-w-2xl mx-auto mb-8 text-lg">
            Let us bring our passion for design and technology to your next
            project. Whether it's a smart home upgrade or an unforgettable
            event, we're here to make it happen.
          </p>
          <Link to="/services">
            <button className="btn btn-primary px-10 btn-lg rounded-md font-bold text-base-content shadow-lg hover:scale-105 transform transition">
              Explore Our Services
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
