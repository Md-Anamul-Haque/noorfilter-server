"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShieldCheck, Download, Smartphone, MonitorSmartphone, Apple, Loader2 } from "lucide-react";

function FallbackContent() {
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop" | "loading">("loading");
  const searchParams = useSearchParams();
  
  const token = searchParams.get("token") || "";

  const playStoreUrl = token 
    ? `https://play.google.com/store/apps/details?id=com.udvabok.noorfilter&referrer=token%3D${encodeURIComponent(token)}`
    : "https://play.google.com/store/apps/details?id=com.udvabok.noorfilter";

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/android/i.test(userAgent)) {
      setPlatform("android");
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      setPlatform("ios");
    } else {
      setPlatform("desktop");
    }
  }, []);

  const getButtonConfig = () => {
    switch (platform) {
      case "ios":
        return {
          text: "Available only on Android",
          href: "#",
          icon: <Apple className="w-5 h-5" />,
          disabled: true,
          className: "bg-slate-300 text-slate-500 cursor-not-allowed",
        };
      case "desktop":
        return {
          text: "Get Android App",
          href: playStoreUrl,
          icon: <MonitorSmartphone className="w-5 h-5" />,
          disabled: false,
          className: "bg-slate-900 text-white hover:bg-slate-800 hover:-translate-y-0.5 shadow-md hover:shadow-lg",
        };
      case "android":
      case "loading":
      default:
        return {
          text: "Download on Google Play",
          href: playStoreUrl,
          icon: <Download className="w-5 h-5" />,
          disabled: false,
          className: "bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5 shadow-md hover:shadow-lg",
        };
    }
  };

  const btn = getButtonConfig();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-200">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">App Not Installed</h1>
          <p className="text-slate-600 font-medium leading-relaxed">
            It looks like you don't have the NoorFilter app installed on this device. Please download the app to continue using its features.
          </p>
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-2 text-sm text-emerald-800 font-medium text-left">
            💡 <strong>Note:</strong> Please install the app, then come back to this page and click the button again to log in automatically.
          </div>
        </div>

        <div className="pt-4 space-y-4">
          <a
            href={btn.disabled ? undefined : btn.href}
            target={btn.disabled ? undefined : "_blank"}
            rel={btn.disabled ? undefined : "noopener noreferrer"}
            className={`flex items-center justify-center w-full gap-3 px-6 py-4 text-lg font-bold rounded-full transition-all ${btn.className}`}
            onClick={(e) => btn.disabled && e.preventDefault()}
          >
            {btn.icon}
            {btn.text}
          </a>
          
          <Link
            href="/dashboard"
            className="inline-block text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-slate-400 text-sm font-medium">
        <Smartphone className="w-4 h-4" />
        <span>For the best experience, please use an Android device.</span>
      </div>
    </div>
  );
}

export default function AppAuthFallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}>
      <FallbackContent />
    </Suspense>
  );
}
