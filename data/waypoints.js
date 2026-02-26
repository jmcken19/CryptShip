export function getWaypoints(chainId, devicePreference = 'both') {
    const chainConfig = chains[chainId];
    const chainName = chainConfig.name;
    const networkLabel = chainConfig.network;
    const c = chainId.toUpperCase();

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
            points: devicePreference === 'mobile' ? [
                'Download the Phantom app from the App Store or Google Play.',
                'Secure your 12-word seed phrase on paper, never digitally.',
                'Enable biometric security (FaceID/Fingerprint) in the app.'
            ] : devicePreference === 'computer' ? [
                'Install the Phantom extension from the Chrome Web Store.',
                'Secure your 12-word seed phrase on paper, never digitally.',
                'Set a strong unlock password for the extension.'
            ] : [
                'Install Phantom on your phone and as a browser extension.',
                'Secure your 12-word seed phrase on paper, never digitally.',
                'You can use the same seed phrase to sync both devices.'
            ],
            action: devicePreference === 'mobile' ? 'Install the Phantom app.' : devicePreference === 'computer' ? 'Install the Phantom extension.' : 'Install Phantom on both mobile and computer.',
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
