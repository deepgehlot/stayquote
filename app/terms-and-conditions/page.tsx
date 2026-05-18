import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ScrollText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | StayQuote",
  description: "Read the Terms & Conditions for using the StayQuote platform by ShapeBytes.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#f1611b] transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#f1611b]/20 flex items-center justify-center">
              <ScrollText className="w-6 h-6 text-[#f1611b]" />
            </div>
            <div>
              <p className="text-[#f1611b] text-xs font-bold uppercase tracking-widest mb-1">Legal</p>
              <h1 className="text-3xl font-black">Terms &amp; Conditions</h1>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Last updated: May 18, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the <strong>StayQuote</strong> platform (&ldquo;the Service&rdquo;), operated by <strong>ShapeBytes</strong>, you agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not use the Service.
          </p>
          <p>
            These terms apply to all users of the Service, including administrators, team members, and any other individuals who access the platform through your account.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            StayQuote is a cloud-based hospitality management platform that provides tools for:
          </p>
          <ul>
            <li>Creating and managing professional quotations for property stays and events.</li>
            <li>Tracking guest enquiries and follow-ups.</li>
            <li>Managing room availability and reservations.</li>
            <li>Generating branded PDF documents for quotations and reservations.</li>
            <li>Email communication with guests via your own SMTP configuration.</li>
          </ul>
        </Section>

        <Section title="3. Account Registration">
          <p>
            To use the Service, you must create an account by providing accurate and complete information. You are responsible for:
          </p>
          <ul>
            <li>Maintaining the confidentiality of your login credentials.</li>
            <li>All activities that occur under your account.</li>
            <li>Notifying us immediately of any unauthorised use of your account.</li>
          </ul>
          <p>
            You must be at least 18 years old and have the legal authority to enter into these terms on behalf of your business.
          </p>
        </Section>

        <Section title="4. Subscription and Payment">
          <ul>
            <li>The Service is offered on a subscription basis at <strong>₹999 per month per property</strong>.</li>
            <li>Payments are billed monthly in advance. Subscriptions auto-renew unless cancelled before the renewal date.</li>
            <li>All fees are non-refundable except where required by applicable law.</li>
            <li>We reserve the right to change pricing with 30 days&apos; notice. Continued use after the notice period constitutes acceptance of the new pricing.</li>
            <li>Failure to pay may result in suspension or termination of your account.</li>
          </ul>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree not to use the Service to:</p>
          <ul>
            <li>Violate any applicable laws or regulations.</li>
            <li>Upload, store, or transmit any unlawful, harmful, or fraudulent content.</li>
            <li>Reverse engineer, decompile, or attempt to derive the source code of the platform.</li>
            <li>Interfere with or disrupt the security or integrity of the platform.</li>
            <li>Use the platform to send unsolicited communications (spam) to guests.</li>
            <li>Share access to your account with individuals outside your property team without authorisation.</li>
          </ul>
        </Section>

        <Section title="6. Data Ownership">
          <p>
            You retain full ownership of all data you enter into the platform, including guest information, quotations, reservations, and property settings. By using the Service, you grant ShapeBytes a limited licence to store and process this data solely for the purpose of providing the Service to you.
          </p>
          <p>
            We do not claim ownership of your data and will not use it for any purpose other than providing and improving the Service.
          </p>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            All intellectual property rights in the StayQuote platform — including its design, code, features, and branding — are owned exclusively by ShapeBytes. Nothing in these Terms grants you any right to use our trademarks, logos, or brand assets without prior written consent.
          </p>
        </Section>

        <Section title="8. Third-Party Services">
          <p>
            The Service integrates with or allows you to connect third-party services (e.g., your SMTP email provider). ShapeBytes is not responsible for the reliability, security, or actions of third-party services you connect to the platform.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, ShapeBytes shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the Service — including but not limited to loss of bookings, revenue, data, or business opportunities.
          </p>
          <p>
            Our total liability to you for any claims under these Terms shall not exceed the amount you paid to us in the three (3) months preceding the claim.
          </p>
        </Section>

        <Section title="10. Termination">
          <p>
            You may cancel your subscription at any time from your account settings. Upon cancellation, your access will continue until the end of the current billing period. After that, your account and data will be deactivated.
          </p>
          <p>
            We reserve the right to suspend or terminate your account immediately if you violate these Terms, with or without prior notice.
          </p>
        </Section>

        <Section title="11. Modifications to Service">
          <p>
            We reserve the right to modify, update, or discontinue any feature of the Service at any time. We will make reasonable efforts to notify users of significant changes in advance. Your continued use of the Service constitutes acceptance of the modified terms.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Rajasthan, India.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>If you have any questions about these Terms &amp; Conditions, please contact us:</p>
          <div className="bg-[#f1611b]/5 border border-[#f1611b]/20 rounded-xl p-5 mt-4">
            <p className="font-bold text-gray-900">ShapeBytes</p>
            <p className="text-gray-600 text-sm mt-1">Email: <a href="mailto:growth@shapebytes.com" className="text-[#f1611b] hover:underline">growth@shapebytes.com</a></p>
            {/* <p className="text-gray-600 text-sm">Phone: <a href="tel:+919999949999" className="text-[#f1611b] hover:underline">+91 99999 4999</a></p> */}
          </div>
        </Section>

        {/* Back / nav links */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#f1611b] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-[#f1611b] transition-colors">
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-black text-gray-900 mb-4 pb-2 border-b-2 border-[#f1611b]/20">{title}</h2>
      <div className="space-y-3 text-gray-600 leading-relaxed text-sm [&_ul]:mt-3 [&_ul]:space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_strong]:text-gray-900 [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  );
}
