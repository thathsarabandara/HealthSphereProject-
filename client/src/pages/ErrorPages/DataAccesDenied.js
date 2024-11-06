import React from 'react'
import Error from './Error'

function DataAccesDenied() {
  return (
    <Error 
      errorimg={accessDeniedImg} 
      errorCode="403" 
      errorMessage="Access Denied. You don’t have permission to access this page." 
    />
  )
}

export default DataAccesDenied