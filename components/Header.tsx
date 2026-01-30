'use client';

import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Heart, Menu, X } from "lucide-react";
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useUser();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | null>(null);

  // Fetch user role from the backend
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;

      try {
        // Check if user is a doctor
        const doctorRes = await fetch('/api/doctor/profile', { cache: 'no-store' });
        if (doctorRes.ok) {
          const doctorData = await doctorRes.json();
          if (doctorData.doctor) {
            setUserRole('doctor');
            return;
          }
        }

        // Check if user is a patient
        const patientRes = await fetch('/api/patient/profile', { cache: 'no-store' });
        if (patientRes.ok) {
          const patientData = await patientRes.json();
          if (patientData.patient) {
            setUserRole('patient');
            return;
          }
        }

        setUserRole(null);
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  // Determine if we're on a dashboard page
  const isDoctorDashboard = pathname?.includes('/doctor');
  const isPatientDashboard = pathname?.includes('/patient');
  const isDashboard = pathname === '/dashboard';
  const isOnDashboard = isDoctorDashboard || isPatientDashboard || isDashboard;

  // Don't show the header on dashboard pages (they have their own navigation)
  if (isOnDashboard) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo Section */}
          <Link 
            href="/" 
            className="flex items-center space-x-2 group transition-transform hover:scale-105"
          >
            <Heart className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
              HealthCare<span className="text-blue-600">Plus</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <SignedIn>
              <Link 
                href="/"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              {userRole === 'patient' && (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    My Appointments
                  </Link>
                </>
              )}
              {userRole === 'doctor' && (
                <>
                  <Link 
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    Appointments
                  </Link>
                </>
              )}
              <Link 
                href="/about"
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </SignedIn>
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 rounded-full font-semibold text-sm px-5 lg:px-6 py-2 lg:py-2.5 transition-all duration-200 hover:shadow-md">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm px-5 lg:px-6 py-2 lg:py-2.5 transition-all duration-200 hover:shadow-lg">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  {user?.firstName}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <SignedIn>
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9"
                  }
                }}
              />
            </SignedIn>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-900" />
              ) : (
                <Menu className="h-6 w-6 text-gray-900" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3">
              <SignedIn>
                <Link 
                  href="/"
                  className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                {userRole === 'patient' && (
                  <>
                    <Link 
                      href="/dashboard"
                      className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard"
                      className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Appointments
                    </Link>
                  </>
                )}
                {userRole === 'doctor' && (
                  <>
                    <Link 
                      href="/dashboard"
                      className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/dashboard"
                      className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Appointments
                    </Link>
                  </>
                )}
                <Link 
                  href="/about"
                  className="px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button 
                    className="mx-4 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-900 rounded-full font-semibold text-sm px-5 py-2.5 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button 
                    className="mx-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm px-5 py-2.5 transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </button>
                </SignUpButton>
              </SignedOut>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}