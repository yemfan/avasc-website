import type { Metadata } from "next";
import Link from "next/link";

/**
 * [REQUIRES LEGAL REVIEW]
 *
 * TOM validation report CR-006: avasc.org had no /terms page. Scaffold covers
 * what a victim-support nonprofit ToS should address: acceptable use of the
 * report form, what AVASC is and is not (not a law firm / investigator /
 * government agency), defamation and moderation posture for user-submitted
 * content, donation terms, AI-output disclaimers, liability cap.
 *
 * None of it is legal advice. Replace with counsel-reviewed or
 * generator-produced copy before paid launch or scaled public use.
 *
 * Sections still marked "[REQUIRES LEGAL REVIEW]" are gaps — especially
 * liability caps, arbitration/venue, and the defamation posture which
 * varies materially by jurisdiction.
 */

const LAST_UPDATED = "April 17, 2026";
const LEGAL_EMAIL = "legal@avasc.org";

export const metadata: Metadata = {
  title: "Terms of Service | AVASC",
  description:
    "Terms governing use of the AVASC website — scam reporting, alerts, donations, and what AVASC is and is not.",
  alternates: { canonical: "/terms" },
  keywords: ["terms of service", "AVASC", "acceptable use"],
};

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "agreement",
    title: "1. Agreement to these terms",
    body: (
      <>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of
          avasc.org and the AVASC Service (the &ldquo;Service&rdquo;) provided by the
          Association of Victims Against Cyber-Scams (&ldquo;AVASC,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By using the
          Service you agree to these Terms and our{" "}
          <Link href="/privacy" className="text-avasc-gold-light underline">
            Privacy Policy
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "what-we-are-not",
    title: "2. What AVASC is and is not",
    body: (
      <>
        <p>
          AVASC is a California nonprofit organization (501(c)(3) status pending) that
          collects scam reports, identifies patterns, publishes anonymized public
          resources, and supports victims with guidance and referrals.
        </p>
        <p>
          AVASC is <strong>not</strong>:
        </p>
        <ul>
          <li>A law firm or legal service.</li>
          <li>A licensed investigator or private detective.</li>
          <li>A government agency.</li>
          <li>A recovery or fund-retrieval service.</li>
        </ul>
        <p>
          Using the Service does not create an attorney-client or investigator-client
          relationship. We cannot guarantee recovery of lost funds and will never ask
          for an upfront fee to &ldquo;recover&rdquo; your money. If someone claiming
          to be from AVASC ever does, it&apos;s a scam — report them to{" "}
          <a href="mailto:security@avasc.org" className="text-avasc-gold-light underline">
            security@avasc.org
          </a>
          .
        </p>
      </>
    ),
  },
  {
    id: "eligibility",
    title: "3. Eligibility",
    body: (
      <>
        <p>
          You must be at least 18 years old to create an account or submit a report.
          If you are a parent or guardian of a minor who was scammed, you may submit a
          report on their behalf.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "4. Acceptable use",
    body: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Submit reports you know to be false, misleading, or retaliatory.</li>
          <li>
            Submit passwords, full card numbers, government-ID numbers, or other
            sensitive credentials in public report fields.
          </li>
          <li>Impersonate another person or misrepresent your affiliation.</li>
          <li>
            Use the Service to harass, defame, or target anyone who is not actually
            suspected of a scam.
          </li>
          <li>
            Scrape, bulk-download, or redistribute published scam data beyond fair-use
            journalistic or research excerpts with attribution.
          </li>
          <li>Attempt to probe or circumvent the Service&apos;s security.</li>
        </ul>
        <p>
          We may suspend or remove accounts, reports, or stories for violations.
        </p>
      </>
    ),
  },
  {
    id: "reports",
    title: "5. Scam reports you submit",
    body: (
      <>
        <p>
          When you submit a scam report:
        </p>
        <ul>
          <li>You retain ownership of the information you provide.</li>
          <li>
            You grant AVASC a worldwide, royalty-free license to review, anonymize,
            categorize, and publish the report as part of public scam-pattern data.
          </li>
          <li>
            AVASC moderators review each report before public publication and edit
            for accuracy, privacy, and safety. We reserve the right not to publish.
          </li>
          <li>
            You can withdraw or amend your report at any time by emailing{" "}
            <a
              href="mailto:privacy@avasc.org"
              className="text-avasc-gold-light underline"
            >
              privacy@avasc.org
            </a>
            . Anonymized patterns already incorporated into public data may remain
            after individual-report withdrawal.
          </li>
          <li>
            You represent that the factual content of your report is accurate to the
            best of your knowledge.
          </li>
        </ul>
        <p>
          [REQUIRES LEGAL REVIEW] Defamation posture: user-submitted reports accusing
          named individuals/businesses of fraud carry defamation exposure even after
          moderation. Counsel should confirm the moderation SOP and any Section 230
          reliance.
        </p>
      </>
    ),
  },
  {
    id: "donations",
    title: "6. Donations",
    body: (
      <>
        <ul>
          <li>
            AVASC accepts donations through third-party processors (Stripe, PayPal).
            Those processors have their own terms and privacy policies.
          </li>
          <li>
            Donations are currently <strong>not tax-deductible</strong> because
            AVASC&apos;s IRS 501(c)(3) determination is pending. We&apos;ll update this
            when status changes. See the{" "}
            <Link href="/donate" className="text-avasc-gold-light underline">
              donation page FAQ
            </Link>{" "}
            for details.
          </li>
          <li>
            Recurring donations can be cancelled any time from your processor account
            or by emailing{" "}
            <a href="mailto:give@avasc.org" className="text-avasc-gold-light underline">
              give@avasc.org
            </a>
            .
          </li>
          <li>Donations are non-refundable except where required by law.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ai-output",
    title: "7. AI-generated content",
    body: (
      <>
        <p>
          Portions of the Service use AI to summarize reports, suggest tags, or
          generate safety guidance. AI output is informational and may contain errors.
          It is <strong>not</strong> legal, financial, or investigative advice. Verify
          anything important with a qualified professional or an authoritative source
          (the{" "}
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-avasc-gold-light underline"
          >
            FTC
          </a>
          ,{" "}
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-avasc-gold-light underline"
          >
            FBI IC3
          </a>
          ,{" "}
          <a
            href="https://www.identitytheft.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-avasc-gold-light underline"
          >
            IdentityTheft.gov
          </a>
          ).
        </p>
      </>
    ),
  },
  {
    id: "our-ip",
    title: "8. Our intellectual property",
    body: (
      <>
        <p>
          The Service, including the AVASC name, logo, site design, software, and
          non-user-contributed content, is owned by AVASC or our licensors. Using the
          Service does not transfer those rights. Attribution-based journalistic or
          academic use of published anonymized data is welcome; contact us first for
          commercial use.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers",
    title: "9. Disclaimers",
    body: (
      <>
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind.
          AVASC does not warrant that the Service will be uninterrupted, free of
          errors, or that any report or alert will lead to a particular outcome.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "10. Limitation of liability",
    body: (
      <>
        <p>
          To the maximum extent permitted by law, AVASC&apos;s aggregate liability for
          any claim arising out of or related to these Terms or the Service will not
          exceed one hundred U.S. dollars ($100).
        </p>
        <p>
          In no event will AVASC be liable for indirect, incidental, special,
          consequential, or exemplary damages arising from your use of the Service.
        </p>
        <p>
          [REQUIRES LEGAL REVIEW] A victim-support nonprofit should think carefully
          about carve-outs here — especially for gross negligence or willful
          misconduct. Counsel should confirm.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "11. Changes to these Terms",
    body: (
      <>
        <p>
          We may update these Terms from time to time. Material changes will be
          notified via email or a prominent notice in the Service at least 30 days
          before they take effect.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "12. Governing law",
    body: (
      <>
        <p>
          [REQUIRES LEGAL REVIEW] These Terms are governed by the laws of California,
          without regard to conflict-of-laws principles. Disputes will be resolved in
          the state or federal courts located in Los Angeles County, California,
          except where prohibited by law.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "13. Contact",
    body: (
      <>
        <p>
          Questions about these Terms can be directed to{" "}
          <a href={`mailto:${LEGAL_EMAIL}`} className="text-avasc-gold-light underline">
            {LEGAL_EMAIL}
          </a>
          .
        </p>
        <p className="text-xs text-[var(--avasc-text-muted)]">
          Association of Victims Against Cyber-Scams · Los Angeles, California · 501(c)(3) Pending
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-[var(--avasc-text-primary)]">
      <div className="mb-6 rounded-lg border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-3 text-xs text-[var(--avasc-gold-light)]">
        <strong>Notice:</strong> This page is a pre-launch scaffold. It covers standard
        nonprofit topics but is <strong>not legal advice</strong> and must be replaced
        with counsel-reviewed copy before scaled public use.
      </div>

      <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Terms of Service</h1>
      <p className="text-sm text-[var(--avasc-text-muted)] mb-8">Last updated: {LAST_UPDATED}</p>

      <nav
        aria-label="Table of contents"
        className="mb-10 rounded-lg border border-white/[0.08] bg-white/[0.02] p-4"
      >
        <div className="text-[11px] font-semibold uppercase tracking-wide text-[var(--avasc-text-muted)] mb-2">
          Contents
        </div>
        <ol className="list-decimal list-inside space-y-1 text-sm text-[var(--avasc-text-secondary)]">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-avasc-gold-light hover:underline">
                {s.title.replace(/^\d+\.\s*/, "")}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <article className="space-y-8 text-[var(--avasc-text-secondary)]">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-20">
            <h2 className="text-xl font-medium text-white mb-3">{s.title}</h2>
            <div className="space-y-3 leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mt-3 [&_strong]:text-white">
              {s.body}
            </div>
          </section>
        ))}
      </article>

      <div className="mt-12 border-t border-white/[0.06] pt-6 text-sm text-[var(--avasc-text-muted)]">
        See also our{" "}
        <Link href="/privacy" className="text-avasc-gold-light hover:underline">
          Privacy Policy
        </Link>
        .{" "}
        <Link href="/" className="ml-2 text-avasc-gold-light hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
