
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import CommentForm from '@/components/CommentForm';
import CommentList from '@/components/CommentList';
import { useAuth } from '@/context/AuthContext';
import { useBlog, Blog } from '@/context/BlogContext';
import { toast } from 'sonner';

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { blogs, likeBlog, commentOnBlog, loading } = useBlog();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (id) {
      const foundBlog = blogs.find(b => b._id === id);
      if (foundBlog) {
        setBlog(foundBlog);
        if (user) {
          setIsLiked(foundBlog.likes.includes(user._id));
        }
      } else {
        navigate('/not-found');
      }
    }
  }, [id, blogs, user, navigate]);

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-4">Loading...</h1>
          </div>
        </main>
      </div>
    );
  }

  const handleLikeClick = async () => {
    if (!user) {
      toast.error('You must be logged in to like posts');
      navigate('/login');
      return;
    }

    try {
      await likeBlog(blog._id, user._id);
      setIsLiked(prev => !prev);
    } catch (error) {
      toast.error('Failed to update like status');
    }
  };

  const handleCommentSubmit = async (content: string) => {
    if (!user) {
      toast.error('You must be logged in to comment');
      navigate('/login');
      return;
    }

    try {
      await commentOnBlog(blog._id, user._id, user.name, content);
    } catch (error) {
      toast.error('Failed to post comment');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <article className="container mx-auto max-w-3xl">
          {blog.imageUrl && (
            <div className="w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <img 
                src={blog.imageUrl} 
                alt={blog.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <header className="mb-8">
            <h1 className="blog-title mb-4">{blog.title}</h1>
            
            {blog.subtitle && (
              <p className="blog-subtitle">{blog.subtitle}</p>
            )}
            
            <div className="flex items-center justify-between mt-6 text-gray-600 text-sm">
              <div>
                By <span className="font-medium">{blog.author.name}</span> •{' '}
                {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeClick}
                className="flex items-center gap-2"
              >
                <Heart 
                  size={16} 
                  className={isLiked ? "fill-red-500 text-red-500" : ""} 
                />
                <span>{blog.likes.length} likes</span>
              </Button>
            </div>
          </header>
          
          <div className="prose prose-lg max-w-none">
            {blog.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          <div className="mt-12">
            <h2 className="text-2xl font-serif font-medium mb-6">Comments</h2>
            <CommentForm 
              onSubmit={handleCommentSubmit} 
              isSubmitting={loading}
            />
            
            <div className="mt-8">
              <CommentList comments={blog.comments} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default BlogDetail;
