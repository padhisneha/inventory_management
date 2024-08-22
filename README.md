# Pantry Management App

A modern Pantry Management System built with Next.js and Firebase Firestore. The app helps users manage their pantry inventory and provides recipe suggestions based on available ingredients. The app integrates with the Spoonacular API to fetch recipe information, including ingredients, nutrition, diet, and allergen details.

## Table of Contents

- [Features](#features)
- [App Demo](#App-Demo)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Technologies](#technologies)

## Features

- Add, update, and remove pantry items.
- View inventory with real-time synchronization using Firebase Firestore.
- Suggest recipes based on available ingredients.
- Fetch detailed recipe information using the Spoonacular API.
- Responsive design with a sleek UI inspired by Pantry Management themes.
- Modals with scrollable content for long recipe descriptions.
- Persistent dark theme with consistent background color.

## App Demo

![Pantry Management App](https://inventory-management-d0b8d.web.app/)

## Installation

### Prerequisites

- Node.js and npm installed
- Firebase account and Firestore setup
- Spoonacular API key

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/pantry-management-app.git
   cd pantry-management-app

2. Install dependencies:

  ```bash
  npm install
  ```
3. Set up environment variables:

  Create a .env.local file in the root directory and add your Firebase and Spoonacular API credentials:

  NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
  NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
  NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
  NEXT_PUBLIC_SPOONACULAR_API_KEY=your_spoonacular_api_key

4. Run the app locally:

  ```bash
  npm run dev
  ```
Open http://localhost:3000 to view it in your browser.

## Usage
  - Add pantry items using the form on the left.
  - Click "Suggest Recipes" to fetch recipes based on your available ingredients.
  - View recipe details in a scrollable modal.
  - Manage your inventory by adding or removing items.

## API Integration
The app uses the Spoonacular API to fetch recipe information. The following API endpoints are used:

  GET /recipes/findByIngredients: Suggests recipes based on available ingredients.
  GET /recipes/{id}/information: Fetches detailed recipe information including ingredients, instructions, and nutritional facts.
  
## Technologies
  - Next.js: React framework for server-side rendering and static site generation.
  - Firebase Firestore: Real-time NoSQL database for storing pantry inventory.
  - Spoonacular API: API for fetching recipes and nutritional information.
  - Material-UI: UI component library for React.
