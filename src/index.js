import express from 'express';
import supabase from './supabase.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

dotenv.config();

const app = express();
const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use body-parser to handle JSON data
app.use(bodyParser.json());

// Serve static files from src/public
app.use(express.static(path.join(__dirname, 'public')));

// Set the views directory and the view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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
  const { data: subjects, error } = await supabase
    .from('doctors')
    .select('*')
    .or(orCondition);


  if (error) return res.status(500).json({ error: error.message });

  res.json(subjects);
});


app.post('/rate', async (req, res) => {
    const { student_name, student_number, subject_code, comment, rating } = req.body;
  
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
      .upsert({ student_number, student_name ,major: defaultMajor}, { onConflict: ['student_number'] });
  
    if (studentError) {
      return res.status(500).json({ error: studentError.message });
    }
  
    // Insert the rating into the ratings table
    const { data, error } = await supabase
      .from('ratings')
      .insert({ student_number, subject_code, comment, rating });
  
    if (error) return res.status(500).json({ error: error.message });
  
    res.json({ message: 'Rating submitted successfully!' });
  });
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/rate', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'rate.html'));
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
