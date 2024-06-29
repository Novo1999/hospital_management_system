document.addEventListener('DOMContentLoaded', function () {
  fetchPatients()
  fetchDoctors()
  fetchAppointments()

  document.getElementById('doctorId').addEventListener('change', fetchSlots)

  document
    .getElementById('appointmentForm')
    .addEventListener('submit', function (event) {
      event.preventDefault()
      const patientId = document.getElementById('patientId').value
      const doctorId = document.getElementById('doctorId').value
      const slot = document.getElementById('slot').value

      fetch('http://localhost:3000/book-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patientId, doctorId, slot }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error)
          } else {
            alert(data.message)
            fetchSlots()
            fetchAppointments()
          }
        })
        .catch((error) => {
          console.error('Error:', error)
          alert('There was an error booking the appointment.')
        })
    })
})

function fetchPatients() {
  fetch('http://localhost:3000/patients')
    .then((response) => response.json())
    .then((patients) => {
      const patientSelect = document.getElementById('patientId')
      patients.forEach((patient) => {
        const option = document.createElement('option')
        option.value = patient.patientId
        option.textContent = `${patient.name} (ID: ${patient.patientId})`
        patientSelect.appendChild(option)
      })
    })
    .catch((error) => console.error('Error fetching patients:', error))
}

function fetchDoctors() {
  fetch('http://localhost:3000/doctors')
    .then((response) => response.json())
    .then((doctors) => {
      const doctorSelect = document.getElementById('doctorId')
      doctors.forEach((doctor) => {
        const option = document.createElement('option')
        option.value = doctor.doctorId
        option.textContent = `${doctor.name} (${doctor.specialization})`
        doctorSelect.appendChild(option)
      })
    })
    .catch((error) => console.error('Error fetching doctors:', error))
}

function fetchSlots() {
  const doctorId = document.getElementById('doctorId').value
  if (!doctorId) return

  fetch('http://localhost:3000/doctors')
    .then((response) => response.json())
    .then((doctors) => {
      const doctor = doctors.find((d) => d.doctorId === doctorId)
      const slotSelect = document.getElementById('slot')
      slotSelect.innerHTML = ''
      doctor.availableSlots.forEach((slot) => {
        const option = document.createElement('option')
        option.value = slot
        option.textContent = slot
        slotSelect.appendChild(option)
      })
    })
    .catch((error) => console.error('Error fetching slots:', error))
}

function fetchAppointments() {
  fetch('http://localhost:3000/appointments')
    .then((response) => response.json())
    .then((appointments) => {
      const appointmentsDiv = document.getElementById('appointments')
      appointmentsDiv.innerHTML = ''
      appointments.forEach((appointment) => {
        const appointmentDiv = document.createElement('div')
        appointmentDiv.className = 'appointment'
        appointmentDiv.innerHTML = `
                    <p>Patient ID: ${appointment.patientId}</p>
                    <p>Doctor ID: ${appointment.doctorId}</p>
                    <p>Slot: ${appointment.slot}</p>
                `
        appointmentsDiv.appendChild(appointmentDiv)
      })
    })
    .catch((error) => console.error('Error fetching appointments:', error))
}
