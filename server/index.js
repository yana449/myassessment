require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');
const razorpay = require('razorpay');
const crypto = require("crypto");

const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000;

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
    const { name, age, phoneNumber, batch, paymentStatus } = req.body;

    // Basic validation
    if (age < 18 || age > 65) {
      return res.status(400).json({ error: 'Age must be between 18 and 65.' });
    }

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

app.post('/api/payment', async(req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  
    const options = req.body;
    const order = await razorpay.orders.create(options);
  
    if(!order){
      return res.status(500).send('Error in payment');
    }
    return res.json(order);
  } catch (error) {
    console.log(error)
      return res.status(500).send('Error in payment');
  }
})

app.post("/api/validate", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  //order_id + "|" + razorpay_payment_id
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");
  if (digest !== razorpay_signature) {
    return res.status(400).json({ msg: "Transaction is not legit!" });
  }

  res.json({
    msg: "success",
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
