import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
  {
    "id": "islamic_1",
    "textEn": "Take benefit of five before five: Your youth before your old age, your health before your sickness, your wealth before your poverty, your free time before you are preoccupied, and your life before your death.",
    "textBn": "পাঁচটি জিনিসের পূর্বে পাঁচটি জিনিসের মূল্যায়ন কর: বার্ধক্যের পূর্বে যৌবনকে, অসুস্থতার পূর্বে সুস্থতাকে, দারিদ্র্যের পূর্বে সচ্ছলতাকে, ব্যস্ততার পূর্বে অবসরকে এবং মৃত্যুর পূর্বে জীবনকে।",
    "category": "islamic"
  },
  {
    "id": "islamic_2",
    "textEn": "Two blessings which many people squander: Health and free time.",
    "textBn": "এমন দুটি নিয়ামত রয়েছে যা অধিকাংশ মানুষই হেলায় হারিয়ে ফেলে বা লোকসান করে: স্বাস্থ্য এবং অবসর সময়।",
    "category": "islamic"
  },
  {
    "id": "motivational_1",
    "textEn": "Your focus determines your reality.",
    "textBn": "আপনার মনোযোগই আপনার বাস্তবতা নির্ধারণ করে।",
    "category": "motivational"
  },
  {
    "id": "motivational_2",
    "textEn": "Starve your distractions, feed your focus.",
    "textBn": "বিক্ষেপকে দূরে রাখুন, মনোযোগকে পরিচর্যা করুন।",
    "category": "motivational"
  },
  {
    "id": "motivational_3",
    "textEn": "You will never reach your destination if you stop and throw stones at every dog that barks.",
    "textBn": "পথে প্রতিটি বাধায় আটকে গেলে আপনি কখনোই গন্তব্যে পৌঁছাতে পারবেন না।",
    "category": "motivational"
  },
  {
    "id": "motivational_4",
    "textEn": "The successful warrior is the average man, with laser-like focus.",
    "textBn": "লেজারের মতো মনোযোগ সম্পন্ন একজন সাধারণ মানুষই সফল যোদ্ধা।",
    "category": "motivational"
  }
], {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
}

