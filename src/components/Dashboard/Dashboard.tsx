import * as React from 'react';
import { useState } from 'react';
import { ChartWidget } from '../ChartWidget/ChartWidget';
import { Watchlist } from '../Watchlist/Watchlist';
import { version } from '../../charting_library';
import './Dashboard.css';

export const Dashboard = () => {
	const [primarySymbol, setPrimarySymbol] = useState('NEOUSDT');
	const [secondarySymbol, setSecondarySymbol] = useState('BTCUSDT');
	const [viewMode, setViewMode] = useState<'single' | 'split'>('split');

	// Trigger resize when switching views
	React.useEffect(() => {
		const handleResize = () => {
			window.dispatchEvent(new Event('resize'));
		};
		// Small delay to allow DOM to update first
		const timeoutId = setTimeout(handleResize, 100);
		return () => clearTimeout(timeoutId);
	}, [viewMode]);

	return (
		<div className="dashboard">
			<header className="dashboard-header">
				<div className="header-content">
					<h1 className="dashboard-title">
						<span className="title-icon">📈</span>
						NEO Crypto Charts
						<a 
							href="https://github.com/hellolotus/charts2" 
							target="_blank" 
							rel="noopener noreferrer"
							className="github-link"
							title="View on GitHub"
						>
							<svg width="24" height="24" viewBox="0 0 16 16" fill="currentColor">
								<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
							</svg>
						</a>
					</h1>
					<a 
						href="https://hellolotus.github.io/charts" 
						target="_blank" 
						rel="noopener noreferrer"
						className="buzz-charts-link"
						title="Visit Buzz Charts"
					>
						🔥 Buzz Charts
					</a>
					<div className="header-controls">
						<div className="view-toggle">
							<button
								className={`toggle-btn ${viewMode === 'single' ? 'active' : ''}`}
								onClick={() => setViewMode('single')}
								title="Single chart view"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<rect x="3" y="3" width="18" height="18" rx="2"/>
								</svg>
							</button>
							<button
								className={`toggle-btn ${viewMode === 'split' ? 'active' : ''}`}
								onClick={() => setViewMode('split')}
								title="Split view"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<rect x="3" y="3" width="7" height="18" rx="2"/>
									<rect x="14" y="3" width="7" height="18" rx="2"/>
								</svg>
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="dashboard-content">
				<aside className="sidebar">
					<Watchlist 
						onSymbolSelect={setPrimarySymbol}
						currentSymbol={primarySymbol}
					/>
				</aside>

				<main className="main-content">
					<div className={`charts-container ${viewMode}`}>
						<div className="chart-panel primary">
							<div className="chart-header">
								<h3 className="chart-title">{primarySymbol.replace('USDT', '/USDT')}</h3>
								<div className="chart-actions">
									<select 
										className="symbol-select"
										value={primarySymbol}
										onChange={(e) => setPrimarySymbol(e.target.value)}
									>
										<option value="BTCUSDT">BTC/USDT</option>
										<option value="ETHUSDT">ETH/USDT</option>
										<option value="BNBUSDT">BNB/USDT</option>
										<option value="ADAUSDT">ADA/USDT</option>
										<option value="SOLUSDT">SOL/USDT</option>
										<option value="XRPUSDT">XRP/USDT</option>
										<option value="DOGEUSDT">DOGE/USDT</option>
										<option value="MATICUSDT">MATIC/USDT</option>
										<option value="NEOUSDT">NEO/USDT</option>
									</select>
								</div>
							</div>
							<div className="chart-wrapper">
								<ChartWidget 
									symbol={primarySymbol}
									theme="dark"
									onSymbolChange={setPrimarySymbol}
								/>
							</div>
						</div>

						{viewMode === 'split' && (
							<div className="chart-panel secondary">
								<div className="chart-header">
									<h3 className="chart-title">{secondarySymbol.replace('USDT', '/USDT')}</h3>
									<div className="chart-actions">
										<select 
											className="symbol-select"
											value={secondarySymbol}
											onChange={(e) => setSecondarySymbol(e.target.value)}
										>
											<option value="BTCUSDT">BTC/USDT</option>
											<option value="ETHUSDT">ETH/USDT</option>
											<option value="BNBUSDT">BNB/USDT</option>
											<option value="ADAUSDT">ADA/USDT</option>
											<option value="SOLUSDT">SOL/USDT</option>
											<option value="XRPUSDT">XRP/USDT</option>
											<option value="DOGEUSDT">DOGE/USDT</option>
											<option value="MATICUSDT">MATIC/USDT</option>
											<option value="NEOUSDT">NEO/USDT</option>
										</select>
									</div>
								</div>
								<div className="chart-wrapper">
									<ChartWidget 
										symbol={secondarySymbol}
										theme="dark"
										onSymbolChange={setSecondarySymbol}
									/>
								</div>
							</div>
						)}
					</div>
				</main>
			</div>

			<footer className="dashboard-footer">
				<p>
					Data provided by <strong>Binance API</strong> • 
					Powered by <strong>TradingView Charting Library {version()}</strong>
				</p>
			</footer>
		</div>
	);
};
