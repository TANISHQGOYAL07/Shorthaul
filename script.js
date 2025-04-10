// Main JavaScript file for ShortHaul website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initNavigation();
  initStickyHeader();
  initRideOptions();
  initFaqAccordion();
  initTestimonialSlider();
  initCounterAnimation();
  initBookingForm();
  initContactForm();
  initRideEstimator();
  initSmoothScroll();
  initAnimations();
  initMobileDetection();
});

// Navigation functionality
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const body = document.body;
  
  // Create mobile navigation if it doesn't exist
  if (!document.querySelector('.mobile-nav')) {
      const mobileNav = document.createElement('div');
      mobileNav.className = 'mobile-nav';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'close-menu';
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      mobileNav.appendChild(closeBtn);
      
      const navLinks = document.querySelector('.nav-links').cloneNode(true);
      navLinks.className = 'mobile-nav-links';
      mobileNav.appendChild(navLinks);
      
      const navBtn = document.querySelector('.nav-btn').cloneNode(true);
      navBtn.className = 'btn mobile-nav-btn';
      mobileNav.appendChild(navBtn);
      
      body.appendChild(mobileNav);
      
      // Add event listeners
      closeBtn.addEventListener('click', function() {
          mobileNav.classList.remove('active');
          body.classList.remove('no-scroll');
      });
  }
  
  const mobileNav = document.querySelector('.mobile-nav');
  
  // Toggle mobile menu
  hamburger.addEventListener('click', function() {
      mobileNav.classList.add('active');
      body.classList.add('no-scroll');
  });
  
  // Close mobile menu when clicking on links
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
          mobileNav.classList.remove('active');
          body.classList.remove('no-scroll');
      });
  });
}

// Sticky header on scroll
function initStickyHeader() {
  const header = document.querySelector('header');
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', function() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > 50) {
          header.classList.add('scrolled');
      } else {
          header.classList.remove('scrolled');
      }
      
      // Hide/show header on scroll direction
      if (scrollTop > lastScrollTop && scrollTop > 200) {
          // Scrolling down
          header.style.transform = 'translateY(-100%)';
      } else {
          // Scrolling up
          header.style.transform = 'translateY(0)';
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

// Ride options selection
function initRideOptions() {
  const rideOptions = document.querySelectorAll('.ride-option');
  
  rideOptions.forEach(option => {
      option.addEventListener('click', function() {
          // Remove selected class from all options
          rideOptions.forEach(opt => opt.classList.remove('selected'));
          
          // Add selected class to clicked option
          this.classList.add('selected');
          
          // Update estimated fare based on selection
          updateFareEstimate();
      });
  });
}

// FAQ accordion functionality
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', function() {
          // Close all other items
          faqItems.forEach(faq => {
              if (faq !== item) {
                  faq.classList.remove('active');
              }
          });
          
          // Toggle current item
          item.classList.toggle('active');
      });
  });
}

// Testimonial slider
function initTestimonialSlider() {
  const track = document.querySelector('.testimonial-track');
  const dots = document.querySelectorAll('.dot');
  const cards = document.querySelectorAll('.testimonial-card');
  let currentIndex = 0;
  
  // Function to move to a specific slide
  function goToSlide(index) {
      if (index < 0) index = cards.length - 1;
      if (index >= cards.length) index = 0;
      
      currentIndex = index;
      
      // Move track to show current slide
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // Update active dot
      dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentIndex);
      });
  }
  
  // Initialize dot click events
  dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
  });
  
  // Auto slide every 5 seconds
  let slideInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
  
  // Pause auto slide on hover
  track.addEventListener('mouseenter', () => clearInterval(slideInterval));
  track.addEventListener('mouseleave', () => {
      slideInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
  });
  
  // Support touch events for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
  });
  
  track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
  });
  
  function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
          // Swipe left
          goToSlide(currentIndex + 1);
      } else if (touchEndX > touchStartX + 50) {
          // Swipe right
          goToSlide(currentIndex - 1);
      }
  }
}

