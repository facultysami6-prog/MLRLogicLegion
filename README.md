# FreshFind — Fresh All Along

A responsive farmers' market discovery website that helps users explore local markets, discover seasonal produce, check market schedules, and save their favourite finds.

## Project Overview

**Project Name:** FreshFind  
**Theme:** eGreen Basket  
**Category:** Web Innovation Unleashed  
**Project Type:** Responsive Single Page Application (SPA)

FreshFind is designed to make it easier for visitors to discover farmers' markets, view their operating days and hours, explore available produce, and find seasonal recommendations.

The website uses pre-populated JSON data and frontend logic. It does not require a backend server or a live AI service.

## Features

### 1. Home Page
- FreshFind branding and introductory content.
- Quick market search.
- Featured markets and seasonal produce.
- Floating chatbot access.

### 2. Find a Market
- Search for markets using available filters.
- View markets and their locations.
- Use browser geolocation to sort markets by distance when permission is granted.

### 3. Market Directory
- Browse market cards with names, locations, schedules, and produce information.
- Filter markets by area, day, and produce type.
- Search by keyword.
- Sort markets by next opening, name, proximity, or rating.
- Switch between grid, list, and map views.

### 4. Market Details
- Market address and location map.
- Operating days and hours.
- Open, closed, and opening-soon status.
- Produce available at each market.
- Related market and produce information.

### 5. Produce Guide
- Browse produce items by category.
- View produce descriptions, seasons, storage tips, and related markets.
- Open individual produce detail pages.

### 6. Seasonal Picks
- Explore produce recommendations for different seasons.
- View seasonal produce information and related markets.

### 7. Chatbot
- Floating chatbot available throughout the website.
- Pre-scripted question-and-answer logic.
- Quick reply suggestions.
- Links to relevant market and produce pages.
- No live external AI service or backend connection.

### 8. My Fresh Finds (Bookmarks)
- Save favourite markets and produce.
- Add personal notes to saved items.
- Remove saved items.
- Export saved items as a text file.
- Share recommendations using available browser sharing features.

### 9. About Us
- Information about the FreshFind platform, its purpose, and its team.

### 10. Contact Us
- Contact information and location map.
- Frontend contact form with local validation.

### 11. Additional UI Features
- Live clock and market status indicators.
- Simulated visitor counter.
- Breadcrumb navigation.
- Hover effects and animations.
- Responsive layouts for desktop, tablet, and mobile.
- Demo login/signup interface.

## Technologies Used

- React
- TypeScript
- HTML5
- CSS3
- Tailwind CSS
- Vite
- JSON for pre-populated data
- Browser Local Storage for client-side demo data
- Browser Geolocation API
- Google Maps embed

## Project Structure

```text
freshfind/
├── public/
│   └── images/
├── src/
│   ├── components/
│   ├── data/
│   │   ├── chatbot.json
│   │   ├── farmers.json
│   │   ├── markets.json
│   │   ├── produce.json
│   │   ├── seasonal.json
│   │   └── testimonials.json
│   ├── lib/
│   ├── pages/
│   ├── store/
│   ├── utils/
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

## Installation Instructions

### Prerequisites
- Node.js and npm installed on your computer.
- Visual Studio Code or another code editor.

### Step 1: Extract the Project
Extract the FreshFind ZIP file to a folder on your computer.

### Step 2: Open the Project
Open the extracted `freshfind` folder in Visual Studio Code.

### Step 3: Open the Terminal
In Visual Studio Code, select **Terminal → New Terminal**.

### Step 4: Install Dependencies

Run:

```bash
npm install
```

### Step 5: Start the Development Server

Run:

```bash
npm run dev
```

### Step 6: Open the Website
Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Step 7: Create a Production Build

Run:

```bash
npm run build
```

### Step 8: Preview the Production Build

Run:

```bash
npm run preview
```

## Data and Storage

- Market, produce, seasonal, farmer, and chatbot information is stored in pre-populated JSON files.
- The website does not use a backend database or server-side storage.
- Some demo preferences and saved content are stored in the browser's Local Storage.
- Contact form submissions are handled locally and are not sent to a server.
- Chatbot responses are generated using predefined rules and data.

## Testing Checklist

Before submitting the project, verify:

- [ ] All navigation links and pages work correctly.
- [ ] Market search, filters, and sorting work correctly.
- [ ] Market details show the correct location, schedule, and produce.
- [ ] Produce categories and seasonal recommendations work.
- [ ] Chatbot answers supported questions and displays relevant links.
- [ ] Bookmarks, notes, export, and sharing work as expected.
- [ ] Geolocation works when permission is granted and handles denial correctly.
- [ ] Contact form validation works.
- [ ] Login/signup is clearly a demo feature.
- [ ] Website works on desktop, tablet, and mobile.
- [ ] Keyboard navigation and accessibility are checked.
- [ ] Google Lighthouse performance, accessibility, and SEO tests are completed.
- [ ] Production build completes successfully.

## Assumptions and Limitations

- FreshFind is a frontend-only demonstration project.
- Market and produce information is based on static, pre-populated data and may not represent live market availability.
- The chatbot uses predefined responses and does not connect to a live AI service.
- Login/signup is a demo interface and does not provide real authentication.
- The contact form does not send messages to a backend or email service.
- Visitor statistics are simulated and are not real website analytics.
- Browser geolocation requires user permission and a supported browser.
- Maps and externally hosted images may require an internet connection.
- Saved data is stored locally in the user's browser and is not synchronized across devices.

## Project Deliverables

- Source code ZIP file.
- Project report.
- README installation instructions.
- Website demonstration video in MP4 format.
- Optional hosted website URL.

## Project Information

**FreshFind — Fresh All Along**  
Theme: eGreen Basket  
Category: Web Innovation Unleashed
