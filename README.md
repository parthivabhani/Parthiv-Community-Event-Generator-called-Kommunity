Community Event Planner

A full-stack web application that allows users to create, explore, and manage community events. The project includes a React + Vite frontend and a Node.js + Express backend connected to MongoDB.

Features:
- User authentication (signup, login)
- Create and manage events
- View upcoming community events
- Responsive, modern UI using Tailwind CSS
- RESTful API architecture

Tech Stack:
Frontend:
- React (Vite)
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication

Setup Instructions:
- Clone the repository : git clone <repo-url> and then: cd community-event-planner


Backend Setup:
- cd backend
- npm install

Create a .env file:
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_secret_key
- PORT=5000


Run the backend:
npm start


Frontend Setup:
- cd ../frontend
- npm install
- npm run dev


The app will be available at:

http://localhost:5173
