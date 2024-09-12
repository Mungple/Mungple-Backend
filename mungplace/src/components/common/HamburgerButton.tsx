import React, {useState} from 'react';

const HamburgerButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button onClick={toggleModal} className="hamburger-button">
        &#9776;
      </button>

      {isOpen && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={toggleModal} className="close-button">
              &times;
            </button>
            <p>This is the modal content!</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HamburgerButton;
