# Ecommerce Website Backend

This repository contains the backend code for an ecommerce website built using MongoDB, Express, React, and Node.js (MERN stack). 
The backend provides API endpoints for user authentication, product management, cart management, order management, and payment processing using Razorpay.

## Features

- RESTful API endpoints for user authentication (sign up, log in, log out)
- Secure password hashing using bcrypt.js
- JSON Web Tokens (JWT) for authentication and authorization
- MongoDB integration for database storage
- Cloudinary integration for storing image files
- Middleware for authentication and error handling
- Integration with Razorpay for online payments

## Razorpay Integration

Our backend seamlessly integrates with Razorpay, a popular payment gateway, to facilitate online payments for our ecommerce platform.
When a user initiates the checkout process, the backend communicates with Razorpay's API to create a payment order. Upon successful payment,
Razorpay sends a webhook notification to our backend, which updates the order status accordingly.
This integration ensures a smooth and secure payment experience for our users.

## Technologies Used

- Node.js
- Express
- MongoDB
- bcrypt.js
- JSON Web Tokens (JWT)
- Multer
- Razorpay

## Default User Credentials:
Check frontend repository for Default credentials : [Ecommerce frontend Repo](https://github.com/Emmanuel-Benjamin00/E-Commerce-Frontend)

## Usage:

1. To get started with the Restaurant Website:
   ```bash
   git clone https://github.com/Emmanuel-Benjamin00/E-Commerce-Backend.git

