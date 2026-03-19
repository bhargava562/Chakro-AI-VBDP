import { Sparkles } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'API Docs'],
  Company: ['About Us', 'Careers', 'Blog', 'Press'],
  Resources: ['Documentation', 'Help Center', 'Community', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'MSME Compliance'],
};

export function FooterSection() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-5 gap-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-card">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-[var(--text-primary)]">Chakro AI</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              AI-powered business development partner for Indian MSMEs. Privacy-first. Transparent AI.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-[var(--text-primary)] mb-6 tracking-wide">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all duration-200 hover:translate-x-1 inline-block"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--text-tertiary)]">
            © 2026 Chakro AI. Built for Indian MSMEs, with ❤️
          </p>
          <p className="text-xs text-[var(--text-tertiary)]">
            Making public procurement accessible to every business.
          </p>
        </div>
      </div>
    </footer>
  );
}