// Counter animation for stats section
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  // Function to animate counter
  function animateCounter(element, target) {
      const duration = 2000; // 2 seconds
      const frameDuration = 1000 / 60; // 60fps
      const totalFrames = Math.round(duration / frameDuration);
      let frame = 0;
      
      // Handle decimal numbers
      const isDecimal = target % 1 !== 0;
      const decimalPlaces = isDecimal ? 1 : 0;
      
      const animate = () => {
          frame++;
          // Calculate current count
          const progress = frame / totalFrames;
          const currentCount = isDecimal ? 
              (progress * target).toFixed(decimalPlaces) : 
              Math.floor(progress * target);
          
          element.textContent = currentCount;
          
          if (frame < totalFrames) {
              requestAnimationFrame(animate);
          } else {
              element.textContent = target;
          }
      };
      
      animate();
  }
  
  // Use Intersection Observer to trigger animation when stats section is visible
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              statNumbers.forEach(number => {
                  const target = parseFloat(number.getAttribute('data-count'));
                  animateCounter(number, target);
              });
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });
  
  const statsSection = document.querySelector('.stats');
  if (statsSection) {
      observer.observe(statsSection);
  }
}

// Booking form logic
function initBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  
  if (bookingForm) {
      bookingForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const pickup = document.getElementById('pickup').value;
          const destination = document.getElementById('destination').value;
          const time = document.getElementById('time').value;
          const passengers = document.getElementById('passengers').value;
          const specialRequests = document.getElementById('special-requests').value;
          
          // Get selected ride option
          let rideType = '';
          const selectedOption = document.querySelector('.ride-option.selected');
          if (selectedOption) {
              rideType = selectedOption.getAttribute('data-option');
          }
          
          // Validate form
          if (!pickup || !destination || !time) {
              showNotification('Please fill in all required fields', 'error');
              return;
          }
          
          // Create booking object
          const bookingData = {
              pickup,
              destination,
              time,
              passengers,
              specialRequests,
              rideType
          };
          
          // Simulate API call
          setTimeout(() => {
              console.log('Booking data:', bookingData);
              
              // Show confirmation message
              showNotification('Your ride has been booked successfully!', 'success');
              
              // Simulate finding driver
              setTimeout(() => {
                  showRideConfirmation();
              }, 1500);
              
              // Reset form
              bookingForm.reset();
              
              // Reset ride options
              document.querySelectorAll('.ride-option').forEach(opt => opt.classList.remove('selected'));
              
              // Reset fare estimate
              document.getElementById('estimatedFare').textContent = '₹0';
          }, 1000);
      });
  }
}

// Contact form submission
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          // Get form values
          const name = document.getElementById('contactName').value;
          const email = document.getElementById('contactEmail').value;
          const subject = document.getElementById('contactSubject').value;
          const message = document.getElementById('contactMessage').value;
          
          // Validate form
          if (!name || !email || !message) {
              showNotification('Please fill in all required fields', 'error');
              return;
          }
          
          // Create contact object
          const contactData = {
              name,
              email,
              subject,
              message
          };
          
          // Simulate API call
          setTimeout(() => {
              console.log('Contact data:', contactData);
              
              // Show confirmation message
              showNotification('Your message has been sent successfully!', 'success');
              
              // Reset form
              contactForm.reset();
          }, 1000);
      });
  }
}

// Fare estimator functionality
function initRideEstimator() {
  const pickup = document.getElementById('pickup');
  const destination = document.getElementById('destination');
  const rideOptions = document.querySelectorAll('.ride-option');
  
  // Update fare when inputs change
  if (pickup && destination) {
      pickup.addEventListener('input', updateFareEstimate);
      destination.addEventListener('input', updateFareEstimate);
  }
  
  // Update fare when ride type changes
  rideOptions.forEach(option => {
      option.addEventListener('click', updateFareEstimate);
  });
}

