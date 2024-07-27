import React, { useState } from 'react';

const FormField = ({ field, value, onSave, countryList }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    // Reset error message
    setError('');

    // Validate mobile field
    if (field === 'mobile' && inputValue.length < 10) {
      setError('Mobile number must be at least 10 digits long.');
      return;
    }

    if (field === 'firstname' && inputValue.trim() === '') {
        setError('Firstname cannot be empty.');
        return;
      }

    // Call onSave if validation passes
    onSave(inputValue);
  };

  const renderInput = () => {
    switch (field) {
      case 'dob':
        return <input type="date" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full border p-2" />;
      case 'mobile':
        return <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full border p-2" />;
      case 'gender':
        return (
          <select value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full border p-2">
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        );
      case 'nationality':
        return (
          <select value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full border p-2">
            <option value="">Select Country</option>
            {countryList.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
        );
      default:
        return <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} className="w-full border p-2" />;
    }
  };

  return (
    <div>
      <h2 className="text-xl mb-4 capitalize">Update {field}</h2>
      {renderInput()}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      <button onClick={handleSave} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
};

export default FormField;
