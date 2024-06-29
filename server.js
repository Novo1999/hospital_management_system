const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const fs = require('fs')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

// Function to read data from db.json
const getData = () => {
  const data = fs.readFileSync('db.json')
  return JSON.parse(data)
}

// Endpoint to get patients
app.get('/patients', (req, res) => {
  const data = getData()
  res.json(data.patients)
})

// Endpoint to get doctors
app.get('/doctors', (req, res) => {
  const data = getData()
  res.json(data.doctors)
})

// Endpoint to book appointment
app.post('/book-appointment', (req, res) => {
  const { patientId, doctorId, slot } = req.body
  const data = getData()

  const doctor = data.doctors.find((d) => d.doctorId === doctorId)
  if (doctor && doctor.availableSlots.includes(slot)) {
    data.appointments.push({ patientId, doctorId, slot })
    doctor.availableSlots = doctor.availableSlots.filter((s) => s !== slot)
    fs.writeFileSync('db.json', JSON.stringify(data, null, 2))
    res.json({ message: 'Appointment booked successfully' })
  } else {
    res.status(400).json({ error: 'Slot not available' })
  }
})

// Endpoint to get appointments
app.get('/appointments', (req, res) => {
  const data = getData()
  res.json(data.appointments)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`)
})
