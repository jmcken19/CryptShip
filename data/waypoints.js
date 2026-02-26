export function getWaypoints(chain) {
    const c = chain.toUpperCase();
    const chainName = c === 'SOL' ? 'Solana' : c === 'ETH' ? 'Ethereum' : 'Bitcoin';
    const networkLabel = c === 'SOL' ? 'Solana network' : c === 'ETH' ? 'Ethereum network' : 'Bitcoin network';

    return [
        {
            id: 1,
            title: 'Create a Coinbase Account',
            goal: 'Set up a trusted custodial platform as your starting point.',
            points: [
                `Coinbase is a regulated exchange where you can buy ${c} and other cryptocurrencies.`,
                'Visit coinbase.com to create a free account — do not click ads or search-result links.',
                'Use a strong, unique password and an email you control.',
                'Complete identity verification (KYC) — this is standard for regulated platforms.',
                'Start with the basics: you don\'t need to trade or use advanced features right away.',
            ],
            action: 'Go to coinbase.com and create your account.',
            actionLink: 'https://coinbase.com/join/ZKU75L5?src=referral-link',
            checkbox: 'I have created a Coinbase account.',
        },
        {
            id: 2,
            title: 'Secure + Fund Coinbase',
            goal: 'Lock down your account with 2FA and add a small starting balance.',
            points: [
                'Enable two-factor authentication (2FA) immediately — use an authenticator app, not SMS if possible.',
                'Add a payment method (bank, debit card) to deposit funds.',
                'Start small: a small amount is enough to learn with. This is education, not investing advice.',
                'Never share your Coinbase login credentials, 2FA codes, or account recovery details with anyone.',
                'Bookmark coinbase.com — always navigate from your bookmark, never from links in emails or messages.',
            ],
            action: 'Enable 2FA and make a small deposit to fund your account.',
            checkbox: 'I have enabled 2FA and funded my Coinbase account.',
        },
        {
            id: 3,
            title: 'Download Phantom',
            goal: 'Install Phantom wallet — your self-custody tool for the blockchain.',
            points: [
                `Phantom is a multi-chain wallet that supports ${chainName} (plus Solana, Ethereum, and Bitcoin).`,
                'Choose your preference: Mobile (iOS/Android) or Browser Extension (Chrome, Firefox, Edge).',
                'Install ONLY from the official source: phantom.app — never from ads, search results, or third-party links.',
                'When creating your wallet, Phantom will show a seed phrase (12 words). This is your master key.',
                'Do NOT take photos or screenshots of your seed phrase. Do NOT store it in Notes, cloud storage, email, or any digital file.',
                'Write it on paper and store it in a secure, offline location. Consider a second backup in a separate place.',
                'Enable app lock (biometric or PIN) for daily security.',
            ],
            action: 'Install Phantom from phantom.app, create your wallet, and secure your seed phrase offline.',
            actionLink: 'https://phantom.app',
            checkbox: 'I have installed Phantom and secured my seed phrase offline.',
        },
        {
            id: 4,
            title: 'Find Your Address',
            goal: `Locate your ${c} receive address in Phantom and build the verification habit.`,
            points: [
                `In Phantom, tap "Receive" and select ${chainName} to see your ${c} wallet address.`,
                'Your wallet address is your public identifier — it\'s safe to share (unlike your seed phrase).',
                `Each address is unique to the ${networkLabel}. Always verify you\'re using the correct network.`,
                'Build the habit: before receiving or sending, always double-check the address character by character.',
                'You can copy your address to paste it elsewhere. Never manually type addresses — always copy and verify.',
            ],
            action: `Open Phantom, find your ${c} receive address, and copy it.`,
            checkbox: `I can locate my ${c} receive address in Phantom.`,
        },
        {
            id: 5,
            title: 'First Safe Transaction',
            goal: `Send ${c} from Coinbase to Phantom using the test-send → confirm → full-amount method.`,
            points: [
                `In Coinbase, go to "Send" and paste your Phantom ${c} address.`,
                `CRITICAL: Verify you\'re sending on the ${networkLabel} — selecting the wrong network can lose funds.`,
                'Always send a small test amount first. Wait for it to arrive and confirm in Phantom.',
                'After confirming the test, send the remaining amount.',
                `Fees vary — ${c === 'ETH' ? 'Ethereum gas fees fluctuate with network demand' : c === 'BTC' ? 'Bitcoin fees depend on mempool congestion' : 'Solana fees are typically very low'}.`,
                'Double-check the recipient address every single time. Blockchain transactions are irreversible.',
            ],
            action: 'Send a test amount from Coinbase to Phantom, confirm it, then send the rest.',
            checkbox: `I have completed a test transaction and confirmed it arrived in Phantom.`,
        },
        {
            id: 6,
            title: 'Final Checklist',
            goal: 'Confirm your foundation is complete and you\'re ready to operate independently.',
            points: [
                '✓ Coinbase account created with 2FA enabled.',
                '✓ Phantom installed from official source (phantom.app).',
                '✓ Seed phrase written on paper, stored offline — no photos, no cloud, no email.',
                `✓ Can find and verify your ${c} address in Phantom.`,
                '✓ Completed test-send → confirm → full-amount transaction workflow.',
                '✓ Understand that links should be verified and bookmarked, never clicked from messages.',
            ],
            action: 'Review each item above. If any feel uncertain, revisit that waypoint.',
            checkbox: 'I have completed this voyage.',
        },
    ];
}
