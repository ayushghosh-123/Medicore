# 🏥 Healthcare Plus - Digital Healthcare Management System.

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
├── app/                          # Next.js App Router (Frontend & API)
│   ├── api/                      # API routes (Backend Layer)
│   │   ├── appointments/         # Appointment CRUD operations
│   │   │   ├── route.ts          # GET/POST appointments
│   │   │   ├── book/             # Booking endpoints
│   │   │   ├── doctor/           # Doctor-specific appointment ops
│   │   │   └── patient/          # Patient-specific appointment ops
│   │   ├── doctors/             # Doctor management endpoints
│   │   │   └── route.ts          # GET doctors list
│   │   ├── patients/            # Patient management endpoints
│   │   │   └── profile/          # Patient profile operations
│   │   ├── analytics/           # AI analysis endpoints
│   │   │   └── route.ts          # Medical report analysis
│   │   ├── payments/            # Payment processing
│   │   │   ├── create-razorpay-order/  # Order creation
│   │   │   ├── razorpay-webhook/ # Webhook handling
│   │   │   └── verify/           # Payment verification
│   │   ├── save-user/           # User registration
│   │   └── user/                # User role management
│   │       └── role/             # Role assignment
│   ├── dashboard/               # Main dashboard pages
│   │   └── page.tsx             # Dashboard home
│   ├── doctor/                  # Doctor-specific pages
│   │   └── onboarding/          # Doctor registration flow
│   ├── patient/                 # Patient-specific pages
│   │   └── onboarding/          # Patient registration flow
│   ├── report-analysis/         # Medical report upload/analysis
│   ├── role-selection/          # User role selection
│   ├── sign-in/ & sign-up/      # Authentication pages
│   └── layout.tsx              # Root layout with Clerk provider
├── components/                   # Reusable React components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── DoctorDashboard.tsx  # Doctor dashboard UI
│   │   ├── DoctorProfile.tsx    # Doctor profile management
│   │   ├── PatientDashboard.tsx # Patient dashboard UI
│   │   └── PatientProfile.tsx   # Patient profile management
│   ├── ui/                      # Shadcn/ui component library
│   │   ├── badge.tsx, button.tsx, card.tsx, etc. # UI primitives
│   ├── Header.tsx              # Navigation header with auth
│   ├── PaymentMethodSelector.tsx # Payment UI components
│   ├── RazorpayPaymentForm.tsx # Payment integration
│   └── ...                      # Other feature components
├── models/                       # MongoDB schemas (Data Layer)
│   ├── Appointment.ts           # Appointment data model
│   ├── Doctor.ts               # Doctor profile schema
│   └── Patient.ts              # Patient profile schema
├── lib/                         # Utility libraries & configurations
│   ├── mongodb.ts              # Database connection & caching
│   ├── api.ts                  # API client utilities
│   ├── razorpay.ts             # Payment gateway integration
│   ├── utils.ts                # Helper functions
│   └── ...                     # Other utilities
├── public/                      # Static assets
│   └── ...                     # Images, icons, etc.
├── package.json                # Dependencies & scripts
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
└── eslint.config.mjs           # ESLint configuration
```

## 🏗️ Architecture

### High-Level Architecture

Healthcare Plus follows a **modern full-stack architecture** built on Next.js 15, leveraging its App Router for both frontend rendering and backend API routes. The architecture is designed for scalability, maintainability, and rapid development.

#### **Frontend Layer**
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom components
- **UI Library**: Radix UI primitives with custom styling
- **State Management**: React Query for server state, React hooks for local state
- **Animations**: Framer Motion for smooth interactions

#### **Backend Layer**
- **Runtime**: Next.js API routes (serverless functions)
- **Authentication**: Clerk for user management and session handling
- **Database**: MongoDB with Mongoose ODM
- **External APIs**: OpenAI for AI analysis, Razorpay for payments
- **Validation**: Zod for input validation

#### **Data Layer**
- **Database**: MongoDB (NoSQL)
- **ODM**: Mongoose for schema definition and validation
- **Connection**: Cached connection with error handling

#### **External Services**
- **Authentication**: Clerk (handles sign-up, sign-in, user profiles)
- **Payments**: Razorpay (secure payment processing)
- **AI Analysis**: OpenAI (medical report processing)
- **Deployment**: Vercel (recommended for Next.js)

### Data Flow Architecture

```
User Interaction → React Component → API Route → Authentication Check → Database Operation → Response → UI Update
     ↓              ↓              ↓              ↓              ↓              ↓              ↓
  Browser       Client-side      Server-side     Clerk          MongoDB       JSON          React Query
