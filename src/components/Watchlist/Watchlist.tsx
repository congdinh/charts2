import * as React from 'react';
import { useState } from 'react';
import { useWatchlist, WatchlistItem } from '../../hooks/useWatchlist';
import './Watchlist.css';

interface WatchlistProps {
	onSymbolSelect: (symbol: string) => void;
	currentSymbol?: string;
}

const popularCryptos = [
	{ symbol: 'NEOUSDT', name: 'NEO' },
	{ symbol: 'BTCUSDT', name: 'Bitcoin' },
	{ symbol: 'ETHUSDT', name: 'Ethereum' },
	{ symbol: 'BNBUSDT', name: 'BNB' },
	{ symbol: 'ADAUSDT', name: 'Cardano' },
	{ symbol: 'DOGEUSDT', name: 'Dogecoin' },
	{ symbol: 'XRPUSDT', name: 'Ripple' },
	{ symbol: 'SOLUSDT', name: 'Solana' },
	{ symbol: 'MATICUSDT', name: 'Polygon' },
];

export const Watchlist = ({ onSymbolSelect, currentSymbol }: WatchlistProps) => {
	const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
	const [searchTerm, setSearchTerm] = useState('');
	const [showAddMenu, setShowAddMenu] = useState(false);

	const filteredCryptos = popularCryptos.filter(crypto =>
		crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
		crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleAddCrypto = (symbol: string, name: string) => {
		addToWatchlist(symbol, name);
		setShowAddMenu(false);
		setSearchTerm('');
	};

	return (
		<div className="watchlist-container">
			<div className="watchlist-header">
				<h2>📊 Watchlist</h2>
				<button 
					className="add-button"
					onClick={() => setShowAddMenu(!showAddMenu)}
					title="Add to watchlist"
				>
					{showAddMenu ? '✕' : '+'}
				</button>
			</div>

			{showAddMenu && (
				<div className="add-menu">
					<input
						type="text"
						placeholder="Search crypto..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="search-input"
					/>
					<div className="crypto-list">
						{filteredCryptos.map(crypto => (
							<div 
								key={crypto.symbol}
								className="crypto-item"
								onClick={() => handleAddCrypto(crypto.symbol, crypto.name)}
							>
								<span className="crypto-name">{crypto.name}</span>
								<span className="crypto-symbol">{crypto.symbol}</span>
								{isInWatchlist(crypto.symbol) && (
									<span className="added-badge">✓</span>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			<div className="watchlist-items">
				{watchlist.length === 0 ? (
					<div className="empty-state">
						<p>No symbols in watchlist</p>
						<p className="hint">Click + to add cryptocurrencies</p>
					</div>
				) : (
					watchlist.map((item: WatchlistItem) => (
						<div 
							key={item.symbol}
							className={`watchlist-item ${currentSymbol === item.symbol ? 'active' : ''}`}
							onClick={() => onSymbolSelect(item.symbol)}
						>
							<div className="item-info">
								<span className="item-name">{item.name}</span>
								<span className="item-symbol">{item.symbol}</span>
							</div>
							<button
								className="remove-button"
								onClick={(e) => {
									e.stopPropagation();
									removeFromWatchlist(item.symbol);
								}}
								title="Remove from watchlist"
							>
								✕
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};
