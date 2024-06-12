Project Overview

This project comprises a React frontend and a Node.js/Express backend with MongoDB for database management. It includes configuration using environment variables.


Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. Node.js
2. npm
3. MongoDB

Installation

Clone the Repository
1. Open your terminal or command prompt.
2. Clone the repository from GitHub

Setup the frontend server

1. Navigate into the project frontend directory: cd client
2. Install the dependencies: npm install
3. Start the frontend server: npm run start

Setup the backend server

1. Navigate into the project backend directory: cd server
2. Install the dependencies: npm install
3. Create a .env file in the server directory and add your MongoDB connection string: MONGO_URI=your_mongodb_connection_string   &   JWT_SECRET=your_jwt_secret
4. Start the backend server: npm run dev
