import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "1",
      textEn: "Stay focused and keep moving forward.",
      textBn: "মনোযোগ ধরে রাখুন এবং এগিয়ে চলুন।",
      category: "motivation",
    },
    {
      id: "2",
      textEn: "Small steps lead to big results.",
      textBn: "ছোট পদক্ষেপ বড় ফলাফল নিয়ে আসে।",
      category: "success",
    },
    {
      id: "3",
      textEn: "Patience is the key to growth.",
      textBn: "ধৈর্যই উন্নতির চাবিকাঠি।",
      category: "life",
    },
    {
      id: "4",
      textEn: "Every challenge is a chance to improve.",
      textBn: "প্রতিটি চ্যালেঞ্জ উন্নতির একটি সুযোগ।",
      category: "motivation",
    },
    {
      id: "5",
      textEn: "Discipline beats motivation.",
      textBn: "প্রেরণার চেয়ে শৃঙ্খলা বেশি শক্তিশালী।",
      category: "discipline",
    },
    {
      id: "6",
      textEn: "Your future is created by today's actions.",
      textBn: "আজকের কাজই আগামীকাল তৈরি করে।",
      category: "success",
    },
    {
      id: "7",
      textEn: "Knowledge grows when shared.",
      textBn: "জ্ঞান ভাগ করলে বৃদ্ধি পায়।",
      category: "education",
    },
    {
      id: "8",
      textEn: "Be kind even when nobody is watching.",
      textBn: "কেউ না দেখলেও সদয় থাকুন।",
      category: "character",
    },
    {
      id: "9",
      textEn: "Time is your most valuable asset.",
      textBn: "সময় আপনার সবচেয়ে মূল্যবান সম্পদ।",
      category: "productivity",
    },
    {
      id: "10",
      textEn: "Consistency creates excellence.",
      textBn: "ধারাবাহিকতা উৎকর্ষতা তৈরি করে।",
      category: "discipline",
    },
    {
      id: "11",
      textEn: "Dream big, start small.",
      textBn: "বড় স্বপ্ন দেখুন, ছোট থেকে শুরু করুন।",
      category: "motivation",
    },
    {
      id: "12",
      textEn: "Gratitude turns what we have into enough.",
      textBn: "কৃতজ্ঞতা যা আছে তাকেই যথেষ্ট করে তোলে।",
      category: "life",
    },
    {
      id: "13",
      textEn: "Hard work compounds over time.",
      textBn: "পরিশ্রম সময়ের সাথে বহুগুণ ফল দেয়।",
      category: "success",
    },
    {
      id: "14",
      textEn: "Protect your mind from harmful influences.",
      textBn: "ক্ষতিকর প্রভাব থেকে আপনার মনকে রক্ষা করুন।",
      category: "awareness",
    },
    {
      id: "15",
      textEn: "A clear goal gives direction.",
      textBn: "স্পষ্ট লক্ষ্য জীবনে দিকনির্দেশনা দেয়।",
      category: "productivity",
    }
  ], {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
}