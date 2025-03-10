import React from 'react';
import Slider from 'react-slick';
import './BlogPostSlider.css'

const BlogPostSlider = () => {
  // Example blog post data
  const blogPosts = [
    {
      title: "Understanding Chiropractic Care: Benefits & Myths",
      author: "Dr. John Smith",
      date: "March 12, 2025",
      content: "Learn about chiropractic care, its benefits, and the common myths surrounding it. Understand how chiropractic therapy can improve your health and well-being.",
      imgSrc: "https://th.bing.com/th/id/R.18fc3a3b07dab7d7db95c9db269d87ba?rik=xzAEMHSLanMOFQ&riu=http%3a%2f%2fwww.sweetcaptcha.com%2fwp-content%2fuploads%2f2018%2f07%2fa333.jpg&ehk=dzcfab0%2bnfkmNXGBcKc0PHTiURIqiombsqH7EOtk2jE%3d&risl=&pid=ImgRaw&r=0&sres=1&sresct=1",
    },
    {
      title: "How Preventive Healthcare Saves Lives",
      author: "Dr. Emily White",
      date: "March 8, 2025",
      content: "Discover the importance of preventive healthcare and how routine screenings and early detection can help prevent serious health issues.",
      imgSrc: "https://i.ytimg.com/vi/MxZ2C8rsB4o/maxresdefault.jpg",
    },
    {
      title: "Top Tips for Maintaining a Healthy Lifestyle",
      author: "Dr. Michael Brown",
      date: "March 5, 2025",
      content: "Read about the top tips and habits that can help you maintain a healthy lifestyle. Small changes can make a big difference in your overall health.",
      imgSrc: "https://www.makemebetter.net/wp-content/uploads/2022/07/main-13.jpg",
    },
    {
      title: "Understanding Electrotherapy for Pain Relief",
      author: "Dr. Sarah Lee",
      date: "March 1, 2025",
      content: "Electrotherapy is a popular treatment method for pain relief. In this post, we explain how it works and how it can help patients recover faster.",
      imgSrc: "https://www.royacdn.com/unsafe/Site-d8a8003c-2649-43a2-bd4d-7268df29c5e3/Images/Electro_5.jpg",
    },
  ];

  // Slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <section className="blog-post-section py-5">
      <div className="container">
        <div className="row text-center mb-4">
          <div className="col">
            <h2 className="section-title" style={{ fontSize: "36px", fontWeight: "600", color: "#1E4D70" }}>
              Latest Blog Posts
            </h2>
            <p className="section-subtitle" style={{ fontSize: "18px", fontWeight: "400", color: "#5B5B5B" }}>
              Stay updated with our latest posts and tips on health, wellness, and medical treatments.
            </p>
          </div>
        </div>

        <div className="row">
          <Slider {...settings}>
            {blogPosts.map((post, index) => (
              <div key={index} className="blog-card">
                <div className="card" style={{ border: 'none', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
                  <img src={post.imgSrc} alt="blog-image" className="card-img-top" style={{ borderRadius: '8px 8px 0 0' }} />
                  <div className="card-body" style={{ padding: '20px' }}>
                    <h5 className="card-title" style={{ fontSize: '20px', fontWeight: '500', color: '#1E4D70' }}>
                      {post.title}
                    </h5>
                    <p className="card-text" style={{ color: '#777', fontSize: '16px' }}>
                      {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                    </p>
                    <div className="card-footer" style={{ fontSize: '14px', color: '#5B5B5B', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                      <p><strong>{post.author}</strong> | {post.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default BlogPostSlider;
