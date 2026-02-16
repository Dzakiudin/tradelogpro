# 📈 TradeLogPro

## 🚀 Overview

**TradeLogPro** is a premium, high-performance trading journal application designed for professional traders. Built with a "Pro Max" design philosophy, it features a stunning glassmorphism UI, real-time analytics, and a seamless mobile-first experience.

This application helps traders track their performance, analyze setups, and maintain discipline through an intuitive and focused interface.

## ✨ Key Features

- **💎 Premium "Pro Max" UI**: Dark-themed, glassmorphism design with fluid animations and micro-interactions.
- **📊 Advanced Analytics**:
  - Real-time P/L tracking (Day, Week, Month).
  - Win Rate visualizers.
  - Capital Growth Charts.
- **📱 Mobile-First Architecture**:
  - Responsive layouts with a specialized mobile Bottom Navigation.
  - Native-like touch interactions and modal transitions.
  - PWA-ready design.
- **📅 Interactive Calendar**: Heatmap-style trading calendar to visualize daily performance consistency.
- **📝 Comprehensive Trade Logging**:
  - Detailed entry for pairs, setups, risks, and psychological mood.
  - Discipline checklist for every trade.
- **☁️ Cloud Sync**: Real-time data synchronization using Firebase Firestore.

## 🛠️ Technology Stack

- **Frontend Core**: [React](https://reactjs.org/) (v18), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Custom Config)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) via `react-chartjs-2`
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore & Auth)

## ⚡ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/tradelogpro.git
   cd tradelogpro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory and add your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Auth/         # Authentication forms
│   ├── Calendar/     # Trading calendar & heatmap
│   ├── Charts/       # Analytics charts
│   ├── Common/       # Modals, Buttons, Inputs
│   ├── Dashboard/    # Stats cards, Progress bars
│   ├── Layout/       # Sidebar, BottomNav, Main Layout
│   └── Trades/       # Trade lists, Forms, Input logic
├── context/          # React Context (Auth, Theme)
├── lib/              # Firebase configuration
├── types/            # TypeScript interfaces
└── utils/            # Helper functions
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<center>
  <p>Made with ❤️ by <b>Jackie</b></p>
  <p><i>"Consistency is the key to trading mastery."</i></p>
</center>
