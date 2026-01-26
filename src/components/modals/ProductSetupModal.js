import React, { useState } from 'react';
import { Modal, Button, Input, Select } from '../common/UIComponents.js';

/**
 * ProductSetupModal Component
 * Modal for setting up a new product with job type and location
 */
function ProductSetupModal({ isOpen, onClose, onSave, productType = 'Flush Casement' }) {
  const [jobType, setJobType] = useState('Supply & Fit - Remove & replace');
  const [location, setLocation] = useState('');
  
  const jobTypeOptions = [
    { value: 'Supply & Fit - Remove & replace', label: 'Supply & Fit - Remove & replace' },
    { value: 'Supply Only', label: 'Supply Only' },
    { value: 'Supply & Fit - New build', label: 'Supply & Fit - New build' },
    { value: 'Repair', label: 'Repair' },
  ];
  
  const handleSave = () => {
    if (!location.trim()) {
      alert('Please enter a location');
      return;
    }
    onSave({ jobType, location: location.trim(), productType });
  };
  
  return React.createElement(Modal, {
    title: productType,
    isOpen,
    onClose,
    width: '500px'
  },
    React.createElement('div', { className: 'product-setup-form' },
      React.createElement('div', { className: 'form-row' },
        React.createElement('div', { className: 'form-col' },
          React.createElement(Select, {
            label: 'Job Type',
            value: jobType,
            onChange: setJobType,
            options: jobTypeOptions
          })
        ),
        React.createElement('div', { className: 'form-col' },
          React.createElement(Input, {
            label: 'Location',
            value: location,
            onChange: setLocation,
            placeholder: 'e.g., Lounge, Kitchen, Bedroom'
          })
        )
      ),
      React.createElement('div', { className: 'form-actions' },
        React.createElement(Button, {
          variant: 'secondary',
          onClick: onClose
        }, 'Cancel'),
        React.createElement(Button, {
          variant: 'success',
          onClick: handleSave
        }, 'Save')
      )
    )
  );
}

export default ProductSetupModal;
