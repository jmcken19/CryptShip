import ChainPage from '@/components/ChainPage';

export const metadata = {
    title: 'SOL Voyage — Cryptship',
    description: 'Learn Solana fundamentals: wallet setup, security, explorer literacy, fees, and safe transactions through a guided onboarding voyage.',
};

export default function SolPage() {
    return <ChainPage chainId="sol" />;
}
