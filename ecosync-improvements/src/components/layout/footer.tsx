import * as React from 'react'
import { Leaf, Github, Twitter, Mail } from 'lucide-react'

export function Footer(): JSX.Element {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t bg-muted/50"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold text-primary">
              <Leaf className="h-5 w-5" aria-hidden="true" />
              <span>EcoSync</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Helping individuals understand, track, and reduce their carbon footprint through data-driven insights.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: '/onboarding', label: 'Calculate Footprint' },
                { href: '/dashboard', label: 'Dashboard' },
                { href: '/actions', label: 'Action Library' },
                { href: '/insights', label: 'Insights' },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              {[
                { href: 'https://www.ipcc.ch/', label: 'IPCC Reports', external: true },
                { href: 'https://www.epa.gov/ghgreporting', label: 'EPA GHG Hub', external: true },
                { href: 'https://ourworldindata.org/co2-emissions', label: 'Our World in Data', external: true },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                    {link.external && (
                      <span className="sr-only"> (opens in new tab)</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Data Sources
            </h3>
            <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
              Emission factors based on IPCC 2023 Assessment Reports, EPA Greenhouse Gas Reporting Program, 
              Carbon Trust research, and peer-reviewed scientific literature. Regional adjustments use 
              World Bank and UN data.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EcoSync. Built for Hack2Skill PromptWars Challenge 3.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/namanraii/EcoSync"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="GitHub repository (opens in new tab)"
            >
              <Github className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Twitter (opens in new tab)"
            >
              <Twitter className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href="mailto:contact@ecosync.app"
              className="text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Send email"
            >
              <Mail className="h-5 w-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
