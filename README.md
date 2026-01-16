# Kerala Parcel Connect (MVP)

A peer-to-peer logistics marketplace for Kerala, connecting travelers with parcel senders.

# Demo site

https://kerala-send-ahwwkdsdv-hisham-cs-projects.vercel.app/

## Features

- **Role Selection:** Customer (Sender) or Delivery Partner (Traveler).
- **Customer Flow:** Search for travelers by route and date, view matches, and confirm booking.
- **Partner Flow:** List a journey, auto-detect route (simulated), and view package delivery requests.
- **Interactive Map:** Visualizes pickup and drop locations using OpenStreetMap.
- **Liquid Glass UI:** Modern, translucent design inspired by Apple's design language.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4 (Liquid Glass Theme)
- **Maps:** React Leaflet / OpenStreetMap
- **Icons:** Lucide React

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open:** [http://localhost:3000](http://localhost:3000)

## MVP Limitations

- **Data:** All data (travelers, requests) is mocked for demonstration.
- **Maps:** Route calculation is simulated; map markers are static or approximate.
- **Auth:** No actual authentication (phone verification is a UI placeholder).
