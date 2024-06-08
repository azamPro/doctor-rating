// src/public/scripts/index.js
document.addEventListener('DOMContentLoaded', function() {
    const majorSelect = document.getElementById('major');
    majorSelect.addEventListener('change', function() {
      const major = this.value;
      if (major) {
        showSubjects(major);
      }
    });
  
    const majorLinks = document.querySelectorAll('nav a:not(.font-bold)');
    majorLinks.forEach(link => {
      link.addEventListener('click', function(event) {
        const major = this.getAttribute('onclick').split("'")[1];
        showSubjects(major);
        event.preventDefault();
      });
    });
  });
  
  async function showSubjects(major) {
    const response = await fetch(`/subjects?major=${major}`);
    const subjects = await response.json();
    const subjectsDiv = document.getElementById('subjects');
    subjectsDiv.innerHTML = subjects.map(subject => `
      <div class="card p-4 mb-4 bg-white shadow cursor-pointer" onclick="rateDoctor('${subject.subject_code}')" style="direction: rtl;">
        <h2 class="text-xl">${subject.subject_name} (${subject.subject_code})</h2>
        <p class="font-bold mt-3" >اسم الدكتور : ${subject.doctor_name}</p>
      </div>
    `).join('');
  }
  
  function rateDoctor(subject_code) {
    window.location.href = `/rate?subject_code=${encodeURIComponent(subject_code)}`;
  }
  