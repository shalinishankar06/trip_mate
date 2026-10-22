# TripMate

TripMate is a travel discovery and trip-planning demo built with React, TypeScript, Vite, and Tailwind CSS.

## Run it in VS Code

1. Install Node.js 20 or newer.
2. Open this extracted `TripMate-VSCode` folder in VS Code.
3. Open **Terminal → New Terminal** and run:

   ```sh
   npm install
   npm run dev
   ```

4. Open the local URL printed in the terminal.

To create a production build, run `npm run build`.

## Push this app to GitHub

This standalone folder can be its own repository. In the VS Code terminal, run:

```sh
git init -b main
git add .
git commit -m "Initial TripMate app"
git remote add origin https://github.com/shalinishankar06/trip_mate.git
git push -u origin main
```

VS Code or Git may ask you to sign in to GitHub before the push.

## Demo data and behavior

- Destination budgets are sample estimates displayed in INR. The demo uses a fixed approximate conversion of ₹85 per US$1, not a live exchange rate.
- Ratings, attractions, restaurants, and stays are illustrative sample data, not live information.
- Every newly planned trip gets a distinct itinerary variation based on the destination, trip length, and saved variation number. Reopening a saved trip keeps its itinerary stable.
- Demo account details, preferences, and saved trips stay in this browser's local storage. No real account or server storage is used.
