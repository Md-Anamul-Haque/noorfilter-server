import React from "react";
import Link from "next/link";
import { ShieldCheck, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - NoorFilter",
  description: "Privacy Policy for NoorFilter - Understand how we protect your data and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-200">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-8 py-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/cubes.png')] opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg mb-6">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
            <p className="text-slate-400 font-medium text-lg">Effective Date: June 25, 2026</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 space-y-12 text-slate-700 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Overview</h2>
            <p className="text-lg">
              NoorFilter ("we", "our", or "us") is deeply committed to protecting your privacy. This Privacy Policy explains how our application uses your device's permissions. NoorFilter is designed to help users maintain focus and avoid distracting short-form content (like YouTube Shorts, Facebook Reels, and Instagram Reels) by replacing them with positive, mindful reminders such as Hadiths or motivational quotes. It also provides a Safe Internet feature to filter out malicious or inappropriate domains.
            </p>
          </section>

          {/* Accessibility Service Alert */}
          <section className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-900">Crucial Disclosure: Use of Accessibility Service API</h2>
            </div>
            <p className="font-medium text-red-800 text-lg">
              NoorFilter strictly requires the use of the <strong>Accessibility Service API</strong> to function. Below is a detailed disclosure of how and why we use this API:
            </p>
            <ul className="space-y-3 list-disc list-inside text-red-800/90 ml-2 md:ml-4 text-lg">
              <li><strong>Why we need it:</strong> The Accessibility Service is used solely to detect when you are interacting with short-form video content interfaces (e.g., YouTube Shorts, Facebook Reels, Instagram Reels) so that the app can intervene and display a focus reminder overlay.</li>
              <li><strong>What it does:</strong> It scans the active window's view hierarchy and package names locally on your device to identify specific video player components.</li>
              <li><strong>Data Collection & Privacy:</strong> We <strong>DO NOT</strong> collect, store, transmit, or share any personal data, screen content, or text typed by the user. All accessibility event processing happens completely locally on your device and is discarded immediately after analysis. Your privacy is 100% guaranteed.</li>
            </ul>
          </section>

          {/* VpnService Alert */}
          <section className="bg-red-50 border border-red-100 rounded-2xl p-6 md:p-8 space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-red-500"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-red-900">Crucial Disclosure: Use of VpnService API</h2>
            </div>
            <p className="font-medium text-red-800 text-lg">
              NoorFilter uses the Android <strong>VpnService API</strong> to provide the Safe Internet filtering feature. Below is a detailed disclosure of how and why we use this API:
            </p>
            <ul className="space-y-3 list-disc list-inside text-red-800/90 ml-2 md:ml-4 text-lg">
              <li><strong>Why we need it:</strong> The VpnService is used to create a local DNS sinkhole that blocks access to known adult, gambling, malware, phishing, and tracking domains across your device.</li>
              <li><strong>What it does:</strong> It intercepts DNS requests locally to check if the requested domain matches our filter lists. If a match is found, the connection is blocked.</li>
              <li><strong>Data Collection & Privacy:</strong> The VPN operates <strong>entirely locally</strong> on your device. We do not route your internet traffic through external remote servers, nor do we monitor, log, or collect your browsing history or data.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Data Collection and Usage</h2>
            <p className="text-lg">
              NoorFilter operates with maximum privacy in mind. We do not collect personal information, usage analytics, or device identifiers. Any settings or preferences you configure in the app (such as blocklists, timer settings, or overlay preferences) are stored locally in the app's secure database on your device. The app periodically connects to our server solely to download the latest motivational quotes and Hadiths for the blocking overlay, but this process does not transmit any of your personal data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Third-Party Services</h2>
            <p className="text-lg">
              The app does not integrate with any third-party analytics, tracking, or advertising SDKs. It works locally to ensure an uninterrupted and privacy-first experience.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Changes to This Privacy Policy</h2>
            <p className="text-lg">
              We may update our Privacy Policy from time to time. You are advised to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-2">Contact Us</h2>
            <p className="text-lg">
              If you have any questions or suggestions about our Privacy Policy, please do not hesitate to contact us at <a href="mailto:m.anamul.dev@gmail.com" className="text-emerald-600 hover:text-emerald-700 font-bold underline underline-offset-4 decoration-2">m.anamul.dev@gmail.com</a>.
            </p>
          </section>

        </div>
        
        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-100 p-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
            &larr; Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
