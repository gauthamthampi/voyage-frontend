import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

function GoogleMapModal({ isOpen, onClose, onLocationSelect }) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

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

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLocation({ lat, lng });
          setSelectedLocation({ lat, lng });
        },
        (error) => {
          console.error('Error fetching current location:', error);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setCurrentLocation({ lat, lng });
      setSelectedLocation({ lat, lng });
      mapRef.current.panTo({ lat, lng });
    }
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-lg w-3/4 max-w-2xl">
          <h2 className="text-xl font-bold mb-4">Select Location</h2>
          <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} libraries={['places']}>
            <Autocomplete onLoad={(ref) => (autocompleteRef.current = ref)} onPlaceChanged={handlePlaceChanged}>
              <input
                type="text"
                placeholder="Search for a location"
                className="w-full p-2 mb-4 border rounded"
              />
            </Autocomplete>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={selectedLocation || currentLocation}
              zoom={10}
              onClick={handleMapClick}
              onLoad={(map) => (mapRef.current = map)}
            >
              {selectedLocation && <Marker position={selectedLocation} />}
            </GoogleMap>
          </LoadScript>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-500 text-white font-bold py-2 px-4 mx-2 rounded"
              onClick={handleUseCurrentLocation}
            >
              Use Current Location
            </button>
            <div>
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
      </div>
    )
  );
}

export default GoogleMapModal;
