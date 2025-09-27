import { toast } from 'react-toastify';

// Custom toast configurations for the Who's My Doc app
export const toastConfig = {
  position: "top-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

// Custom toast functions with app-specific styling
export const showSuccessToast = (message) => {
  toast.success(message, {
    ...toastConfig,
    style: {
      background: '#10b981',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)',
    },
    progressStyle: {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    ...toastConfig,
    style: {
      background: '#ef4444',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(239, 68, 68, 0.3)',
    },
    progressStyle: {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  });
};

export const showInfoToast = (message) => {
  toast.info(message, {
    ...toastConfig,
    style: {
      background: '#3b82f6',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
    },
    progressStyle: {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  });
};

export const showWarningToast = (message) => {
  toast.warning(message, {
    ...toastConfig,
    style: {
      background: '#f59e0b',
      color: 'white',
      fontWeight: '500',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)',
    },
    progressStyle: {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  });
};

// Medical-specific toast messages
export const medicalToasts = {
  appointmentBooked: () => showSuccessToast('🎉 Appointment booked successfully! You will receive a confirmation email shortly.'),
  appointmentCancelled: () => showSuccessToast('✅ Appointment cancelled successfully.'),
  profileUpdated: () => showSuccessToast('✅ Profile updated successfully!'),
  loginSuccess: (name) => showSuccessToast(`👋 Welcome back, ${name}!`),
  registrationSuccess: () => showSuccessToast('🎉 Registration successful! Please login to continue.'),
  doctorsFound: (count) => showInfoToast(`🔍 Found ${count} doctor(s) matching your criteria!`),
  noDoctorsFound: () => showInfoToast('🔍 No doctors found for your search criteria. Try adjusting your filters.'),
  validationError: (message) => showErrorToast(`⚠️ ${message}`),
  networkError: () => showErrorToast('🌐 Network error. Please check your connection and try again.'),
  serverError: () => showErrorToast('🔧 Server error. Please try again later.'),
};
