import { useEffect, useState } from 'react'
import personsData from './services/persons'


const Filter = ({value, onChange}) => {
  return (
    <div>filter shown with <input value={value} onChange={onChange}/></div>
  )
}

const PersonForm = ({submit, nameValue, handleName, numberValue, handleNUmber }) => {
  return (
    <form onSubmit={submit}>
    <div>
      name: <input value={nameValue} onChange={handleName}/>
    </div>
    <div>
      number: <input value={numberValue} onChange={handleNUmber}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Persons = ({filtered, onDelete}) => {
  return( 
    <div>
      {filtered.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => onDelete(person.id, person.name)}>delete</button>
          </div>
      ))}
    </div>
    )
}

const Notification = ({message, isError}) => {
  if (!message) {
    return null
  }
  const notificationCss = {
    color: isError ? 'red' : 'green',
    background: 'lightgray',
    fontSize: '20px',
    border: `2px solid ${isError ? 'red' : 'green'}`,
    borderRadius: '5px',
    padding: '10px',
    marginBottom: '10px',
  }
  return (
    <div style={notificationCss}>
      {message}
    </div>
  )

}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({message: null, isError: false})

  useEffect(() => {
    personsData.getAll().then(initalPersons => setPersons(initalPersons))
    }, [])

  const showNotification = (message, isError = false) => {
    setNotification({message, isError})
    setTimeout(() => setNotification({message: null, isError: false}), 5000)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }
  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)
    const personObject = {name: newName, number: newNumber}

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number wiht a new one?`)) {
        personsData.update(existingPerson.id, personObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === existingPerson.id ? returnedPerson : person))
            showNotification(`Updated ${newName} information`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            showNotification(`Falied to update ${newName}`, true)
          })
      }
    } else {
      personsData.create(personObject)
        .then(addedPerson => {
          setPersons(persons.concat(addedPerson))
          showNotification(`Added ${newName}`)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          showNotification(`Falied to add ${newName}`, true)
        })
    }
  }
  const deletePerson = (id, name) => {
    console.log('Attempting to delete:', id, name)
    if (window.confirm(`Delete ${name}?`)) {
      personsData.remove(String(id))
        .then(() => {
          console.log('Deletion successful for ID:', id)
          setPersons(persons.filter(person => person.id !== id))
          showNotification(`Deleted ${name}`)
        })
        .catch(error => {
          console.error('Deletion failed:', error)
          showNotification(`Information of ${name} has already been removed from server`, true)
        })
    }
  }
  
  

  const filteredPersons = persons.filter((person) => 
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} isError={notification.isError} />

      <Filter value={filter} onChange={handleFilterChange}/>

      <h2>add a new</h2>

      <PersonForm 
        submit={addPerson} 
        nameValue={newName} 
        handleName={handleNameChange} 
        numberValue={newNumber} 
        handleNUmber={handleNumberChange} />

      <h2>Numbers</h2>

      <Persons filtered={filteredPersons} onDelete={deletePerson} />
    </div>
  )

}

export default App