// Function to calculate estimated fare
function updateFareEstimate() {
  const pickup = document.getElementById('pickup').value;
  const destination = document.getElementById('destination').value;
  const estimatedFare = document.getElementById('estimatedFare');
  
  if (!pickup || !destination) {
      estimatedFare.textContent = '₹0';
      return;
  }
  
  // Get selected ride option
  const selectedOption = document.querySelector('.ride-option.selected');
  if (!selectedOption) {
      estimatedFare.textContent = '₹0';
      return;
  }
  
  // Get price range from selected option
  const priceText = selectedOption.querySelector('.price-estimate').textContent;
  const priceRange = priceText.match(/₹(\d+)-(\d+)/);
  
  if (!priceRange) {
      estimatedFare.textContent = '₹0';
      return;
  }
  
  const minPrice = parseInt(priceRange[1]);
  const maxPrice = parseInt(priceRange[2]);
  
  // Calculate random distance between 1-5 km (simulating real calculation)
  const distance = Math.random() * 4 + 1; // 1-5 km
  
  // Calculate fare based on distance and ride type
  let baseFare;
  switch (selectedOption.getAttribute('data-option')) {
      case 'toto-pool':
          baseFare = minPrice + (maxPrice - minPrice) * (distance - 1) / 4;
          break;
      case 'cycle-rickshaw':
          baseFare = minPrice + (maxPrice - minPrice) * (distance - 1) / 4;
          break;
      case 'female-rider':
          baseFare = minPrice + (maxPrice - minPrice) * (distance - 1) / 4;
          break;
      default:
          baseFare = minPrice;
  }
  
  // Round to nearest 5
  const fare = Math.round(baseFare / 5) * 5;
  
  // Update fare display
  estimatedFare.textContent = `₹${fare} (${distance.toFixed(1)} km)`;
}

// Show notification message
function showNotification(message, type = 'info') {
  // Create notification element if it doesn't exist
  if (!document.querySelector('.notification')) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      document.body.appendChild(notification);
  }
  
  const notification = document.querySelector('.notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  
  // Add animation
  setTimeout(() => {
      notification.classList.add('show');
  }, 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
          notification.style.display = 'none';
      }, 300);
  }, 3000);
}

// Show ride confirmation modal
function showRideConfirmation() {
  // Create modal if it doesn't exist
  if (!document.querySelector('.ride-confirmation-modal')) {
      const modal = document.createElement('div');
      modal.className = 'ride-confirmation-modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      const closeBtn = document.createElement('span');
      closeBtn.className = 'close-modal';
      closeBtn.innerHTML = '&times;';
      modalContent.appendChild(closeBtn);
      
      const header = document.createElement('div');
      header.className = 'modal-header';
      header.innerHTML = `
          <i class="fas fa-check-circle"></i>
          <h2>Ride Confirmed!</h2>
      `;
      modalContent.appendChild(header);
      
      const body = document.createElement('div');
      body.className = 'modal-body';
      body.innerHTML = `
          <div class="driver-info">
              <div class="driver-pic">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Driver">
              </div>
              <div class="driver-details">
                  <h3>Rahul Singh</h3>
                  <div class="driver-rating">
                      <i class="fas fa-star"></i>
                      <span>4.8</span>
                  </div>
                  <p class="vehicle-info">Toto Rickshaw • WB 34C 6352</p>
              </div>
          </div>
          <div class="ride-details">
              <div class="detail">
                  <i class="fas fa-clock"></i>
                  <p>Arriving in <strong>5 minutes</strong></p>
              </div>
              <div class="detail">
                  <i class="fas fa-map-marker-alt"></i>
                  <p>Distance: <strong>2.3 km</strong></p>
              </div>
              <div class="detail">
                  <i class="fas fa-rupee-sign"></i>
                  <p>Fare: <strong>₹45</strong></p>
              </div>
          </div>
          <div class="action-buttons">
              <button class="btn call-btn"><i class="fas fa-phone"></i> Call Driver</button>
              <button class="btn track-btn"><i class="fas fa-map-marked-alt"></i> Track Ride</button>
              <button class="btn cancel-btn"><i class="fas fa-times"></i> Cancel</button>
          </div>
      `;
      modalContent.appendChild(body);
      
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Add event listeners
      closeBtn.addEventListener('click', function() {
          modal.style.display = 'none';
      });
      
      window.addEventListener('click', function(e) {
          if (e.target === modal) {
              modal.style.display = 'none';
          }
      });
      
      const cancelBtn = modal.querySelector('.cancel-btn');
      if (cancelBtn) {
          cancelBtn.addEventListener('click', function() {
              modal.style.display = 'none';
              showNotification('Your ride has been cancelled', 'info');
          });
      }
  }
  
  // Show modal
  const modal = document.querySelector('.ride-confirmation-modal');
  modal.style.display = 'flex';
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;
          
          const targetElement = document.querySelector(targetId);
          if (!targetElement) return;
          
          const headerOffset = 100;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
          });
      });
  });
}

