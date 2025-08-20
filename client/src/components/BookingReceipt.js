import React from 'react';
import { MdEvent, MdPerson, MdLocalHospital, MdPayment } from 'react-icons/md';

const sectionStyle = {
  marginBottom: '0.75rem',
  padding: '0.5rem 0',
  borderBottom: '1px solid #f5f5f5',
  fontSize: '0.625rem'
};

const headingStyle = {
  color: '#4B5563',
  fontSize: '0.625rem',
  margin: '0 0 0.5rem 0',
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  fontWeight: 600,
  letterSpacing: '0.1px'
};

const labelStyle = {
  color: '#6B7280',
  margin: '0.3rem 0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontSize: '0.625rem'
};

const valueStyle = {
  color: '#111827',
  fontWeight: 400,
  textAlign: 'right',
  fontSize: '0.625rem'
};

export const BookingReceipt = React.forwardRef(({ booking }, ref) => (
  <div ref={ref} style={{
    maxWidth: '400px',
    margin: '0 auto',
    padding: '0.75rem',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    color: '#374151',
    lineHeight: 1.3,
    fontSize: '0.625rem',
    backgroundColor: '#ffffff',
    borderRadius: '4px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
  }}>
    {/* Header */}
    <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
      <div style={{ 
        color: '#3B82F6', 
        margin: '0 0 0.25rem 0',
        fontSize: '0.875rem',
        fontWeight: 400,
        letterSpacing: '0.3px'
      }}>
        HealthSphere
      </div>
      <div style={{ 
        color: '#9CA3AF', 
        fontSize: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.5rem'
      }}>
        Appointment Receipt
      </div>
      <div style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #E5E7EB, transparent)',
        margin: '0.4rem 0'
      }} />
    </div>

    {/* Appointment Details */}
    <div style={sectionStyle}>
      <h3 style={headingStyle}>
        <MdEvent size={10} /> Appointment Details
      </h3>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Reference #</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.reservation_id}</p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Status</p>
        <p style={{
          ...valueStyle,
          color: booking.reservation_status === 'completed' ? '#10B981' : 
                 booking.reservation_status === 'available' ? '#3B82F6' : '#F59E0B',
          fontWeight: 500,
          textTransform: 'capitalize',
          fontSize: '0.5625rem',
          padding: '0.05rem 0.3rem',
          backgroundColor: booking.reservation_status === 'completed' ? '#ECFDF5' : 
                            booking.reservation_status === 'available' ? '#EFF6FF' : '#FFFBEB',
          borderRadius: '2px',
          margin: 0
        }}>
          {booking.reservation_status}
        </p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Date</p>
        <p style={{ ...valueStyle, margin: 0 }}>
          {new Date(booking.schedule_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Time</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.schedule_time}</p>
      </div>
    </div>

    {/* Patient Information */}
    <div style={sectionStyle}>
      <h3 style={headingStyle}>
        <MdPerson size={10} /> Patient Information
      </h3>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Patient ID</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.patient_id || 'N/A'}</p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Name</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.patient_name || 'N/A'}</p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Phone Number</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.patient_phone_number || 'N/A'}</p>
      </div>
    </div>

    {/* Doctor Information */}
    <div style={sectionStyle}>
      <h3 style={headingStyle}>
        <MdLocalHospital size={10} /> Doctor Information
      </h3>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Doctor</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.doctor_details?.name || 'N/A'}</p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Specialization</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.doctor_details?.specialization || 'N/A'}</p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Schedule Date</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.schedule_date || 'N/A'}</p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Schedule Time</p>
        <p style={{ ...valueStyle, margin: 0 }}>{booking.schedule_time || 'N/A'}</p>
      </div>
    </div>

    {/* Payment Summary */}
    <div style={sectionStyle}>
      <h3 style={headingStyle}>
        <MdPayment size={10} /> Payment
      </h3>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Consultation</p>
        <p style={{ ...valueStyle, margin: 0 }}>Rs. {parseFloat(booking.amount || 0).toFixed(2)}</p>
      </div>
      <div style={labelStyle}>
        <p style={{ margin: 0 }}>Tax</p>
        <p style={{ ...valueStyle, margin: 0 }}>0.00</p>
      </div>
      <div style={{
        ...labelStyle,
        marginTop: '0.5rem',
        paddingTop: '0.4rem',
        borderTop: '1px solid #E5E7EB',
        fontWeight: 600,
        fontSize: '0.6875rem',
        color: '#111827'
      }}>
        <p style={{ margin: 0 }}>Total</p>
        <p style={{ ...valueStyle, color: '#3B82F6', margin: 0 }}>Rs. {parseFloat(booking.amount || 0).toFixed(2)}</p>
      </div>
    </div>

    {/* Footer */}
    <div style={{
      marginTop: '1rem',
      paddingTop: '0.5rem',
      borderTop: '1px solid #F3F4F6',
      textAlign: 'center',
      fontSize: '0.5rem',
      color: '#9CA3AF',
      lineHeight: 1.3
    }}>
      <div>Thank you for choosing HealthSphere</div>
      <div style={{ fontSize: '0.45rem', marginTop: '0.25rem' }}>
        Present this receipt at your appointment
      </div>
    </div>
  </div>
));

export default BookingReceipt;