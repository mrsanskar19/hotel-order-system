import { useState } from 'react';

const Modal = ({ buttonText, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={openModal} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {buttonText || 'Open Modal'}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
            <button className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl" onClick={closeModal}>
              &times;
            </button>
            <div className="mt-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
