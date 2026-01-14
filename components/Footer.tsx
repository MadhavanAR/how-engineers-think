'use client';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="footer-text">
          Built by{' '}
          <a
            href="https://github.com/MadhavanAR"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Madhavan
          </a>{' '}
          - <span className="footer-sarcasm">because someone had to</span>
        </p>
        <p className="footer-copyright">
          © {new Date().getFullYear()} MadhavanAR. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
