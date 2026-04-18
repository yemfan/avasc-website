import type { Metadata } from "next";
import Link from "next/link";

/**
 * [REQUIRES LEGAL REVIEW]
 *
 * TOM validation report CR-006: avasc.org had no /privacy page. This matters
 * because the site collects scam reports (sensitive victim narratives), SMS
 * phone numbers with TCPA-regulated consent, email subscriptions, donation
 * information, and user accounts. Missing privacy policy is a legal-
 * compliance failure.
 *
 * This scaffold covers every topic a privacy policy for a victim-support
 * nonprofit must address. None of it is legal advice. Before public launch,
 * replace with counsel-reviewed copy or a generator-produced policy
 * (Termly / Iubenda / TermsFeed) tailored to:
 *   - Victim-report data (sensitive + special-category in the EU sense)
 *   - SMS via Twilio + TCPA consent
 *   - Email via SendGrid / Resend + CAN-SPAM
 *   - Donation processing via Stripe / PayPal
 *   - CCPA/CPRA + GDPR rights
 *   - 501(c)(3) Pending disclosure tied to donation data
 *
 * Anchor ids for #cookies and #ccpa are referenced by the global footer.
 * Keep them stable.
 */

const LAST_UPDATED = "April 17, 2026";
const CONTACT_EMAIL = "privacy@avasc.org";

export const metadata: Metadata = {
  title: "Privacy Policy | AVASC",
  description:
    "How AVASC collects, uses, shares, and protects personal information — including victim reports, SMS alerts, and donation data.",
  alternates: { canonical: "/privacy" },
  keywords: ["privacy policy", "AVASC", "victim data", "GDPR", "CCPA"],
};

