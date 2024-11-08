import React from 'react'
import Error from './Error'
import error400 from '../../assets/images/Rectangle 9 (1).svg';

function Error400() {
  return (
    <Error 
      errorimg={error400} 
      errorCode="400" 
      errorMessage="Bad Request. The request could not be understood by the server." 
    />
  )
}

export default Error400