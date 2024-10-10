# ByteLabyrinth

ByteLabyrinth is a comprehensive web application built using the MEAN stack (MongoDB, Express.js, Angular, Node.js) for a web development company. This project showcases our expertise in full-stack JavaScript development and provides a robust foundation for scalable web applications.

## Features

- **MongoDB Database**: Efficient and scalable NoSQL database for storing project data
- **Express.js Backend**: Fast, unopinionated, minimalist web framework for Node.js
- **Angular Frontend**: Powerful and flexible framework for building dynamic single-page applications
- **Node.js Server**: JavaScript runtime built on Chrome's V8 JavaScript engine

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB (v4.x or later)
- Angular CLI (v12.x or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/ByteLabyrinth.git
   cd ByteLabyrinth
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../frontend
   npm install
   ```

## Configuration

1. Create a `.env` file in the `backend` directory and add your MongoDB connection string and other environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

2. Update the `environment.ts` and `environment.prod.ts` files in the `frontend/src/environments` directory with your backend API URL.

## Running the Application

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   ng serve
   ```

3. Open your browser and navigate to `http://localhost:4200` to view the application.

## Building for Production

1. Build the Angular frontend:
   ```
   cd frontend
   ng build --prod
   ```

2. The built files will be in the `frontend/dist` directory. Configure your backend to serve these static files.

## Testing

- Run backend tests:
  ```
  cd backend
  npm test
  ```

- Run frontend tests:
  ```
  cd frontend
  ng test
  ```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

Linkedin - (https://www.linkedin.com/in/luis-miguel-vargas-garrido-1743a0114/)

Project Link: (https://github.com/tandemresistentia/ByteLabyrinth)