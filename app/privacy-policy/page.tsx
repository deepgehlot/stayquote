import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | StayQuote",
  description: "Read the Privacy Policy for StayQuote — how we collect, use, and protect your data.",
};

export default function PrivacyPolicyPage() {
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
              <ShieldCheck className="w-6 h-6 text-[#f1611b]" />
            </div>
            <div>
              <p className="text-[#f1611b] text-xs font-bold uppercase tracking-widest mb-1">Legal</p>
              <h1 className="text-3xl font-black">Privacy Policy</h1>
            </div>
          </div>
          <p className="text-gray-400 text-sm">Last updated: May 18, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-14 space-y-10">

        <Section title="1. Introduction">
          <p>
            Welcome to <strong>StayQuote</strong>, a product of <strong>ShapeBytes</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
          <p>
            Please read this policy carefully. If you do not agree with the terms of this policy, please discontinue use of the platform.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Name, email address, phone number, property name, and password when you register.</li>
            <li><strong>Property Data:</strong> Room categories, services, pricing, availability, and other property-related information you enter into the system.</li>
            <li><strong>Guest Information:</strong> Guest names, contact details, and booking information you add while managing enquiries and reservations.</li>
            <li><strong>Billing Information:</strong> Subscription payment data processed securely through our payment partners. We do not store your full card details.</li>
            <li><strong>Usage Data:</strong> Log data, device information, IP address, browser type, and pages visited to help us improve the service.</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Provide, operate, and maintain the StayQuote platform.</li>
            <li>Process your subscription and send billing-related communications.</li>
            <li>Send you product updates, feature announcements, and support messages.</li>
            <li>Respond to your comments, questions, and support requests.</li>
            <li>Analyse usage patterns to improve the platform experience.</li>
            <li>Comply with applicable laws and regulations.</li>
          </ul>
        </Section>

        <Section title="4. Sharing of Information">
          <p>We do not sell, trade, or rent your personal information to third parties. We may share information with:</p>
          <ul>
            <li><strong>Service Providers:</strong> Trusted third-party services such as cloud hosting (Vercel), email delivery (SMTP providers), and analytics tools — only to the extent necessary to provide the service.</li>
            <li><strong>Legal Requirements:</strong> If required by law, court order, or government regulation.</li>
            <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, your data may be transferred to the new entity.</li>
          </ul>
        </Section>

        <Section title="5. Data Security">
          <p>
            We implement appropriate technical and organisational security measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These include SSL/TLS encryption, access controls, and regular security reviews.
          </p>
          <p>
            However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal data for as long as your account is active or as needed to provide services. If you cancel your subscription, we will retain your data for up to 90 days before deletion, unless a longer retention period is required by law.
          </p>
        </Section>

        <Section title="7. Your Rights">
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>Right to access the personal data we hold about you.</li>
            <li>Right to correct inaccurate or incomplete data.</li>
            <li>Right to request deletion of your data.</li>
            <li>Right to restrict or object to processing of your data.</li>
            <li>Right to data portability.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:growth@shapebytes.com" className="text-[#f1611b] hover:underline">growth@shapebytes.com</a>.</p>
        </Section>

        <Section title="8. Cookies">
          <p>
            We use cookies and similar tracking technologies to maintain your session (authentication token) and improve your experience. You may disable cookies in your browser settings, but this may affect the functionality of the platform.
          </p>
        </Section>

        <Section title="9. Third-Party Links">
          <p>
            The platform may contain links to third-party websites. We are not responsible for the privacy practices of those websites and encourage you to review their privacy policies.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with a revised &ldquo;Last updated&rdquo; date. Your continued use of the platform after any changes constitutes acceptance of the new policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
          <div className="bg-[#f1611b]/5 border border-[#f1611b]/20 rounded-xl p-5 mt-4">
            <p className="font-bold text-gray-900">ShapeBytes</p>
            <p className="text-gray-600 text-sm mt-1">Email: <a href="mailto:growth@shapebytes.com" className="text-[#f1611b] hover:underline">growth@shapebytes.com</a></p>
            {/* <p className="text-gray-600 text-sm">Phone: <a href="tel:+919999949999" className="text-[#f1611b] hover:underline">+91 99999 4999</a></p> */}
          </div>
        </Section>

        {/* Back link */}
        <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#f1611b] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/terms-and-conditions" className="text-sm text-gray-500 hover:text-[#f1611b] transition-colors">
            Terms &amp; Conditions →
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
