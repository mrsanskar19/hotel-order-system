"use client"
import { useState } from 'react';

export const Modal = ({
  buttonText = 'Open Modal',
  title,
  children,
  opacity = 0.5,
  border = false,
  closable = true,
  overlayClose = true,
  onClose,
  customStyles = {},
  externalOpen ,
  setExternalOpen // optional external controller
}) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = externalOpen !== undefined && setExternalOpen !== undefined;
  const isOpen = isControlled ? externalOpen : internalOpen;

  const openModal = () => {
    isControlled ? setExternalOpen(true) : setInternalOpen(true);
  };

  const closeModal = () => {
    isControlled ? setExternalOpen(false) : setInternalOpen(false);
    onClose?.();
  };

  const handleOverlayClick = (e) => {
    if (overlayClose && e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {buttonText}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
          onClick={handleOverlayClick}
        >
          <div
            className={`bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md ${
              border ? 'border border-gray-300' : ''
            }`}
            style={customStyles}
          >
            {closable && (
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
                onClick={closeModal}
              >
                &times;
              </button>
            )}
            {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
            <div>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

