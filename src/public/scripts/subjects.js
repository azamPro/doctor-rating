document.addEventListener('DOMContentLoaded', function() {
  const majorSelect = document.getElementById('major');
  majorSelect.addEventListener('change', function() {
    const major = this.value;
    if (major) {
      showSubjects(major); // Default to boys for now
    }
  });

  const majorLinks = document.querySelectorAll('nav a:not(.font-bold)');
  majorLinks.forEach(link => {
    link.addEventListener('click', function(event) {
      const major = this.getAttribute('onclick').split("'")[1];
      showSubjects(major); // Default to boys for now
      event.preventDefault();
    });
  });
});

async function showSubjects(major) {
    // Show the loading spinner
    document.getElementById('loading').classList.add('loading');

  const response = await fetch(`/subjects?major=${major}`);
  const subjects = await response.json();
  const subjectsDiv = document.getElementById('subjects');

  if (subjects.length === 0) {
    subjectsDiv.innerHTML = '<p>No subjects available.</p>';
  } else {
    subjectsDiv.innerHTML = subjects.map(subject => {
      return subject.subject_assignments.map(assignment => {
        const bgColor = assignment.gender === 'girls' ? 'bg-pink-200' : 'bg-white';
        return `
          <div class="card p-4 mb-4 ${bgColor} shadow cursor-pointer" onclick="rateDoctor('${subject.subject_code}', '${assignment.gender}', '${subject.subject_name}')" style="direction: rtl;">
            <p class="text-xs">${ assignment.gender === 'girls' ? 'طالبات' : 'طلاب'}</p>
            <h1 class="text-xl font-bold">${subject.subject_code}</h1>
            <h2 class="text-xl">${subject.subject_name}</h2>
            <p class="font-bold">اسم الدكتور : ${assignment.doctor_name}</p>
          </div>
        `;
      }).join('');
    }).join('');
  }
  // hide the loading spinner
  document.getElementById('loading').classList.remove('loading');

}

function rateDoctor(subject_code, gender, subject_name) {
  window.location.href = `/rate?subject_code=${encodeURIComponent(subject_code)}&gender=${encodeURIComponent(gender)}&subject_name=${encodeURIComponent(subject_name)}`;
}
