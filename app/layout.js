import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Cryptship — Shipping Users to the Blockchain',
  description: 'Guided onboarding voyages for SOL, ETH, and BTC. Build wallet fundamentals, learn how to read the network, and move safely.',
  keywords: 'crypto, blockchain, onboarding, solana, ethereum, bitcoin, wallet, education',
  openGraph: {
    title: 'Cryptship — Shipping Users to the Blockchain',
    description: 'Guided onboarding voyages for SOL, ETH, and BTC.',
    siteName: 'Cryptship',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="ocean-bg" aria-hidden="true">
          <div className="wave-container">
            <div className="wave" />
            <div className="wave" />
            <div className="wave" />
          </div>
        </div>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
