import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Cryptship — Shipping users to on-chain trading — safely and confidently.',
  description: 'Guided onboarding voyages for SOL, ETH, and BTC. Build wallet trading foundations, learn how to read the network, and move safely.',
  keywords: 'crypto, trading, onboarding, solana, ethereum, bitcoin, wallet, education',
  openGraph: {
    title: 'Cryptship — Shipping users to on-chain trading — safely and confidently.',
    description: 'Guided onboarding voyages for SOL, ETH, and BTC.',
    siteName: 'Cryptship',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="ocean-bg" aria-hidden="true"></div>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
