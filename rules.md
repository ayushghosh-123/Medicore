# HMS Setup Guide

Rules -
1. TypeScript for type safety
2. Don't the file structure. After asking me change it
3. Don't change database design (tell me then i manually fix up this)
4. Use tailwindcss for css and responsive design 

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/hospital_management
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital_management

# Google AI (for analytics)
OPENAI_API_KEY=your_google_ai_api_key_here

```

## Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Clerk Authentication**
   - Go to [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key
   - Add them to your `.env.local` file

3. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env.local` file

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## API Routes Fixed

The following API routes have been fixed and are now working:

- `GET /api/appointments/patient` - Fetch patient appointments
- `PUT /api/appointments/patient` - Update patient profile
- `GET /api/doctors` - Fetch all available doctors
- `POST /api/appointments/book` - Book new appointment
- `GET /api/doctor/profile` - Fetch doctor profile
- `PUT /api/doctor/profile` - Update doctor profile

## Features

- ✅ Patient Dashboard with appointment management
- ✅ Doctor browsing and booking
- ✅ Appointment scheduling
- ✅ Profile management
- ✅ Modern UI with Tailwind CSS
- ✅ TypeScript support
- ✅ MongoDB integration
- ✅ Clerk authentication
