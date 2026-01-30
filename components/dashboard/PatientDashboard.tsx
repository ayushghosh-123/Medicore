'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Plus,
  Search,
  Filter,
  Star,
  Menu,
  X,
  LogOut,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import PatientProfile from './PatientProfile';
import PaymentMethodSelector from '../PaymentMethodSelector';

interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  rating: number;
  totalPatients: number;
  biography: string;
  availableSlots: Array<{
    day: string;
    startTime: string;
    endTime: string;
  }>;
}

interface Appointment {
  _id: string;
  doctor: Doctor;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
  consultationFee: number;
}

export default function PatientDashboard() {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingData, setBookingData] = useState({
    appointmentDate: '',
    appointmentTime: '',
    reason: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, doctorsRes] = await Promise.all([
        fetch('/api/appointments/patient', { cache: 'no-store' }),
        fetch('/api/doctors', { cache: 'no-store' })
      ]);

      const appointmentsData = await appointmentsRes.json();
      const doctorsData = await doctorsRes.json();

      setAppointments(appointmentsData.appointments || []);
      setDoctors(doctorsData.doctors || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctorId: string) => {
    const doctor = doctors.find(d => d._id === doctorId);
    if (doctor) {
      setSelectedDoctor(doctor);
      setShowBookingModal(true);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor) return;

    try {
      const response = await fetch('/api/appointments/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          doctorId: selectedDoctor._id,
          appointmentDate: bookingData.appointmentDate,
          appointmentTime: bookingData.appointmentTime,
          reason: bookingData.reason,
          consultationFee: selectedDoctor.consultationFee
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowBookingModal(false);
        setSelectedDoctor(null);
        setBookingData({ appointmentDate: '', appointmentTime: '', reason: '' });
        fetchData();
        alert('Appointment booked successfully!');
      } else {
        alert(result.error || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const upcomingAppointments = appointments.filter(apt =>
    new Date(apt.appointmentDate) >= new Date() && apt.status !== 'Cancelled'
  ).slice(0, 3);

  const recentAppointments = appointments.filter(apt =>
    apt.status === 'Completed'
  ).slice(0, 3);

  const filteredDoctors = doctors.filter(doctor =>
    searchQuery === '' ||
    `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'doctors', label: 'Find Doctors', icon: Stethoscope },
    { id: 'appointments', label: 'My Appointments', icon: Clock },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Heart className="h-7 w-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">
                HealthCare<span className="text-blue-600">Plus</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Info & Mobile Menu */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10"
                      }
                    }}
                  />
                </div>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden border-t border-gray-100 overflow-hidden"
              >
                <nav className="py-4 space-y-1">
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                          }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:space-y-8"
          >
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl lg:rounded-2xl p-6 lg:p-8 text-white">
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {getGreeting()}, {user?.firstName}!
              </h1>
              <p className="text-blue-100 text-base lg:text-lg">
                Your health journey continues. Let&apos;s make today count.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>Upcoming</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-blue-600 mb-1">
                    {upcomingAppointments.length}
                  </div>
                  <p className="text-gray-600 text-sm">Appointments scheduled</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span>Completed</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                    {recentAppointments.length}
                  </div>
                  <p className="text-gray-600 text-sm">Recent visits</p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-1">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base lg:text-lg flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 text-purple-600" />
                    <span>Doctors</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl lg:text-3xl font-bold text-purple-600 mb-1">
                    {doctors.length}
                  </div>
                  <p className="text-gray-600 text-sm">Available providers</p>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-lg lg:text-xl">Upcoming Appointments</span>
                  <Button
                    size="sm"
                    onClick={() => setActiveTab('appointments')}
                    className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                  >
                    View All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-3 lg:space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 lg:h-6 lg:w-6 text-blue-600" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                            </h4>
                            <p className="text-xs lg:text-sm text-gray-600">{appointment.doctor.specialization}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end sm:text-right gap-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </div>
                            <div className="text-xs lg:text-sm text-gray-600">{appointment.appointmentTime}</div>
                          </div>
                          <Badge className={`${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 lg:py-12">
                    <Calendar className="h-12 w-12 lg:h-16 lg:w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4 lg:mb-6">No upcoming appointments</p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setActiveTab('doctors')}
                    >
                      Book Appointment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              <Card
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => setActiveTab('doctors')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <Plus className="h-5 w-5 text-green-600" />
                    <span>Book New Appointment</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Find and book appointments with our healthcare providers
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
                onClick={() => setActiveTab('appointments')}
              >
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span>View Medical History</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Access your complete appointment and medical history
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-base lg:text-lg">
                    <Stethoscope className="h-5 w-5 text-orange-600" />
                    <span>Analyze Your Report</span>
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Get AI-powered insights on your medical reports
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Doctors Tab */}
        {activeTab === 'doctors' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Find a Doctor</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="hidden sm:flex">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor._id} className="hover:shadow-lg transition-shadow flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg lg:text-xl mb-4">
                      {doctor.firstName.charAt(0)}{doctor.lastName.charAt(0)}
                    </div>
                    <CardTitle className="text-lg lg:text-xl">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {doctor.specialization} • {doctor.experience} years experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 lg:space-y-4 flex-grow flex flex-col">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Qualification</span>
                      <span className="font-medium">{doctor.qualification}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-medium text-green-600">${doctor.consultationFee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{doctor.rating || 'New'}</span>
                      <span className="text-sm text-gray-600">
                        ({doctor.totalPatients} patients)
                      </span>
                    </div>
                    {doctor.biography && (
                      <p className="text-sm text-gray-600 line-clamp-3">{doctor.biography}</p>
                    )}
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 mt-auto"
                      onClick={() => handleBookAppointment(doctor._id)}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <Stethoscope className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">Try adjusting your search criteria</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900">My Appointments</h2>

            <div className="space-y-4">
              {appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <Card key={appointment._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3 lg:space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {appointment.doctor.firstName.charAt(0)}{appointment.doctor.lastName.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base lg:text-lg font-semibold text-gray-900 truncate">
                              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                            </h4>
                            <p className="text-sm lg:text-base text-gray-600">{appointment.doctor.specialization}</p>
                            <p className="text-xs lg:text-sm text-gray-500">{appointment.reason}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end sm:text-right gap-3">
                          <div>
                            <div className="text-base lg:text-lg font-semibold text-gray-900">
                              {new Date(appointment.appointmentDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-600">{appointment.appointmentTime}</div>
                          </div>
                          <Badge className={`${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments yet</h3>
                  <p className="text-gray-600 mb-6">Book your first appointment to get started</p>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setActiveTab('doctors')}
                  >
                    Find a Doctor
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && <PatientProfile />}
      </main>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              if (!showPaymentModal) {
                setShowBookingModal(false);
                setSelectedDoctor(null);
                setBookingData({ appointmentDate: '', appointmentTime: '', reason: '' });
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg lg:text-xl font-semibold mb-4">
                Book Appointment with Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
              </h3>
              {!showPaymentModal ? (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={bookingData.appointmentDate}
                      onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Time
                    </label>
                    <select
                      required
                      value={bookingData.appointmentTime}
                      onChange={(e) => setBookingData({ ...bookingData, appointmentTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for Visit
                    </label>
                    <textarea
                      required
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Describe your symptoms or reason for visit..."
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowBookingModal(false);
                        setSelectedDoctor(null);
                        setBookingData({ appointmentDate: '', appointmentTime: '', reason: '' });
                      }}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto"
                      onClick={() => setShowPaymentModal(true)}
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </form>
              ) : (
                <PaymentMethodSelector
                  doctorId={selectedDoctor._id}
                  amount={selectedDoctor.consultationFee}
                  doctorName={`${selectedDoctor.firstName} ${selectedDoctor.lastName}`}
                  appointmentDate={bookingData.appointmentDate}
                  appointmentTime={bookingData.appointmentTime}
                  reason={bookingData.reason}
                  onSuccess={() => {
                    setShowPaymentModal(false);
                    setShowBookingModal(false);
                    setSelectedDoctor(null);
                    setBookingData({ appointmentDate: '', appointmentTime: '', reason: '' });
                    fetchData();
                  }}
                  onCancel={() => setShowPaymentModal(false)}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}