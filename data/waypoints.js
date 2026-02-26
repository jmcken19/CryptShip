import { chains } from './chainConfig';

/**
 * Returns waypoints tailored to chain and device preference.
 * devicePreference: 'mobile' | 'web' | 'both'
 */
export function getWaypoints(chainId, devicePreference = 'both') {
    const chainConfig = chains[chainId] || chains.sol;
    const chainName = chainConfig.name;
    const c = chainConfig.symbol;

    if (chainId === 'sol') {
        const steps = [
            {
                id: 1,
                title: 'Create a Coinbase Account',
                goal: 'Set up a trusted custodial platform as your starting point.',
                commonBullets: [
                    'Visit coinbase.com to create a free account.',
                    'Complete identity verification (KYC).',
                    'Use a unique password and secure email.'
                ],
                action: 'Create your account at coinbase.com.',
                actionLinks: {
                    all: 'https://coinbase.com/join/ZKU75L5?src=referral-link'
                },
                checkbox: 'I have created a Coinbase account.',
            },
            {
                id: 2,
                title: 'Secure + Fund Coinbase',
                goal: 'Enable 2FA and add a small starting balance.',
                commonBullets: [
                    'Enable 2FA using an authenticator app.',
                    'Deposit a small amount to learn with.',
                    'Never share your login or 2FA codes.'
                ],
                action: 'Enable 2FA and fund your account.',
                checkbox: 'I have enabled 2FA and funded my Coinbase account.',
            },
            {
                id: 3,
                title: 'Download Phantom',
                goal: 'Install Phantom wallet — your self-custody tool.',
                commonBullets: [
                    'Secure your 12-word seed phrase on paper, never digitally.'
                ],
                mobileBullets: [
                    'Download Phantom from App Store or Google Play.',
                    'Enable biometric security (FaceID/Fingerprint).'
                ],
                webBullets: [
                    'Install the Phantom extension from the Chrome Web Store.',
                    'Set a strong unlock password for the extension.'
                ],
                action: devicePreference === 'mobile' ? 'Install the Phantom app.' : devicePreference === 'web' ? 'Install the Phantom extension.' : 'Install Phantom on both mobile and web.',
                actionLinks: {
                    mobile: 'https://phantom.app/download',
                    web: 'https://phantom.app/download'
                },
                checkbox: 'I have installed Phantom and secured my seed phrase offline.',
            },
            {
                id: 4,
                title: 'Find Your Address',
                goal: `Locate your ${c} receive address in Phantom.`,
                commonBullets: [
                    `Tap "Receive" and select ${chainName}.`,
                    'Copy your address; never type it manually.',
                    'Double-check every character before sending.'
                ],
                action: `Copy your ${c} address from Phantom.`,
                checkbox: `I can locate my ${c} receive address in Phantom.`,
            },
            {
                id: 5,
                title: 'First Safe Transaction',
                goal: `Send a test amount of ${c} from Coinbase to Phantom.`,
                commonBullets: [
                    'Always send a small test amount first.',
                    'Verify the network is correct for the transaction.',
                    'Wait for confirmation before sending the rest.'
                ],
                action: 'Complete a test transaction from Coinbase to Phantom.',
                checkbox: `I have completed a test transaction and confirmed it arrived.`,
            },
            {
                id: 6,
                title: 'Final Checklist',
                goal: 'Confirm your foundation is complete and ready for trading.',
                commonBullets: [
                    'Coinbase account secured and funded.',
                    'Phantom installed with seed phrase offline.',
                    'Tested the full-amount transaction workflow.'
                ],
                action: 'Review your steps and you are ready for on-chain trading.',
                checkbox: 'I have completed this voyage.',
            },
        ];

        return filterStepsByPreference(steps, devicePreference);
    }

    if (chainId === 'eth') {
        const steps = [
            {
                id: 1,
                title: 'Setup Strategy',
                goal: 'Understand how you will manage your ETH wallet.',
                commonBullets: [
                    'Ethereum works seamlessly across devices.',
                    'Syncing mobile and web ensures availability.'
                ],
                action: 'Review your setup strategy.',
                checkbox: 'I have chosen my setup strategy.',
            },
            {
                id: 2,
                title: 'Download Phantom (ETH)',
                goal: 'Install Phantom — your tool for sending and receiving ETH.',
                commonBullets: [
                    'Phantom supports Ethereum natively alongside Solana.'
                ],
                mobileBullets: [
                    'Download from App Store or Google Play.',
                    'Ensure it is the official Phantom wallet.'
                ],
                webBullets: [
                    'Install the Phantom extension for your browser.',
                    'Keep your browser updated for maximum security.'
                ],
                action: devicePreference === 'mobile' ? 'Install the Phantom app.' : devicePreference === 'web' ? 'Install the Phantom extension.' : 'Install Phantom on both devices.',
                actionLinks: {
                    mobile: 'https://phantom.app/download',
                    web: 'https://phantom.app/download'
                },
                checkbox: 'I have installed Phantom for Ethereum.',
            },
            {
                id: 3,
                title: 'Create Wallet + Backup',
                goal: 'Generate your private keys and secure them offline.',
                commonBullets: [
                    'Secure your 12-word seed phrase on paper, never digitally.',
                    'Do NOT take photos or screenshots of your seed phrase.',
                    'Anyone with this phrase can access your ETH.'
                ],
                action: 'Create your wallet and backup your seed phrase.',
                checkbox: 'I have backed up my seed phrase securely offline.',
            },
            {
                id: 4,
                title: 'Find Your ETH Address',
                goal: 'Locate your public receive address in Phantom.',
                commonBullets: [
                    'Tap "Receive" and select Ethereum to see your address.',
                    'Your ETH address starts with "0x...".',
                    'Double-check characters every time.'
                ],
                action: 'Copy your ETH receive address from Phantom.',
                checkbox: 'I can locate my ETH receive address.',
            },
            {
                id: 5,
                title: 'Safely Fund Your Wallet',
                goal: 'Transfer ETH to your address from a trusted platform.',
                commonBullets: [
                    'Fund by sending ETH from a platform like Coinbase.',
                    'Always double-check the network is set to Ethereum.'
                ],
                action: 'Fund your wallet from a platform like Coinbase.',
                actionLinks: {
                    all: 'https://coinbase.com/join/ZKU75L5?src=referral-link'
                },
                checkbox: 'I understand how to safely fund my wallet.',
            },
            {
                id: 6,
                title: 'Safe Movement Habit',
                goal: 'Develop the habit of test transfers and confirmations.',
                commonBullets: [
                    'Always send a small test amount first.',
                    'Wait for confirmation on the network.',
                    'Verify the test amount arrives before moving more.'
                ],
                action: 'Review your safe send/receive habits.',
                checkbox: 'I have mastered the safe movement checklist.',
            },
        ];

        return filterStepsByPreference(steps, devicePreference);
    }

    if (chainId === 'btc') {
        const steps = [
            {
                id: 1,
                title: 'Trading Environment',
                goal: 'Confirm your active BTC trading platform.',
                commonBullets: [
                    'BTC trading works well on mobile and web.',
                    'CEX.IO offers access for easy trading.',
                ],
                action: 'Access your BTC trading environment.',
                checkbox: 'I have chosen my trading setup.',
            },
            {
                id: 2,
                title: 'Buy BTC Initially (Coinbase)',
                goal: 'Use a common US on-ramp to acquire BTC.',
                commonBullets: [
                    'Coinbase is a high-security on-ramp for US buyers.',
                    'Link a bank account or card to buy BTC easily.',
                ],
                action: 'Buy your initial BTC on Coinbase.',
                actionLinks: {
                    all: 'https://coinbase.com/join/ZKU75L5?src=referral-link'
                },
                checkbox: 'I have acquired initial BTC.',
            },
            {
                id: 3,
                title: 'Trade BTC (CEX.IO)',
                goal: 'Use CEX.IO for active Bitcoin trading.',
                commonBullets: [
                    'CEX.IO is recommended for its trading features.',
                    'Keeps movements fast and low-fee on an exchange.'
                ],
                mobileBullets: [
                    'Use the CEX.IO mobile app for trading on the go.',
                ],
                webBullets: [
                    'Use the CEX.IO web platform for detailed trading view.',
                ],
                action: 'Set up an account on CEX.IO.',
                actionLinks: {
                    mobile: 'https://cex.io/mobile-app',
                    web: 'https://cex.io/'
                },
                checkbox: 'I have set up CEX.IO for trading.',
            },
            {
                id: 4,
                title: 'Security Foundations',
                goal: 'Protect your exchange accounts from unauthorized access.',
                commonBullets: [
                    'Enable authenticator 2FA on all accounts.',
                    'Be alert for phishing or fake support messages.',
                    'Use a strong, unique password for every platform.'
                ],
                action: 'Audit your security settings.',
                checkbox: 'I have enabled 2FA and secured my accounts.',
            },
            {
                id: 5,
                title: 'Concept: Self-Custody',
                goal: 'Understand the concept of holding your own BTC.',
                commonBullets: [
                    'Withdrawing to your own address means full responsibility.',
                    'Self-custody is for long-term storage, not active trading.',
                    'Never store your recovery phrase digitally.'
                ],
                action: 'Study the difference between exchange vs self-custody.',
                checkbox: 'I understand the concept of BTC self-custody.',
            },
            {
                id: 6,
                title: 'Safe Movement Checklist',
                goal: 'Ensure your BTC transfers are verified and correct.',
                commonBullets: [
                    'Verify recipient addresses multiple times.',
                    'Execute a small test send for significant amounts.',
                    'Allow time for BTC network confirmations.'
                ],
                action: 'Review and apply the safe movement checklist.',
                checkbox: 'I am ready to move BTC safely.',
            },
        ];

        return filterStepsByPreference(steps, devicePreference);
    }

    return [];
}

