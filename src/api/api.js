import { createBlog, fetchBlogs } from "@/api";
const API_BASE_URL = "http://localhost:5000";

export const fetchBlogs = async () => {
    const response = await fetch(`${API_BASE_URL}/blogs`);
    return response.json();
};

export const createBlog = async (blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(blogData)
    });
    return response.json();
};
