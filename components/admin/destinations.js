import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { localhost } from '@/url';
import { toast, ToastContainer,Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Destinations = () => {
  const [showModal, setShowModal] = useState(false);
  const [destinationDetails, setDestinationDetails] = useState({
    name: '',
    description: '',
    photos: '',
    bestSeason: '',
    thingsToDo: [{ place: '', description: '' }],
  });
  const [coverPhotoFile, setCoverPhotoFile] = useState(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({
    name: '',
    description: '',
    Photos: '',
    bestSeason: '',
    thingsToDo: [{ place: '', description: '' }],
    backendErrors: '',
  });
  const [destinations, setDestinations] = useState([]);
  const [editingDestination, setEditingDestination] = useState(null);

  const fetchDestinations = async () => {
    try {
      const response = await axios.get(localhost+'/admin/destinations');
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDestinationDetails({
      ...destinationDetails,
      [name]: value,
    });
  };

  const handleThingsToDoChange = (index, e) => {
    const { name, value } = e.target;
    const newThingsToDo = [...destinationDetails.thingsToDo];
    newThingsToDo[index][name] = value;
    setDestinationDetails({
      ...destinationDetails,
      thingsToDo: newThingsToDo,
    });
  };

  const addNewThingToDo = () => {
    setDestinationDetails({
      ...destinationDetails,
      thingsToDo: [...destinationDetails.thingsToDo, { place: '', description: '' }],
    });
  };

  const removeThingToDo = (index) => {
    const newThingsToDo = [...destinationDetails.thingsToDo];
    newThingsToDo.splice(index, 1);
    setDestinationDetails({
      ...destinationDetails,
      thingsToDo: newThingsToDo,
    });
  };

  const handleCoverPhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverPhoto = () => {
    setCoverPhotoFile(null);
    setCoverPhotoPreview(null);
  };

  const validateForm = () => {
    const newErrors = {
      name: '',
      description: '',
      Photos: '',
      bestSeason: '',
      thingsToDo: destinationDetails.thingsToDo.map(() => ({ place: '', description: '' })),
    };
    let isValid = true;

    if (!destinationDetails.name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!destinationDetails.description) {
      newErrors.description = 'Description is required';
      isValid = false;
    }
    if (!coverPhotoFile && !editingDestination) {
      newErrors.Photos = 'Cover photo is required';
      isValid = false;
    }
    if (!destinationDetails.bestSeason) {
      newErrors.bestSeason = 'Best season is required';
      isValid = false;
    }

    destinationDetails.thingsToDo.forEach((item, index) => {
      if (!item.place) {
        newErrors.thingsToDo[index].place = 'Place is required';
        isValid = false;
      }
      if (!item.description) {
        newErrors.thingsToDo[index].description = 'Description is required';
        isValid = false;
      }
    });

    return { newErrors, isValid };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newErrors, isValid } = validateForm();
    setErrors(newErrors);
    if (!isValid) {
      return;
    }
  
    const formData = new FormData();
    formData.append('name', destinationDetails.name);
    formData.append('description', destinationDetails.description);
    if (coverPhotoFile) {
      formData.append('photos', coverPhotoFile);
    }
    formData.append('bestSeason', destinationDetails.bestSeason);
    formData.append('thingsToDo', JSON.stringify(destinationDetails.thingsToDo));
  
    try {
      if (editingDestination) {
        await axios.put(`${localhost}/admin/updateDestination/${editingDestination._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post(`${localhost}/admin/addDestination`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
  
      setShowModal(false);
      setDestinationDetails({
        name: '',
        description: '',
        photos: '',
        bestSeason: '',
        thingsToDo: [{ place: '', description: '' }],
      });
      setCoverPhotoFile(null);
      setCoverPhotoPreview(null);
      setEditingDestination(null);
      fetchDestinations();
    } catch (error) {
      
        console.error('An unexpected error occurred:', error);

    }
  };
  
  

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setDestinationDetails({
      name: destination.name,
      description: destination.description,
      photos: destination.photos,
      bestSeason: destination.bestSeason,
      thingsToDo: destination.thingsToDo,
    });
    setCoverPhotoPreview(`${localhost}/uploads/${destination.photos}`);
    setShowModal(true);
  };

  const handleBlock = (id)=>{
   try{
    const response = axios.put(`${localhost}/${id}/blockDestination`)
    toast.success('Destination blocked successfully', {
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
    fetchDestinations()
  } catch (error) {
    console.error('Error blocking destination:', error);
    toast.error('Failed to block Destination. Please try again later.', {
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
  }
  }

  const handleUnBlock = (id) => {
    try{
      const response = axios.put(`${localhost}/${id}/unblockDestination`)
      toast.success('Destination blocked successfully', {
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
      fetchDestinations()
    } catch (error) {
      console.error('Error blocking destination:', error);
      toast.error('Failed to block Destination. Please try again later.', {
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
    }
  }

  return (
    <div>
       <ToastContainer />
      <div className='flex justify-between items-center'>
        <p className='p-6 text-lg font-bold'>Destinations</p>
        <button
          className='bg-blue-500 text-white font-bold py-2 px-4 mx-2 rounded'
          onClick={() => setShowModal(true)}
        >
          Add Destination
        </button>
      </div>

      {showModal && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded shadow-lg w-1/2 max-h-screen overflow-auto'>
            <h2 className='text-2xl mb-4'>{editingDestination ? 'Edit Destination' : 'Add New Destination'}</h2>
            <form onSubmit={handleSubmit}>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Name:</label>
                <input
                  type='text'
                  name='name'
                  value={destinationDetails.name}
                  onChange={handleInputChange}
                  className='border rounded w-full py-2 px-3'
                />
                {errors.name && <p className='text-red-500'>{errors.name}</p>}
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Description:</label>
                <textarea
                  name='description'
                  value={destinationDetails.description}
                  onChange={handleInputChange}
                  className='border rounded w-full py-2 px-3'
                  // maxLength={500}
                />
                {errors.description && <p className='text-red-500'>{errors.description}</p>}
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Cover Photo:</label>
                <input
                  type='file'
                  name='photos'
                  onChange={handleCoverPhotoChange}
                  className='border rounded w-full py-2 px-3'
                />
                {errors.Photos && <p className='text-red-500'>{errors.Photos}</p>}
                {coverPhotoPreview && (
                  <div className='mt-2'>
                    <img src={coverPhotoPreview} alt='Cover Preview' className='w-full h-auto' />
                    <button
                      type='button'
                      className='bg-red-500 text-white font-bold py-2 px-4 rounded mt-2'
                      onClick={removeCoverPhoto}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Best Season:</label>
                <input
                  type='text'
                  name='bestSeason'
                  value={destinationDetails.bestSeason}
                  onChange={handleInputChange}
                  className='border rounded w-full py-2 px-3'
                  // maxLength={150}

                />
                {errors.bestSeason && <p className='text-red-500'>{errors.bestSeason}</p>}
              </div>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>Things to Do:</label>
                {destinationDetails.thingsToDo.map((item, index) => (
                  <div key={index} className='mb-2'>
                    <input
                      type='text'
                      name='place'
                      placeholder='Place'
                      value={item.place}
                      onChange={(e) => handleThingsToDoChange(index, e)}
                      className='border rounded w-full py-2 px-3 mb-1'
                    />
                    {errors.thingsToDo[index] && errors.thingsToDo[index].place && (
                      <p className='text-red-500'>{errors.thingsToDo[index].place}</p>
                    )}
                    <textarea
                      name='description'
                      placeholder='Description'
                      value={item.description}
                      onChange={(e) => handleThingsToDoChange(index, e)}
                      className='border rounded w-full py-2 px-3 mb-1'
                      // maxLength={150}
                    />
                    {errors.thingsToDo[index] && errors.thingsToDo[index].description && (
                      <p className='text-red-500'>{errors.thingsToDo[index].description}</p>
                    )}
                    <button
                      type='button'
                      className='bg-red-500 text-white font-bold py-1 px-2 rounded mt-1'
                      onClick={() => removeThingToDo(index)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type='button'
                  className='bg-green-500 text-white font-bold py-1 px-2 rounded mt-2'
                  onClick={addNewThingToDo}
                >
                  Add More
                </button>
              </div>
              {errors.backendErrors && <p className='text-red-500'>{errors.backendErrors}</p> }
              <div className='flex justify-end'>
                <button
                  type='button'
                  className='bg-red-500 text-white font-bold py-2 px-4 rounded mr-2'
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='bg-blue-500 text-white font-bold py-2 px-4 rounded'
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className='mt-4'>
        <h2 className='text-base mb-4 mx-4'>Existing Destinations</h2>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className="bg-gray-50">
            <tr className='bg-gray-200'>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Cover Photo</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Description</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
              <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {destinations.map((destination) => (
              <tr key={destination._id} className='hover:bg-gray-100'>
                <td className='px-4 py-4 whitespace-nowrap'>
                  <img src={`${localhost}/uploads/${destination.coverPhoto}`} alt="Destination Cover" className='w-20 h-auto' />
                </td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>{destination.name}</td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>{destination.description}</td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>{destination.status ? 'Active' : 'Inactive'}</td>
                <td className='border border-gray-300 px-4 py-4 whitespace-nowrap'>
                  <button
                    className='bg-blue-500 text-white font-light py-1 px-2 rounded mr-2'
                    onClick={() => handleEdit(destination)}
                  >
                    Edit
                  </button>
                  <button 
                    className={`bg-${destination.status ? 'red' : 'green'}-500 text-white font-light py-1 px-2 rounded`}
                    onClick={destination.status ? () => handleBlock(destination._id) : () => handleUnBlock(destination._id)}
                   >
                      {destination.status ? 'Block' : 'Unblock'}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Destinations;
