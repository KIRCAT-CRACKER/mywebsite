// Contact form functionality

document.addEventListener('DOMContentLoaded', function() {
  initContactForm();
});

function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const submitLoading = document.getElementById('submit-loading');
  const messageDiv = document.getElementById('form-message');

  if (!form) return;

  // Form validation
  const inputs = form.querySelectorAll('input, textarea, select');
      
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });

  // Form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
        
    if (!validateForm()) {
      return;
    }

    await submitForm();
  });

  // Real-time validation functions
  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let message = '';

    // Remove existing error styling
    clearFieldError(field);

    switch (fieldName) {
      case 'name':
        if (!value) {
          isValid = false;
          message = 'Name is required';
        } else if (value.length < 2) {
          isValid = false;
          message = 'Name must be at least 2 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          isValid = false;
          message = 'Name can only contain letters and spaces';
        }
        break;

      case 'email':
        if (!value) {
          isValid = false;
          message = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
        break;

      case 'subject':
        if (!value) {
          isValid = false;
          message = 'Please select a subject';
        }
        break;

      case 'message':
        if (!value) {
          isValid = false;
          message = 'Message is required';
        } else if (value.length < 10) {
          isValid = false;
          message = 'Message must be at least 10 characters';
        } else if (value.length > 1000) {
          isValid = false;
          message = 'Message must be less than 1000 characters';
        }
        break;
    }

    if (!isValid) {
      showFieldError(field, message);
    }

    return isValid;
  }

  function validateForm() {
    let isValid = true;
        
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  function showFieldError(field, message) {
    field.classList.add('border-red-500', 'bg-red-50');
    field.classList.remove('border-gray-500', 'focus:border-cyan-400');
        
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-400 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  function clearFieldError(field) {
    field.classList.remove('border-red-500', 'bg-red-50');
    field.classList.add('border-gray-500');
        
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  function showFormMessage(message, type) {
    messageDiv.innerHTML = `
      <div class="flex items-center">
        <i class="fas ${type === 'success' ? 'fa-check-circle text-green-400' : 'fa-exclamation-circle text-red-400'} mr-2"></i>
        <span>${message}</span>
      </div>
    `;
    messageDiv.className = `mt-4 p-4 rounded-lg ${type === 'success' ? 'message-success' : 'message-error'}`;
    messageDiv.classList.remove('hidden');

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        messageDiv.classList.add('hidden');
      }, 5000);
    }
  }

  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');
      submitText.textContent = 'Sending...';
      submitLoading.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      submitText.textContent = 'Send Message';
      submitLoading.classList.add('hidden');
    }
  }

  async function submitForm() {
    setLoadingState(true);
    messageDiv.classList.add('hidden');

    const formData = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value,
      message: form.message.value.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        showFormMessage('Thank you for your message! I\'ll get back to you within 24 hours.', 'success');
        form.reset();
            
        // Clear any validation errors
        inputs.forEach(input => clearFieldError(input));
            
      } else {
        throw new Error(data.message || 'Failed to send message');
      }

    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage(
        error.message || 'Sorry, there was an error sending your message. Please try again or contact me directly via email.',
        'error'
      );
    } finally {
      setLoadingState(false);
    }
  }
}

// Character counter for message textarea
function initCharacterCounter() {
  const messageField = document.getElementById('message');
  if (!messageField) return;

  const counter = document.createElement('div');
  counter.className = 'text-sm text-gray-400 mt-1 text-right';
  counter.id = 'char-counter';
  messageField.parentNode.appendChild(counter);

  function updateCounter() {
    const current = messageField.value.length;
    const max = 1000;
    counter.textContent = `${current}/${max} characters`;
        
    if (current > max * 0.9) {
      counter.classList.add('text-yellow-400');
      counter.classList.remove('text-gray-400');
    } else {
      counter.classList.add('text-gray-400');
      counter.classList.remove('text-yellow-400');
    }
  }

  messageField.addEventListener('input', updateCounter);
  updateCounter(); // Initial call
}

// Initialize character counter
initCharacterCounter();

// Auto-save form data to localStorage
function initAutoSave() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const STORAGE_KEY = 'contact-form-draft';

  // Load saved data
  function loadDraft() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
          const field = form.querySelector(`[name="${key}"]`);
          if (field) {
            field.value = data[key];
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load form draft:', error);
    }
  }

  // Save draft
  function saveDraft() {
    try {
      const formData = new FormData(form);
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save form draft:', error);
    }
  }

  // Clear draft
  function clearDraft() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear form draft:', error);
    }
  }

  // Load draft on page load
  loadDraft();

  // Save draft on input
  const inputs = form.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    input.addEventListener('input', debounce(saveDraft, 1000));
  });

  // Clear draft on successful submission
  form.addEventListener('submit', function(e) {
    // Only clear if form will be submitted successfully
    setTimeout(clearDraft, 2000);
  });
}

// Debounce utility function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize auto-save
initAutoSave();

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
  // Ctrl/Cmd + Enter to submit form
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const form = document.getElementById('contact-form');
    if (form) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  }
});

// Add form analytics (if needed)
function trackFormInteraction(action, field = null) {
  // This would integrate with analytics service
  console.log('Form interaction:', { action, field, timestamp: new Date().toISOString() });
}

// Track form events
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('focus', (e) => {
    if (e.target.matches('input, textarea, select')) {
      trackFormInteraction('field_focus', e.target.name);
    }
  }, true);

  form.addEventListener('submit', () => {
    trackFormInteraction('form_submit');
  });
}