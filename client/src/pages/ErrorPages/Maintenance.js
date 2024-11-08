import React from 'react'
import Error from './Error'
import maintenanceImage from '../../assets/images/Rectangle 9 (1).svg';

function Maintenance() {
  return (
    <Error 
      errorimg={maintenanceImage} 
      errorCode="503" 
      errorMessage="We're down for maintenance. Please check back soon." 
    />
  )
}

export default Maintenance