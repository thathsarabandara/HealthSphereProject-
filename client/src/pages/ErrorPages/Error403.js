import React from 'react'
import error403 from '../../assets/images/Rectangle 9 (2).svg';
import Error from './Error';

function Error403() {
  return (
    <Error 
      errorimg={error403} 
      errorCode="403" 
      errorMessage="Forbidden. You don’t have permission to access this page." 
    />
  )
}

export default Error403