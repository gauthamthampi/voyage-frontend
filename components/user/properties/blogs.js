import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEmailFromToken from '@/utils/decode';
import { localhost } from '@/url';
import { FaEdit, FaTrash } from 'react-icons/fa';

function Blogs() {
  const [showModal, setShowModal] = useState(false);
  const [blogs, setBlogs] = useState([]); 
  const [title, setTitle] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [editingBlog, setEditingBlog] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const userEmail = getEmailFromToken();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${localhost}/api/premium/blogs`, {
          params: { email: userEmail }
        });
        setBlogs(response.data);
      } catch (err) {
        console.log(err);
        setError('Failed to fetch blogs.');
      }
    };

    fetchBlogs();
  }, [userEmail]);

  const handleAddBlog = () => {
    setEditingBlog(null);  // Clear any existing editing blog
    setShowModal(true);
  };

  const handleEditBlog = (blog) => {
    setTitle(blog.title);
    setContent(blog.content);
    setCoverPhoto(null);
    setImagePreview(blog.photos ? `${localhost}/uploads/${blog.photos}` : null);
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDeleteBlog = (blog) => {
    setBlogToDelete(blog);
    setShowConfirmModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setTitle('');
    setCoverPhoto(null);
    setContent('');
    setImagePreview(null);
    setError('');
    setEditingBlog(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPhoto(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCoverPhoto(null);
    setImagePreview(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!title || !content) {
      setError('Title and content are required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('writer', userEmail);
  
    // If there's a new photo, append it; otherwise, keep the existing photo
    if (coverPhoto) {
      formData.append('photos', coverPhoto);
    } else if (editingBlog) {
      // If no new photo and we're editing, use the existing photo
      formData.append('existingPhoto', editingBlog.photos); // Use the old photo
    }
  
    try {
      if (editingBlog) {
        // Update existing blog
        const response = await axios.put(`${localhost}/api/blogs/update/${editingBlog._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBlogs(blogs.map(blog => blog._id === editingBlog._id ? response.data : blog));
      } else {
        // Create new blog
        const response = await axios.post(`${localhost}/api/blogs/create`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setBlogs([...blogs, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.error || 'Failed to save the blog.');
    }
  };
  

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${localhost}/api/blogs/delete/${blogToDelete._id}`);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setShowConfirmModal(false);
      setBlogToDelete(null);
    } catch (err) {
      console.log(err);
      setError('Failed to delete the blog.');
    }
  };

  return (
    <div className='p-2'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold mt-3">My Blogs</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddBlog}
        >
          Write a blog
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {blogs.length === 0 ? (
          <p>No blogs available</p>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="relative border p-4 rounded shadow">
              <img src={`${localhost}/uploads/${blog.photos}`} alt={blog.title} className="mb-2 rounded" />
              <h3 className="text-lg font-bold">{blog.title}</h3>
              <p className="text-sm">{blog.content.slice(0, 100)}...</p>
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEditBlog(blog)}
                  className="text-blue-500"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeleteBlog(blog)}
                  className="text-red-500"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-w-3xl">
            <h3 className="text-2xl font-bold mb-4">{editingBlog ? 'Edit Blog' : 'Write a New Blog'}</h3>
            <form onSubmit={handleFormSubmit} className="max-h-[80vh] overflow-y-auto">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded" 
                  placeholder="Enter blog title"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Cover Photo</label>
                <input 
                  type="file" 
                  className="w-full px-3 py-2 border rounded" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="relative mt-4">
                    <img src={imagePreview} alt="Cover Preview" className="w-full h-64 object-cover rounded" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Blog Content</label>
                <textarea 
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 border rounded" 
                  rows="8" 
                  placeholder="Write your blog here..."
                ></textarea>
              </div>
              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {editingBlog ? 'Update' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this blog?</p>
            <div className="flex justify-end mt-4">
              <button 
                type="button" 
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={handleConfirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Blogs;

