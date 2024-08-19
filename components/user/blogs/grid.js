'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { localhost } from '../../../url';

const BlogGrid = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(localhost + '/api/allblogs');
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchBlogs();
  }, []);

  // Function to format the date
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Read Latest Articles</h2>
        <p className="mt-4 text-lg leading-6 text-gray-500">
          Dive into insightful reads that inspire, inform, and ignite curiosity.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {blogs.map((blog) => (
          <div key={blog._id} className="relative">
            <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105">
              <div className="w-full h-full bg-gray-200">
                <img
                  className="object-cover w-full h-full"
                  src={`${localhost}/uploads/${blog.photos}`}
                  alt={blog.title}
                />
              </div>
            </div>
            <div className="mt-4">
            <p className="text-sm font-light text-gray-600">
                {formatDate(blog.timestamp)}
              </p>
              <h3 className="text-xl font-semibold text-gray-900">{blog.title}</h3>
              <p className="mt-2 text-base text-gray-500 line-clamp-2">{blog.content}</p>
            
              <a href={`/readblog/${blog._id}`} className="mt-3 text-base font-medium text-indigo-600 hover:text-indigo-500">
                Continue Reading &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogGrid;
