// src/public/scripts/rate.js
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const subject_code = decodeURIComponent(urlParams.get('subject_code'));
    document.getElementById('subject_code').value = subject_code;
  
    document.getElementById('rateForm').addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const formData = new FormData(this);
      const response = await fetch('/rate', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const result = await response.json();
      if (result.error) {
        alert('Error: ' + result.error);
      } else {
        alert('Rating submitted successfully!');
        this.reset();
      }
    });
  });
  