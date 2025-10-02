const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}
// Serve uploaded files statically
app.use('/uploads', express.static(UPLOAD_DIR));

mongoose.connect('mongodb://localhost:27017/agrconnect', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  phone: { type: String, required: true },
  imageUrl: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedDate: { type: Date, default: Date.now },
});
ProductSchema.index({ name: 1, postedBy: 1 }, { unique: true });
const Product = mongoose.model('Product', ProductSchema);

const DealerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  productsOffered: [{ type: String }],
  rating: { type: Number, default: 4.5 },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  postedDate: { type: Date, default: Date.now },
});
DealerSchema.index({ name: 1, location: 1 }, { unique: true });
const Dealer = mongoose.model('Dealer', DealerSchema);

const MarketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  timings: { type: String, required: true },
  contact: { type: String, required: true },
  commodities: [{ type: String }],
  rating: { type: Number, default: 4.0 },
  postedDate: { type: Date, default: Date.now },
});
MarketSchema.index({ name: 1, location: 1 }, { unique: true });
const Market = mongoose.model('Market', MarketSchema);

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  postedDate: { type: Date, default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
});
const Post = mongoose.model('Post', PostSchema);

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  commentedDate: { type: Date, default: Date.now },
});
const Comment = mongoose.model('Comment', CommentSchema);

const LikeSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  likedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likedDate: { type: Date, default: Date.now },
});
const Like = mongoose.model('Like', LikeSchema);

const JWT_SECRET = '1234567890'; // Change in production

// Multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

const requireAdminRole = (req, res, next) => {
  User.findById(req.user.userId)
    .then(user => {
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
      }
      req.user.fullUser = user;
      next();
    })
    .catch(err => res.status(500).json({ message: 'Server error' }));
};

// Signup
app.post('/signup', async (req, res) => {
  const { name, role, email, password } = req.body;
  try {
    let user = await User.findOne({ name });
    if (user) return res.status(400).json({ message: 'Username already taken' });
    user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, role: role || 'user', email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, message: 'Login successful', role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Products (Authenticated for modify, public for get)
app.post('/products', authenticateToken, upload.single('image'), async (req, res) => {
  const { name, description, quantity, price, location, phone } = req.body;
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const product = new Product({ name, description, quantity, price, location, phone, imageUrl, postedBy: req.user.userId });
    await product.save();
    res.status(201).json({ message: 'Product added', product });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate product entry' });
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/products', async (req, res) => {
  const { search } = req.query;
  try {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const products = await Product.find(query).populate('postedBy', 'name');
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('postedBy');
    if (product.postedBy._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updateData = req.body;
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: 'Product updated', product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/products/:id', authenticateToken, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('postedBy');
    if (product.postedBy._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Dealers (Admin-only for modify)
app.post('/dealers', authenticateToken, requireAdminRole, async (req, res) => {
  try {
    const dealer = new Dealer({ ...req.body, postedBy: req.user.fullUser._id });
    await dealer.save();
    res.status(201).json({ message: 'Dealer added', dealer });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate dealer entry' });
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/dealers', async (req, res) => {
  const { location } = req.query;
  try {
    const query = location ? { location: { $regex: location, $options: 'i' } } : {};
    const dealers = await Dealer.find(query).populate('postedBy', 'name');
    res.json(dealers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Markets (Admin-only for modify)
app.post('/markets', authenticateToken, requireAdminRole, async (req, res) => {
  try {
    const market = new Market(req.body);
    await market.save();
    res.status(201).json({ message: 'Market added', market });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) return res.status(400).json({ message: 'Duplicate market entry' });
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/markets', async (req, res) => {
  const { location } = req.query;
  try {
    const query = location ? { location: { $regex: location, $options: 'i' } } : {};
    const markets = await Market.find(query);
    res.json(markets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Posts
app.post('/posts', authenticateToken, upload.single('image'), async (req, res) => {
  const { text } = req.body;
  try {
    if (!text && !req.file) return res.status(400).json({ message: 'Post must have text or an image' });
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const post = new Post({ text, imageUrl, postedBy: req.user.userId });
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('postedBy', 'name role');
    res.status(201).json({ message: 'Post created', post: populatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ postedDate: -1 }).populate('postedBy', 'name role').populate({
      path: 'comments',
      populate: { path: 'commentedBy', select: 'name' }
    }).exec();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Comments
app.post('/posts/:postId/comments', authenticateToken, async (req, res) => {
  const { text } = req.body;
  try {
    if (!text || !text.trim()) return res.status(400).json({ message: 'Comment text required' });
    const comment = new Comment({ text: text.trim(), post: req.params.postId, commentedBy: req.user.userId });
    await comment.save();
    await Post.findByIdAndUpdate(req.params.postId, { $push: { comments: comment._id } });
    const populatedComment = await Comment.findById(comment._id).populate('commentedBy', 'name');
    res.status(201).json({ message: 'Comment added', comment: populatedComment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Likes
app.post('/posts/:postId/like', authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.userId;

    const existingLike = await Like.findOne({ post: postId, likedBy: userId });
    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      const post = await Post.findById(postId);
      return res.json({ message: 'Unliked', likesCount: post ? post.likes.length : 0 });
    } else {
      const like = new Like({ post: postId, likedBy: userId });
      await like.save();
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      const post = await Post.findById(postId);
      return res.json({ message: 'Liked', likesCount: post ? post.likes.length : 0 });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));