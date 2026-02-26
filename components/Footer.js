import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <ul className="footer-links">
                    <li><Link href="/disclaimer">Disclaimer</Link></li>
                    <li><Link href="/disclaimer#privacy">Privacy</Link></li>
                    <li><a href="mailto:contact@cryptship.com">Contact</a></li>
                </ul>
                <p className="footer-disclaimer">
                    Educational only — not financial advice. Cryptship provides learning resources to help users understand blockchain technology. Always do your own research.
                </p>
            </div>
        </footer>
    );
}