/**
 * Filter and construct waypoint items based on device preference.
 */
function filterStepsByPreference(steps, pref) {
    return steps.map(s => {
        let bullets = [...(s.commonBullets || [])];
        let actionLink = s.actionLinks?.all || null;

        if (pref === 'mobile') {
            bullets = [...bullets, ...(s.mobileBullets || [])];
            actionLink = s.actionLinks?.mobile || s.actionLinks?.all || null;
        } else if (pref === 'web') {
            bullets = [...bullets, ...(s.webBullets || [])];
            actionLink = s.actionLinks?.web || s.actionLinks?.all || null;
        } else {
            // Both
            bullets = [...bullets, ...(s.mobileBullets || []), ...(s.webBullets || [])];
            // If both links exist, we favor the "main" one or handle separately in UI
            // For now, if 'both', and specific links exist, we might need to show a list, 
            // but for simplicity we'll fallback to mobile then web if 'all' missing
            actionLink = s.actionLinks?.all || s.actionLinks?.web || s.actionLinks?.mobile || null;

            // Special case for 'both' link display: if we have both mobile and web specifically,
            // we provide an array so the component can render multiple if needed, or just favor all.
            if (s.actionLinks?.mobile && s.actionLinks?.web && !s.actionLinks?.all) {
                actionLink = [
                    { label: 'Mobile App', url: s.actionLinks.mobile },
                    { label: 'Web / Extension', url: s.actionLinks.web }
                ];
            }
        }

        // Limit bullets for mobile/web to 3, both to 5
        const limit = (pref === 'both') ? 5 : 3;
        bullets = bullets.slice(0, limit);

        return {
            id: s.id,
            title: s.title,
            goal: s.goal,
            points: bullets,
            action: s.action,
            actionLink: actionLink,
            checkbox: s.checkbox
        };
    });
}
