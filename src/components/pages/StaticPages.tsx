import React, { useState } from 'react';
import { Shield, FileText, AlertTriangle, Info, Mail, CheckCircle2, Send } from 'lucide-react';

interface StaticPageProps {
  page: 'privacy' | 'terms' | 'disclaimer' | 'about' | 'contact';
}

export const StaticPages: React.FC<StaticPageProps> = ({ page }) => {
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  if (page === 'privacy') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Privacy Policy</h1>
            <p className="text-xs text-slate-500">Effective Date: October 2024 • Last updated for 360tools.site</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-4">
          <p>
            At <strong>360tools.site</strong>, your privacy and document confidentiality are our highest priorities.
            Unlike conventional web converters that upload your personal documents to third-party cloud servers, our architecture
            processes all PDF documents, images, audio waveforms, video frames, and financial formulas <strong>100% client-side in your web browser</strong>.
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-6">1. Zero File Upload Policy (Local Processing)</h3>
          <p>
            When you use our PDF tools (such as Merge PDF, Image to PDF, Split PDF, Watermark PDF, or Text to PDF) or Media tools
            (Audio Cutter, Video Aspect Resizer, Video Frame Extractor), the files never leave your device. All rendering, slicing, and
            encoding happens in your computer’s local memory utilizing WebAssembly, Canvas API, and client-side JavaScript libraries
            (<code>pdf-lib</code> and <code>jspdf</code>). We do not operate storage buckets or backend servers that receive your documents.
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-6">2. Cookies and Third-Party Advertising</h3>
          <p>
            We may use third-party advertising services such as Google AdSense to serve ads when you visit 360tools.site.
            Google and its partners use cookies (such as the DoubleClick cookie) to serve ads based on your prior visits to our website
            or other websites on the Internet.
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a>.</li>
            <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">aboutads.info</a>.</li>
          </ul>

          <h3 className="text-base font-bold text-slate-900 mt-6">3. LocalStorage and Browser State</h3>
          <p>
            To enhance user experience, certain calculators may store temporary non-personally identifiable settings (e.g., your preference
            for metric vs. imperial units or recent calculator history) within your browser’s local storage. You can purge this at any time
            by clearing your browser cookies and site data.
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-6">4. Contacting Us</h3>
          <p>
            If you have questions regarding this Privacy Policy, you can reach out via our contact portal or email us at{' '}
            <a href="mailto:support@360tools.site" className="text-blue-600 hover:underline">support@360tools.site</a>.
          </p>
        </div>
      </div>
    );
  }

  if (page === 'terms') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Terms of Service</h1>
            <p className="text-xs text-slate-500">Agreement & Conditions for Using 360tools.site</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-4">
          <p>
            Welcome to 360tools.site. By accessing or using our free web utility suite, calculators, PDF processors,
            and media converters, you agree to be bound by these Terms of Service.
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-6">1. Permitted Use</h3>
          <p>
            360tools.site provides all utilities free of charge for personal, educational, and commercial use. You agree not to
            attempt to scrape the website through abusive automated bots, decompile or reverse engineer proprietary client logic with
            malicious intent, or interfere with other visitors' lawful enjoyment of the service.
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-6">2. Intellectual Property and Content Ownership</h3>
          <p>
            You retain 100% intellectual property and full copyright over all documents, images, audio tracks, and videos you process
            using our tools. Because processing is strictly client-side, 360tools.site claims zero ownership, license, or rights to any
            file passed into our web applications.
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-6">3. Availability & Service Updates</h3>
          <p>
            We strive for 99.9% uptime and regularly deploy performance enhancements. However, services are provided on an "as is" and
            "as available" basis without warranties of uninterrupted availability.
          </p>
        </div>
      </div>
    );
  }

  if (page === 'disclaimer') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Disclaimer</h1>
            <p className="text-xs text-slate-500">Informational, Financial, and Medical Disclaimers</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-4">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-medium">
            <strong>Important Notice:</strong> The calculations, estimations, formulas, and tools provided on 360tools.site
            are intended solely for general educational, illustrative, and informational purposes.
          </div>

          <h3 className="text-base font-bold text-slate-900 mt-6">Financial Calculators Disclaimer</h3>
          <p>
            Our Mortgage & Loan, Compound Interest, Currency & Inflation, Sales Tax, and Salary calculators implement standard mathematical
            formulas. However, real-world banking rates, compounding intervals, amortization fees, escrow charges, and localized tax laws
            differ across jurisdictions. Nothing on this website constitutes certified financial, legal, or investment advice. Consult a
            licensed financial advisor or CPA before entering into binding loan commitments.
          </p>

          <h3 className="text-base font-bold text-slate-900 mt-6">Health & Fitness Calculators Disclaimer</h3>
          <p>
            The BMI, Calorie TDEE, Body Fat %, Water Intake, and Target Heart Rate tools are based on statistical population models (such as
            the World Health Organization BMI guidelines, Mifflin-St Jeor equation, and Tanaka formula). They do not substitute professional
            medical diagnosis, treatment, or dietary consultation. Always consult a qualified physician before starting any intense weight-loss,
            hydration, or cardiovascular training program.
          </p>
        </div>
      </div>
    );
  }

  if (page === 'about') {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">About 360tools</h1>
            <p className="text-xs text-slate-500">The Modern, Privacy-First Client-Side Web Utility Platform</p>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600 space-y-4">
          <p>
            <strong>360tools</strong> was created with a clear mission: to provide the fastest, cleanest, and most reliable
            suite of productivity tools on the web without compromising user privacy or cluttering the screen with annoying popups.
          </p>
          <p>
            Inspired by beloved utilities like iLovePDF, 123apps, and Omni Calculator, we built 360tools using modern web standards
            like WebAssembly, Web Audio API, and HTML5 Canvas. Because every calculation and file manipulation executes natively inside your
            browser, your confidential documents remain strictly in your custody at all times.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">⚡ Lightning Fast</h4>
              <p className="text-xs text-slate-500">No waiting in server upload queues or slow cloud processing pipelines.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">🔒 100% Private</h4>
              <p className="text-xs text-slate-500">Files and calculations never leave your computer or phone.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm mb-1">🌐 Always Free</h4>
              <p className="text-xs text-slate-500">Zero subscriptions, paywalls, or daily document upload limits.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Contact Page
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Contact Us</h1>
          <p className="text-xs text-slate-500">Get in touch with the 360tools engineering team</p>
        </div>
      </div>

      {contactSubmitted ? (
        <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-emerald-900">Message Received!</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            Thank you for contacting 360tools. A member of our support team will review your inquiry and respond within 24–48 hours.
          </p>
          <button
            onClick={() => setContactSubmitted(false)}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleContactSubmit} className="space-y-4 max-w-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-blue-500"
                placeholder="Jane Doe"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-blue-500"
                placeholder="jane@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
            <input
              type="text"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-blue-500"
              placeholder="Feedback, Feature Request, or Bug Report"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:outline-blue-500"
              placeholder="How can we help you?"
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-2 transition-colors"
          >
            <Send className="w-4 h-4" /> Send Message
          </button>
        </form>
      )}
    </div>
  );
};
