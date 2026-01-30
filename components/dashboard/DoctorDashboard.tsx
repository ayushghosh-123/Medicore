'use client';

// DoctorDashboard: Main dashboard for doctors, showing appointments, stats, profile, analytics, and patient records.
// Uses Clerk for authentication and fetches doctor/appointment data from backend APIs.

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  User,
  TrendingUp,
  Users,
  DollarSign,
  CheckCircle,
  Menu,
  X,
} from 'lucide-react';
import { motion } from 'framer-motion';

// import DoctorOnboarding from "@/app/doctor/onboarding/page";
import DoctorProfile from './DoctorProfile';
import AnalyticsPage from "@/app/analytics/page"

// Patient and Appointment interfaces for type safety
interface Patient {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  dateOfBirth: string;
  gender: string;
}

interface Appointment {
  _id: string;
  patient: Patient;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
  symptoms: string[];
  consultationFee: number;
  notes?: string;
  diagnosis?: string;
}

// Doctor interface for doctorInfo state
interface Doctor {
  specialization?: string;
  experience?: number;
  totalPatients?: number;
  profileCompleted?: boolean;
  // Add other fields as needed
}

// Main DoctorDashboard component
export default function DoctorDashboard() {
  const { user } = useUser(); // Clerk user object
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorInfo, setDoctorInfo] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // Tab navigation
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // Mobile menu state

  // Tab configuration with icons
  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'chats', label: 'Chats', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: DollarSign },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Fetch appointments and doctor profile on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch data from backend APIs
  const fetchData = async () => {
    try {
      const [appointmentsRes, doctorRes] = await Promise.all([
        fetch('/api/appointments/doctor', { cache: 'no-store' }),
        fetch('/api/doctor/profile', { cache: 'no-store' })
      ]);

      const appointmentsData = await appointmentsRes.json();
      const doctorData = await doctorRes.json();

      setAppointments(appointmentsData.appointments || []);
      setDoctorInfo(doctorRes.ok ? (doctorData.doctor || null) : null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper for appointment status badge colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Filter today's appointments
  const todayAppointments = appointments.filter(apt => {
    const today = new Date().toDateString();
    return new Date(apt.appointmentDate).toDateString() === today;
  });

  // Filter upcoming appointments (not cancelled, date >= today)
  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.appointmentDate) >= new Date() && apt.status !== 'Cancelled'
  ).slice(0, 5);

  // Filter completed appointments
  const completedAppointments = appointments.filter(apt =>
    apt.status === 'Completed'
  );

  // Calculate total revenue from completed appointments
  const totalRevenue = completedAppointments.reduce((sum, apt) => sum + apt.consultationFee, 0);

  // Loading spinner while fetching data
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Responsive Header with navigation tabs and user info */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Branding */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg md:text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Doctor Portal
                </h1>
                <p className="text-xs text-gray-500 hidden md:block">Healthcare Management</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative px-3 xl:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 xl:gap-2">
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"
                        initial={false}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User Info and Mobile Menu Button */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Desktop User Info */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">Dr. {user?.firstName}</p>
                  <p className="text-xs text-gray-500">Medical Professional</p>
                </div>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-10 h-10 ring-2 ring-green-100',
                    },
                  }}
                />
              </div>

              {/* Mobile UserButton */}
              <div className="md:hidden">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: 'w-9 h-9',
                    },
                  }}
                />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t border-gray-200 overflow-hidden"
            >
              <nav className="py-3 space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-green-50 to-blue-50 text-green-700 font-semibold'
                          : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{tab.label}</span>
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeMobileTab"
                          className="ml-auto w-1 h-6 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
              {/* Mobile user info */}
              <div className="md:hidden px-4 py-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-green-50/30">
                <p className="text-sm font-semibold text-gray-900">Dr. {user?.firstName}</p>
                <p className="text-xs text-gray-500">Medical Professional</p>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Overview Tab: Welcome, stats, today's/upcoming appointments, quick actions */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white shadow-xl">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Welcome back, Dr.&nbsp;{user?.firstName}!
              </h1>
              <p className="text-green-100 text-base sm:text-lg">
                You have {todayAppointments.length} appointment{todayAppointments.length !== 1 ? 's' : ''} scheduled for today.
              </p>
              {doctorInfo && (
                <div className="mt-4 flex flex-wrap gap-2 sm:gap-4 text-sm">
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {doctorInfo.specialization}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                    {doctorInfo.experience} years experience
                  </span>
                </div>
              )}
            </div>

            {/* Quick Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Today's Appointments */}
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    <span>Today</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-1">
                    {todayAppointments.length}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">Appointments</p>
                </CardContent>
              </Card>

              {/* Total Patients */}
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    <span>Patients</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">
                    {doctorInfo?.totalPatients || 0}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">Total patients</p>
                </CardContent>
              </Card>

              {/* Completed Appointments */}
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                    <span>Completed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-1">
                    {completedAppointments.length}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">This month</p>
                </CardContent>
              </Card>

              {/* Revenue */}
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base sm:text-lg flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
                    <span>Revenue</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-600 mb-1">
                    ${totalRevenue}
                  </div>
                  <p className="text-gray-600 text-xs sm:text-sm">Total earned</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Schedule and Upcoming Appointments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Today's Schedule */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span>Today&apos;s Schedule</span>
                    <Badge variant="secondary" className="text-xs">{todayAppointments.length} appointments</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {todayAppointments.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {todayAppointments.slice(0, 4).map((appointment) => (
                        <div
                          key={appointment._id}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {appointment.patient.firstName} {appointment.patient.lastName}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{appointment.reason}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {appointment.appointmentTime}
                            </div>
                            <Badge className={`mt-1 text-xs ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {todayAppointments.length > 4 && (
                        <Button
                          variant="outline"
                          className="w-full text-sm"
                          onClick={() => setActiveTab('appointments')}
                        >
                          View All Today&apos;s Appointments
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-sm">No appointments scheduled for today</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Appointments */}
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base sm:text-lg">
                    <span>Upcoming Appointments</span>
                    <Button
                      size="sm"
                      onClick={() => setActiveTab('appointments')}
                      className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {upcomingAppointments.slice(0, 4).map((appointment) => (
                        <div
                          key={appointment._id}
                          className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {appointment.patient.firstName} {appointment.patient.lastName}
                              </h4>
                              <p className="text-xs sm:text-sm text-gray-600 truncate">{appointment.reason}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <div className="text-xs sm:text-sm font-medium text-gray-900">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600">{appointment.appointmentTime}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 text-sm">No upcoming appointments</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions: Cards for navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-green-200" onClick={() => setActiveTab('appointments')}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <span>Manage Appointments</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    View, update, and manage your appointment schedule
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-blue-200" onClick={() => setActiveTab('patients')}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Patient Records</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    Access patient information and medical history
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-purple-200" onClick={() => setActiveTab('analytics')}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                    <span>Practice Analytics</span>
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    View insights and reports about your practice
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Appointments Tab: List and details of all appointments */}
        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Appointments</h2>

            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                            {appointment.patient.firstName.charAt(0)}{appointment.patient.lastName.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                              {appointment.patient.firstName} {appointment.patient.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">Age: {new Date().getFullYear() - new Date(appointment.patient.dateOfBirth).getFullYear()}, {appointment.patient.gender}</p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">{appointment.reason}</p>
                            {appointment.symptoms && appointment.symptoms.length > 0 && (
                              <p className="text-xs sm:text-sm text-gray-500 truncate">Symptoms: {appointment.symptoms.join(', ')}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:text-right flex-shrink-0">
                          <div>
                            <div className="text-base sm:text-lg font-semibold text-gray-900">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">{appointment.appointmentTime}</div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={`text-xs ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </Badge>
                            <div className="text-sm text-green-600 font-medium">
                              ${appointment.consultationFee}
                            </div>
                          </div>
                        </div>
                      </div>
                      {(appointment.notes || appointment.diagnosis) && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {appointment.diagnosis && (
                            <p className="text-sm"><strong>Diagnosis:</strong> {appointment.diagnosis}</p>
                          )}
                          {appointment.notes && (
                            <p className="text-sm text-gray-600 mt-1"><strong>Notes:</strong> {appointment.notes}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
                  <p className="text-sm text-gray-600">Your appointments will appear here once patients start booking</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Tab: Doctor profile info */}
        {activeTab === "profile" && (
          <DoctorProfile />
        )}

        {/* Chats Tab: Placeholder for future chat functionality */}
        {/* {activeTab === "chats" && ()} */}

        {/* Analytics Tab: Practice analytics and reports */}
        {activeTab === "analytics" && (
          <AnalyticsPage />
        )}
      </div>
    </div>
  );
}