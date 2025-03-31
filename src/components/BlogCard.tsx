
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Blog } from '@/context/BlogContext';

interface BlogCardProps {
  blog: Blog;
  className?: string;
  onLikeClick?: (blogId: string) => void;
  isLiked?: boolean;
  currentUserId?: string | null;
}

const BlogCard: React.FC<BlogCardProps> = ({ 
  blog, 
  className,
  onLikeClick,
  isLiked = false,
  currentUserId
}) => {
  const {
    _id,
    title,
    subtitle,
    author,
    createdAt,
    likes,
    comments,
    imageUrl
  } = blog;

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onLikeClick && currentUserId) {
      onLikeClick(_id);
    }
  };

  return (
    <Link to={`/blog/${_id}`}>
      <div className={cn("blog-card group h-full flex flex-col", className)}>
        {imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="flex flex-col flex-grow p-5">
          <div className="mb-1 text-sm text-gray-500">
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
          
          <h3 className="text-xl font-serif font-medium mb-2 group-hover:text-gray-700 transition-colors">
            {title}
          </h3>
          
          {subtitle && (
            <p className="text-gray-600 mb-3 line-clamp-2">{subtitle}</p>
          )}
          
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              By {author.name}
            </span>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleLikeClick}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <Heart 
                  size={16} 
                  className={isLiked ? "fill-red-500 text-red-500" : ""} 
                />
                <span>{likes.length}</span>
              </button>
              
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MessageSquare size={16} />
                <span>{comments.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
