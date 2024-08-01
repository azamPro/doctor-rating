document.addEventListener('DOMContentLoaded', async function () {
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

    
    async function showSubjects(major) {
        try {
            // Show the loading spinner
            document.getElementById('loading').classList.add('loading');
            // Fetching stats data based on major
            const responseStats = await fetch(`/admin/stats?major=${major}`);
            const stats = await responseStats.json();
    
            // Fetching subjects data based on major
            const responseSubjects = await fetch(`/subjects?major=${major}`);
            const subjects = await responseSubjects.json();
            //let  ratingNumber;
            const statsDiv = document.getElementById('stats');
    
            if (subjects.length === 0) {
                statsDiv.innerHTML = '<p>No subjects available.</p>';
            } else {
              // Combining both stats and subject data
                let subjectsHtml = subjects.map(subject => {
                    return subject.subject_assignments.map(assignment => {
                        const bgColor = assignment.gender === 'girls' ? 'bg-pink-200' : 'bg-white';
                        
                        // Find the matching stats for this subject and gender
                        const matchingStat = stats.subjects.find(stat => stat.subject_code === subject.subject_code);
                        const matchingRatingAverage = stats.subjects.find(stat => stat.subject_code === subject.subject_code);
                        let ratingNumber = 0;
                        let ratingAverage = 0;
                        if (matchingStat) {
                            if (assignment.gender === 'girls') {
                                ratingNumber = matchingStat.girls_ratings;
                                ratingAverage= matchingRatingAverage.average_girls_rating
                            } else {
                                ratingNumber = matchingStat.boys_ratings;
                                ratingAverage= matchingRatingAverage.average_boys_rating
                            }
                        }
                        
                        // Filter ratings based on gender
                        const totalRatings = stats.subjects
                            .filter(stat => stat.subject_code === subject.subject_code && stat.gender === assignment.gender)
                            .reduce((acc, stat) => acc + stat.total_ratings, 0);
                        
                            let ratingColor = 'bg-gray-200'; // Default background color

                            if (ratingAverage > 3.5) {
                                ratingColor = 'bg-green-500';
                            } else if (ratingAverage >= 2 && ratingAverage <= 3.5) {
                                ratingColor = 'bg-orange-500';
                            } else if (ratingAverage < 2) {
                                ratingColor = 'bg-red-500';
                            }

                            return `
                                <div class="subject p-6 ${bgColor} shadow rounded mb-4 cursor-pointer " data-subject-code="${subject.subject_code}" gender="${assignment.gender}">
                                    <div class="sub flex items-center">
                                        <div class="contentInSub ml-6 flex-grow">
                                            <h3 class="text-xl font-bold">${subject.subject_name} (${subject.subject_code})</h3>
                                            <p>اسم الدكتور : ${assignment.doctor_name}</p>
                                            <p class="mt-2 text-red-800 font-bold">عدد المقيميين: ${ratingNumber}</p>
                                        </div>
                                        <div class="flex-shrink-0 ${ratingColor} text-white text-3xl font-bold p-3 rounded-l-md">
                                            ${ratingAverage}/5
                                        </div>
                                    </div>
                                    <div class="ratings hidden mt-4"></div>
                                </div>
                            `;
                        
                    }).join('');
                }).join('');
    
                statsDiv.innerHTML = `
                    <div class="subjects">
                        <h1 class="text-2xl font-bold mb-4">التقييمات:</h1>
                        ${subjectsHtml}
                    </div>
                `;
    
               // Add event listeners to each sub div inside the subject card
            document.querySelectorAll('.subject .sub').forEach(subDiv => {
                subDiv.addEventListener('click', async function (event) {
                    // Prevent the event from bubbling up to parent elements
                    event.stopPropagation();
                    
                    const subjectCard = this.closest('.subject');
                    const subjectCode = subjectCard.getAttribute('data-subject-code');
                    const ratingsDiv = subjectCard.querySelector('.ratings');
                    const gender = subjectCard.getAttribute('gender');
                    
                    if (ratingsDiv.classList.contains('hidden')) {
                        await fetchRatings(subjectCode, ratingsDiv, gender);
                        ratingsDiv.classList.remove('hidden');
                    } else {
                        ratingsDiv.classList.add('hidden');
                    }
                });
            });

            }
        // Hide the loading spinner after data is fetched
        document.getElementById('loading').classList.remove('loading');
        document.getElementById('notic').textContent  = 'اضغط على المادة التي تريد قراءة تعليقات الطلاب عنها';
        } catch (error) {
            console.error('Error fetching stats or subjects:', error);
            document.getElementById('stats').innerHTML = '<p>Error loading data. Please try again later.</p>';
            document.getElementById('loading').classList.remove('loading');


        }
    }
      
    
    
    async function fetchRatings(subjectCode, ratingsDiv, gender) {
        try {
            const response = await fetch(`/admin/ratings/${subjectCode}?gender=${gender}`);
            const ratings = await response.json();

            if (ratings.length === 0) {
                ratingsDiv.innerHTML = '<p>No ratings available.</p>';
            } else {
                let ratingsHtml = ratings.map(rating => `
                    <div class="p-4 bg-gray-100 shadow rounded mb-4">
                        <p><strong>المقيم:</strong> مجهول</p>
                        <p><strong>التعليق:</strong> ${rating.comment}</p>
                        <p><strong>التقييم:</strong> ${rating.rating}</p>
                    </div>
                `).join('');
                ratingsDiv.innerHTML = ratingsHtml;
            }
        } catch (error) {
            console.error('Error fetching ratings:', error);
            ratingsDiv.innerHTML = '<p>Error loading ratings. Please try again later.</p>';
        }
    }
});
