'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Post } from '@/types';
import { useAuth } from '@/context/AuthContext';

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

export default function SinglePost({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get(`/posts/${params.id}`);
        setPost(data);
        setError('');
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.response?.data?.error || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [params.id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${params.id}`);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error deleting post:', err);
      alert(err.response?.data?.error || 'Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-sm mb-4">{error}</p>
          <Link
            href="/"
            className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-4">Post not found</p>
          <Link
            href="/"
            className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && post.author._id === user._id;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200 inline-flex items-center"
        >
          ← Back to Home
        </Link>
      </div>

      <article className="bg-white border border-gray-100 rounded-md shadow-md">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-black tracking-tight mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <span>By </span>
            <Link href={`/?author=${post.author._id}`} className="text-gray-700 ml-2 hover:text-black text-sm font-medium transition-colors duration-200">{post.author.name}</Link>
            <span className="mx-2">•</span>
            <span className="text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          {isAuthor && (
            <div className="mt-8 pt-8 border-t border-gray-100 flex space-x-4">
              <Link
                href={`/dashboard/edit/${post._id}`}
                className="text-gray-600 hover:text-black text-sm font-medium transition-colors duration-200"
              >
                Edit Post
              </Link>
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600 text-sm font-medium transition-colors duration-200"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>
      </article>
    </div>
  );
} 