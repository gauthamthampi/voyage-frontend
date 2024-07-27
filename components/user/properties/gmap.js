import React, {useState} from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: -3.745,
  lng: -38.523
};

function GoogleMapModal({ isOpen, onClose, onLocationSelect }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapClick = (event) => {
    const { latLng } = event;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  const handleSaveLocation = () => {
    onLocationSelect(selectedLocation);
    onClose();
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg w-3/4 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Select Location</h2>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onClick={handleMapClick}
            >
              {selectedLocation && (
                <Marker position={selectedLocation} />
              )}
            </GoogleMap>
          </LoadScript>
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 mx-2 rounded"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded"
              onClick={handleSaveLocation}
            >
              Save Location
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default GoogleMapModal;
