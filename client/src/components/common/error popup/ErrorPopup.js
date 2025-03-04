import React from "react";
import './ErrorPopup.css';

const ErrorPopup = ({ 
    show,  
    onClose, 
    title = "Error!", 
    message = "An error occurred.", 
    button = "okay", 
}) => {
    return (
        <div className={`modal fade ${show ? "show d-block" : ""}`} id="statusErrorsModal" tabindex="-1" role="dialog" data-bs-backdrop="static" data-bs-keyboard="false"> 
          <div className="modal-dialog modal-dialog-centered modal-sm" role="document"> 
            <div className="modal-content"> 
              <div className="modal-body text-center p-lg-4"> 
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                                <circle className="path circle" fill="none" stroke="#db3646" stroke-width="6" stroke-miterlimit="10" cx="65.1" cy="65.1" r="62.1" /> 
                                <line className="path line" fill="none" stroke="#db3646" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="30" y1="30" x2="100" y2="100" />
                                <line className="path line" fill="none" stroke="#db3646" stroke-width="6" stroke-linecap="round" stroke-miterlimit="10" x1="100" y1="30" x2="30" y2="100" />
                </svg> 
                <h4 className="text-danger mt-3">{title}</h4> 
                <p className="mt-3">{message}</p>
                <button type="button" className="btn btn-sm mt-3 btn-danger" data-bs-dismiss="modal" onClick={onClose}>{button}</button> 
              </div> 
            </div> 
          </div> 
        </div>
    );
};

export default ErrorPopup;
