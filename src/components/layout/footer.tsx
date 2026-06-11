/**
 * Footer Component
 * Site footer with links and attribution
 */

import * as React from 'react'
import Link from 'next/link'

export function Footer(): JSX.Element {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="mb-2 text-lg font-bold text-primary">EcoSync</h3>
            <p className="text-sm text-muted-foreground">
              Helping individuals understand, track, and reduce their carbon footprint through
              personalized insights and actionable recommendations.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="mb-3 font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/actions"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Actions
                </Link>
              </li>
              <li>
                <Link
                  href="/insights"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div>
            <h4 className="mb-3 font-semibold">Data Sources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>IPCC 2023 - Emission Factors</li>
              <li>EPA GHG Hub</li>
              <li>Our World in Data</li>
              <li>Carbon Trust</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EcoSync. Built for Hack2Skill PromptWars Challenge 3.</p>
          <p className="mt-1">
            Carbon data based on IPCC, EPA, and peer-reviewed research. Not for commercial use.
          </p>
        </div>
      </div>
    </footer>
  )
}
