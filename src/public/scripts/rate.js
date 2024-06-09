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

    const formData = new FormData(this);
    console.log('Form Data:', Object.fromEntries(formData)); // Log form data

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
