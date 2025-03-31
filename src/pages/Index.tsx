import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useBlog } from "@/context/BlogContext";
import BlogCard from "@/components/BlogCard";

const Index = () => {
  const { user } = useAuth();
  const { blogs, likeBlog } = useBlog();
  const navigate = useNavigate();

  const handleLikeBlog = (blogId: string) => {
    if (user) {
      likeBlog(blogId, user._id);
    } else {
      navigate("/login");
    }
  };

  const isBlogLikedByUser = (blogLikes: string[]) =>
    user ? blogLikes.includes(user._id) : false;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-medium tracking-tight mb-6">
              Express Yourself Through Words
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
              Create, share, and discover stories that matter to you. Join our
              community of writers and readers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate(user ? "/dashboard" : "/signup")}
                size="lg"
                className="text-base px-8"
              >
                {user ? "Go to Dashboard" : "Start Writing"}
              </Button>
              <Button
                onClick={() => navigate("/blogs")}
                variant="outline"
                size="lg"
                className="text-base px-8"
              >
                Explore Blogs
              </Button>
            </div>
          </div>
        </section>

        {/* Featured blogs */}
        {blogs.length > 0 && (
          <section className="py-12 px-4 bg-gray-50">
            <div className="container max-w-7xl mx-auto">
              <h2 className="text-3xl font-serif font-medium mb-10 text-center">
                Featured Posts
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.slice(0, 3).map((blog) => (
                  <BlogCard
                    key={blog._id}
                    blog={blog}
                    onLikeClick={handleLikeBlog}
                    isLiked={isBlogLikedByUser(blog.likes)}
                    currentUserId={user?._id}
                  />
                ))}
              </div>

              {blogs.length > 3 && (
                <div className="mt-12 text-center">
                  <Button onClick={() => navigate("/blogs")} variant="outline">
                    View All Posts
                  </Button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Call to action */}
        <section className="py-16 px-4 bg-black text-white">
          <div className="container max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">
              Ready to share your story?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
              Join our community and start writing today. It's free and only
              takes a minute to get started.
            </p>
            <Button
              onClick={() => navigate(user ? "/dashboard" : "/signup")}
              size="lg"
              variant="outline"
              className="text-base px-8 border-white text-white hover:bg-white hover:text-black"
            >
              {user ? "Go to Dashboard" : "Get Started for Free"}
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} Blogify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
