import React from 'react'
import Error from './Error'
import error408 from '../../assets/images/Rectangle 9 (1).svg';

function Error408() {
  return (
    <Error 
      errorimg={error408} 
      errorCode="408" 
      errorMessage="Request Timeout. The server timed out waiting for the request." 
    />
  )
}

export default Error408