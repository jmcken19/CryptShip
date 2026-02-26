export const metadata = {
    title: 'Disclaimer & Privacy — Cryptship',
    description: 'Educational disclaimer and privacy information for Cryptship.',
};

export default function DisclaimerPage() {
    return (
        <div className="page-container">
            <div className="disclaimer-page">
                <h1>Disclaimer & Privacy</h1>

                <h2>Educational Disclaimer</h2>
                <p>
                    Cryptship is an educational platform designed to help users learn about blockchain
                    technology, cryptocurrency wallets, and on-chain transactions. All content provided
                    on this website is for informational and educational purposes only.
                </p>
                <p>
                    <strong>This is not financial advice.</strong> Nothing on Cryptship should be
                    construed as investment advice, financial guidance, or a recommendation to buy,
                    sell, or hold any cryptocurrency or digital asset.
                </p>
                <p>
                    Cryptocurrency involves significant risk, including the potential loss of all
                    invested capital. Users should:
                </p>
                <ul>
                    <li>Conduct their own research before making any financial decisions.</li>
                    <li>Consult with qualified financial advisors for personalized advice.</li>
                    <li>Understand that past performance does not guarantee future results.</li>
                    <li>Only invest what they can afford to lose.</li>
                </ul>

                <h2>Accuracy of Information</h2>
                <p>
                    While we strive to provide accurate and up-to-date information, Cryptship makes
                    no warranties or representations about the completeness, accuracy, or reliability
                    of any content. Market data is sourced from third-party APIs and may be delayed
                    or inaccurate.
                </p>

                <h2>No Liability</h2>
                <p>
                    Cryptship, its creators, and contributors shall not be held liable for any losses,
                    damages, or claims arising from the use of this platform or reliance on its content.
                    Users interact with blockchain networks at their own risk.
                </p>

                <h2 id="privacy">Privacy Policy</h2>
                <p>
                    Cryptship respects your privacy. Here&apos;s what we collect and how we use it:
                </p>
                <ul>
                    <li>
                        <strong>Account data:</strong> If you create an account, we store your email
                        and hashed password. We never store plain-text passwords.
                    </li>
                    <li>
                        <strong>Progress data:</strong> Your voyage completion status is stored to
                        provide continuity across sessions and devices.
                    </li>
                    <li>
                        <strong>No tracking:</strong> We do not use third-party analytics or advertising
                        trackers.
                    </li>
                    <li>
                        <strong>No selling:</strong> We never sell, rent, or share your personal
                        information with third parties.
                    </li>
                    <li>
                        <strong>Cookies:</strong> We use a single HTTP-only authentication cookie
                        to maintain your login session. No tracking cookies.
                    </li>
                </ul>

                <h2>Contact</h2>
                <p>
                    For questions or concerns, reach out at{' '}
                    <a href="mailto:contact@cryptship.com">contact@cryptship.com</a>.
                </p>

                <p style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(45, 212, 191, 0.1)' }}>
                    <em>Last updated: February 2026</em>
                </p>
            </div>
        </div>
    );
}
