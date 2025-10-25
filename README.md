# Canteen Management System

<img src="./Images/project-3.png" width="100%">

## Overview

The **Canteen Management System** is a web app that makes food ordering in canteens or cafeterias easy and efficient. Built with **React** and **Firebase**, it allows users to browse food items, add them to a cart, and place orders. Admins can track orders, view reports, and manage the system.

**[Live Demo](https://sauravrwt.github.io/Canteen-Management/)**

## Features

- **Browse Food Items**: See a list of available food items with details like price and quantity.
- **Search Bar**: Quickly find specific items.
- **Shopping Cart**: Add, remove, or adjust items in your cart.
- **Order History**: 
  - Users can view their past orders.
  - Admins can see all users' orders.
- **Reports & Charts**: Visualize sales trends with charts.
- **PDF Export**: Save order history as a PDF.
- **Secure Login**: Uses Firebase for secure user authentication.
- **Mobile-Friendly**: Works on both desktop and mobile devices.

## Technologies Used

- **React.js**: For building the user interface.
- **Firebase**: For real-time database and user authentication.
- **Bootstrap**: For styling and layout.
- **Recharts**: For creating charts and graphs.
- **JSPDF**: For exporting data as PDFs.

## How to Set Up the Project

Follow these steps to run the project on your computer:

1. **Clone the Project**:
   ```bash
   git clone https://github.com/SauRavRwT/Canteen-Management.git
   ```

2. **Go to the Project Folder**:
   ```bash
   cd Canteen-Management
   ```

3. **Install Required Packages**:
   ```bash
   npm install
   ```

4. **Set Up Firebase**:

- Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
   - Register a web app within your Firebase project.
   - Enable Firebase Authentication and set up the desired sign-in methods.
   - Copy your Firebase configuration keys.
   - Rename `.env.example` to `.env` and add your Firebase keys.
   - Apply `auth != null` to admin, sales, product read/write database rules.
   - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
      - Register a web app within your Firebase project.
      - Enable Firebase Authentication and set up the desired sign-in methods.
      - Copy the Firebase configuration and create a `firebase.js` file in the project directory:
      - Import the provided `./src/Database/Database.json` file into your Firebase Realtime Database and update the `AdminUserId` field with the admin user ID from Firebase Authentication.
      - Apply `auth != null` to admin, sales, product read/write database rules.

5. **Start the App**:
   ```bash
   npm start
   ```

6. Open the app in your browser at [http://localhost:3000](http://localhost:3000).

## Contributing

We’d love your help! Feel free to fork the project, make changes, and submit a Pull Request.
