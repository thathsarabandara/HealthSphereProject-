import React from 'react'
import Error from './Error'

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