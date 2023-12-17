require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 3001;

app.use(cors())
app.use(bodyParser.json());

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  phoneNumber: String,
  batch: String,
  paymentStatus: Boolean,
  paymentDate: { type: Date, default: Date.now },
});

// Create a user model
const User = mongoose.model('User', userSchema);

// API endpoint to handle form submissions
app.post('/api/submit', async (req, res) => {
  try {
    const { name, age, phoneNumber, batch } = req.body;

    // Basic validation
    if (age < 18 || age > 65) {
      return res.status(400).json({ error: 'Age must be between 18 and 65.' });
    }

    // Assuming payment is successful
    const paymentStatus = true;

    // Save user data to the database
    const newUser = new User({ name, age, phoneNumber, batch, paymentStatus });
    await newUser.save();

    // Return response to the frontend
    res.json({ success: true, message: 'Form submitted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
