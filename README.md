# Supermarket Management System - Frontend

## Overview
React-based frontend application for Supermarket Management System with Bootstrap 5.

## Technology Stack
- React 18.2
- React Router DOM 6.20
- Axios 1.6
- Bootstrap 5.3
- Vite 5.0

## Features
- Dashboard with real-time statistics
- Product management (CRUD operations)
- Barcode-based billing system
- Sales reports and analytics
- Stock movement tracking
- Responsive Bootstrap 5 UI

## Installation

### Prerequisites
- Node.js 16+ and npm

### Setup
\`\`\`bash
cd frontend
npm install
\`\`\`

## Running the Application

### Development Mode
\`\`\`bash
npm run dev
\`\`\`
The application will be available at `http://localhost:3000`

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Preview Production Build
\`\`\`bash
npm run preview
\`\`\`

## Configuration

### Environment Variables
Create a `.env` file in the frontend directory:
\`\`\`
VITE_API_URL=http://localhost:8080/api
\`\`\`

## Project Structure
\`\`\`
frontend/
├── src/
│   ├── components/
│   │   ├── layout/          # Navbar, layout components
│   │   ├── common/          # Reusable components (Alert, Spinner, etc.)
│   │   ├── pages/           # Page components
│   │   ├── products/        # Product-related components
│   │   └── billing/         # Billing-related components
│   ├── services/            # API service layer
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── vite.config.js
└── package.json
\`\`\`

## Features Guide

### Dashboard
- View total products, low stock alerts, and sales statistics
- Quick access to recent bills and low-stock products

### Product Management
- Add, edit, and delete products
- Search and filter by name, barcode, category, and status
- Barcode-centric design with duplicate prevention
- Low stock threshold configuration

### Billing System
- Barcode scanner support (keyboard-emulated scanners)
- Manual barcode entry fallback
- Real-time bill calculation
- Tax and discount management
- Invoice generation and printing

### Reports
- Daily and monthly sales reports
- Custom date range reports
- Transaction history
- Revenue analytics

### Stock Movements
- Track all inventory changes
- View stock history by product
- Filter by movement type (SALE, RESTOCK, ADJUSTMENT)

## API Integration
The frontend communicates with the Spring Boot backend API at `http://localhost:8080/api`

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile and tablet devices

## Notes
- Ensure backend API is running on port 8080
- Barcode scanners should be configured to emulate keyboard input
- Print functionality uses browser's native print dialog
