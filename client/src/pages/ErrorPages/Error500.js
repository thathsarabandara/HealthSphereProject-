import React from 'react'
import Error from './Error'
import error500 from '../../assets/images/Rectangle 9 (1).svg';

function Error500() {
  return (
    <Error 
      errorimg={error500} 
      errorCode="500" 
      errorMessage="Internal Server Error. Please try again later." 
    />
  )
}

export default Error500