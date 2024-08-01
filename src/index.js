import express from 'express';
import supabase from './supabase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use body-parser to handle JSON data
app.use(bodyParser.json());

// Serve static files from src/public
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Route for the admin page
app.get('/admin54705', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// API endpoint to fetch the count of students, ratings, and subjects
app.get('/admin/stats', async (req, res) => {
  try {
    const { data: students, error: studentsError } = await supabase
      .from('students')
      .select('student_number, student_name', { count: 'exact' });

    const { data: ratings, error: ratingsError } = await supabase
      .from('ratings')
      .select('id, gender', { count: 'exact' }); // Ensure gender is selected

    const { data: subjectsData, error: subjectsError } = await supabase
      .from('doctors')
      .select('subject_code', { count: 'exact' });

    if (studentsError || ratingsError || subjectsError) {
      return res.status(500).json({ error: 'Failed to fetch stats' });
    }

    // Get the detailed stats for each subject
    const { data: detailedSubjects, error: detailedSubjectsError } = await supabase
      .from('doctors')
      .select('subject_code, subject_name, subject_assignments(doctor_name, gender), ratings(*)');

    if (detailedSubjectsError) {
      return res.status(500).json({ error: 'Failed to fetch detailed subject stats' });
    }

    const subjects = detailedSubjects.map(subject => {
      // Filter ratings by gender and calculate total ratings for each
      const girlsRatings = subject.ratings.filter(rating => rating.gender === 'girls');
      const boysRatings = subject.ratings.filter(rating => rating.gender === 'boys');
    
      // Calculate total and average ratings for girls
      const totalGirlsRatings = girlsRatings.length;
      const sumGirlsRatings = girlsRatings.reduce((acc, rating) => acc + rating.rating, 0);
      const averageGirlsRating = totalGirlsRatings > 0 ? (sumGirlsRatings / totalGirlsRatings).toFixed(2) : null;
    
      // Calculate total and average ratings for boys
      const totalBoysRatings = boysRatings.length;
      const sumBoysRatings = boysRatings.reduce((acc, rating) => acc + rating.rating, 0);
      const averageBoysRating = totalBoysRatings > 0 ? (sumBoysRatings / totalBoysRatings).toFixed(2) : null;
    
      // Calculate total ratings across all genders
      const totalRatings = subject.ratings.length;
      console.log(`Total ratings for girl:${averageGirlsRating} boys: ${averageBoysRating}`);

      return {
        subject_code: subject.subject_code,
        subject_name: subject.subject_name,
        total_ratings: totalRatings,
        girls_ratings: totalGirlsRatings,
        boys_ratings: totalBoysRatings,
        average_girls_rating: averageGirlsRating,
        average_boys_rating: averageBoysRating,
        detailed_subjects: detailedSubjects
      };
    });

    // Sort subjects by total ratings in descending order
    subjects.sort((a, b) => b.total_ratings - a.total_ratings);

    res.json({
      studentCount: students.length,
      ratingCount: ratings.length,
      subjectCount: subjectsData.length,
      students,
      subjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// API endpoint to fetch student details by student number
app.get('/admin/student/:studentNumber', async (req, res) => {
  const { studentNumber } = req.params;

  try {
    const { data: student, error } = await supabase
      .from('students')
      .select('*')
      .eq('student_number', studentNumber)
      .single();

    if (error) return res.status(500).json({ error: error.message });

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to fetch ratings by subject code
app.get('/admin/ratings/:subjectCode', async (req, res) => {
  const { subjectCode } = req.params;
  const { gender } = req.query; // Destructure gender from req.query

  try {
    let ratingsQuery = supabase
      .from('ratings')
      .select(`
        *,
        students (
          student_name
        )
      `)
      .eq('subject_code', subjectCode);

    // If gender is provided, filter by gender
    if (gender) {
      ratingsQuery = ratingsQuery.eq('gender', gender);
    }

    const { data: ratings, error } = await ratingsQuery;

    if (error) return res.status(500).json({ error: error.message });

    // Adjusting the structure of the response to include student_name directly
    const formattedRatings = ratings.map(rating => ({
      ...rating,
      student_name: rating.students.student_name
    }));

    res.json(formattedRatings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.get('/result', async (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'Result.html'));
})


app.get('/subjects', async (req, res) => {
  const { major } = req.query;
  let orCondition;

  if (major === 'nothing') {
    return res.json([]); // Return an empty array for "nothing" major
  } else if (major === 'IT') {
    orCondition = `major.eq.${major},major.eq.common`;
  } else {
    orCondition = `major.eq.${major},major.eq.common,major.eq.commoncscoe`;
  }

  let query = supabase
    .from('doctors')
    .select('subject_code, subject_name, major, subject_assignments(doctor_name, gender)')
    .or(orCondition);

  if (major === 'COE') {
    query = query.filter('subject_assignments.gender', 'eq', 'boys');
  }

  const { data: subjects, error } = await query;

  if (error) return res.status(500).json({ error: error.message });

  res.json(subjects);
});

app.get('/subject-gender', async (req, res) => {
  const { subject_code } = req.query;

  try {
    const { data: assignments, error } = await supabase
      .from('subject_assignments')
      .select('gender')
      .eq('subject_code', subject_code);

    if (error) {
      console.error('Error fetching gender:', error);
      return res.status(500).json({ error: error.message });
    }

    if (assignments.length === 0) {
      return res.status(404).json({ error: 'No assignments found for this subject code' });
    }

    // Assuming the gender is consistent for a subject code, we take the first result
    const gender = assignments[0].gender;
    
    res.json({ gender });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/rate', async (req, res) => {
  const { student_name, student_number, subject_code, comment, rating, gender } = req.body;

  // Validate student number
  if (!/^\d{9}$/.test(student_number)) {
    return res.status(400).json({ error: 'Student number must be 9 digits.' });
  }

  // Check if the student has already rated this subject
  const { data: existingRating, error: existingError } = await supabase
    .from('ratings')
    .select('*')
    .eq('student_number', student_number)
    .eq('subject_code', subject_code)
    .single();

  if (existingRating) {
    return res.status(400).json({ error: 'You have already rated this subject.' });
  }

  if (existingError && existingError.code !== 'PGRST116') {
    return res.status(500).json({ error: existingError.message });
  }

  // Ensure student exists in students table
  const defaultMajor = 'Unknown'; // Set a default value for major  
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .upsert({ student_number, student_name, major: defaultMajor }, { onConflict: ['student_number'] });

  if (studentError) {
    return res.status(500).json({ error: studentError.message });
  }

  // Insert the rating into the ratings table
  const { data, error } = await supabase
    .from('ratings')
    .insert({ student_number, subject_code, comment, rating, gender });

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: 'Rating submitted successfully!' });
});

app.get('/rate', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rate.html'));
  });

app.get('/rating', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
