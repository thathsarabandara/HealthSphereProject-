import React, { useState } from 'react';
import Bot from '../../assets/images/bot-image.png';

function WebBot() {
  const [isIframeVisible, setIframeVisible] = useState(false);

  const toggleIframe = () => {
    setIframeVisible(!isIframeVisible); 
  };

  return (
    <div>
      {!isIframeVisible && (
        <button style={styles.imageButton} onClick={toggleIframe}>
          <img src={Bot} alt="Bot Icon" style={styles.botIcon} />
        </button>
      )}

      {isIframeVisible && (
        <div style={styles.iframeContainer}>
          <button style={styles.closeButton} onClick={toggleIframe}> - </button>
          <iframe
            src="http://localhost:3004/"
            style={styles.iframe}
            title="WebBot"
          ></iframe>
        </div>
      )}
    </div>
  );
}

const styles = {
  imageButton: {
    position: 'fixed',
    bottom: '50px', 
    right: '50px',  
    zIndex: '1000',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
  botIcon: {
    width: '60px',  
    height: '60px',
    borderRadius: '50%',  
    animation: 'shake 1.5s ease-in-out infinite', 
    transition: 'transform 0.3s ease, opacity 0.3s ease',  
  },
  iframeContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '400px', 
    height: '840px',
    backgroundColor: 'white',
    borderRadius: '10px', 
    overflow: 'hidden',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', 
    zIndex: '1000',
    borderRadius: '20px',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },

  closeButton: {
    position: 'absolute',
    width: '40px',
    height: '40px',
    top: '20px',
    right: '20px',
    backgroundColor: '#054fbf',
    color: 'white',
    border: '1px solid white',
    borderRadius: '65%',
    padding: '5px 10px',
    cursor: 'pointer',
  },
};

export default WebBot;

const keyframes = `
  @keyframes shake {
    0% { transform: translate(0); }
    10% { transform: translate(-4px, 0); }
    20% { transform: translate(4px, 0); }
    30% { transform: translate(-3px, 0); }
    40% { transform: translate(3px, 0); }
    50% { transform: translate(-2px, 0); }
    60% { transform: translate(2px, 0); }
    70% { transform: translate(-1px, 0); }
    80% { transform: translate(1px, 0); }
    100% { transform: translate(0); }
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);
}

const hoverStyles = `
  .botIcon:hover {
    transform: scale(1.1); /* Increase size on hover */
    opacity: 0.8; /* Slightly fade on hover */
  }
`;

if (typeof document !== 'undefined') {
  const hoverStyleSheet = document.createElement("style");
  hoverStyleSheet.type = "text/css";
  hoverStyleSheet.innerText = hoverStyles;
  document.head.appendChild(hoverStyleSheet);
}
