import React from 'react'
import Error from './Error'

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