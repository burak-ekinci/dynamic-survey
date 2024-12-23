# Dynamic Survey - Modern Survey Management Platform

Dynamic Survey is a modern web application that allows users to create, manage, and analyze surveys easily and efficiently.

## Features

### 📊 Survey Management

- Create custom surveys with multiple question types
- Real-time survey results and analytics
- Anonymous response collection
- Survey sharing capabilities
- Active/Inactive survey status management
- Survey deadline management

### 📈 Analytics & Reporting

- Real-time result tracking
- Visual data representation with charts
- Detailed response analytics
- Export survey results
- Response rate monitoring

### 👤 User Management

- Secure registration and login system
- JWT-based authentication
- Profile management
- Role-based access control
- User data protection

### 🎨 User Interface

- Modern and responsive design
- Intuitive navigation
- Mobile-friendly interface
- Toast notifications
- Loading animations
- Interactive charts
- Dark theme support

## Technology Stack

### Frontend

- **React.js** - UI development
- **React Router** - Page routing
- **Chart.js** - Data visualization
- **Bootstrap** - Styling and components
- **Axios** - HTTP requests
- **React Toastify** - Notifications
- **Bootstrap Icons** - Icons
- **Vite** - Build tool

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cors** - Cross-origin resource sharing

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/dynamic-survey.git
cd dynamic-survey
```

2. Install dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Configure environment variables

Create a `.env` file in the server directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

4. Run the development servers

```bash
# Start frontend server
cd client
npm run dev

# Start backend server
cd ../server
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173` to access the application.

## Key Features

- **Easy Survey Creation**: Intuitive interface for creating professional surveys
- **Real-time Analytics**: Monitor survey results as they come in
- **Secure & Anonymous**: Protect participant privacy and data security
- **Mobile Responsive**: Perfect survey experience on all devices
- **Share & Collect**: Easy survey distribution and response collection
- **Visual Reports**: Beautiful charts and graphs for data visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@dynamicsurvey.com or create an issue in this repository.
