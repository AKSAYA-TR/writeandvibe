
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import BlogCard from '@/components/BlogCard';
import BlogForm, { BlogFormValues } from '@/components/BlogForm';
import { useAuth } from '@/context/AuthContext';
import { useBlog, Blog } from '@/context/BlogContext';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const { blogs, createBlog, updateBlog, deleteBlog, likeBlog, loading } = useBlog();
  const navigate = useNavigate();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [activeTab, setActiveTab] = useState('your-blogs');

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const userBlogs = blogs.filter(blog => blog.author._id === user._id);
  const otherBlogs = blogs.filter(blog => blog.author._id !== user._id);

  const handleCreateBlog = async (data: BlogFormValues) => {
    if (!user) return;
    
    try {
      await createBlog({
        ...data,
        author: {
          _id: user._id,
          name: user.name,
        },
      });
      setIsCreateDialogOpen(false);
      toast.success('Blog post created successfully!');
    } catch (error) {
      toast.error('Failed to create blog post.');
    }
  };

  const handleEditBlog = async (data: BlogFormValues) => {
    if (!selectedBlog) return;
    
    try {
      await updateBlog(selectedBlog._id, {
        ...data,
      });
      setIsEditDialogOpen(false);
      setSelectedBlog(null);
      toast.success('Blog post updated successfully!');
    } catch (error) {
      toast.error('Failed to update blog post.');
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await deleteBlog(blogId);
        toast.success('Blog post deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete blog post.');
      }
    }
  };

  const handleLikeBlog = (blogId: string) => {
    if (user) {
      likeBlog(blogId, user._id);
    }
  };

  const isBlogLikedByUser = (blogLikes: string[]) => {
    return user ? blogLikes.includes(user._id) : false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <h1 className="text-3xl font-serif font-medium">Dashboard</h1>
            
            <div className="mt-4 md:mt-0">
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Create Blog</span>
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="your-blogs" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="your-blogs">Your Blogs</TabsTrigger>
              <TabsTrigger value="explore">Explore</TabsTrigger>
            </TabsList>
            
            <TabsContent value="your-blogs">
              {userBlogs.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-4">You haven't created any blogs yet</h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first blog post
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    Create Your First Blog
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userBlogs.map(blog => (
                    <div key={blog._id} className="relative group">
                      <BlogCard 
                        blog={blog} 
                        onLikeClick={handleLikeBlog}
                        isLiked={isBlogLikedByUser(blog.likes)}
                        currentUserId={user._id}
                      />
                      
                      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setSelectedBlog(blog);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        
                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteBlog(blog._id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="explore">
              {otherBlogs.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-4">No other blogs available</h3>
                  <p className="text-gray-600">
                    Check back later for new content from other writers
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {otherBlogs.map(blog => (
                    <BlogCard 
                      key={blog._id} 
                      blog={blog} 
                      onLikeClick={handleLikeBlog}
                      isLiked={isBlogLikedByUser(blog.likes)}
                      currentUserId={user._id}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      {/* Create Blog Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Blog</DialogTitle>
          </DialogHeader>
          <BlogForm 
            onSubmit={handleCreateBlog} 
            isSubmitting={loading}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Blog Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Blog</DialogTitle>
          </DialogHeader>
          {selectedBlog && (
            <BlogForm 
              onSubmit={handleEditBlog} 
              initialData={selectedBlog}
              isSubmitting={loading}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
