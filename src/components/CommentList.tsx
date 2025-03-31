
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Comment } from '@/context/BlogContext';

type CommentListProps = {
  comments: Comment[];
  className?: string;
};

const CommentList: React.FC<CommentListProps> = ({ comments, className }) => {
  if (comments.length === 0) {
    return (
      <div className={cn("py-4 text-center text-gray-500", className)}>
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {comments.map((comment) => (
        <div 
          key={comment._id} 
          className="border-b border-gray-100 pb-4 last:border-0"
        >
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.userName}</span>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <p className="mt-1 text-gray-700">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
