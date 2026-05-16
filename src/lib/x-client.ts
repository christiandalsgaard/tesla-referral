import { TwitterApi } from "twitter-api-v2";

// X (Twitter) API client — uses OAuth 1.0a user context so we can
// post tweets and upload media on behalf of @that_tesla_guy.
// All 4 keys come from the X Developer Portal app's "Keys and Tokens" tab.
export function getXClient() {
  const client = new TwitterApi({
    appKey: process.env.X_API_KEY!,
    appSecret: process.env.X_API_SECRET!,
    accessToken: process.env.X_ACCESS_TOKEN!,
    accessSecret: process.env.X_ACCESS_SECRET!,
  });

  // Return the read-write client (v2 endpoints)
  return client;
}
