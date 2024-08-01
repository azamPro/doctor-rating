# Doctor Rating System

Welcome to the Doctor Rating System project! This project allows students to rate and view ratings for different professors based on their subjects. It includes an admin dashboard to monitor the number of students, ratings, and average ratings for each subject.

## Live Demo

You can check out the live demo of the project here: [Doctor Rating System](https://doctor-rating.vercel.app/)

## Technologies Used

- **Node.js**: The runtime environment for executing JavaScript code on the server.
- **Express.js**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **Supabase**: An open-source Firebase alternative that allows us to build scalable applications. We use Supabase for authentication, database management, and API endpoints.
- **EJS (Embedded JavaScript)**: A simple templating language that lets you generate HTML markup with plain JavaScript.
- **Tailwind CSS**: A utility-first CSS framework for building custom designs without writing much CSS.
- **Vercel**: A cloud platform for static sites and Serverless Functions, used for deployment.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or later)
- **NPM** (comes with Node.js) or **Yarn**
- **Supabase** account with a project set up

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/azamPro/doctor-rating.git
   cd doctor-rating

2. **Install dependencies:**

   ```bash
   npm install
3. **Setup Supabase:**

- Create a new project on [Supabase](https://supabase.com/)
- Set up your database tables as per the schema required by the project (you can refer to the project’s SQL scripts for table creation).
- Get your Supabase URL and Anon Key from the project settings
4. **Configure Environment Variables:**
Create a .env file in the root of your project and add the following:
   ```bash
    SUPABASE_URL=your-supabase-url
    SUPABASE_ANON_KEY=your-supabase-anon-key
    PORT=5000
  ```
Replace your-supabase-url and your-supabase-anon-key with your actual Supabase project URL and anon key.

5. **Running the Project Locally:**
Once you've set up everything, you can start the project locally by running:

   ```bash
    npm start

  ```

  ##  Project Structure

- public/: Contains static files such as CSS, JavaScript, and images.
- views/: Contains EJS templates for rendering HTML pages.
- routes/: Contains route definitions for the Express application.
- controllers/: Contains the business logic for handling requests and responses.
- scripts/: Contains client-side JavaScript files.

## Key Features
  1. **Rating System**: Students can rate professors based on different subjects, and the ratings are stored in a database.
  2. **Admin Dashboard**: The admin can view statistics like the total number of students, subjects, and ratings.
  3. **Responsive Design**: The application is fully responsive, with layouts optimized for different screen sizes.

  ## Contributing

Contributions are welcome! If you find any issues or have suggestions for new features, please open an issue or create a pull request.

You can also reach out to me on social media:

- **Twitter**: [@azampro_](https://twitter.com/azampro_)

---

Thank you for checking out the Doctor Rating System! Feel free to explore the code, suggest improvements, and contribute to the project.
