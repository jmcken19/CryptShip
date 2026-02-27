import ChainPage from '@/components/ChainPage';

export const metadata = {
    title: 'BTC Voyage — Cryptship',
    description: 'Learn Bitcoin fundamentals: wallet setup, security, confirmations, and safe transactions through a guided onboarding voyage.',
};

export default function BtcPage() {
    return <ChainPage chainId="btc" />;
}
