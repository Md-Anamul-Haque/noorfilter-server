import { NextResponse } from "next/server";
import adultFilterData from "@/data/filters/blocked-domains/adult.json";
import scamFilterData from "@/data/filters/blocked-domains/scam.json";
import drugsFilterData from "@/data/filters/blocked-domains/drugs.json";
export async function GET() {
  return NextResponse.json({
    adult:adultFilterData.domains,

    gambling: [
      "bet365-demo.com",
      "casino-world.net",
      "poker-play.org",
      "sportsbet-demo.com",
      "luckyjackpot.net"
    ],

    drugs: drugsFilterData.domains,


    malware: [
      "malware-download.com",
      "infected-files.net",
      "virus-demo.org",
      "trojan-center.com",
      "ransomware-host.net"
    ],

    phishing: [
      "paypal-secure-login.com",
      "facebook-login-security.net",
      "bank-verify-account.org",
      "google-auth-check.com",
      "account-warning.net"
    ],

    fraud: [
      "investment-double-money.com",
      "fake-loan.net",
      "crypto-profit-fast.org",
      "earn-million-demo.com"
    ],

    scam: scamFilterData.domains,

    tracking: [
      "tracker-one.com",
      "tracking-network.net",
      "ads-tracker.org",
      "analytics-monitor.com",
      "fingerprint-tracker.net"
    ],

    piracy: [
      "pirated-movies.com",
      "free-premium-apps.net",
      "torrent-download.org",
      "cracked-software.com",
      "warez-demo.net"
    ]
  }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
}