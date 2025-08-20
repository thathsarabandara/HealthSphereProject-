import React from 'react'
//import '../../user/Doctors/Style/DoctorCard.css'

function DoctorCard({ image, title, description, link }) {
  return (
    <div className="col-12 col-md-12 col-lg-6 mb-5" style={{ width: 197, height: 273, borderRadius: 8 }}>
  <div className="card text-center shadow" 
    style={{ 
      background: '#2A5D9C', 
      transition: 'transform 0.3s ease-in-out',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
  >
    <div className="card-body" style={{ background: '#2A5D9C', width: 190, height: 280, borderRadius: 8 }}>
      <img 
        src={image} 
        alt={title} 
        className="rounded-circle mb-1" 
        style={{ width: 94, height: 94 }} 
      />
      <div className="text-white mb-0" style={{ fontSize: 16, fontFamily: 'Sansation', fontWeight: '400' }}>
        {title}
      </div>
      <div className="text-white mb-3" style={{ fontSize: 9, fontFamily: 'Sansation', fontWeight: '400' }}>
        {description}
      </div>
      <button className="btn mb-1 w-100" style={{ background: '#112D4E', borderRadius: 10 }}>
        <a href={link} style={{ textDecoration: 'none', color: 'white', width: '100%', display: 'block', height: '100%' }}>
          <span className="text-white" style={{ fontSize: 15, fontFamily: 'Sansation', fontWeight: '400' }}>
            Book
          </span>
        </a>
      </button>
    </div>
  </div>
</div>




  )
}

export default DoctorCard
