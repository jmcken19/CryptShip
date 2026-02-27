import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <ul className="footer-links">
                    <li><Link href="/disclaimer">Disclaimer</Link></li>
                    <li><Link href="/disclaimer#privacy">Privacy</Link></li>
                    <li><a href="https://x.com/bigpotdev" target="_blank" rel="noopener noreferrer">Contact</a></li>
                </ul>
                <p className="footer-disclaimer">
                    Cryptship is not investing advice. It teaches wallet setup and safe on-chain trading workflows. You are responsible for any trades and decisions.
                </p>
            </div>
        </footer>
    );
}
