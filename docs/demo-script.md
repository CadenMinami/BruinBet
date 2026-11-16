# Milestone 2 demo script

Goal: show one full loop. Log in, bet, market closes, admin settles, balance updates. Should take around 5 min.

## Before the demo (~5 min before)

1. Start the server (`cd server`, `npm run dev`) and the client (`cd client`, `npm run dev`) in two terminals.
2. Reseed so everyone is back at 1000 and the demo markets are fresh:
   ```
   cd server
   npm run seed -- 5
   ```
   The 5 means the two demo markets close 5 min after seeding (default is 10). Write down the closing time it prints.
3. Open two browser windows: a normal one for the user and a private one for the admin.
4. In the admin window, log in as bcoins_admin and open the De Neve chicken tenders market page **now**, before it closes. Leave that tab open. Closed markets drop off the open markets list, so this is how the admin gets back to it to settle.

| Role | Email | Password |
|---|---|---|
| User | joebruin@ucla.edu | GoBruins2026 |
| User | josiebruin@ucla.edu | GoBruins2026 |
| Admin | bcoins.admin@ucla.edu | AdminBruin2026 |

## Demo

1. **Log in as a user.** Log in as joebruin. Balance in the nav says **1000**.
2. **Search + filter.** Pick **Dining**, search "De Neve". The chicken tenders market shows up.
3. **Bet.** Open it, pick **Yes**, bet **100**. Payout preview says **200** (100 x 2.0). Confirm. Balance goes to **900**.
4. **My Bets.** The bet shows up as **pending**.
5. **(Optional) losing bet.** Log in as josiebruin and bet 100 on **No**. Balance 900.
6. **Market closes.** After the closing time, refresh. The market is gone from the open list and you can't bet on it anymore.
7. **Switch to the admin.** Go to the private window (already logged in as bcoins_admin). Can also show the create market form here.
8. **Settle.** Go to the De Neve market tab you left open and refresh. Pick **Yes** as the winner, confirm.
9. **New balance.** Go back to joebruin and refresh. Balance is **1100** (900 + 200) and the bet says **won**. josiebruin stays at **900** with **lost**.

## If something breaks

- Market closed before we bet: reseed with a bigger number, like `npm run seed -- 10`, or just use another market (the rest close in days).
- Settle doesn't work because the market is still open: wait until the closing time the seed printed.
- Balances are off from practice runs: run `npm run seed` again, it resets everything.
- If a part doesn't work, demo what does and say what's left. Don't fake it.
