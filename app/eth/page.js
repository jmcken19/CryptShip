import ChainPage from '@/components/ChainPage';

export const metadata = {
    title: 'ETH Voyage — Cryptship',
    description: 'Learn Ethereum fundamentals: wallet setup, security, gas fees, explorer literacy, and safe transactions through a guided onboarding voyage.',
};

export default function EthPage() {
    return <ChainPage chainId="eth" />;
}
