import express from 'express';
import { Post } from '../models/Post';
import { auth } from '../middleware/auth';

const router = express.Router();

// Add cache control middleware
const noCache = (_req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};

// Apply no-cache middleware to all routes
router.use(noCache);

// Get all posts
router.get('/', async (req, res) => {
  try {
    const { author } = req.query;
    const query = author ? { author } : {};
    
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    return res.json(posts);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching posts' });
  }
});

// Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching post' });
  }
});

// Create new post (protected)
router.post('/', auth, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    
    const post = new Post({
      title,
      content,
      author: req.user._id
    });
    
    await post.save();
    await post.populate('author', 'name email');
    
    return res.status(201).json(post);
  } catch (error) {
    return res.status(400).json({ error: 'Error creating post' });
  }
});

// Update post (protected)
router.put('/:id', auth, async (req: any, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    post.title = title || post.title;
    post.content = content || post.content;
    
    await post.save();
    await post.populate('author', 'name email');
    
    return res.json(post);
  } catch (error) {
    return res.status(400).json({ error: 'Error updating post' });
  }
});

// Delete post (protected)
router.delete('/:id', auth, async (req: any, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    
    await post.deleteOne();
    return res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting post' });
  }
});

export default router; 