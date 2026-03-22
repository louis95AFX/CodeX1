// Scroll progress indicator
window.onscroll = function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById("scrollProgress").style.width = scrolled + "%";
  
  // Show/hide back to top button
  if (winScroll > 300) {
    document.getElementById("backToTop").classList.remove("hidden");
  } else {
    document.getElementById("backToTop").classList.add("hidden");
  }
};

// Back to top functionality
document.getElementById("backToTop").addEventListener("click", function() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// FAQ toggle functionality
document.querySelectorAll('.faq-toggle').forEach(button => {
  button.addEventListener('click', () => {
    const content = button.nextElementSibling;
    const icon = button.querySelector('i');
    
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
  });
});

// Course enrollment functionality
let selectedCourse = "";
let coursePrice = "";
let userEmail = localStorage.getItem("userEmail"); 

function setCourse(buttonElement) {
  selectedCourse = buttonElement.getAttribute("data-course");
  coursePrice = buttonElement.getAttribute("data-price");

  // Update modal text
  document.getElementById("modalCourseTitle").innerText = `Enroll in ${selectedCourse}`;
  document.getElementById("modalCourseName").innerText = selectedCourse;
  document.getElementById("modalCoursePrice").innerText = `R${coursePrice}`;

  // Update Payfast form hidden inputs
  document.querySelector("input[name='amount']").value = coursePrice;
  document.querySelector("input[name='item_name']").value = selectedCourse;

  showPaymentModal();
}

const origin = window.location.origin;
if (origin.startsWith("https://")) {
  document.getElementById("return_url").value = `${origin}/myprofile.html`;
  document.getElementById("cancel_url").value = `${origin}/cancelled.html`;
  document.getElementById("notify_url").value = `${origin}/notify`;
}

function showPaymentModal() {
  document.getElementById("paymentModal").classList.remove("hidden");
  document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
}

function closeModal() {
  document.getElementById("paymentModal").classList.add("hidden");
  document.body.style.overflow = ''; // Re-enable scrolling
}

function redirectToPayment(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById("email");
  if (!emailInput.checkValidity()) {
    emailInput.focus();
    return;
  }
  
  // Check if userEmail exists
  if (!userEmail) {
    alert("Please log in before enrolling in a course.");
    window.location.href = "index.html";
    return;
  }
  
  // Prepare the purchase data
  const purchaseData = {
    course: selectedCourse,
    price: coursePrice,
    email: userEmail,
    created_at: new Date().toISOString(),
  };

  // Send the purchase data to your backend (Server-side API) before proceeding with the payment
  fetch("http://localhost:5000/savePurchase", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(purchaseData),
  })
    .then((response) => {
      if (response.ok) {
        // Proceed with the Payfast payment after saving the data to the database
        document.querySelector("form").submit(); // Submit the Payfast form
      } else {
        alert("Error saving purchase data.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while processing your payment.");
    });
}

function filterCourses() {
  const searchQuery = document.getElementById('courseSearch').value.toLowerCase();
  const courses = document.querySelectorAll('.course-card');

  courses.forEach(course => {
    const courseTitle = course.querySelector('h4').textContent.toLowerCase();
    course.style.display = courseTitle.includes(searchQuery) ? 'flex' : 'none';
  });
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
  const modal = document.getElementById('paymentModal');
  if (event.target === modal) {
    closeModal();
  }
});

// Initialize animations on scroll
document.addEventListener('DOMContentLoaded', function() {
  const animateElements = document.querySelectorAll('.animate__animated');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(entry.target.dataset.animate);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });
});
