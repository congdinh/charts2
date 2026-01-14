import { useState, useEffect } from 'react';

export interface WatchlistItem {
	symbol: string;
	name: string;
	addedAt: number;
}

const WATCHLIST_STORAGE_KEY = 'crypto_watchlist';

export const useWatchlist = () => {
	const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

	// Load watchlist from localStorage on mount
	useEffect(() => {
		const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				if (parsed.length === 0) {
					// Default watchlist with NEOUSDT
					setWatchlist([
						{
							symbol: 'NEOUSDT',
							name: 'NEO',
							addedAt: Date.now()
						}
					]);
				} else {
					setWatchlist(parsed);
				}
			} catch (error) {
				console.error('Error parsing watchlist:', error);
				// Default watchlist on error
				setWatchlist([
					{
						symbol: 'NEOUSDT',
						name: 'NEO',
						addedAt: Date.now()
					}
				]);
			}
		} else {
			// Default watchlist if nothing in localStorage
			setWatchlist([
				{
					symbol: 'NEOUSDT',
					name: 'NEO',
					addedAt: Date.now()
				}
			]);
		}
	}, []);

	// Save watchlist to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
	}, [watchlist]);

	const addToWatchlist = (symbol: string, name?: string) => {
		const exists = watchlist.some(item => item.symbol === symbol);
		if (!exists) {
			const newItem: WatchlistItem = {
				symbol,
				name: name || symbol.replace('USDT', '/USDT'),
				addedAt: Date.now(),
			};
			setWatchlist([...watchlist, newItem]);
		}
	};

	const removeFromWatchlist = (symbol: string) => {
		setWatchlist(watchlist.filter(item => item.symbol !== symbol));
	};

	const isInWatchlist = (symbol: string): boolean => {
		return watchlist.some(item => item.symbol === symbol);
	};

	const clearWatchlist = () => {
		setWatchlist([]);
	};

	return {
		watchlist,
		addToWatchlist,
		removeFromWatchlist,
		isInWatchlist,
		clearWatchlist,
	};
};
