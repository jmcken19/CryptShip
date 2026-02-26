import Hero from '@/components/Hero';
import MarketSnapshot from '@/components/MarketSnapshot';
import Headlines from '@/components/Headlines';
import VoyageCTA from '@/components/VoyageCTA';
import DevBio from '@/components/DevBio';
import Donate from '@/components/Donate';

export const metadata = {
  title: 'Cryptship — Shipping users to on-chain trading — safely and confidently.',
  description: 'Guided onboarding voyages for SOL, ETH, and BTC. Learn how to set up and fund a wallet for trading.',
};

export default function HomePage() {
  return (
    <div className="page-container">
      <Hero />
      <VoyageCTA />
      <MarketSnapshot />
      <Headlines />
      <DevBio />
      <Donate />
    </div>
  );
}