const SECTIONS: { id: string; title: string; body: React.ReactNode }[] = [
  {
    id: "introduction",
    title: "1. Introduction",
    body: (
      <>
        <p>
          The Association of Victims Against Cyber-Scams (&ldquo;AVASC,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates avasc.org
          and provides scam reporting, pattern intelligence, alert subscriptions, and
          victim-support resources (the &ldquo;Service&rdquo;). This Privacy Policy
          explains what information we collect, how we use and share it, and the
          choices you have.
        </p>
        <p>
          AVASC is a California nonprofit organization. AVASC is <strong>not</strong> a
          law firm, investigator, or government agency, and does not guarantee recovery
          of funds. Using the Service does not create an attorney-client or
          investigator-client relationship.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "2. Information we collect",
    body: (
      <>
        <p>We collect three buckets of information:</p>
        <ul>
          <li>
            <strong>Scam reports you submit</strong> — free-text description of what
            happened, scam type, estimated amount lost, optional file attachments, and
            optional contact information. Reports may include highly sensitive personal
            details. AVASC strongly advises that you never submit passwords, full card
            numbers, SSNs, or government-ID numbers in a report.
          </li>
          <li>
            <strong>Account and contact information</strong> — if you create an account
            or subscribe to alerts: name, email, phone number (when you opt in to SMS),
            and any preferences you save.
          </li>
          <li>
            <strong>Usage and device information</strong> — pages viewed, features used,
            IP address, approximate location derived from IP, browser and device
            identifiers, session duration, and error diagnostics.
          </li>
        </ul>
        <p>
          [REQUIRES LEGAL REVIEW] Confirm whether victim-report free-text should be
          treated as special-category data under GDPR (health / criminal allegations
          common) and whether that triggers additional safeguards.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use",
    title: "3. How we use information",
    body: (
      <>
        <p>We use the information above to:</p>
        <ul>
          <li>
            Process, triage, and — if approved by moderators — anonymize and publish
            scam patterns to help others recognize and avoid similar fraud.
          </li>
          <li>
            Deliver alert messages (SMS or email) to subscribers who have opted in, per
            their preferences.
          </li>
          <li>Provide victim-support resources and respond to inquiries.</li>
          <li>Detect and prevent abuse of the Service.</li>
          <li>
            Share aggregated, de-identified insights with law enforcement, regulators,
            and the public to help combat scams.
          </li>
          <li>
            Communicate with donors and subscribers about program impact and AVASC news
            (only when you have opted in).
          </li>
          <li>Comply with legal obligations.</li>
        </ul>
        <p>
          [REQUIRES LEGAL REVIEW] Confirm whether victim reports are ever used to
          train AI classifiers, and if so disclose with an opt-out path consistent with
          GDPR Article 22 and CCPA profiling rules.
        </p>
      </>
    ),
  },
  {
    id: "publication",
    title: "4. What gets published publicly",
    body: (
      <>
        <p>
          Approved scam patterns are published on AVASC&apos;s public database in an{" "}
          <strong>anonymized</strong> form. Specifically:
        </p>
        <ul>
          <li>Reporter name, email, and phone are never published.</li>
          <li>
            Free-text reports are reviewed by moderators and edited to remove
            identifying details, scam-artist contact information that could endanger
            reporters, and any password / card / SSN content that slipped through.
          </li>
          <li>
            You can ask to withdraw or amend a report at any time by emailing{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-avasc-gold-light underline">
              {CONTACT_EMAIL}
            </a>
            .
          </li>
        </ul>
        <p>
          [REQUIRES LEGAL REVIEW] Define moderator workflow + retention of rejected
          reports, and confirm the defamation posture for user-submitted allegations.
        </p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "5. How we share information",
    body: (
      <>
        <p>We share information only with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> — hosting (Vercel), database (Supabase),
            SMS delivery (Twilio), email delivery (SendGrid / Resend), payment
            processing (Stripe, PayPal), and analytics (where you have opted in).
          </li>
          <li>
            <strong>Law enforcement</strong> — we may share scam reports with the FTC,
            FBI IC3, state attorneys general, or other authorities when required by
            law, subpoena, or court order, or when we believe sharing is necessary to
            protect against imminent harm.
          </li>
          <li>
            <strong>Aggregated public reporting</strong> — de-identified, aggregated
            statistics may be shared with the public, press, researchers, and
            policymakers.
          </li>
          <li>
            <strong>Business transfers</strong> — in connection with a merger or
            transfer of the nonprofit&apos;s assets.
          </li>
        </ul>
        <p>
          We do <strong>not</strong> sell personal information.
        </p>
      </>
    ),
  },
  {
    id: "sms-email-compliance",
    title: "6. SMS and email alerts",
    body: (
      <>
        <p>
          AVASC sends SMS and email alerts only to subscribers who have expressly opted
          in. Every SMS message complies with the Telephone Consumer Protection Act
          (47 U.S.C. § 227) and FCC rules; every marketing email complies with the
          CAN-SPAM Act. STOP / UNSUBSCRIBE / HELP keywords work as expected and are
          honored immediately.
        </p>
        <p>
          You can manage your alert preferences at{" "}
          <Link href="/alerts/preferences" className="text-avasc-gold-light underline">
            /alerts/preferences
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "7. Cookies and tracking",
    body: (
      <>
        <p>We use cookies and similar technologies in four categories:</p>
        <ul>
          <li>
            <strong>Strictly necessary</strong> — keeps you signed in, remembers
            preferences, prevents CSRF. Always on; required for the site to work.
          </li>
          <li>
            <strong>Functional</strong> — remembers UI preferences. On by default; can
            be disabled in your browser.
          </li>
          <li>
            <strong>Analytics</strong> — aggregated usage and performance data. Off
            unless you opt in via the consent banner.
          </li>
          <li>
            <strong>Advertising / marketing</strong> — currently none; AVASC does not
            run advertising. This category is reserved.
          </li>
        </ul>
        <p>
          [REQUIRES LEGAL REVIEW] Wire a cookie consent banner for EU / California
          visitors. Pattern exists on the leadsmart-ai repo and can be ported.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "8. Your rights",
    body: (
      <>
        <p>Depending on where you live, you may have the right to:</p>
        <ul>
          <li>Access the personal information we hold about you.</li>
          <li>Correct inaccurate information.</li>
          <li>Delete your account and associated personal information.</li>
          <li>Export your data in a portable format.</li>
          <li>Withdraw consent to marketing communications.</li>
          <li>
            Opt out of any &ldquo;sale&rdquo; or &ldquo;sharing&rdquo; of personal
            information as defined under CCPA / CPRA (we do not believe we engage in
            either).
          </li>
        </ul>
        <p>
          Exercise any right by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-avasc-gold-light underline">
            {CONTACT_EMAIL}
          </a>
          . We respond within the timeframes required by applicable law.
        </p>
      </>
    ),
  },
  {
    id: "ccpa",
    title: "9. California residents — CCPA / CPRA",
    body: (
      <>
        <p>
          If you are a California resident, you have additional rights under the CCPA
          and CPRA:
        </p>
        <ul>
          <li>
            <strong>Right to know</strong> the categories of personal information we
            have collected, sources, purposes, and third parties we share with.
          </li>
          <li>
            <strong>Right to delete</strong> personal information, with limited
            exceptions.
          </li>
          <li>
            <strong>Right to correct</strong> inaccurate personal information.
          </li>
          <li>
            <strong>Right to limit use</strong> of sensitive personal information.
          </li>
          <li>
            <strong>Right to opt out of sale or sharing</strong> — AVASC does not sell
            or share personal information. If this ever changes we will provide a
            &ldquo;Do Not Sell or Share&rdquo; link.
          </li>
          <li>
            <strong>Right to non-discrimination</strong> — we will not retaliate for
            exercising these rights.
          </li>
        </ul>
        <p>
          To submit a request, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-avasc-gold-light underline">
            {CONTACT_EMAIL}
          </a>{" "}
          with the subject &ldquo;CCPA request.&rdquo;
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "10. Retention",
    body: (
      <>
        <p>
          We retain scam reports indefinitely as anonymized pattern data (deletions
          erase linkage to the reporter but may leave the anonymized pattern in the
          database if others have relied on it). Account information is retained while
          the account is active; deletion removes or anonymizes personal information
          within 90 days, except where retention is required by law (donation records
          for tax purposes, SMS consent proof for TCPA).
        </p>
        <p>
          [REQUIRES LEGAL REVIEW] Confirm retention windows per data category.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "11. Security",
    body: (
      <>
        <p>
          We apply industry-standard safeguards: encryption in transit (TLS) and at
          rest, access controls, audit logging, and regular security reviews. Reports
          containing sensitive details are stored in access-controlled systems
          separate from public data. If you discover a security issue, please email{" "}
          <a href="mailto:security@avasc.org" className="text-avasc-gold-light underline">
            security@avasc.org
          </a>{" "}
          before public disclosure.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "12. Children",
    body: (
      <>
        <p>
          The Service is not directed to children under 16. We do not knowingly
          collect personal information from children. If a child has submitted a
          report, parent / guardian contact at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-avasc-gold-light underline">
            {CONTACT_EMAIL}
          </a>{" "}
          to have it removed.
        </p>
      </>
    ),
  },
  {
    id: "changes",
    title: "13. Changes to this policy",
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time. Material changes will
          be notified via email or a prominent notice at least 30 days before they
          take effect.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "14. Contact",
    body: (
      <>
        <p>
          Questions about this Privacy Policy can be directed to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-avasc-gold-light underline">
            {CONTACT_EMAIL}
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

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 text-[var(--avasc-text-primary)]">
      <div className="mb-6 rounded-lg border border-[var(--avasc-gold)]/30 bg-[var(--avasc-gold)]/[0.06] p-3 text-xs text-[var(--avasc-gold-light)]">
        <strong>Notice:</strong> This page is a pre-launch scaffold. It covers the
        topics a real privacy policy must address but is <strong>not legal advice</strong>
        {" "}and must be replaced with counsel-reviewed or generator-produced copy before
        collecting additional victim data at scale.
      </div>

      <h1 className="text-3xl font-medium tracking-tight text-white mb-2">Privacy Policy</h1>
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
        <Link href="/terms" className="text-avasc-gold-light hover:underline">
          Terms of Service
        </Link>
        .{" "}
        <Link href="/" className="ml-2 text-avasc-gold-light hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
