# 📈 Crypto Dashboard

A modern, real-time cryptocurrency dashboard built with React and TradingView Charting Library, powered by Binance API.

![Crypto Dashboard](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📊 **Real-time Data**: Live cryptocurrency price data from Binance API
- 🔄 **WebSocket Integration**: Real-time updates via Binance WebSocket
- 📱 **Split View**: Compare two cryptocurrencies side-by-side
- ⭐ **Watchlist**: Personal watchlist with localStorage persistence
- 🎨 **Modern UI**: Beautiful dark theme with gradients and animations
- 📈 **TradingView Charts**: Professional charting powered by TradingView
- 🌐 **15+ Crypto Pairs**: BTC, ETH, BNB, ADA, SOL, and more

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- TradingView Charting Library (place in `public/charting_library/`)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
# Create production build
npm run build
```

## 🌐 Deploy to GitHub Pages

### Step 1: Update package.json

If deploying to `https://<username>.github.io/<repo-name>`, update the `homepage` field:

```json
{
  "homepage": "https://<username>.github.io/<repo-name>"
}
```

For a user/organization site (`https://<username>.github.io`), use:

```json
{
  "homepage": "https://<username>.github.io"
}
```

Or keep it as `"."` for relative paths (recommended).

### Step 2: Deploy

```bash
# Install gh-pages if not already installed
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy
```

This will:
1. Build the production bundle
2. Create/update the `gh-pages` branch
3. Push the build folder to GitHub Pages

### Step 3: Configure GitHub Repository

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select the `gh-pages` branch
4. Click **Save**

Your site will be live at `https://<username>.github.io/<repo-name>` in a few minutes!

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard/          # Main dashboard component
│   ├── ChartWidget/        # TradingView chart wrapper
│   └── Watchlist/          # Watchlist sidebar
├── datafeed/
│   └── BinanceDatafeed.ts  # Binance API integration
├── hooks/
│   └── useWatchlist.ts     # Watchlist management hook
└── charting_library/       # TradingView library
```

## 🔧 Configuration

### Changing Crypto Pairs

Edit `src/components/Watchlist/Watchlist.tsx`:

```typescript
const popularCryptos = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  // Add more pairs...
];
```

### Customizing Theme

Edit `src/components/Dashboard/Dashboard.css` to change colors and styles.

## 🎨 Features Breakdown

### Real-time Data Feed
- Uses Binance REST API for historical data
- WebSocket connection for live price updates
- Supports multiple timeframes (1m, 5m, 1h, 1D, etc.)

### Watchlist Management
- Add/remove cryptocurrencies
- Persistent storage using localStorage
- Quick symbol switching

### Split View
- Compare two charts simultaneously
- Independent symbol selection
- Toggle between single and split view

## ⚠️ Important Notes

### TradingView Library License
The TradingView Charting Library requires a license. This project assumes you have:
- Downloaded the library from TradingView
- Placed it in `public/charting_library/`
- Have appropriate licensing for your use case

### Binance API Limits
- Demo/public endpoints have rate limits
- Consider implementing request throttling for production
- WebSocket connections are limited per IP

## 🛠️ Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **TradingView Charting Library** - Professional charts
- **Binance API** - Cryptocurrency data
- **WebSocket** - Real-time updates
- **LocalStorage** - Data persistence

## 📝 License

MIT License - feel free to use this project for learning and development.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using React and TradingView**
