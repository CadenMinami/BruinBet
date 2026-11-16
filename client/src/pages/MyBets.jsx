import { useEffect, useState } from 'react'
import './MyBets.css'

const API_URL = 'http://localhost:4000/api'

function MyBets() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadBets() {
      try {
        const res = await fetch(API_URL + '/users/me/bets', {
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        })
        if (res.status === 401) {
          setError('You need to log in to see your bets')
          return
        }
        if (!res.ok) {
          setError('Could not load your bets')
          return
        }
        const data = await res.json()
        // works if the server sends [...] or { bets: [...] }, depending on endpoint
        setBets(Array.isArray(data) ? data : data.bets || [])
      } catch (err) {
        console.error(err)
        setError('Could not reach the server')
      } finally {
        setLoading(false)
      }
    }
    loadBets()
  }, [])

  if (loading) return <p>Loading your bets...</p>
  if (error) return <p className="error">{error}</p>
  if (bets.length === 0) return <p>No bets yet. Go pick a market!</p>

  return (
    <div className="my-bets">
      <h1>My Bets</h1>
      <p>Bets are final. The odds and payout are locked in when you place the bet.</p>
      <table>
        <thead>
          <tr>
            <th>Market</th>
            <th>My pick</th>
            <th>Bet</th>
            <th>Odds</th>
            <th>Payout</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {bets.map((bet) => (
            <BetRow key={bet._id} bet={bet} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BetRow({ bet }) {
  // bet.market is the whole market if the server populates it, otherwise just the id
  const market = typeof bet.market === 'object' && bet.market !== null ? bet.market : null
  const question = market ? market.question : 'Market ' + bet.market
  const pick =
    market && market.outcomes[bet.outcomeIndex]
      ? market.outcomes[bet.outcomeIndex].label
      : 'Outcome ' + (bet.outcomeIndex + 1)

  let payoutText = bet.potentialPayout + ' (if it wins)'
  if (bet.result === 'won') payoutText = '+' + bet.potentialPayout
  if (bet.result === 'lost') payoutText = '0'

  return (
    <tr>
      <td>{question}</td>
      <td>{pick}</td>
      <td>{bet.amount}</td>
      <td>{bet.odds}</td>
      <td>{payoutText}</td>
      <td>
        <span className={'badge badge-' + bet.result}>{bet.result}</span>
      </td>
    </tr>
  )
}

export default MyBets