```

1. **User Action**: User interacts with React components
2. **API Call**: Components make HTTP requests to Next.js API routes
3. **Authentication**: API routes verify user identity via Clerk
4. **Business Logic**: Routes perform database operations using Mongoose
5. **Data Processing**: Results are processed and formatted
6. **Response**: JSON data returned to client
7. **State Update**: React Query caches and updates component state

## 🏛️ System Design

### User Roles & Permissions

The system implements a **role-based access control (RBAC)** system with two primary user types:

#### **Patient Role**
- **Profile Management**: Complete medical history, allergies, emergency contacts
- **Appointment Booking**: Search doctors, view availability, book slots
- **Medical Records**: Upload and analyze medical reports
- **Payment Processing**: Secure transactions via Razorpay
- **Dashboard**: View upcoming appointments, medical history, reports

#### **Doctor Role**
- **Profile Management**: Professional information, specialization, availability
- **Appointment Management**: View/manage patient appointments, update status
- **Patient Records**: Access comprehensive patient medical history
- **Practice Analytics**: View appointment statistics, patient feedback
- **Communication**: Respond to patient inquiries (future feature)

### Core System Components

#### **Authentication System**
- **Provider**: Clerk
- **Features**: Sign-up/sign-in, password reset, social auth
- **Session Management**: JWT-based sessions with automatic refresh
- **Role Assignment**: Dynamic role detection (patient/doctor)

#### **Appointment System**
- **Booking Flow**: Patient selects doctor → chooses slot → confirms booking
- **Status Management**: Pending → Confirmed → Completed/Cancelled
- **Conflict Prevention**: Real-time slot availability checking
- **Notifications**: Email/SMS alerts (future implementation)

#### **Payment System**
- **Gateway**: Razorpay
- **Features**: Secure payment processing, order creation, webhook handling
- **Currencies**: INR (Indian Rupee) support
- **Refunds**: Automated refund processing for cancellations

#### **AI Analysis System**
- **Provider**: OpenAI GPT models
- **Features**: Medical report OCR, symptom analysis, health insights
- **Integration**: File upload → AI processing → structured insights
- **Privacy**: Secure data handling with encryption

#### **Database Design**
- **Schema Type**: Document-based (MongoDB)
- **Collections**: Users, Doctors, Patients, Appointments, Payments, Reports
- **Relationships**: Referenced documents with population
- **Indexing**: Optimized queries for performance
- **Validation**: Schema-level validation with Mongoose

### Security Design

#### **Authentication & Authorization**
- **Multi-factor Authentication**: Clerk-provided MFA options
- **API Security**: JWT tokens with expiration
- **Role-based Access**: API routes validate user permissions
- **Input Validation**: Zod schemas for all API inputs

#### **Data Protection**
- **Encryption**: Environment variables for sensitive data
- **HTTPS**: Enforced SSL/TLS connections
- **Data Sanitization**: Input cleaning and validation
- **Audit Logging**: User actions tracked for compliance

#### **Infrastructure Security**
- **Environment Isolation**: Separate dev/staging/production
- **Dependency Management**: Regular security updates
- **Code Security**: ESLint rules, TypeScript strict mode

### Performance Considerations

#### **Frontend Optimization**
- **Code Splitting**: Next.js automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Caching**: React Query for API response caching
- **Bundle Analysis**: Optimized bundle sizes

#### **Backend Optimization**
- **Database Indexing**: Strategic indexes for query performance
- **Connection Pooling**: MongoDB connection reuse
- **Caching**: In-memory caching for frequently accessed data
- **Rate Limiting**: API rate limiting (future implementation)

#### **Scalability**
- **Serverless**: Vercel serverless functions auto-scale
- **Database**: MongoDB Atlas horizontal scaling
- **CDN**: Static asset delivery via CDN
- **Monitoring**: Performance monitoring and alerting

### Deployment Architecture

#### **Recommended Deployment**
- **Platform**: Vercel (optimized for Next.js)
- **Database**: MongoDB Atlas
- **CI/CD**: GitHub Actions for automated deployments
- **Monitoring**: Vercel Analytics, MongoDB monitoring

#### **Environment Configuration**
- **Development**: Local MongoDB, Clerk dev keys
- **Staging**: Staging MongoDB, test payments
- **Production**: Production MongoDB, live payments

This architecture ensures a robust, scalable, and maintainable healthcare management system that can grow with increasing user demands while maintaining security and performance standards.

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
