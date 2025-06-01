'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Post } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

// Disable caching for this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Add timestamp to prevent caching
  config.params = { ...config.params, _t: Date.now() };
  return config;
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!user) return;
        
        const userId = user._id || user.id;
        if (!userId) {
          setError('User ID not found');
          setLoading(false);
          return;
        }
        
        const { data } = await api.get(`/posts?author=${userId}`);
        setPosts(data);
        setError('');
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
          return;
        }
        setError(err.response?.data?.error || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    // Wait before checking for user and fetching posts
    const timer = setTimeout(fetchPosts, 500);

    return () => clearTimeout(timer);
  }, [user, router]);

  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-12"
      >
        <div>
          <h1 className="text-3xl font-bold text-black tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your blog posts
          </p>
        </div>
        <div>
          <Link
            href="/dashboard/new"
            className="inline-flex items-center px-4 py-2 rounded-md shadow-md bg-black text-white hover:bg-gray-900 text-sm font-medium transition-colors duration-200"
          >
            New Post
          </Link>
        </div>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-sm mb-8 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {posts.map((post) => (
          <motion.article
            key={post._id}
            variants={item}
            className="bg-white border rounded-md shadow-sm hover:shadow-md transition-all duration-200 border-gray-200 hover:border-gray-300 flex flex-col max-h-[240px]"
          >
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-black mb-3">
                <Link href={`/posts/${post._id}`} className="hover:text-gray-600 transition-colors duration-200">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm mb-4 overflow-hidden line-clamp-4">
                {post.content}
              </p>
              <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-gray-400 hover:text-red-600 text-sm font-medium transition-colors duration-200"
                >
                  Delete
                </button>
                <span className="text-xs text-gray-400">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {posts.length === 0 && !error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center py-16"
        >
          <p className="text-gray-500 text-sm">You haven't created any posts yet.</p>
          <Link
            href="/dashboard/new"
            className="mt-4 inline-flex items-center px-4 py-2 bg-black text-white hover:bg-gray-900 text-sm font-medium transition-colors duration-200"
          >
            Create your first post
          </Link>
        </motion.div>
      )}
    </div>
  );
}