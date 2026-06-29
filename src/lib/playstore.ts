import gplay from 'google-play-scraper';

export async function getAppDetails(appId: string) {
  try {
    const details = await gplay.app({ appId });
    return {
      version: details.version || "Latest",
      recentChanges: details.recentChanges || "General bug fixes and performance improvements.",
    };
  } catch (error) {
    console.error("Failed to fetch app details from Google Play:", error);
    return {
      version: "Latest",
      recentChanges: "General bug fixes and performance improvements.",
    };
  }
}
