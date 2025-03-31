
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useBlog } from '@/context/BlogContext';
import Navbar from '@/components/Navbar';
import BlogForm from '@/components/BlogForm';
import { toast } from 'sonner';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { blogs, updateBlog } = useBlog();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the blog to edit
  useEffect(() => {
    const foundBlog = blogs.find(b => b._id === id);
    
    if (foundBlog) {
      setBlog(foundBlog);
    } else {
      toast.error('Blog post not found');
      navigate('/dashboard');
    }
  }, [blogs, id, navigate]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Check if user is the author of the blog
    if (blog && blog.author._id !== user._id) {
      toast.error('You are not authorized to edit this blog');
      navigate('/dashboard');
    }
  }, [user, blog, navigate]);

  if (!user || !blog) {
    return null;
  }

  const handleUpdateBlog = async (data) => {
    try {
      setIsSubmitting(true);
      await updateBlog(blog._id, {
        ...data,
      });
      toast.success('Blog post updated successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating blog:', error);
      toast.error('Failed to update blog post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-serif font-medium mb-8">Edit Blog Post</h1>
          
          <div className="bg-white shadow-sm rounded-lg p-6">
            <BlogForm 
              onSubmit={handleUpdateBlog}
              initialData={blog}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditPost;
