import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';


const GoogleMapViewModal = ({ isOpen, onClose, latitude, longitude }) => {
  if (!isOpen) return null;

  return (
  

<div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
  <div className="relative w-full max-w-4xl max-h-[80vh] bg-white p-4 overflow-auto">
    <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>X</button>
    <div className="w-full h-full">
  <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ height: '400px', width: '800px' }}
            center={{ lat: latitude, lng: longitude }}
            zoom={15}
          >
            <Marker position={{ lat: latitude, lng: longitude }} />
          </GoogleMap>
        </LoadScript>  </div>
</div>
</div>
  );
};

export default GoogleMapViewModal;