// Scroll animations
function initAnimations() {
  // Use Intersection Observer to animate elements when they enter viewport
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('animate');
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });
  
  // Observe section headers
  document.querySelectorAll('.section-header').forEach(item => {
      observer.observe(item);
  });
  
  // Observe feature cards
  document.querySelectorAll('.feature-card').forEach(item => {
      observer.observe(item);
  });
  
  // Observe steps
  document.querySelectorAll('.step').forEach(item => {
      observer.observe(item);
  });
  
  // Add more elements to animate as needed
}

// Mobile device detection for optimizations
function initMobileDetection() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
      document.body.classList.add('mobile-device');
      
      // Optimize image loading for mobile
      document.querySelectorAll('img').forEach(img => {
          if (!img.getAttribute('loading')) {
              img.setAttribute('loading', 'lazy');
          }
      });
  }
}

// Add CSS styles for new components
function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
      /* Animation classes */
      .section-header, .feature-card, .step {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
      }
      
      .animate {
          opacity: 1;
          transform: translateY(0);
      }
      
      /* Notification styles */
      .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 15px 20px;
          border-radius: 5px;
          color: white;
          font-weight: 500;
          z-index: 9999;
          opacity: 0;
          transform: translateX(30px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
          max-width: 300px;
      }
      
      .notification.show {
          opacity: 1;
          transform: translateX(0);
      }
      
      .notification.success {
          background-color: var(--success-color);
      }
      
      .notification.error {
          background-color: var(--danger-color);
      }
      
      .notification.info {
          background-color: var(--primary-color);
      }
      
      /* Modal styles */
      .ride-confirmation-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 9999;
          justify-content: center;
          align-items: center;
      }
      
      .modal-content {
          background-color: var(--white);
          border-radius: 10px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: modalOpen 0.4s ease;
      }
      
      .close-modal {
          position: absolute;
          top: 15px;
          right: 15px;
          font-size: 24px;
          cursor: pointer;
          color: var(--text-light);
          transition: var(--transition);
      }
      
      .close-modal:hover {
          color: var(--danger-color);
      }
      
      .modal-header {
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid var(--gray);
      }
      
      .modal-header i {
          color: var(--success-color);
          font-size: 40px;
          margin-bottom: 10px;
      }
      
      .modal-body {
          padding: 20px;
      }
      
      .driver-info {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--gray);
      }
      
      .driver-pic img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--primary-color);
      }
      
      .driver-details {
          margin-left: 20px;
      }
      
      .driver-rating {
          color: var(--warning-color);
          margin: 5px 0;
      }
      
      .vehicle-info {
          color: var(--text-light);
      }
      
      .ride-details {
          margin-bottom: 20px;
      }
      
      .detail {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
      }
      
      .detail i {
          width: 30px;
          color: var(--primary-color);
          font-size: 1.2rem;
      }
      
      .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: space-between;
      }
      
      .action-buttons .btn {
          flex: 1;
          min-width: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
      }
      
      .call-btn {
          background-color: var(--success-color);
      }
      
      .call-btn:hover {
          background-color: #218838;
      }
      
      .track-btn {
          background-color: var(--primary-color);
      }
      
      .cancel-btn {
          background-color: var(--danger-color);
      }
      
      .cancel-btn:hover {
          background-color: #c82333;
      }
      
      /* Animation keyframes */
      @keyframes modalOpen {
          from {
              opacity: 0;
              transform: translateY(-50px);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
      }
      
      /* No scroll class */
      body.no-scroll {
          overflow: hidden;
      }
      
      /* Mobile-specific styles */
      @media (max-width: 768px) {
          .action-buttons {
              flex-direction: column;
          }
          
          .notification {
              top: auto;
              bottom: 20px;
              left: 20px;
              right: 20px;
              max-width: none;
          }
      }
  `;
  
  document.head.appendChild(style);
}

// Add dynamic styles when DOM is loaded
document.addEventListener('DOMContentLoaded', addDynamicStyles);


