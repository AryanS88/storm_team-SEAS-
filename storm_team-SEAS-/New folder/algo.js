const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
app.use(express.json())
const port = process.env.PORT || 3000

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/career_counseling', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

mongoose.connection.on(
  'error',
  console.error.bind(console, 'MongoDB connection error:')
)

// Define a schema for student responses
const studentResponseSchema = new mongoose.Schema({
  // Define fields for student responses here
  // For example, you might have fields like "Logical quotient rating," "Self-learning capability," etc.
})

const StudentResponse = mongoose.model('StudentResponse', studentResponseSchema)

// Define rules for career counseling
// Refactored rule-based engine function
function suggestCareer(userResponses) {
  const technologyScore =
    userResponses['Logical quotient rating'] +
    userResponses['Self-learning capability']
  const businessScore =
    userResponses['Public speaking points'] +
    userResponses['Memory capability score']
  const artsScore =
    userResponses['Reading and writing skills'] +
    userResponses['Interested subjects']

  // Determine the type of company based on the response
  let companyType = userResponses['Type of company want to settle in?']

  // Determine the type of books preferred by the student
  let bookPreference = userResponses['Interested Type of Books you prefer']

  // Initialize an array to store career options
  const careerOptions = []

  // Technology Careers
  if (technologyScore > businessScore && technologyScore > artsScore) {
    if (companyType === 'Startup') {
      careerOptions.push('Technology: Software Developer (Startup)')
    } else if (companyType === 'Tech Giant') {
      careerOptions.push('Technology: Software Engineer (Tech Giant)')
    } else if (bookPreference === 'Business/Management') {
      careerOptions.push('Technology: IT Project Manager')
    } else {
      careerOptions.push('Technology: Web Developer')
    }
  }

  // Business Careers
  if (businessScore > technologyScore && businessScore > artsScore) {
    if (companyType === 'Financial Institution') {
      careerOptions.push('Business: Financial Analyst (Financial Institution)')
    } else if (companyType === 'Marketing/Advertising Agency') {
      careerOptions.push(
        'Business: Marketing Specialist (Marketing/Advertising Agency)'
      )
    } else if (bookPreference === 'Technology') {
      careerOptions.push('Business: IT Consultant')
    } else {
      careerOptions.push('Business: Entrepreneur')
    }
  }

  // Arts Careers
  if (artsScore > technologyScore && artsScore > businessScore) {
    if (bookPreference === 'Fiction') {
      careerOptions.push('Arts: Novelist (Fiction)')
    } else if (bookPreference === 'Non-Fiction') {
      careerOptions.push('Arts: Non-Fiction Writer')
    } else if (bookPreference === 'History') {
      careerOptions.push('Arts: Historian')
    } else {
      careerOptions.push('Arts: Graphic Designer')
    }
  }

  // Check if the student has equal scores in multiple disciplines
  if (careerOptions.length > 1) {
    return 'You have multiple career options: ' + careerOptions.join(', ')
  }

  // If only one career option is available, return it
  if (careerOptions.length === 1) {
    return careerOptions[0]
  }

  return 'Career path not determined'
}

// Function to handle form submission
function handleFormSubmit(event) {
  event.preventDefault() // Prevent the default form submission behavior

  // Gather user responses from the form
  const userResponses = {
    'Logical quotient rating': parseInt(
      document.getElementById('logical-quotient-rating').value
    ),
    'Public speaking points': parseInt(
      document.getElementById('public-speaking-points').value
    ),
    'Self-learning capability': parseInt(
      document.getElementById('self-learning-capability').value
    ),
    // Add more form fields and their corresponding properties
  }

  // Call the suggestCareer function with user responses
  const careerSuggestion = suggestCareer(userResponses)

  // Display the career suggestion to the user
  document.getElementById('career-suggestion').textContent = careerSuggestion
}

// Add an event listener to the form's submit button
document
  .getElementById('career-form')
  .addEventListener('submit', handleFormSubmit)

// Handle student responses and provide career suggestions
app.post('/suggest-career', async (req, res) => {
  try {
    const studentResponses = req.body

    // Save student responses to MongoDB (optional)
    const newStudentResponse = new StudentResponse(studentResponses)
    await newStudentResponse.save()

    // Suggest a career based on the rules
    const suggestedCareer = suggestCareer(studentResponses)

    res.status(200).json({ suggestedCareer })
  } catch (error) {
    res.status(500).json({
      error: 'Error processing student responses',
      details: error.message,
    })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
