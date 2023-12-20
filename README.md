
# Yoga Classes - Flexmoney Assessment

### Docker Container Deployment on AWS EC2 Instance
Link: `http://ec2-13-211-29-253.ap-southeast-2.compute.amazonaws.com:3000/`

### Vercel and Railway Deployment
- Frontend Deployment on Vercel: `https://yogaclassess-flexmoney.vercel.app`
- Backend Deployment on Railway

## About the project:
- Developed a Yoga Class admission form using React.js for the frontend and Node.js for the backend.
- Implemented age validation (18-65 years) and basic phone number validation on the form.
- Utilized Docker for containerization and deployed the application on an AWS EC2 instance.
- Integrated Razorpay payment gateway for fee transactions, with a simulated payment validation in the backend.
- Designed a MongoDB database with an Entity Relationship (ER) diagram to store user information.

#### Backend Endpoints:
`/api/submit` :
- Handles POST requests for form submissions.
- Validates the user's age, ensuring it falls within the range of 18 to 65 years.
- Saves user data, including name, age, phone number, chosen batch, and payment status, to the MongoDB database.
Returns a JSON response indicating the success or failure of the form submission.

`/api/payment` :
- Manages POST requests for payment initiation.
- Utilizes the Razorpay API to create a payment order based on the provided options.
- Returns the created order details as a JSON response.
- Handles errors and responds with a 500 status if there are any issues in the payment initiation process.

`/api/validate` :
- Listens for POST requests to validate Razorpay payment.
- Verifies the legitimacy of the transaction using the provided Razorpay order ID, payment ID, and signature.
- Utilizes cryptographic hashing to ensure the integrity of the transaction data.
- Responds with a success message and the order and payment IDs if the transaction is legitimate; otherwise, returns an error response with a 400 status.

## ER Diagram:

+------------------+
|      User        |
+------------------+
| id (PK)          |
| name             |
| age              |
| phoneNumber      |
| batch            |
| paymentStatus    |
| paymentDate      |
+------------------+



