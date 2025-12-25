# ExpenseCheck

A modern, privacy-focused personal finance dashboard tailored for Indian users, built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 **Interactive Trading-Style Dashboard**: Visualize your financial health with interactive area charts and category breakdowns.
- 🇮🇳 **Indian Context**: Native support for Indian Rupee (₹) formatting and FY 2024-25 Tax estimation.
- 🧮 **Tax Estimator**: Built-in calculator to estimate tax liability based on the New Tax Regime.
- 🌙 **Modern Glassmorphism UI**: Sleek, dark-themed interface with smooth animations.
- 📄 **Google Pay Support**: Import transactions directly from your Google Pay monthly statement PDFs.
- ✍️ **Manual Entry**: Easily add custom transactions for cash or other sources.
- 💾 **Local Storage**: Data persists in your browser - no external database, full privacy.
- 📤 **Data Management**: Export and Import your data as JSON for backup or migration.
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3 (Glassmorphism design)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Parsing**: PDF.js
- **Routing**: React Router (HashRouter)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/expense-check.git
   cd expense-check
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to GitHub Pages

This project is pre-configured for deployment to GitHub Pages.

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your `gh-pages` branch.

   **Manual method:**
   ```bash
   npm run build
   git add dist -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix dist origin gh-pages
   ```

## Privacy Note

This application runs entirely on the client side. Your financial data is stored in your browser's LocalStorage and is never sent to any server. When parsing PDFs, the processing happens locally on your device.

## License

MIT
