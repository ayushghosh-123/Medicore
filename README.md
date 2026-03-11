# 🏥 Healthcare Plus - Digital Healthcare Management System

A comprehensive digital healthcare platform that connects patients with healthcare providers, enabling seamless appointment booking, secure communication, and AI-powered medical report analysis.

![Healthcare Plus](https://img.shields.io/badge/Healthcare-Plus-blue?style=for-the-badge&logo=health)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🎯 Project Overview

Healthcare Plus is a modern, full-stack healthcare management system designed to revolutionize the way patients interact with healthcare providers. The platform offers a seamless experience for booking appointments, managing medical records, and getting AI-powered insights on medical reports.

### 🌟 Key Features

#### 👥 **Patient Features**
- **📅 Smart Appointment Booking**: Browse and book appointments with healthcare providers
- **👨‍⚕️ Doctor Discovery**: Search and filter doctors by specialization, experience, and ratings
- **📋 Profile Management**: Complete patient profile with medical history, allergies, and emergency contacts
- **📊 Medical Report Analysis**: Upload medical reports (images/PDFs) for AI-powered analysis
- **💬 Secure Messaging**: Chat with healthcare providers (coming soon)
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

#### 👨‍⚕️ **Doctor Features**
- **📅 Appointment Management**: View and manage patient appointments
- **👥 Patient Records**: Access comprehensive patient medical history
- **📊 Practice Analytics**: View insights and reports about your practice
- **💬 Patient Communication**: Respond to patient messages and inquiries
- **📋 Profile Management**: Update professional information and availability

#### 🤖 **AI-Powered Features**
- **🔍 Medical Report Analysis**: AI-powered analysis of uploaded medical reports
- **📈 Health Insights**: Get detailed insights and recommendations
- **🩺 Symptom Analysis**: AI-assisted symptom analysis and preliminary recommendations
- **📊 Trend Analysis**: Track health trends over time

## 🛠️ Tech Stack

### **Frontend**
- **Next.js 15.4.6** - React framework with App Router
- **TypeScript 5.0** - Type-safe JavaScript
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible UI components

### **Backend**
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Clerk** - Authentication and user management

### **AI & Analytics**
- **Open AI (gptMini)** - Medical report analysis
- **React Query** - Data fetching and caching

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or MongoDB Atlas)
- **Clerk Account** for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/healthcare-plus.git
   cd healthcare-plus
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   CLERK_SECRET_KEY=your_clerk_secret_key_here

   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/healthcare_plus
   # Or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_plus

   # Open AI (for medical report analysis)
   OPEN_AI_API_KEY=your_google_ai_api_key_here

   # Next.js
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   ```

4. **Set up Clerk Authentication**
   - Go to [clerk.com](https://clerk.com)
   - Create a new application
   - Copy your publishable key and secret key
   - Add them to your `.env.local` file

5. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update the `MONGODB_URI` in your `.env.local` file

6. **Set up Google AI (Optional)**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key for Gemini
   - Add it to your `.env.local` file

7. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

8. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
healthcare-plus/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── appointments/         # Appointment management
│   │   ├── doctors/             # Doctor management
│   │   ├── patients/            # Patient management
│   │   └── analytics/           # AI analysis endpoints
│   ├── dashboard/               # Main dashboard
│   ├── doctor/                  # Doctor-specific pages
│   ├── patient/                 # Patient-specific pages
│   └── layout.tsx              # Root layout
├── components/                   # React components
│   ├── dashboard/               # Dashboard components
│   ├── ui/                      # Reusable UI components
│   └── Header.tsx              # Navigation header
├── models/                       # MongoDB models
│   ├── Appointment.ts           # Appointment schema
│   ├── Doctor.ts               # Doctor schema
│   └── Patient.ts              # Patient schema
├── lib/                         # Utility functions
│   ├── mongodb.ts              # Database connection
│   ├── api.ts                  # API utilities
│   └── utils.ts                # Helper functions
└── public/                      # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/healthcare-plus/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- **Clerk** for authentication
- **MongoDB** for database
- **Open AI** for medical analysis
- **Next.js** team for the amazing framework
- **Tailwind CSS** for the utility-first approach

---

**Made with ❤️ for better healthcare**

*Healthcare Plus - Connecting patients with care, one appointment at a time.*
