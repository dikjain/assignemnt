'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Post } from '@/types';
import { motion } from 'framer-motion';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
});

api.interceptors.request.use((config) => {
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

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/posts');
        setPosts(data);
        setError('');
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading posts...</p>
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
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold text-black tracking-tight mb-4">
          Welcome to Our Blog
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover stories, thinking, and expertise from writers on any topic.
        </p>
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
                <Link
                  href={`/posts/${post._id}`}
                  className="text-gray-400 hover:text-black text-sm font-medium transition-colors duration-200"
                >
                  Read more
                </Link>
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
          <p className="text-gray-500 text-sm">No posts found.</p>
        </motion.div>
      )}
    </div>
  );
}   