import { redirect } from "next/navigation";
// import { getServerSession } from "next-auth"; // অথবা আপনার Auth Provider
import Link from "next/link";

export default async function MePage() {
  const session = {
    // mock session data for demonstration
    user: {
      id: "user123",
      name: "John Doe",
      email: "johndoe@gmail.com",
        role: "user", // or "admin"
    }
  } //await getServerSession();
  
  if (!session) {
    redirect("/api/auth/signin");
  }

  // Database থেকে ইউজারের মেয়াদ নিয়ে আসা (ধরি ডাটাবেস থেকে পাচ্ছেন)
  const userValidUntil = Date.now() + 3600 * 1000 // Example: valid for 1 hour

  const token = "JWT_SECURE_TOKEN_OR_USER_ID"; 
  
  // Android অ্যাপের জন্য Deep Link
  const appDeepLink = `noorfilter://auth?token=${token}&valid_until=${userValidUntil}`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">আপনার সদস্যপদ</h1>
        
        <div className="bg-blue-50 text-blue-800 rounded-lg p-4 my-6 text-left">
          <p className="text-sm font-medium">বর্তমান পরিকল্পনা: <span className="font-bold">Premium</span></p>
          <p className="text-sm font-medium mt-2">অ্যাক্সেস মেয়াদ: <span className="font-bold">৩১ ডিসেম্বর, ২০২৬</span></p>
        </div>

        <p className="text-gray-600 mb-8 text-sm">
          আপনার পেমেন্ট বা সাবস্ক্রিপশন আপডেট হয়ে থাকলে নিচের বাটনে ক্লিক করে অ্যাপে অ্যাক্সেস যাচাই করুন।
        </p>

        <Link 
          href={appDeepLink}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200"
        >
          অ্যাক্সেস যাচাই করে অ্যাপে ফিরুন
        </Link>
      </div>
    </div>
  );
}