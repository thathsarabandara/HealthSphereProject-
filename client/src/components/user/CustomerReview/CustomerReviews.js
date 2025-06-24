import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./CustomerReviews.css";

const CustomerReviews = () => {
  const reviews = [
    {
      name: "John Doe",
      profession: "Software Engineer",
      review:
        "I had severe back pain for months, and this clinic changed my life. The treatments were personalized and effective. I feel like a new person!",
      image: "https://i.pravatar.cc/100?img=1",
      rating: 5,
      date: "March 5, 2025",
    },
    {
      name: "Emily Smith",
      profession: "Marketing Specialist",
      review:
        "Highly professional team! The chiropractic adjustments and physiotherapy sessions were top-notch. I recommend them to anyone with chronic pain.",
      image: "https://i.pravatar.cc/100?img=2",
      rating: 5,
      date: "February 20, 2025",
    },
    {
      name: "Michael Brown",
      profession: "Fitness Trainer",
      review:
        "I was suffering from neck and shoulder tension. After a few sessions, I felt an incredible difference. The staff is friendly and skilled!",
      image: "https://i.pravatar.cc/100?img=3",
      rating: 4.5,
      date: "January 15, 2025",
    },
    {
      name: "Sarah Wilson",
      profession: "Doctor",
      review:
        "As a healthcare professional myself, I was amazed by their approach. They truly care about their patients and provide excellent therapy!",
      image: "https://i.pravatar.cc/100?img=4",
      rating: 5,
      date: "December 10, 2024",
    },
    {
      name: "David Johnson",
      profession: "Business Consultant",
      review:
        "I never believed in chiropractic treatments until I visited this clinic. My chronic lower back pain has disappeared! Worth every visit.",
      image: "https://i.pravatar.cc/100?img=5",
      rating: 5,
      date: "November 28, 2024",
    },
    {
      name: "Sophia Lee",
      profession: "Graphic Designer",
      review:
        "From the moment I walked in, I felt welcomed. The treatment was smooth, and the results were amazing. A 10/10 experience!",
      image: "https://i.pravatar.cc/100?img=6",
      rating: 4.8,
      date: "October 5, 2024",
    },
  ];

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <div className="row justify-content-center pb-4">
          <div className="col-md-8 text-center">
            <p className="subheading text-primary">Patient Testimonials</p>
            <h2 className="fw-bold">Hear from Our Happy Patients</h2>
            <p className="text-muted">
              Discover how our chiropractic care has transformed lives.
            </p>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="review-card">
                <img
                  src={review.image}
                  alt={review.name}
                  className="rounded-circle"
                />
                <h5>{review.name}</h5>
                <p className="text-muted">{review.profession}</p>
                <div className="rating">
                  {Array.from({ length: Math.floor(review.rating) }, (_, i) => (
                    <span key={i}>&#9733;</span>
                  ))}
                  {review.rating % 1 !== 0 && <span>&#9734;</span>}
                </div>
                <p className="review-text">"{review.review}"</p>
                <small>{review.date}</small>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CustomerReviews;
