const express = require('express')
const app = express()
app.use(express.static('dist'))
app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html')
})

const cors = require('cors')
app.use(cors())

const morgan = require('morgan')
morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const persons = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" }
]

//GET persons
app.get('/api/persons', (request, result) => {
  result.json(persons)
})

//GET person
app.get('/api/persons/:id', (request, result) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    if (person) {
      result.json(person)
    } else {
      result.status(404).send({ error: 'Person not found' })
    }
  })

//GET info
app.get('/info', (request, result) => {
    const numberOfPersons = persons.length
    const currentTime = new Date()
    result.send(`
      <p>Phonebook has info for ${numberOfPersons} people</p>
      <p>${currentTime}</p>
    `)
  })

//DELETE person
app.delete('/api/persons/:id', (request, result) => {
    const id = request.params.id
    const index = persons.findIndex(person => person.id === id)
  
    if (index !== -1) {
      persons.splice(index, 1)
      result.status(204).end()
    } else {
      result.status(404).send({ error: 'Person not found' })
    }
  })

// POST new person
app.post('/api/persons', (request, result) => {
    const body = request.body
  
    if (!body.number || !body.name) {
      return result.status(400).json({ error: 'Number or name is missing' })
    }
    if (persons.find(person => person.name === body.name)) {
      return result.status(400).json({ error: 'Name must be unique' })
    }
  
    const newPerson = {
      id: Math.floor(Math.random() * 1000000).toString(),
      name: body.name,
      number: body.number
    }
    persons.push(newPerson)
    result.json(newPerson)
  })
  

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })