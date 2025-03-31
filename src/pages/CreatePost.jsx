import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useBlog } from "@/context/BlogContext";
import Navbar from "@/components/Navbar";
import BlogForm from "@/components/BlogForm";
import { toast } from "sonner";

const CreatePost = () => {
  const { user } = useAuth();
  const { createBlog } = useBlog();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const handleCreateBlog = async (data) => {
    try {
      setIsSubmitting(true);
      const newBlog = {
        title: data.title,
        content: data.content,
        author: user.name, // Only storing author's name, not entire object
      };
      await createBlog(newBlog);
      toast.success("✅ Blog post created successfully!");
      navigate("/dashboard"); // Redirect after successful creation
    } catch (error) {
      console.error("❌ Error creating blog:", error);
      toast.error("Failed to create blog post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-serif font-medium mb-8">Create New Blog Post</h1>

          <div className="bg-white shadow-sm rounded-lg p-6">
            <BlogForm onSubmit={handleCreateBlog} isSubmitting={isSubmitting} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
