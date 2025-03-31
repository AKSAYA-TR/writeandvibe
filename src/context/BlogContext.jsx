
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

const BlogContext = createContext(undefined);

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

// Generate a dummy blog post for testing
const generateDummyBlogs = () => {
  return [
    {
      _id: '1',
      title: 'Getting Started with Blogging',
      subtitle: 'A beginner\'s guide to creating engaging content',
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Sed tincidunt, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
      author: {
        _id: '1',
        name: 'Demo User'
      },
      likes: ['2'],
      comments: [
        {
          _id: '1',
          blogId: '1',
          userId: '2',
          userName: 'Another User',
          content: 'Great post! Very informative.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000'
    },
    {
      _id: '2',
      title: 'The Art of Typography in Web Design',
      subtitle: 'How fonts influence user experience',
      content: 'Fonts play a crucial role in how users perceive and interact with your content. This post explores the importance of typography in modern web design...',
      author: {
        _id: '2',
        name: 'Another User'
      },
      likes: ['1'],
      comments: [],
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1561291386-5be50364cfb5?q=80&w=1000'
    }
  ];
};

export const BlogProvider = ({ children }) => {
  const [blogs, setBlogs] = useState(generateDummyBlogs());
  const [loading, setLoading] = useState(false);

  const createBlog = async (blog) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newBlog = {
        _id: Date.now().toString(),
        ...blog,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setBlogs(prevBlogs => [newBlog, ...prevBlogs]);
      toast.success('Blog post created successfully!');
    } catch (error) {
      toast.error('Failed to create blog post.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBlog = async (blogId, blogUpdate) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === blogId 
            ? { 
                ...blog, 
                ...blogUpdate, 
                updatedAt: new Date().toISOString() 
              } 
            : blog
        )
      );
      
      toast.success('Blog post updated successfully!');
    } catch (error) {
      toast.error('Failed to update blog post.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (blogId) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
      toast.success('Blog post deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete blog post.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const likeBlog = async (blogId, userId) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => {
          if (blog._id === blogId) {
            const alreadyLiked = blog.likes.includes(userId);
            
            if (alreadyLiked) {
              return {
                ...blog,
                likes: blog.likes.filter(id => id !== userId)
              };
            } else {
              return {
                ...blog,
                likes: [...blog.likes, userId]
              };
            }
          }
          return blog;
        })
      );
      
    } catch (error) {
      toast.error('Failed to update like status.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const commentOnBlog = async (blogId, userId, userName, content) => {
    try {
      setLoading(true);
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newComment = {
        _id: Date.now().toString(),
        blogId,
        userId,
        userName,
        content,
        createdAt: new Date().toISOString()
      };
      
      setBlogs(prevBlogs => 
        prevBlogs.map(blog => 
          blog._id === blogId 
            ? { 
                ...blog, 
                comments: [...blog.comments, newComment]
              } 
            : blog
        )
      );
      
      toast.success('Comment added successfully!');
    } catch (error) {
      toast.error('Failed to add comment.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <BlogContext.Provider 
      value={{ 
        blogs, 
        loading, 
        createBlog, 
        updateBlog, 
        deleteBlog, 
        likeBlog, 
        commentOnBlog 
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
