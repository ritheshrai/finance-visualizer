# FinViz - Personal Finance Visualizer

A modern, privacy-focused personal finance dashboard built with React, TypeScript, and Tailwind CSS. visualizing your expenses and income with beautiful interactive charts.

## Features

- 📊 **Interactive Dashboard**: Visualize your financial health with income/expense bars and category breakdowns.
- 🌙 **Dark Mode UI**: Sleek, eye-friendly dark interface using Tailwind CSS.
- 📄 **Google Pay Support**: Import transactions directly from your Google Pay monthly statement PDFs (Beta).
- ✍️ **Manual Entry**: Easily add custom transactions for cash or other sources.
- 💾 **Local Storage**: Data persists in your browser - no external database, full privacy.
- 📤 **Data Management**: Export and Import your data as JSON for backup or migration.
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts
- **Icons**: Lucide React
- **PDF Parsing**: PDF.js
- **Routing**: React Router (HashRouter for GitHub Pages compatibility)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/finance-visualizer.git
   cd finance-visualizer
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

2. Deploy the `dist` folder to your `gh-pages` branch. You can use the `gh-pages` package or manually push the contents of `dist`.

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
