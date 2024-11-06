import React from 'react'
import Error from './Error'

function Error401() {
  return (
    <Error 
      errorimg={error401} 
      errorCode="401" 
      errorMessage="Unauthorized. You need to log in to access this page." 
    />
  )
}

export default Error401