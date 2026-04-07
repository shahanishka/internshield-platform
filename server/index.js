const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internships');
const detectRoutes = require('./routes/detect');
const bookmarkRoutes = require('./routes/bookmarks');
const applicationRoutes = require('./routes/applications');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api', detectRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/applications', applicationRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });