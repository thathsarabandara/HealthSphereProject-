import React from 'react'
import Error from './Error'
import error503 from '../../assets/images/Rectangle 9 (1).svg';

function Error503() {
  return (
    <Error 
      errorimg={error503} 
      errorCode="503" 
      errorMessage="Service Unavailable. The server is temporarily unable to handle the request." 
    />
  )
}

export default Error503