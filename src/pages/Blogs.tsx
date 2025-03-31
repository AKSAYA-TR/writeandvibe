import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchBlogs } from "../api/api";
import Navbar from "@/components/Navbar";
import BlogCard from "@/components/BlogCard";

const Blogs = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const getBlogs = async () => {
      try {
        const data = await fetchBlogs();
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    getBlogs();
  }, []);

  const handleLikeBlog = (blogId: string) => {
    if (user) {
      // Implement like functionality here
      console.log(`User ${user._id} liked blog ${blogId}`);
    } else {
      navigate("/login");
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
          <h1 className="text-3xl font-serif font-medium mb-8">All Blog Posts</h1>

          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-4">No blog posts available</h3>
              <p className="text-gray-600">Check back later for new content</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onLikeClick={handleLikeBlog}
                  isLiked={isBlogLikedByUser(blog.likes)}
                  currentUserId={user?._id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Blogs;
