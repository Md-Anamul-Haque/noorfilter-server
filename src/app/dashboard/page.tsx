"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { createAppLaunchToken } from "../actions/app-auth";
import { getUserSubscription, submitFreeAccessRequest, startFreeTrial } from "../actions/user";
import { ShieldCheck, User, LogOut, CheckCircle2, AlertCircle, Smartphone, Clock, CreditCard, CalendarDays, ArrowRightCircle, Sparkles, Zap, HeartHandshake } from "lucide-react";
import Link from "next/link";
import { FinancialSupportForm } from "@/components/financial-support-form";

function DashboardContent() {
  const { data: session, isPending } = authClient.useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const source = searchParams.get("source");
  const isFromApp = source === "app" || source === "android_app" || source === "android_notification";

  const [loadingAppLaunch, setLoadingAppLaunch] = useState(false);
  const [appLaunchStatus, setAppLaunchStatus] = useState("");
  const [appLaunchError, setAppLaunchError] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<"paid" | "free" | "trial" | null>(null);
  const [selectedPaidDuration, setSelectedPaidDuration] = useState<"1year" | "6month" | "30day">("1year");

  // Tab State
  const [activeTab, setActiveTab] = useState<"overview" | "billing">("overview");

  // Subscription state
  const [subscription, setSubscription] = useState<any>(null);
  const [loadingSub, setLoadingSub] = useState(true);

  useEffect(() => {
    if (session?.user) {
      getUserSubscription().then((sub) => {
        setSubscription(sub);
        setLoadingSub(false);
      });
    }
  }, [session]);

  const handleApplyDeepLink = async () => {
    try {
      setLoadingAppLaunch(true);
      setAppLaunchError("");
      setAppLaunchStatus("আপনার অ্যাক্সেস যাচাই করা হচ্ছে...");

      const jwt = await createAppLaunchToken();

      setAppLaunchStatus("অ্যাপ চালু করা হচ্ছে...");

      const appLinkUrl = `https://noorfilter.udvabok.com/app-auth?token=${encodeURIComponent(jwt)}`;
      window.location.href = appLinkUrl;
    } catch (err) {
      console.error(err);
      setAppLaunchError("দুঃখিত! অ্যাপে প্রবেশ করা যায়নি। আবার চেষ্টা করুন।");
      setAppLaunchStatus("");
    } finally {
      setLoadingAppLaunch(false);
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/");
  };

  const handleStartTrial = async () => {
    const res = await startFreeTrial();
    if (res.success) {
      const sub = await getUserSubscription();
      setSubscription(sub);
      setSelectedPlan(null);
    } else {
      alert(res.error || "Failed to start trial");
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
           <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
           <ShieldCheck className="w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Proxy will redirect anyway
  }

  // Determine trial status
  const now = new Date();
  const trialExpiresAt = subscription?.trialExpiresAt ? new Date(subscription.trialExpiresAt) : null;
  const isTrialActive = trialExpiresAt && trialExpiresAt > now;
  const hasAccess = isTrialActive || subscription?.plan === "premium";

  const getPlanDetails = () => {
    if (!subscription) return { name: "None", price: "৳0 / month" };
    if (subscription.status === "trialing") return { name: "Free Trial", price: "৳0" };
    if (subscription.plan === "free" && subscription.status === "active") return { name: "Free Access", price: "৳0" };
    if (subscription.plan === "premium") return { name: "Premium Plan", price: "৳৯৯ / month" };
    return { name: subscription.plan, price: "-" };
  };

  const planDetails = getPlanDetails();
  const expiryDate = trialExpiresAt ? trialExpiresAt : (subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd) : null);

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans relative overflow-hidden text-slate-800">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">Noorfilter</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-100 px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3 justify-center sm:justify-start">
              Welcome back, {session.user.name?.split(' ')[0] || "User"} <span className="animate-bounce">👋</span>
            </h1>
            <p className="text-slate-500 mt-2 text-lg font-medium">Manage your elite protection and subscription settings.</p>
          </div>
        </div>

        {loadingSub ? (
          <div className="flex justify-center p-24">
            <div className="relative w-12 h-12 flex items-center justify-center">
               <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Left Sidebar (Profile & Current Plan) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-200/60 p-6 flex items-center gap-5 hover:shadow-md transition-shadow duration-300">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-blue-500 p-1 flex items-center justify-center shadow-md">
                    {session.user.image ? (
                      <img src={session.user.image} alt="Profile" className="w-full h-full rounded-full border-2 border-white object-cover" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 tracking-tight">{session.user.name}</h3>
                  <p className="text-sm font-medium text-slate-500 truncate max-w-[180px]">{session.user.email}</p>
                </div>
              </div>

              {/* Advanced Subscription Details Card */}
              <div className="relative bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 p-8 text-white overflow-hidden group hover:shadow-indigo-900/20 transition-all duration-500">
                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] group-hover:bg-indigo-500/30 transition-colors duration-500"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-colors duration-500"></div>
                
                <div className="relative z-10">
                  <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Your Current Plan
                  </h3>
                  
                  <div className="mb-8">
                    <div className="flex flex-wrap items-end gap-3 mb-2">
                      <span className="text-3xl font-extrabold tracking-tight text-white">{planDetails.name}</span>
                      {hasAccess ? (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">Active Status</span>
                      ) : (
                        <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-3 py-1 rounded-full border border-rose-500/30">Access Expired</span>
                      )}
                    </div>
                  </div>

                  {subscription && (
                    <div className="space-y-4 border-t border-slate-700/50 pt-6 pb-6">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4 text-slate-500" /> Start Date</span>
                        <span className="font-bold text-slate-200">
                          {new Date(subscription.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      
                      {expiryDate && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400 font-medium flex items-center gap-2"><Clock className="w-4 h-4 text-slate-500" /> Valid Until</span>
                          <span className={`font-bold ${hasAccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {expiryDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-slate-700/50 pt-6">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-2 text-slate-500">
                      <ArrowRightCircle className="w-4 h-4" /> Next Billing
                    </div>
                    <div className="text-slate-300 font-semibold text-sm">
                      {hasAccess && subscription?.plan === "premium" ? "Auto-renewal enabled" : "Manual renewal required"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Open App Card (Deep Link) */}
              {hasAccess && isFromApp && (
                <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 rounded-3xl shadow-xl shadow-indigo-200/50 p-8 text-white relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <Smartphone className="w-40 h-40" />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm mb-5 shadow-inner border border-white/10">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-2xl mb-3 tracking-tight">Launch App</h3>
                    <p className="text-indigo-100 text-sm font-medium mb-8 leading-relaxed">
                      Your access is verified. Tap below to securely launch the Noorfilter application on your device.
                    </p>
                    
                    {appLaunchStatus && (
                      <div className="mb-5 rounded-xl bg-white/10 backdrop-blur-md p-4 text-sm font-medium border border-white/20">
                        {appLaunchStatus}
                      </div>
                    )}
                    {appLaunchError && (
                      <div className="mb-5 rounded-xl bg-red-500/30 backdrop-blur-md p-4 text-sm font-medium border border-red-500/40">
                        {appLaunchError}
                      </div>
                    )}

                    <button
                      onClick={handleApplyDeepLink}
                      disabled={loadingAppLaunch}
                      className="w-full relative flex items-center justify-center bg-white text-indigo-700 hover:bg-indigo-50 py-4 px-6 rounded-2xl font-bold transition-all duration-300 hover:shadow-lg disabled:opacity-70 disabled:hover:scale-100 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {loadingAppLaunch ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-700 mr-3"></div>
                      ) : null}
                      {loadingAppLaunch ? "Verifying Access..." : "Open App & Connect"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Main Content */}
            <div className="lg:col-span-8">
              
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-slate-200/50 p-1.5 rounded-2xl mb-6 w-fit">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`px-7 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    activeTab === "overview"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  Account Overview
                </button>
                <button
                  onClick={() => setActiveTab("billing")}
                  className={`px-7 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    activeTab === "billing"
                      ? "bg-white text-indigo-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Billing & Subscription
                </button>
              </div>

              {/* Tab 1: Overview (Default Landing - 100% Google Play Compliant) */}
              {activeTab === "overview" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {hasAccess ? (
                     <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-center items-start min-h-[300px]">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                           <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Protection is Active</h2>
                        <p className="text-slate-500 text-lg max-w-xl leading-relaxed">
                          Your account is in good standing. Your devices are currently protected by NoorFilter's elite filtering engine. You can safely launch the app to configure your distraction-free environment.
                        </p>
                     </div>
                  ) : (
                     <div className="bg-white rounded-3xl p-8 sm:p-10 border border-rose-100 shadow-sm relative overflow-hidden flex flex-col justify-center items-start min-h-[300px]">
                        <div className="absolute top-0 left-0 w-2 h-full bg-rose-500"></div>
                        <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6">
                           <AlertCircle className="w-8 h-8 text-rose-600" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Access Expired</h2>
                        <p className="text-slate-500 text-lg max-w-xl leading-relaxed mb-8">
                          Your subscription or trial period has ended. To continue using NoorFilter and keep your devices protected, please navigate to the billing section to manage your account.
                        </p>
                        <button 
                           onClick={() => setActiveTab("billing")}
                           className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2 hover:-translate-y-0.5"
                        >
                           <CreditCard className="w-5 h-5" />
                           Manage Billing
                        </button>
                     </div>
                  )}
                </div>
              )}

              {/* Tab 2: Billing & Subscription (User intentionally navigated here) */}
              {activeTab === "billing" && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  {!hasAccess && subscription && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-5 rounded-2xl flex gap-4 shadow-sm">
                      <div className="p-2 bg-rose-100 rounded-full h-fit">
                        <AlertCircle className="w-6 h-6 text-rose-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg text-rose-900">Subscription Required</h4>
                        <p className="font-medium mt-1 text-rose-700/80">Please select an option below to regain full protection.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6 mt-2">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {hasAccess ? "Upgrade or Extend Access" : "Select a Plan"}
                    </h2>
                    <div className="h-px flex-1 bg-slate-200/60 mt-1"></div>
                  </div>
                  
                  <div className="space-y-5">
                    {/* 1. Free Trial Card */}
                    {!subscription && (
                      <div 
                        className={`group relative bg-white rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden ${
                          selectedPlan === 'trial' 
                            ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-100/50 scale-[1.01]' 
                            : 'border border-slate-200/80 hover:border-emerald-300 hover:shadow-lg hover:-translate-y-1'
                        }`}
                        onClick={() => setSelectedPlan('trial')}
                      >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl transition-opacity duration-300 ${selectedPlan === 'trial' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}></div>
                        
                        <div className="p-7 sm:p-9 relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="bg-emerald-100 text-emerald-700 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">Zero Cost</span>
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">3-Day Free Trial</h3>
                            <p className="text-slate-500 font-medium">Experience all premium filtering capabilities completely free for 72 hours. No credit card required.</p>
                          </div>
                          
                          <div className="w-full sm:w-auto flex-shrink-0">
                            <button 
                              className={`w-full sm:w-auto py-3.5 px-8 rounded-2xl font-bold transition-all duration-300 ${
                                selectedPlan === 'trial' 
                                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                                  : 'bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlan('trial');
                                handleStartTrial();
                              }}
                            >
                              Start Free Trial
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Premium Paid Plan (via Android App) */}
                    <div className="group relative bg-white rounded-3xl transition-all duration-300 overflow-hidden border border-slate-200/80 hover:border-indigo-300 hover:shadow-lg">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl opacity-50"></div>

                      <div className="p-7 sm:p-9 relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-indigo-100 text-indigo-700 text-xs font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider">Premium Access</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Paid Subscription</h3>
                        <p className="text-slate-500 font-medium mb-8 max-w-2xl">Unlock unrestricted access to advanced filtering, comprehensive protection, and priority support across all your devices.</p>
                        
                        {/* Pricing Display (Read-only) */}
                        <div className="space-y-3 mb-8">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 rounded-2xl border-2 border-indigo-500 bg-indigo-50/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-indigo-500 to-transparent opacity-10"></div>
                            <div className="mb-2 sm:mb-0 relative z-10">
                              <div className="flex items-center gap-3">
                                <div className="font-extrabold text-slate-900 text-lg">1 Year Subscription</div>
                                <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide">Best Value</span>
                              </div>
                              <div className="text-indigo-600 text-sm font-bold mt-0.5">Equates to ৳২৫/মাস</div>
                            </div>
                            <div className="text-2xl font-black text-slate-900 relative z-10">৳২৯৯</div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 rounded-2xl border-2 border-slate-100">
                            <div className="mb-2 sm:mb-0">
                              <div className="font-bold text-slate-900 text-lg">6 Months Subscription</div>
                              <div className="text-slate-500 text-sm font-medium mt-0.5">Equates to ৳৩৮/মাস</div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">৳২৩০</div>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center p-5 rounded-2xl border-2 border-slate-100">
                            <div className="mb-2 sm:mb-0">
                              <div className="font-bold text-slate-900 text-lg">30 Days Subscription</div>
                              <div className="text-slate-500 text-sm font-medium mt-0.5">Flexible monthly billing</div>
                            </div>
                            <div className="text-2xl font-black text-slate-900">৳৫০</div>
                          </div>
                        </div>

                        {/* Subscribe via App Message */}
                        <div className="bg-indigo-50 border border-indigo-200/60 rounded-2xl p-5 flex gap-4 items-center">
                          <div className="p-2.5 bg-indigo-100 rounded-xl flex-shrink-0">
                            <Smartphone className="w-6 h-6 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-bold text-indigo-900 text-sm">Subscribe via the NoorFilter App</p>
                            <p className="text-indigo-700/70 text-sm font-medium mt-0.5">
                              Open the NoorFilter app on your Android device to purchase a subscription securely through Google Play.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3. Financial Support */}
                    <div 
                      className={`group relative bg-white rounded-3xl transition-all duration-300 cursor-pointer overflow-hidden ${
                        selectedPlan === 'free' 
                          ? 'border-2 border-slate-900 shadow-xl shadow-slate-200 scale-[1.01]' 
                          : 'border border-slate-200/80 hover:border-slate-400 hover:shadow-lg hover:-translate-y-1'
                      }`}
                      onClick={() => setSelectedPlan('free')}
                    >
                      {selectedPlan === 'free' && (
                        <div className="absolute top-6 right-6 text-slate-900 animate-in zoom-in duration-300">
                          <div className="bg-slate-100 p-1 rounded-full">
                            <CheckCircle2 className="w-6 h-6" />
                          </div>
                        </div>
                      )}
                      
                      <div className="p-7 sm:p-9 relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-1.5 bg-amber-100 rounded-lg">
                            <HeartHandshake className="w-5 h-5 text-amber-700" />
                          </div>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Financial Support Request</h3>
                        
                        <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 mb-6 flex gap-4 items-start">
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-900/80 font-semibold leading-relaxed">
                            "আমি এই মুহূর্তে সাবস্ক্রিপশনের খরচ বহন করতে পারছি পণ্ডিত। আমি ফ্রি অ্যাক্সেসের জন্য আবেদন করতে চাই।"
                          </p>
                        </div>

                        {selectedPlan === 'free' ? (
                          <div className="animate-in fade-in duration-500 mt-2">
                            <div className="h-px w-full bg-slate-100 mb-6"></div>
                            <FinancialSupportForm 
                              onSubmitSuccess={(sub) => {
                                setSubscription(sub);
                                setSelectedPlan(null);
                              }} 
                            />
                          </div>
                        ) : (
                          <button 
                            className="w-full py-4 px-6 rounded-2xl font-bold transition-all duration-300 bg-slate-100 text-slate-700 group-hover:bg-slate-200 group-hover:text-slate-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlan('free');
                            }}
                          >
                            Request Support
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
           <div className="absolute inset-0 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
           <ShieldCheck className="w-6 h-6 text-indigo-600 animate-pulse" />
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
