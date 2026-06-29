import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Lock, PlaySquare, Globe, Heart, Activity, Smartphone, Info, Sparkles, CheckCircle2Icon } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-200">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">NoorFilter</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-bold bg-slate-900 text-white px-6 py-2.5 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
          {/* Background decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-[120px] mix-blend-multiply" />
            <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-multiply" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold mb-8">
                <Sparkles className="w-4 h-4" />
                <span>Version 81.0 is here!</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
                Block distracting <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Shorts & Reels.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
                NoorFilter is your ultimate digital wellbeing companion. Break free from endless scrolling and stay safe online with our powerful local VPN filter.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/login"
                  className="flex items-center justify-center w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full hover:from-emerald-700 hover:to-teal-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  Reclaim Your Time
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-24 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">Regain control of your screen time</h2>
              <p className="text-lg text-slate-600 font-medium">NoorFilter intelligently detects highly addictive spaces in popular apps and gently blocks them, replacing them with mindful content.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <PlaySquare className="w-6 h-6 text-teal-600" />,
                  title: "Smart Blocking",
                  desc: "Automatically detects and blocks short-form video players (Reels, Shorts) without blocking the entire app. Use main feeds safely!"
                },
                {
                  icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                  title: "Safe Internet Filtering",
                  desc: "Block adult content, gambling, malware, and phishing sites system-wide using our secure, local DNS VPN filter."
                },
                {
                  icon: <Heart className="w-6 h-6 text-rose-500" />,
                  title: "Mindful Replacements",
                  desc: "Instead of a harsh block screen, you're greeted with peaceful Hadiths or productivity-boosting quotes."
                },
                {
                  icon: <Globe className="w-6 h-6 text-blue-600" />,
                  title: "Custom Site Blocker",
                  desc: "Take complete control over your internet browsing by adding your own custom websites and domains to the blocklist."
                },
                {
                  icon: <Activity className="w-6 h-6 text-indigo-600" />,
                  title: "Detailed Insights",
                  desc: "Track your digital wellbeing journey with in-app statistics, showing you how many distractions you've avoided today."
                },
                {
                  icon: <Lock className="w-6 h-6 text-slate-700" />,
                  title: "Total Privacy",
                  desc: "NoorFilter works entirely locally. The local VPN resolves everything on your device, and no browsing data leaves your phone."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What's New Section */}
        <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-700">
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-amber-400" />
                What's New in Version 81.0
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <div className="mt-1"><CheckCircle2Icon className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <strong className="text-lg">Added Custom Site Blocking:</strong>
                    <p className="text-slate-300 mt-1">You can now block any specific website or domain using our Safe Internet VPN feature.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><CheckCircle2Icon className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <strong className="text-lg">Enhanced Detection Engine:</strong>
                    <p className="text-slate-300 mt-1">Significantly improved the accuracy of Facebook Reels blocking to reduce false positives while scrolling.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1"><CheckCircle2Icon className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <strong className="text-lg">YouTube Shorts Optimization:</strong>
                    <p className="text-slate-300 mt-1">Faster and more reliable blocking specifically tailored for YouTube Shorts.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Permissions Disclaimer */}
        <section className="py-16 bg-slate-100">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-4 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <Info className="w-6 h-6 flex-shrink-0 text-amber-700 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-2">Important Permission Notice</h4>
                <p className="text-sm leading-relaxed mb-4 font-medium opacity-90">
                  NoorFilter requires the <strong>Accessibility Service API</strong> to detect the user interfaces of short-form video platforms on your screen to present a mindful overlay. We do not transmit, save, or log any personal information, screen content, or typing behavior.
                </p>
                <p className="text-sm leading-relaxed font-medium opacity-90">
                  Additionally, we use the <strong>VpnService API</strong> to provide our Safe Internet feature. This is a local DNS filter that does not route your traffic to external servers; it only blocks known malicious or inappropriate domains locally on your device. Your privacy is our absolute highest priority.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <span className="font-bold text-xl text-slate-900">NoorFilter</span>
          </div>
          <p className="text-sm font-medium text-slate-500">
            Tags: productivity, digital wellbeing, screen time, block reels, block shorts, focus, safe internet
          </p>
          <p className="text-sm font-medium text-slate-400">© {new Date().getFullYear()} NoorFilter. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
