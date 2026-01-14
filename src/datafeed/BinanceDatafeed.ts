import {
	IBasicDataFeed,
	LibrarySymbolInfo,
	ResolutionString,
	Bar,
	HistoryCallback,
	SubscribeBarsCallback,
	ErrorCallback,
	SearchSymbolsCallback,
	ResolveCallback,
	DatafeedConfiguration,
} from '../charting_library/datafeed-api';

interface BinanceBar {
	t: number; // Open time
	o: string; // Open
	h: string; // High
	l: string; // Low
	c: string; // Close
	v: string; // Volume
}

const configurationData: DatafeedConfiguration = {
	supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', '1D', '1W', '1M'] as ResolutionString[],
	exchanges: [{ value: 'Binance', name: 'Binance', desc: 'Binance Exchange' }],
	symbols_types: [{ name: 'crypto', value: 'crypto' }],
};

// Popular crypto pairs
const popularSymbols = [
	'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'DOGEUSDT',
	'XRPUSDT', 'DOTUSDT', 'UNIUSDT', 'SOLUSDT', 'MATICUSDT',
	'LTCUSDT', 'LINKUSDT', 'AVAXUSDT', 'ATOMUSDT', 'ETCUSDT', 'NEOUSDT'
];

class BinanceDatafeed implements IBasicDataFeed {
	private lastBarsCache = new Map<string, Bar>();
	private subscribers = new Map<string, SubscribeBarsCallback>();
	private ws: WebSocket | null = null;
	private subscribedSymbols = new Set<string>();

	onReady(callback: (configuration: DatafeedConfiguration) => void): void {
		setTimeout(() => callback(configurationData), 0);
	}

	searchSymbols(
		userInput: string,
		exchange: string,
		symbolType: string,
		onResult: SearchSymbolsCallback
	): void {
		const symbols = popularSymbols
			.filter(symbol => 
				symbol.toLowerCase().includes(userInput.toLowerCase())
			)
			.map(symbol => ({
				symbol: symbol,
				full_name: `Binance:${symbol}`,
				description: symbol.replace('USDT', '/USDT'),
				exchange: 'Binance',
				type: 'crypto',
			}));

		onResult(symbols);
	}

	resolveSymbol(
		symbolName: string,
		onResolve: ResolveCallback,
		onError: ErrorCallback
	): void {
		const symbolInfo: LibrarySymbolInfo = {
			ticker: symbolName,
			name: symbolName,
			description: symbolName.replace('USDT', '/USDT'),
			type: 'crypto',
			session: '24x7',
			timezone: 'Etc/UTC',
			exchange: 'Binance',
			listed_exchange: 'Binance',
			minmov: 1,
			pricescale: 100,
			has_intraday: true,
			has_weekly_and_monthly: true,
			supported_resolutions: configurationData.supported_resolutions!,
			volume_precision: 2,
			data_status: 'streaming',
			format: 'price',
		};

		setTimeout(() => onResolve(symbolInfo), 0);
	}

	getBars(
		symbolInfo: LibrarySymbolInfo,
		resolution: ResolutionString,
		periodParams: {
			from: number;
			to: number;
			firstDataRequest: boolean;
		},
		onResult: HistoryCallback,
		onError: ErrorCallback
	): void {
		const { from, to, firstDataRequest } = periodParams;
		const interval = this.convertResolution(resolution);
		const symbol = symbolInfo.ticker || symbolInfo.name;

		const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${from * 1000}&endTime=${to * 1000}&limit=1000`;

		fetch(url)
			.then(response => response.json())
			.then((data: any[]) => {
				if (!data || data.length === 0) {
					onResult([], { noData: true });
					return;
				}

				const bars: Bar[] = data.map((kline: any) => ({
					time: kline[0],
					open: parseFloat(kline[1]),
					high: parseFloat(kline[2]),
					low: parseFloat(kline[3]),
					close: parseFloat(kline[4]),
					volume: parseFloat(kline[5]),
				}));

				if (firstDataRequest && bars.length > 0) {
					this.lastBarsCache.set(symbol, bars[bars.length - 1]);
				}

				onResult(bars, { noData: false });
			})
			.catch(error => {
				console.error('Error fetching bars:', error);
				onError(error);
			});
	}

	subscribeBars(
		symbolInfo: LibrarySymbolInfo,
		resolution: ResolutionString,
		onTick: SubscribeBarsCallback,
		listenerGuid: string,
		onResetCacheNeededCallback: () => void
	): void {
		const symbol = (symbolInfo.ticker || symbolInfo.name).toLowerCase();
		const interval = this.convertResolution(resolution);
		
		this.subscribers.set(listenerGuid, onTick);

		if (!this.subscribedSymbols.has(symbol)) {
			this.subscribedSymbols.add(symbol);
			this.subscribeToWebSocket(symbol, interval);
		}
	}

	unsubscribeBars(listenerGuid: string): void {
		this.subscribers.delete(listenerGuid);
	}

	private subscribeToWebSocket(symbol: string, interval: string): void {
		const streamName = `${symbol}@kline_${interval}`;
		
		if (this.ws && this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify({
				method: 'SUBSCRIBE',
				params: [streamName],
				id: Date.now(),
			}));
		} else {
			this.ws = new WebSocket('wss://stream.binance.com:9443/ws');

			this.ws.onopen = () => {
				this.ws?.send(JSON.stringify({
					method: 'SUBSCRIBE',
					params: [streamName],
					id: Date.now(),
				}));
			};

			this.ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				
				if (data.e === 'kline') {
					const kline = data.k;
					const symbolUpper = data.s;
					
					const bar: Bar = {
						time: kline.t,
						open: parseFloat(kline.o),
						high: parseFloat(kline.h),
						low: parseFloat(kline.l),
						close: parseFloat(kline.c),
						volume: parseFloat(kline.v),
					};

					this.lastBarsCache.set(symbolUpper, bar);

					// Notify all subscribers
					this.subscribers.forEach(callback => {
						callback(bar);
					});
				}
			};

			this.ws.onerror = (error) => {
				console.error('WebSocket error:', error);
			};

			this.ws.onclose = () => {
				console.log('WebSocket closed');
				// Reconnect after 5 seconds
				setTimeout(() => {
					if (this.subscribedSymbols.size > 0) {
						this.subscribeToWebSocket(symbol, interval);
					}
				}, 5000);
			};
		}
	}

	private convertResolution(resolution: ResolutionString): string {
		const resolutionMap: { [key: string]: string } = {
			'1': '1m',
			'3': '3m',
			'5': '5m',
			'15': '15m',
			'30': '30m',
			'60': '1h',
			'120': '2h',
			'240': '4h',
			'1D': '1d',
			'1W': '1w',
			'1M': '1M',
		};

		return resolutionMap[resolution] || '1h';
	}
}

export default BinanceDatafeed;
