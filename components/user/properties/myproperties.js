import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEmailFromToken from '../../../utils/decode';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GoogleMapModal from "./gmap";
import axiosInstance from '@/utils/axios';

function MyProperties() {
  const [showModal, setShowModal] = useState(false);
  const [property, setProperty] = useState({
    name: '',
    photos: [],
    description: '',
    latitude: null,
    longitude: null,
    destination: '',
    facilities: [{ facility: '', svg: '' }],
    rooms: [{ category: '', guests: null, availability: null, price: null }],
    surroundings: [{ category: '', place: '', distance: null }]
  });
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const token = localStorage.getItem('usertoken');
  const [showGoogleMapModal, setShowGoogleMapModal] = useState(false);
  // const [propertyLocation, setPropertyLocation] = useState({ lat: null, lng: null });
  const userEmail = getEmailFromToken();

  const handleOpenGoogleMapModal = () => {
    setShowGoogleMapModal(true);
  };

  const handleCloseGoogleMapModal = () => {
    setShowGoogleMapModal(false);
  };

  const handleLocationSelect = (location) => {
    // setPropertyLocation(location);
    setProperty({
      ...property,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  useEffect(() => {
    fetchEmailAndDestinations();
  }, [token]);

    const fetchEmailAndDestinations = async () => {
      try {
        
        setEmail(userEmail);

        try {
          const destinationsResponse = await axiosInstance.get('http://localhost:3001/getDestinations', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          setDestinations(destinationsResponse.data);
        } catch (error) {
          console.error('Error fetching destinations:', error);
        }

        try {
          const propertiesResponse = await axiosInstance.get('http://localhost:3001/getUserProperties', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { email: userEmail }
          });
          setProperties(propertiesResponse.data);
        } catch (error) {
          console.error('Error fetching properties:', error);
        }
      } catch (error) {
        console.error('Error fetching email:', error);
      }
    };

    

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProperty((prevProperty) => ({
      ...prevProperty,
      [name]: value
    }));
  };

  const handleArrayChange = (e, index, field, subfield) => {
    const { value } = e.target;
    setProperty((prevProperty) => {
      const updatedArray = [...prevProperty[field]];
      updatedArray[index][subfield] = value;
      return {
        ...prevProperty,
        [field]: updatedArray
      };
    });
  };

  const addArrayField = (field, newField) => {
    setProperty((prevProperty) => ({
      ...prevProperty,
      [field]: [...prevProperty[field], newField]
    }));
  };

  const removeArrayField = (field, index) => {
    setProperty((prevProperty) => {
      const updatedArray = prevProperty[field].filter((_, i) => i !== index);
      return {
        ...prevProperty,
        [field]: updatedArray
      };
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProperty((prevProperty) => ({
      ...prevProperty,
      photos: [...prevProperty.photos, ...files]
    }));
  };

  const removeImage = (index) => {
    setProperty((prevProperty) => {
      const updatedPhotos = prevProperty.photos.filter((_, i) => i !== index);
      return {
        ...prevProperty,
        photos: updatedPhotos
      };
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setProperty({
      name: '',
      photos: [],
      description: '',
      latitude: null,
      longitude: null,
      destination: '',
      facilities: [{ facility: '', svg: '' }],
      rooms: [{ category: '', guests: null, availability: null, price: null }],
      surroundings: [{ category: '', place: '', distance: null }]
    });
    // setPropertyLocation({ lat: null, lng: null })
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!property.name) newErrors.name = 'Name is required';
    if (!property.description) newErrors.description = 'Description is required';
    if (!property.destination) newErrors.destination = 'Destination is required';
    property.facilities.forEach((facility, index) => {
      if (!facility.facility) newErrors[`facility_${index}`] = 'Facility name is required';
      if (!facility.svg) newErrors[`svg_${index}`] = 'SVG is required';
    });
    property.rooms.forEach((room, index) => {
      if (!room.category) newErrors[`category_${index}`] = 'Category is required';
      if (!room.guests) newErrors[`guests_${index}`] = 'Guests number is required';
      if (!room.availability) newErrors[`availability_${index}`] = 'Availability is required';
      if (!room.price) newErrors[`price_${index}`] = 'Room Amount is required';
    });
    property.surroundings.forEach((surrounding, index) => {
      if (!surrounding.category) newErrors[`sur_category_${index}`] = 'Category is required';
      if (!surrounding.place) newErrors[`sur_place_${index}`] = 'Place is required';
      if (!surrounding.distance) newErrors[`sur_distance_${index}`] = 'Distance is required';
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('name', property.name);
    formData.append('description', property.description);
    formData.append('latitude', property.latitude);
    formData.append('longitude', property.longitude);
    formData.append('destination', property.destination);
    formData.append('email', email);
    property.photos.forEach((photo) => formData.append('photos', photo));
    formData.append('facilities', JSON.stringify(property.facilities));
    formData.append('rooms', JSON.stringify(property.rooms));
    formData.append('surroundings', JSON.stringify(property.surroundings));

    try {
      const response = isEditing
        ? await axiosInstance.put(`http://localhost:3001/property/updateProperty/${editingPropertyId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          })
        : await axiosInstance.post('http://localhost:3001/property/addProperty', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

      console.log('Property saved:', response.data);

      if (isEditing) {
        const updatedProperties = properties.map(prop =>
          prop._id === editingPropertyId ? response.data : prop
        );
        setProperties(updatedProperties);
      } else {
        setProperties([...properties, response.data]);
      }

      setShowModal(false);
      setIsEditing(false);
      setEditingPropertyId(null);
      toast.success(isEditing ? 'Property updated successfully' : 'Property added successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors((prevErrors) => ({ ...prevErrors, ...error.response.data.errors }));
      } else {
        console.error('Error saving property:', error);
      }
    }
  };
  

  const handleEdit = (propertyId) => {
    const propertyToEdit = properties.find((prop) => prop._id === propertyId);
    setProperty({
      name: propertyToEdit.name,
      photos: propertyToEdit.photos, // Handle existing photos
      description: propertyToEdit.description,
      latitude: propertyToEdit.location.latitude,
      longitude:propertyToEdit.location.longitude,
      destination: propertyToEdit.destination,
      facilities: propertyToEdit.facilities,
      rooms: propertyToEdit.rooms,
      surroundings: propertyToEdit.surroundings
    });
    setIsEditing(true);
    setEditingPropertyId(propertyId);
    setShowModal(true);
  };

  const handleBlock = async (propertyId) => {
    try {
      await axios.put(`http://localhost:3001/property/blockProperty/${propertyId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log('Property blocked');
      toast.success('Property Blocked successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });// Refresh the properties list after block
    } catch (error) {
      console.error('Error blocking property:', error);
    }
  };
  const handleUnBlock = async (propertyId) => {
    try {
      await axios.put(`http://localhost:3001/property/blockProperty/${propertyId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // fetchEmailAndDestinations(); 
      toast.success('Property Blocked successfully', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });
    } catch (error) {
      console.error('Error blocking property:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    setIsEditing(false);
    setEditingPropertyId(null);
    setProperty({
      name: '',
      photos: [],
      description: '',
      location: '',
      destination: '',
      facilities: [{ facility: '', svg: '' }],
      rooms: [{ category: '', guests: null, availability: null,price:null }],
      surroundings: [{ category: '', place: '', distance: null }]
    });
    setErrors({});
  };

  return (
    <div>
      <ToastContainer />
      <div className='flex justify-between items-center'>
        <p className='p-6 text-lg font-bold'>My Properties</p>
        <button
          className='bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded'
          onClick={handleOpenModal}
        >
          Add Properties
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full bg-white'>
          <thead>
            <tr >
              <th className='py-2 px-4 border-b text-start'>Name</th>
              <th className='py-2 px-4 border-b text-start'>Image</th>
              <th className='py-2 px-4 border-b text-start'>Destination</th>
              <th className='py-2 px-4 border-b text-start'>No of Rooms</th>
              <th className='py-2 px-4 border-b text-start'>No of Facilities</th>
              <th className='py-2 px-4 border-b text-start'>Status</th>
              <th className='py-2 px-4 border-b text-start'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop._id} className='hover:bg-gray-100'>
                <td className='py-2 px-4 border-b text-center'>{prop.name}</td>
                <td className='py-2 px-4 border-b text-start'>
                  {prop.photos.length > 0 && (
                    <img src={`http://localhost:3001/uploads/${prop.photos[0]}`} alt={prop.name} className='w-20 h-20 object-cover' />
                  )}
                </td>
                <td className='py-2 px-4 border-b text-start'>{prop.destination}</td>
                <td className='py-2 px-4 border-b text-start'>{prop.rooms.length}</td>
                <td className='py-2 px-4 border-b text-start'>{prop.facilities.length}</td>
                <td className={prop.status? "py-2 px-4 border-b text-start text-green-700" : "py-2 px-4 border-b text-start text-red-700"}>{prop.status? "Active" : "Blocked"}</td>
                <td className='py-2 px-4 border-b text-start'>
                  <button
                    className='bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded'
                    onClick={() => handleEdit(prop._id)}
                  >
                    Edit
                  </button>
                  {prop.status === 'Active' ? (
    <button 
      onClick={() => handleBlock(prop._id)}
      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 transition"
    >
      Block
    </button>
  ) : (
    <button 
      onClick={() => handleBlock(prop._id)}
      className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-800 transition"
    >
      Block
    </button>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
  <div className='fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50'>
    <div className='bg-white p-8 rounded shadow-lg w-3/4 max-w-2xl max-h-[90vh] overflow-auto'>
      <h2 className='text-xl font-bold mb-4'>
        {isEditing ? 'Edit Property' : 'Add Property'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2'>Name</label>
          <input
            type='text'
            name='name'
            value={property.name}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded'
          />
          {errors.name && <p className='text-red-500 text-xs'>{errors.name}</p>}
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2'>Description</label>
          <textarea
            name='description'
            value={property.description}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded'
          />
          {errors.description && <p className='text-red-500 text-xs'>{errors.description}</p>}
        </div>
        <div className="mb-4">
  <label htmlFor="location" className="block text-sm font-medium text-gray-700">
    Location
  </label>
  <input
    id="location"
    type="text"
    value={
      property.latitude && property.longitude
        ? `${ property.latitude}, ${property.longitude}`
        : ''
    }
    readOnly
    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
  />
</div>
<button
  type="button"
  onClick={handleOpenGoogleMapModal}
  className="px-4 py-2 bg-blue-500 text-white rounded"
>
  Select Location
</button>
{errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}


        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2'>Destination</label>
          <select
            name='destination'
            value={property.destination}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded'
          >
            <option value=''>Select a destination</option>
            {destinations.map((destination) => (
              <option key={destination._id} value={destination.name}>
                {destination.name}
              </option>
            ))}
          </select>
          {errors.destination && <p className='text-red-500 text-xs'>{errors.destination}</p>}
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-bold mb-2'>Photos</label>
          <input
            type='file'
            multiple
            onChange={handleImageChange}
            className='w-full px-3 py-2 border rounded'
          />
          <div className='flex flex-wrap mt-2'>
            {property.photos.map((photo, index) => (
              <div key={index} className='relative w-20 h-20 mr-2 mb-2'>
                <img
                  src={
                    photo instanceof File
                      ? URL.createObjectURL(photo)
                      : `http://localhost:3001/uploads/${photo}`
                  }
                  alt={`Photo ${index}`}
                  className='w-full h-full object-cover'
                />
                <button
                  type='button'
                  className='absolute top-0 right-0 bg-red-500 text-white p-1 rounded'
                  onClick={() => removeImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        {property.facilities.map((facility, index) => (
          <div key={index} className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Facility {index + 1}</label>
            <div className='flex'>
              <input
                type='text'
                name={`facility_${index}`}
                value={facility.facility}
                onChange={(e) => handleArrayChange(e, index, 'facilities', 'facility')}
                placeholder='Facility name'
                className='w-1/2 px-3 py-2 border rounded mr-2'
              />
              <input
                type='text'
                name={`svg_${index}`}
                value={facility.svg}
                onChange={(e) => handleArrayChange(e, index, 'facilities', 'svg')}
                placeholder='SVG'
                className='w-1/2 px-3 py-2 border rounded'
              />
              <button
                type='button'
                className='bg-red-500 text-white px-3 py-2 ml-2 rounded'
                onClick={() => removeArrayField('facilities', index)}
              >
                &times;
              </button>
            </div>
            {errors[`facility_${index}`] && (
              <p className='text-red-500 text-xs'>{errors[`facility_${index}`]}</p>
            )}
            {errors[`svg_${index}`] && (
              <p className='text-red-500 text-xs'>{errors[`svg_${index}`]}</p>
            )}
          </div>
        ))}
        <button
          type='button'
          className='bg-blue-500 text-white font-bold py-2 px-4 mb-4 rounded'
          onClick={() =>
            addArrayField('facilities', { facility: '', svg: '' })
          }
        >
          Add Facility
        </button>
        {/* Render Rooms */}
        {property.rooms.map((room, index) => (
          <div key={index} className='mb-4'>
            <label className='block text-sm font-bold mb-2'>Room {index + 1}</label>
            <div className='flex'>
              <input
                type='text'
                name={`category_${index}`}
                value={room.category}
                onChange={(e) => handleArrayChange(e, index, 'rooms', 'category')}
                placeholder='Category'
                className='w-1/3 px-3 py-2 border rounded mr-2'
              />
              <input
                type='number'
                name={`guests_${index}`}
                value={room.guests}
                onChange={(e) => handleArrayChange(e, index, 'rooms', 'guests')}
                placeholder='Guests'
                className='w-1/3 px-3 py-2 border rounded mr-2'
              />
              <input
                type='number'
                name={`availability_${index}`}
                value={room.availability}
                onChange={(e) => handleArrayChange(e, index, 'rooms', 'availability')}
                placeholder='Availability'
                className='w-1/3 px-3 py-2 border rounded'
              />
              <input
                type='number'
                name={`price_${index}`}
                value={room.price}
                onChange={(e) => handleArrayChange(e, index, 'rooms', 'price')}
                placeholder='Amount for 1 day'
                className='w-1/3 px-3 py-2 border rounded'
              />
              <button
                type='button'
                className='bg-red-500 text-white px-3 py-2 ml-2 rounded'
                onClick={() => removeArrayField('rooms', index)}
              >
                &times;
              </button>
            </div>
            {errors[`category_${index}`] && (
              <p className='text-red-500 text-xs'>{errors[`category_${index}`]}</p>
            )}
            {errors[`guests_${index}`] && (
              <p className='text-red-500 text-xs'>{errors[`guests_${index}`]}</p>
            )}
            {errors[`availability_${index}`] && (
              <p className='text-red-500 text-xs'>{errors[`availability_${index}`]}</p>
            )}
          </div>
        ))}
        <button
          type='button'
          className='bg-blue-500 text-white font-bold py-2 px-4 mb-4 rounded'
          onClick={() =>
            addArrayField('rooms', { category: '', guests: null, availability: null })
          }
        >
          Add Room
        </button>
        {/* Render Surroundings */}
        {/* Render Surroundings */}
{property.surroundings.map((surrounding, index) => (
  <div key={index} className='mb-4'>
    <label className='block text-sm font-bold mb-2'>Surrounding {index + 1}</label>
    <div className='flex'>
      <select
        name={`category_${index}`}
        value={surrounding.category}
        onChange={(e) => handleArrayChange(e, index, 'surroundings', 'category')}
        className='w-1/3 px-3 py-2 border rounded mr-2'
      >
        <option value=''>Select a category</option>
        <option value='Things nearby'>Things nearby</option>
        <option value="Cafe's and Restaurants">Cafe's and Restaurants</option>
        <option value='Transportation'>Transportation</option>
      </select>
      <input
        type='text'
        name={`place_${index}`}
        value={surrounding.place}
        onChange={(e) => handleArrayChange(e, index, 'surroundings', 'place')}
        placeholder='Place'
        className='w-1/3 px-3 py-2 border rounded mr-2'
      />
      <input
        type='number'
        name={`distance_${index}`}
        value={surrounding.distance}
        onChange={(e) => handleArrayChange(e, index, 'surroundings', 'distance')}
        placeholder='Distance'
        className='w-1/3 px-3 py-2 border rounded'
      />
      <button
        type='button'
        className='bg-red-500 text-white px-3 py-2 ml-2 rounded'
        onClick={() => removeArrayField('surroundings', index)}
      >
        &times;
      </button>
    </div>
    {errors[`category_${index}`] && (
      <p className='text-red-500 text-xs'>{errors[`category_${index}`]}</p>
    )}
    {errors[`place_${index}`] && (
      <p className='text-red-500 text-xs'>{errors[`place_${index}`]}</p>
    )}
    {errors[`distance_${index}`] && (
      <p className='text-red-500 text-xs'>{errors[`distance_${index}`]}</p>
    )}
  </div>
))}
<button
  type='button'
  className='bg-blue-500 text-white font-bold py-2 px-4 mb-4 rounded'
  onClick={() =>
    addArrayField('surroundings', { category: '', place: '', distance: '' })
  }
>
  Add Surrounding
</button>

        <div className='flex justify-end'>
          <button
            type='button'
            className='bg-gray-500 text-white font-bold py-2 px-4 mx-2 rounded'
            onClick={handleCloseModal}
          >
            Cancel
          </button>
          <button
            type='submit'
            className='bg-green-500 text-white font-bold py-2 px-4 mx-2 rounded'
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}
   
   <GoogleMapModal
        isOpen={showGoogleMapModal}
        onClose={handleCloseGoogleMapModal}
        onLocationSelect={handleLocationSelect}
      />

    </div>
  );
};

export default MyProperties;
