document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await fetch('/admin/stats');
      const stats = await response.json();
      const statsDiv = document.getElementById('stats');
      
      let subjectsHtml = stats.subjects.map(subject => `
        <div class="subject p-6 bg-white shadow rounded mb-4 cursor-pointer" data-subject-code="${subject.subject_code}">
          <h3 class="text-xl font-bold">${subject.subject_name} (${subject.subject_code})</h3>
          <p>Total Ratings: ${subject.total_ratings}</p>
          <p>Girls Ratings: ${subject.girls_ratings}</p>
          <p>Boys Ratings: ${subject.boys_ratings}</p>
          <div class="ratings hidden mt-4"></div>
        </div>
      `).join('');
  
      let studentsHtml = stats.students.map(student => `
        <div class="student p-4 bg-white shadow rounded mb-4" data-student-number="${student.student_number}">
          <p><strong>${student.student_name}</strong> (${student.student_number})</p>
        </div>
      `).join('');
      
      statsDiv.innerHTML = `
      <div class="stats grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="stat p-4 bg-white shadow rounded ">
          <h2 class="text-xl font-bold">Number of Students</h2>
          <p class="text-3xl">${stats.studentCount}</p>
        </div>
        <div class="stat p-4 bg-white shadow rounded">
          <h2 class="text-xl font-bold">Number of Subjects</h2>
          <p class="text-3xl">${stats.subjectCount}</p>
        </div>
        <div class="stat p-4 bg-white shadow rounded">
          <h2 class="text-xl font-bold">Number of Ratings</h2>
          <p class="text-3xl">${stats.ratingCount}</p>
        </div>
      </div>
      <div class="students">
        <h2 class="text-xl font-bold mb-4">Students</h2>
        ${studentsHtml}
      </div>
      <div class="subjects">
        <h2 class="text-xl font-bold mb-4">Subjects</h2>
        ${subjectsHtml}
      </div>
      <div id="student-details" class="mt-4"></div>
    `;
  
      document.querySelectorAll('.subject').forEach(subjectCard => {
        subjectCard.addEventListener('click', async function () {
          const subjectCode = this.getAttribute('data-subject-code');
          const ratingsDiv = this.querySelector('.ratings');
          if (ratingsDiv.classList.contains('hidden')) {
            await fetchRatings(subjectCode, ratingsDiv);
            ratingsDiv.classList.remove('hidden');
          } else {
            ratingsDiv.classList.add('hidden');
          }
        });
      });
  
      document.querySelectorAll('.student').forEach(studentCard => {
        studentCard.addEventListener('click', async function () {
          const studentNumber = this.getAttribute('data-student-number');
          await fetchStudentDetails(studentNumber);
        });
      });
  
    } catch (error) {
      console.error('Error fetching stats:', error);
      document.getElementById('stats').innerHTML = '<p>Error loading stats. Please try again later.</p>';
    }
  });
  
  async function fetchStudentDetails(studentNumber) {
    try {
      const response = await fetch(`/admin/student/${studentNumber}`);
      const student = await response.json();
      const studentDetailsDiv = document.getElementById('student-details');
  
      studentDetailsDiv.innerHTML = `
        <div class="p-4 bg-white shadow rounded mb-4">
          <h3 class="text-xl font-bold">Student Details</h3>
          <p><strong>Name:</strong> ${student.student_name}</p>
          <p><strong>Number:</strong> ${student.student_number}</p>
        </div>
      `;
    } catch (error) {
      console.error('Error fetching student details:', error);
      document.getElementById('student-details').innerHTML = '<p>Error loading student details. Please try again later.</p>';
    }
  }
  
  async function fetchRatings(subjectCode, ratingsDiv) {
    try {
      const response = await fetch(`/admin/ratings/${subjectCode}`);
      const ratings = await response.json();
  
      if (ratings.length === 0) {
        ratingsDiv.innerHTML = '<p>No ratings available.</p>';
      } else {
        let ratingsHtml = ratings.map(rating => `
          <div class="p-4 bg-gray-100 shadow rounded mb-4">
            <p><strong>Student:</strong> ${rating.student_name} (${rating.student_number})</p>
            <p><strong>Comment:</strong> ${rating.comment}</p>
            <p><strong>Rating:</strong> ${rating.rating}</p>
            <p><strong>Gender:</strong> ${rating.gender}</p>
            <p><strong>Time:</strong> ${new Date(rating.created_at).toLocaleString()}</p>
          </div>
        `).join('');
        ratingsDiv.innerHTML = ratingsHtml;
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      ratingsDiv.innerHTML = '<p>Error loading ratings. Please try again later.</p>';
    }
  }
  