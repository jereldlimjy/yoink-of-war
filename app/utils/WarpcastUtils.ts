import { getBaseUrl } from "./URLUtils";

export function buildShareUrl(handle: string, battleId: string) {
  const text = `Prepare your butt @${handle}. I challenge you to a yoink-off!`;
  const embed = "https://farcaster.xyz";

  const shareUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(
    text
  )}&embeds[]=${getBaseUrl()}/api/battle/${battleId}`;

  return shareUrl;
}
