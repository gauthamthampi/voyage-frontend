import React from 'react';

const Modal = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3 relative">
        <button className="absolute top-2 right-2 text-red-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
