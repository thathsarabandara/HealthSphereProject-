import React from 'react'
import rectangle9 from '../../assets/images/Rectangle 9 (1).svg';
import Error from './Error';

function Error404() {
  return (
  <Error 
      errorimg={rectangle9} 
      errorCode="404" 
      errorMessage="Page Not Found. The page you are looking for might have been removed." 
    />
  )
}

export default Error404