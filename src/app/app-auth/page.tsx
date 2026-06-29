import Link from "next/link";
import { ShieldCheck, Download, Smartphone } from "lucide-react";

export default function AppAuthFallbackPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans selection:bg-emerald-200">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Open in NoorFilter App</h1>
          <p className="text-slate-600 font-medium leading-relaxed">
            If you have the NoorFilter app installed, it should have opened automatically. If it didn't, or if you don't have the app yet, please download it to continue.
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <a
            href="https://play.google.com/store/apps/details?id=com.udvabok.noorfilter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full gap-3 px-6 py-4 text-lg font-bold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            Download on Google Play
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
