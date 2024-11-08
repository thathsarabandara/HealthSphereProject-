import React from 'react'
import Error from './Error'
import error429 from '../../assets/images/Rectangle 9 (1).svg';

function Error429() {
  return (
    <Error 
      errorimg={error429} 
      errorCode="429" 
      errorMessage="Too Many Requests. You have sent too many requests in a short time." 
    />
  )
}

export default Error429