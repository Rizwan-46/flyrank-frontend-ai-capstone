/**
 * Turns a raw error into a safe, user-facing message. Never surfaces
 * error.stack or raw provider error bodies — only a templated string.
 */
export function categorizeChatError(error) {
  const message = (error?.message || "").toLowerCase();

  if (message.includes("quota") || message.includes("resource_exhausted")) {
    return {
      title: "Daily AI quota reached",
      description: "This demo's free AI usage limit has been reached for now. Please try again later.",
    };
  }

  if (message.includes("429") || message.includes("rate limit") || message.includes("too many requests")) {
    return {
      title: "Too many requests",
      description: "Please wait a moment and try again.",
    };
  }

  if (message.includes("failed to fetch") || message.includes("network") || message.includes("load failed")) {
    return {
      title: "Connection lost",
      description: "Check your connection and try again.",
    };
  }

  return {
    title: "Something went wrong",
    description: "Please try again.",
  };
}