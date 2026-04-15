import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Social Media Scams: How to Stay Safe on Facebook, Instagram, and TikTok | AVASC",
  description:
    "Learn to recognize fake giveaways, impersonation accounts, marketplace fraud, QR code scams, and clickbait links on social media platforms.",
  openGraph: {
    title: "Social Media Scams: How to Stay Safe on Facebook, Instagram, and TikTok | AVASC",
    description:
      "Learn to recognize fake giveaways, impersonation accounts, marketplace fraud, QR code scams, and clickbait links on social media platforms.",
    type: "article",
    url: "https://avasc.org/guides/social-media-scams",
  },
  twitter: {
    card: "summary",
  },
  alternates: {
    canonical: "/guides/social-media-scams",
  },
};

export default function SocialMediaScamsPage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Social Media Scams: How to Stay Safe on Facebook, Instagram, and TikTok",
    description:
      "Learn to recognize fake giveaways, impersonation accounts, marketplace fraud, QR code scams, and clickbait links on social media platforms.",
    author: {
      "@type": "Organization",
      name: "AVASC",
      url: "https://avasc.org",
    },
    datePublished: "2025-01-01",
    publisher: {
      "@type": "Organization",
      name: "AVASC",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://avasc.org",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://avasc.org/guides",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Social Media Scams",
        item: "https://avasc.org/guides/social-media-scams",
      },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Link
        href="/guides"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to guides
      </Link>

      <header className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Social Media Scams: How to Stay Safe on Facebook, Instagram, and TikTok
        </h1>
        <p className="text-base leading-relaxed text-slate-600">
          Social media platforms are ideal hunting grounds for scammers. Billions of users, limited oversight, and the ease of creating fake accounts and impersonating legitimate businesses make platforms ripe for fraud. Here's how to protect yourself.
        </p>
      </header>

      <div className="space-y-8">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Why Social Media Attracts Scammers</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers target social media because:
          </p>

          <ul className="space-y-2 text-slate-700">
            <li>• <span className="font-medium">Large, diverse audiences:</span> Billions of users with varying tech literacy.</li>
            <li>• <span className="font-medium">Easy account creation:</span> Fake accounts are simple to set up and difficult to verify.</li>
            <li>• <span className="font-medium">Limited verification:</span> Unlike banks, platforms have minimal identity verification.</li>
            <li>• <span className="font-medium">Marketplace integration:</span> Buying and selling features enable transaction fraud.</li>
            <li>• <span className="font-medium">Trust and engagement:</span> People are more trusting within social connections.</li>
            <li>• <span className="font-medium">Algorithm exploitation:</span> Scammers can target specific demographics and interests.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Fake Giveaway and Contest Scams</h2>
          <p className="text-slate-700 leading-relaxed">
            One of the most common scams on social media. Scammers create fake versions of popular brands or celebrities offering "free" giveaways.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How it works</h3>
            <ol className="mt-3 list-decimal space-y-3 pl-5 text-slate-700">
              <li><span className="font-medium">Impersonation:</span> Create a page that looks like a popular brand (Apple, Nike, Amazon, etc.)</li>
              <li><span className="font-medium">Attractive offer:</span> Promise a luxury item or cash ("Tag 5 friends to win a free iPhone 15!")</li>
              <li><span className="font-medium">Engagement:</span> Users comment and share, spreading the scam</li>
              <li><span className="font-medium">The hook:</span> "Message us or click here to verify you're a real person"</li>
              <li><span className="font-medium">Data harvesting:</span> Collect personal information, payment details, or malware</li>
            </ol>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">How to spot fake giveaways</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-red-950/90">
              <li>Check the page's verification status (blue checkmark on verified accounts)</li>
              <li>Look at when the page was created (many giveaway scams are new pages)</li>
              <li>Check the number of followers (fake pages often have low engagement despite large follower counts)</li>
              <li>Read the comments (scammers often use fake accounts to comment positively)</li>
              <li>Real brands rarely ask you to "click here" or "message to verify"</li>
              <li>If it seems too good to be true, it is</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">What to do if you interact with a fake giveaway</h3>
            <p className="mt-2 text-slate-700">
              If you've already commented or shared, change your passwords (especially if you use the same password across accounts). Monitor your accounts for unusual activity. Report the page to the platform.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Impersonation and Fake Accounts</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers create accounts pretending to be celebrities, influencers, or businesses to manipulate followers.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Common impersonation tactics</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Cloning a real account name with a similar username (e.g., @real_elon instead of @elonmusk)</li>
              <li>Creating an account claiming to be a celebrity "official account"</li>
              <li>Impersonating customer service accounts</li>
              <li>Copying photos, bios, and content from the real account</li>
              <li>Messaging followers claiming to offer opportunities or asking for payment</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to identify real vs. fake accounts</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li><span className="font-medium">Verification badge:</span> Look for the blue checkmark (though scammers sometimes fake this)</li>
              <li><span className="font-medium">Account age:</span> Click on the account to see when it was created. Real accounts are usually older.</li>
              <li><span className="font-medium">Content and engagement:</span> Real accounts have diverse, authentic content and real engagement (not just bot comments)</li>
              <li><span className="font-medium">Follower patterns:</span> Real accounts grow gradually. Fake ones may have sudden follower spikes.</li>
              <li><span className="font-medium">Bio and links:</span> Check if the bio matches the real person's known information</li>
              <li><span className="font-medium">Direct message requests:</span> Real celebrities rarely DM followers with opportunities</li>
            </ul>
          </Card>

          <Card className="border-red-200 bg-red-50/80 p-6">
            <h3 className="font-semibold text-red-950">Critical rule: Real celebrities and brands don't DM you with offers</h3>
            <p className="mt-3 text-red-950/90">
              If someone claiming to be a celebrity or influencer DMs you offering a job, money, or an exclusive opportunity, it's fake. Real opportunities come through official channels, not random DMs.
            </p>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Marketplace Fraud</h2>
          <p className="text-slate-700 leading-relaxed">
            Facebook Marketplace, Instagram Shopping, and similar features enable buying and selling directly in the app. This creates opportunities for fraud.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Common marketplace scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li><span className="font-medium">Non-delivery:</span> Buyer sends money, seller disappears without sending the item</li>
              <li><span className="font-medium">Counterfeit goods:</span> Seller offers luxury items at unrealistic prices, ships fakes</li>
              <li><span className="font-medium">Payment method switching:</span> Agrees to use the platform's payment system, then asks to pay via wire transfer, gift card, or crypto (to avoid buyer protection)</li>
              <li><span className="font-medium">Overpayment scams:</span> Buyer sends more than the asking price and asks for a refund, but payment was fraudulent</li>
              <li><span className="font-medium">Rental/lease scams:</span> Scammers list properties they don't own, collect deposits, then disappear</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to protect yourself on marketplace platforms</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Use the platform's built-in payment system, never pay outside the app</li>
              <li>Verify the seller (check their profile history, reviews, and how long they've been on the platform)</li>
              <li>Be suspicious of unrealistic prices (if it's too cheap, it's probably fake or stolen)</li>
              <li>Meet in person in a safe location for high-value items, or use local pickup</li>
              <li>Inspect items before paying if meeting in person</li>
              <li>For rentals, verify ownership and never wire deposits</li>
              <li>Ask questions and request photos or videos if possible</li>
              <li>Don't accept payment beyond the asking price</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">QR Code Scams</h2>
          <p className="text-slate-700 leading-relaxed">
            Scammers post QR codes on social media that link to phishing sites, malware, or payment pages.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Common QR code scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>"Free gift card, scan this QR code"</li>
              <li>QR codes in sponsored posts linking to phishing sites</li>
              <li>Codes that download malware or credential-stealing apps</li>
              <li>Codes linking to fake payment pages</li>
              <li>Overlay codes placed on top of legitimate QR codes</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">QR code safety practices</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Only scan QR codes from trusted sources</li>
              <li>Before opening the link, look at the URL preview in your camera app</li>
              <li>Don't scan QR codes from posts by unknown accounts</li>
              <li>Be suspicious of QR codes offering "free" items or money</li>
              <li>Never enter personal or payment information after scanning a QR code from social media</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Clickbait and Malicious Links</h2>
          <p className="text-slate-700 leading-relaxed">
            Sensational posts with links designed to get clicks, either for ad revenue or to spread malware.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Common clickbait patterns</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>"Celebrities HATE this one trick..." (link to unknown site)</li>
              <li>"You won't believe what happened to [celebrity]" (fake news designed for clicks)</li>
              <li>"New healthcare/weight loss breakthrough" (often selling fake products)</li>
              <li>Posts promising to reveal embarrassing information about celebrities</li>
              <li>"[Celebrity] dead at [age]" (false death hoaxes)</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to identify and avoid malicious links</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Hover over links (without clicking) to see the actual URL</li>
              <li>Be suspicious of sensational headlines designed to provoke emotion</li>
              <li>Check if the link is from a reputable news source</li>
              <li>Don't click links from posts with high drama or celebrity gossip</li>
              <li>Verify surprising news through multiple legitimate news outlets</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Romance Scams on Social Media</h2>
          <p className="text-slate-700 leading-relaxed">
            Social media makes romance scams easier by providing access to profiles, photos, and personal information.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Red flags for social media romance scams</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Profile is very new or has minimal activity</li>
              <li>Photos look professionally done or are too perfect</li>
              <li>Person moves conversation off the platform quickly</li>
              <li>They make immediate declarations of love or attraction</li>
              <li>Hesitance to video chat despite claiming to want a relationship</li>
              <li>Story changes or inconsistencies emerge over time</li>
              <li>Financial requests appear after building emotional connection</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">How to protect yourself</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Verify profile authenticity by checking account age and history</li>
              <li>Do a reverse image search on their photos</li>
              <li>Insist on video chatting early in the relationship</li>
              <li>Be cautious if someone you just met asks for money</li>
              <li>Discuss any suspicious relationship with trusted friends</li>
              <li>Never send money to someone you've only met online</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">Multi-Level Marketing (MLM) Scams</h2>
          <p className="text-slate-700 leading-relaxed">
            MLM companies use social media heavily to recruit. While not all MLMs are illegal, predatory ones operate like pyramid schemes.
          </p>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Warning signs of predatory MLMs</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
              <li>Pressure to recruit friends and family</li>
              <li>Income primarily from recruitment, not product sales</li>
              <li>Requirement to purchase inventory upfront</li>
              <li>Promises of easy money or "passive income"</li>
              <li>Using social media heavily to recruit</li>
              <li>Posts emphasizing recruitment over actual products</li>
            </ul>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">General Social Media Safety Practices</h2>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Limit what you share publicly</h3>
            <p className="mt-2 text-slate-700">
              The more information available about you, the easier it is for scammers to manipulate you. Avoid posting:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
              <li>Your full birthdate (month and day are enough if sharing anything)</li>
              <li>Your address or frequent locations</li>
              <li>Phone numbers or email addresses</li>
              <li>Financial information or discussions about money</li>
              <li>Travel plans or vacation dates (shows when you're away)</li>
            </ul>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Use privacy settings</h3>
            <p className="mt-2 text-slate-700">
              Set your profile to private, control who can message you, and limit who sees your posts. Review privacy settings periodically as platforms change them frequently.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Be cautious with friend requests</h3>
            <p className="mt-2 text-slate-700">
              Scammers often clone accounts of people in your network or use fake profiles. If a request seems odd, reach out to the person independently to verify.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Don't download from links in messages</h3>
            <p className="mt-2 text-slate-700">
              If a friend sends a link to download something, verify with them first (via another method like phone). Their account may be compromised.
            </p>
          </Card>

          <Card className="border-slate-200 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900">Report suspicious activity</h3>
            <p className="mt-2 text-slate-700">
              Use the platform's reporting tools for fake accounts, phishing, and scams. While not immediate, these reports help platforms take action.
            </p>
          </Card>
        </section>

        <section className="rounded-2xl border border-amber-200 bg-amber-50/80 p-6">
          <h2 className="text-lg font-semibold text-amber-950">Key Takeaway: Healthy Skepticism</h2>
          <p className="mt-3 text-amber-950/90">
            Social media is designed to encourage quick reactions and sharing. Scammers exploit this by creating posts designed to provoke emotion without thought. Pause before clicking, sharing, or responding. A few seconds to verify can prevent significant harm.
          </p>
        </section>
      </div>

      <div className="space-y-6 border-t border-slate-200 pt-8">
        <h2 className="text-2xl font-semibold text-slate-900">Report and Protect Others</h2>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          <Link
            href="/database"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Search Scam Database</h3>
            <p className="mt-2 text-sm text-slate-600">Check if a social media account, page, or person is known to scam.</p>
          </Link>

          <Link
            href="/report"
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
          >
            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600">Report Social Media Scam</h3>
            <p className="mt-2 text-sm text-slate-600">Document and report scams you encounter on social platforms.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
