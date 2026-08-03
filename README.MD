# Messaging App

A full-stack real-time messaging application that allows users to communicate through private and group chats. The application supports authentication, real-time messaging, profile management, and message editing using modern web technologies.

## Features

- User registration and login
- Secure authentication with Passport.js
- Private one-to-one messaging
- Group chat creation and messaging
- Real-time messaging using Socket.IO
- Edit and delete messages
- Upload profile pictures
- Display user profile information
- Responsive user interface

## Technologies

### Frontend

- React
- Vite
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Passport.js
- Express Session
- Socket.IO
- Multer
- Prisma ORM

### Database

- PostgreSQL (AWS RDS)

### Deployment

- Frontend: Vercel
- Backend: AWS EC2
- Reverse Proxy: Nginx
- Process Manager: PM2
- HTTPS: Let's Encrypt
- DNS: DuckDNS


## Installation

### Clone the repository

```bash
git clone https://github.com/your-username/Messaging-app.git
cd Messaging-app
```

```

Run the backend:

```bash
node app.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Production

The application is deployed using:

- Frontend hosted on Vercel
- Backend hosted on AWS EC2
- PostgreSQL database hosted on AWS RDS
- Nginx as a reverse proxy
- PM2 for process management
- HTTPS provided by Let's Encrypt

## Future Improvements

- Image compression for profile uploads
- Read receipts
- Typing indicators
- User online/offline status
- Notifications
- Password reset
- Integrating with other apps

## Author

Amanuel Tesfatsion