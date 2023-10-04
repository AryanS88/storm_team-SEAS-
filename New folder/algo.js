const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const app = express()
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
function suggestCareer(studentResponses) {
  const {
    'Logical quotient rating': logicalRating,
    'Self-learning capability': selfLearning,
    'Public speaking points': publicSpeaking,
    'Memory capability score': memoryCapability,
    'Reading and writing skills': readingWriting,
    'Interested subjects': interestedSubjects,
    'Type of company want to settle in?': companyType,
    'Interested Type of Books you prefer': bookPreference,
  } = studentResponses

  const careerOptions = {
    Technology: [
      {
        condition:
          logicalRating + selfLearning > publicSpeaking + memoryCapability,
        option: 'Software Developer (Startup)',
      },
      {
        condition: companyType === 'Startup',
        option: 'Software Developer (Startup)',
      },
      {
        condition: companyType === 'Tech Giant',
        option: 'Software Engineer (Tech Giant)',
      },
      {
        condition: bookPreference === 'Business/Management',
        option: 'IT Project Manager',
      },
      {
        condition: true,
        option: 'Web Developer',
      },
    ],
    Business: [
      {
        condition:
          publicSpeaking + memoryCapability > logicalRating + selfLearning,
        option: 'Financial Analyst (Financial Institution)',
      },
      {
        condition: companyType === 'Financial Institution',
        option: 'Financial Analyst (Financial Institution)',
      },
      {
        condition: companyType === 'Marketing/Advertising Agency',
        option: 'Marketing Specialist (Marketing/Advertising Agency)',
      },
      {
        condition: bookPreference === 'Technology',
        option: 'IT Consultant',
      },
      {
        condition: true,
        option: 'Entrepreneur',
      },
    ],
    Arts: [
      {
        condition:
          readingWriting + interestedSubjects.length >
          logicalRating + selfLearning,
        option: 'Novelist (Fiction)',
      },
      {
        condition: bookPreference === 'Non-Fiction',
        option: 'Non-Fiction Writer',
      },
      {
        condition: bookPreference === 'History',
        option: 'Historian',
      },
      {
        condition: true,
        option: 'Graphic Designer',
      },
    ],
  }

  const matchedCareers = {}

  // Determine matched careers in each discipline
  for (const discipline in careerOptions) {
    matchedCareers[discipline] = careerOptions[discipline].filter(
      (option) => option.condition
    )
  }

  // Check if the student has multiple career options
  const selectedCareers = []
  for (const discipline in matchedCareers) {
    if (matchedCareers[discipline].length === 1) {
      selectedCareers.push(matchedCareers[discipline][0].option)
    }
  }

  if (selectedCareers.length > 1) {
    return 'You have multiple career options: ' + selectedCareers.join(', ')
  }

  // If only one career option is available, return it
  if (selectedCareers.length === 1) {
    return selectedCareers[0]
  }

  return 'Career path not determined'
}

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
