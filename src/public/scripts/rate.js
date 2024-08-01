document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const subject_code = decodeURIComponent(urlParams.get('subject_code'));
  const gender = decodeURIComponent(urlParams.get('gender'));
  const subject_name = decodeURIComponent(urlParams.get('subject_name'));

  document.getElementById('subject_code_input').value = subject_code;
  document.getElementById('gender').value = gender;
  document.getElementById('subject_name').textContent = subject_name;
  document.getElementById('subject_code').textContent = subject_code;

  document.getElementById('rateForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    // show the loading spinner
    document.getElementById('loading').classList.add('loading');

    const submitButton = this.querySelector('button[type="submit"]');
    submitButton.disabled = true; // Disable the submit button

    const formData = new FormData(this);
    console.log('Form Data:', Object.fromEntries(formData)); // Log form data

    try {
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
        submitButton.disabled = false; // Re-enable the submit button if there's an error
      } else {
        alert('Rating submitted successfully!');
        // hide the loading spinner
        document.getElementById('loading').classList.remove('loading');

        this.reset();

        // Redirect to the main page with the same major after 3 seconds
        setTimeout(() => {
          window.location.href = `/`;
        }, 1500);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
      submitButton.disabled = false; // Re-enable the submit button if there's an error
      // hide the loading spinner
      document.getElementById('loading').classList.remove('loading');

    }
  });
});
