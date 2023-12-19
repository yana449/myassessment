import React, { useState } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import '../styles/FormContainer.css';
import toast from 'react-hot-toast';

import { TailSpin } from  'react-loader-spinner'

const uri = process.env.REACT_APP_SERVER_URL || "http://localhost:5000"

const FormContainer = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phoneNumber: '',
    batch: '',
    paymentStatus: false
  });
  const [modal, setModal] = useState(false);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Age validation
    const age = parseInt(formData.age, 10);
    if (isNaN(age) || age < 0 || age > 100) {
      toast.error('Age must be between 0 and 100.');
      return;
    }

    // Phone number validation
    const phoneNumberRegex = /^[0-9]{10}$/;
    if (!phoneNumberRegex.test(formData.phoneNumber)) {
      toast.error('Invalid phone number. It must be 10 digits.');
      return;
    }

    setModal(true);
    paymentHandler();
  };

    const amount = 50000;
    const currency = "INR";
    const receiptId = "qwsaq1";
  
    const paymentHandler = async (e) => {
      const response = await fetch(uri+"/api/payment", {
        method: "POST",
        body: JSON.stringify({
          amount,
          currency,
          receipt: receiptId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const order = await response.json();
      //console.log(order);
  
      var options = {
        key: process.env.REACT_APP_RAZORPAY_API_KEY,
        amount,
        currency,
        name: "Yoga Classes",
        description: "Test Transaction",
        order_id: order.id,
        handler: async function (response) {
          const body = {
            ...response,
          };
  
          const validateRes = await fetch(
            uri+"/api/validate",
            {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const jsonRes = await validateRes.json();
          console.log(jsonRes);
          toast.success('Payment successful.');
          setFormData({ ...formData, paymentStatus: true });
          handleDBSubmit();
        },
        prefill: {
          name: formData.name,
          email: "exmaple@example.com",
          contact: formData.phoneNumber, 
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#000000",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        toast.error('Payment Error')
      });
      rzp1.open();
  }

  const handleDBSubmit = () => {
    // Send a POST request with formData
    fetch('http://localhost:5000/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        //console.log(data);
        setModal(false);
        if(data.success){
          toast.success('Registered Successfully')
        } else if(data.error){
          toast.error(data.error)
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className='form-container'>
      {modal && <div className="spinner-container">
        <TailSpin
          height="50"
          width="50"
          color="000000"
          ariaLabel="tail-spin-loading"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={modal}
        />
      </div>}
      <form onSubmit={handleSubmit} className='form' >
        <TextField
          label="Name"
          variant="filled"
          fullWidth
          required
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
          }}
          InputLabelProps={{
            style: { color: 'grey' },
          }}
        />
        <TextField
          label="Age"
          variant="filled"
          fullWidth
          required
          name="age"
          value={formData.age}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
          }}
          InputLabelProps={{
            style: { color: 'grey' },
          }}
        />
        <TextField
          label="Phone Number"
          variant="filled"
          fullWidth
          required
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' },
          }}
          InputLabelProps={{
            style: { color: 'grey' },
          }}
        />
        <FormControl fullWidth variant="filled" margin="normal">
          <InputLabel id="batch-label" style={{ color: 'grey' }} >Choose a Batch</InputLabel>
          <Select
            labelId="batch-label"
            required
            id="batch"
            name="batch"
            value={formData.batch}
            onChange={handleChange}
            label="Choose your Batch"
            style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
          >
            <MenuItem value="6-7AM">6-7AM</MenuItem>
            <MenuItem value="7-8AM">7-8AM</MenuItem>
            <MenuItem value="8-9AM">8-9AM</MenuItem>
            <MenuItem value="5-6PM">5-6PM</MenuItem>
          </Select>
        </FormControl>
        <div className="fee-container">
          <span className="fee-label">Registration Fee: </span>
          <span className="fee">Rs. 500</span>
        </div>
        <Button variant="contained" color="primary" type="submit" className='submit-btn' style={{
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          marginTop: '1rem',
          padding: '0.7rem 1rem',
          fontSize: '1rem',
          borderRadius: '0.5rem',
          width: '100%',
        }} >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default FormContainer;
