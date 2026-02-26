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
                'Visit coinbase.com to create a free account.',
                'Complete identity verification (KYC) as per standard regulations.',
                'Use a unique password and an email you control.'
            ],
            action: 'Create your account at coinbase.com.',
            actionLink: 'https://coinbase.com/join/ZKU75L5?src=referral-link',
            checkbox: 'I have created a Coinbase account.',
        },
        {
            id: 2,
            title: 'Secure + Fund Coinbase',
            goal: 'Enable 2FA and add a small starting balance.',
            points: [
                'Enable two-factor authentication (2FA) using an authenticator app.',
                'Deposit a small amount to your account to learn with.',
                'Never share your login credentials or 2FA codes.'
            ],
            action: 'Enable 2FA and fund your account.',
            checkbox: 'I have enabled 2FA and funded my Coinbase account.',
        },
        {
            id: 3,
            title: 'Download Phantom',
            goal: 'Install Phantom wallet — your self-custody tool.',
            points: [
                'Download the app or extension ONLY from phantom.app.',
                'Secure your 12-word seed phrase on paper, never digitally.',
                'Phantom supports Solana, Ethereum, and Bitcoin.'
            ],
            action: 'Install Phantom and secure your seed phrase offline.',
            actionLink: 'https://phantom.app',
            checkbox: 'I have installed Phantom and secured my seed phrase offline.',
        },
        {
            id: 4,
            title: 'Find Your Address',
            goal: `Locate your ${c} receive address in Phantom.`,
            points: [
                `Tap "Receive" and select ${chainName} to see your address.`,
                'Copy your address; never attempt to type it manually.',
                'Double-check every character before sending or receiving.'
            ],
            action: `Copy your ${c} address from Phantom.`,
            checkbox: `I can locate my ${c} receive address in Phantom.`,
        },
        {
            id: 5,
            title: 'First Safe Transaction',
            goal: `Send a test amount of ${c} from Coinbase to Phantom.`,
            points: [
                'Always send a small test amount first to confirm receipt.',
                'Verify you are using the correct network for the transaction.',
                'Wait for confirmation in Phantom before sending the rest.'
            ],
            action: 'Complete a test transaction from Coinbase to Phantom.',
            checkbox: `I have completed a test transaction and confirmed it arrived.`,
        },
        {
            id: 6,
            title: 'Final Checklist',
            goal: 'Confirm your foundation is complete and ready for trading.',
            points: [
                'Coinbase account secured and funded.',
                'Phantom installed with seed phrase stored offline.',
                'Tested the full-amount transaction workflow successfully.'
            ],
            action: 'Review your steps and you are ready for on-chain trading.',
            checkbox: 'I have completed this voyage.',
        },
    ];
}
