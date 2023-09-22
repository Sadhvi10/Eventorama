# Eventorama - A Tournament Managing Web Application

This project facilitates tournaments without demanding personal data from users, prioritizing their privacy and confidentiality. The application's front end is designed using Reactjs & TailwindCSS, while Google's Firebase serves as the cloud-based tool for authentication and data storage.

## Live website 

https://eventorama-app.vercel.app/

## Features

- Data-Free Storage (No personal data required to register or participate)
- Anonymous participation (Users can register or log in using unique codes)
- Easy Setup (User-friendly interface for setting up tournaments)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Target Audience](#target-audience)
  
## Installation

Follow these steps to install and run the project on your local machine:

### Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: [Install Node.js](https://nodejs.org/)
- **npm (Node Package Manager)**: Included with Node.js

### Clone the Repository

1. Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/Sadhvi10/eventorama.git

### Start the development server

2. Install npm and start the development server (localhost:3000) using the following command:

   ```bash
   npm i && npm run start

## Usage

### Configuration

To set up and configure this project to work with Firebase, follow these steps:

1. **Firebase Account**: Ensure you have a Firebase account. If you don't have one, you can sign up for free at [Firebase](https://firebase.google.com/).

2. **Firebase Project**:
   - Create a new Firebase project in the Firebase Console.
   - Once your project is created, note down your Firebase Project ID and API Key.

3. **Environment Variables**:
   - In the root directory of this project, create a file named `.env` if it doesn't already exist.
   - Add the following environment variables to the `.env` file:

     ```dotenv
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

   Replace the placeholders (`your_api_key`, `your_project_id`, `your_sender_id`, `your_app_id`, `your_measurement_id`) with your actual Firebase credentials.

## Target Audience

- Sports Organizations
- Schools & Educational Institutes
- Gaming Communities

- **Created by Sadhvi Pugaonkar**