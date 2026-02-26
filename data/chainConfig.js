export const chains = {
    sol: {
        id: 'sol',
        name: 'Solana',
        symbol: 'SOL',
        coingeckoId: 'solana',
        color: '#9945FF',
        accentColor: '#14F195',
        description: 'A high-speed blockchain built for fast, low-cost transactions and decentralized apps.',
        explorerUrl: 'https://explorer.solana.com',
        explorerName: 'Solana Explorer',
        walletNote: 'Phantom supports Solana natively.',
        metrics: [
            { key: 'feeLevel', label: 'Fee Level', description: 'Current transaction fee tier' },
            { key: 'activity', label: 'Network Activity', description: 'Transaction volume indicator' },
        ],
        feeTerms: {
            unit: 'lamports',
            typical: '~0.000005 SOL per transaction',
        },
    },
    eth: {
        id: 'eth',
        name: 'Ethereum',
        symbol: 'ETH',
        coingeckoId: 'ethereum',
        color: '#627EEA',
        accentColor: '#C4A3FF',
        description: 'The leading smart contract platform powering DeFi, NFTs, and decentralized applications.',
        explorerUrl: 'https://etherscan.io',
        explorerName: 'Etherscan',
        walletNote: 'Phantom supports Ethereum alongside Solana.',
        metrics: [
            { key: 'gasIndicator', label: 'Gas Price', description: 'Current gas price indicator (gwei)' },
            { key: 'baseFee', label: 'Network Fee Level', description: 'Base fee trend' },
        ],
        feeTerms: {
            unit: 'gwei',
            typical: 'Varies with network congestion',
        },
    },
    btc: {
        id: 'btc',
        name: 'Bitcoin',
        symbol: 'BTC',
        coingeckoId: 'bitcoin',
        color: '#F7931A',
        accentColor: '#FFD93D',
        description: 'The original cryptocurrency — a decentralized digital store of value and payment network.',
        explorerUrl: 'https://mempool.space',
        explorerName: 'Mempool.space',
        walletNote: 'Phantom supports Bitcoin alongside Solana and Ethereum.',
        metrics: [
            { key: 'feeRate', label: 'Fee Rate', description: 'Current fee rate indicator (sat/vB)' },
            { key: 'mempoolLevel', label: 'Mempool Pressure', description: 'Pending transaction congestion' },
        ],
        feeTerms: {
            unit: 'sat/vB',
            typical: 'Varies with mempool congestion',
        },
    },
};

export const chainList = Object.values(chains);
