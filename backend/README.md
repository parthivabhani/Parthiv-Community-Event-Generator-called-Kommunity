Community Event Planner (Backend)

This is the backend of the Community Event Planner web app. It is built using Node.js, Express, and MongoDB, and provides APIs for managing users, authentication, and events.

Tech Stack:
- Node.js and Express for the server
- MongoDB with Mongoose for the database
- JWT for authentication
- CORS and dotenv for configuration

Setup and Run:

Navigate to the backend folder:
cd backend

Install dependencies:
npm install

Create a .env file in the backend directory and add:

- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
- PORT=5000

Start the server:
npm start

The server will run on:
http://localhost:5000
