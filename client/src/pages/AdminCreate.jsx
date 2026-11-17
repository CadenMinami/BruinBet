import { useEffect, useState } from 'react'
import './AdminCreate.css'

const API_URL = 'http://localhost:4000/api'

const CATEGORIES = ['D1 Sports', 'IM Sports', 'Dining', 'Campus', 'Other']

const startingOutcomes = [
  { label: 'Yes', odds: 2.0 },
  { label: 'No', odds: 2.0 },
]

function AdminCreate() {
  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [outcomes, setOutcomes] = useState(startingOutcomes)
  const [closesAt, setClosesAt] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  // null = still checking
  const [isAdmin, setIsAdmin] = useState(null)

  // regular users shouldnt see the form at all, server checks again on submit
  useEffect(() => {
    async function checkAdmin() {
      try {
        const res = await fetch(API_URL + '/auth/me', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        })
        if (!res.ok) {
          setIsAdmin(false)
          return
        }
        const data = await res.json()
        const user = data.user || data
        setIsAdmin(user.isAdmin === true)
      } catch (err) {
        console.error(err)
        setIsAdmin(false)
      }
    }
    checkAdmin()
  }, [])

  function changeOutcome(index, field, value) {
    const copy = outcomes.map((outcome) => ({ ...outcome }))
    copy[index][field] = value
    setOutcomes(copy)
  }

  function addOutcome() {
    setOutcomes([...outcomes, { label: '', odds: 2.0 }])
  }

  function removeOutcome(index) {
    setOutcomes(outcomes.filter((outcome, i) => i !== index))
  }

  // returns an error message or '' if the form is ok
  function checkForm() {
    if (question.trim() === '') return 'Question is required'
    if (outcomes.length < 2) return 'Need at least 2 outcomes'
    for (const outcome of outcomes) {
      if (outcome.label.trim() === '') return 'Every outcome needs a label'
      if (!(Number(outcome.odds) > 1)) return 'Odds have to be more than 1.0'
    }
    if (closesAt === '') return 'Pick a closing time'
    if (new Date(closesAt) <= new Date()) return 'Closing time has to be in the future'
    return ''
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')

    const formError = checkForm()
    setError(formError)
    if (formError) return

    const market = {
      question: question.trim(),
      category: category,
      outcomes: outcomes.map((outcome) => ({
        label: outcome.label.trim(),
        odds: Number(outcome.odds),
      })),
      // datetime-local has no timezone so turn it into a real date first
      closesAt: new Date(closesAt).toISOString(),
    }

    try {
      const res = await fetch(API_URL + '/markets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify(market),
      })
      const data = await res.json().catch(() => ({}))

      if (res.status === 401) {
        setError('You need to log in first')
      } else if (res.status === 403) {
        setError('Only admins can create markets')
      } else if (!res.ok) {
        setError(data.error || 'Could not create market')
      } else {
        setMessage('Market created: ' + market.question)
        setQuestion('')
        setOutcomes(startingOutcomes)
        setClosesAt('')
      }
    } catch (err) {
      console.error(err)
      setError('Could not reach the server')
    }
  }

  if (isAdmin === null) return <p>Loading...</p>
  if (!isAdmin) {
    return (
      <div className="admin-create">
        <p className="error">Only admins can create markets.</p>
      </div>
    )
  }

  return (
    <div className="admin-create">
      <h1>Create a market</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Question
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Will UCLA beat USC?"
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <fieldset>
          <legend>Outcomes</legend>
          {outcomes.map((outcome, index) => (
            <div key={index} className="outcome-row">
              <input
                type="text"
                value={outcome.label}
                onChange={(e) => changeOutcome(index, 'label', e.target.value)}
                placeholder={'Outcome ' + (index + 1)}
                aria-label={'Outcome ' + (index + 1) + ' label'}
              />
              <input
                type="number"
                step="0.1"
                min="1.1"
                value={outcome.odds}
                onChange={(e) => changeOutcome(index, 'odds', e.target.value)}
                aria-label={'Outcome ' + (index + 1) + ' odds'}
              />
              {outcomes.length > 2 && (
                <button type="button" onClick={() => removeOutcome(index)}>
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOutcome}>
            + Add outcome
          </button>
        </fieldset>

        <label>
          Closes at
          <input
            type="datetime-local"
            value={closesAt}
            onChange={(e) => setClosesAt(e.target.value)}
          />
        </label>

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        <button type="submit">Create market</button>
      </form>
    </div>
  )
}

export default AdminCreate
