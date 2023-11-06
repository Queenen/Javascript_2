export function timeAgo(isoDate) {
  try {
    if (!isoDate) {
      throw new Error("Invalid date input");
    }

    const now = new Date();
    const date = new Date(isoDate);
    const secondsPast = (now - date) / 1000;

    if (secondsPast < 60) {
      return secondsPast === 1
        ? "1 second ago"
        : `${Math.round(secondsPast)} seconds ago`;
    }
    if (secondsPast < 3600) {
      const minutes = Math.round(secondsPast / 60);
      return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    }
    if (secondsPast <= 86400) {
      const hours = Math.round(secondsPast / 3600);
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    }
    if (secondsPast <= 2592000) {
      const days = Math.round(secondsPast / 86400);
      return days === 1 ? "1 day ago" : `${days} days ago`;
    }
    if (secondsPast <= 31536000) {
      const months = Math.round(secondsPast / 2592000);
      return months === 1 ? "1 month ago" : `${months} months ago`;
    }
    const years = Math.round(secondsPast / 31536000);
    return years === 1 ? "1 year ago" : `${years} years ago`;
  } catch (error) {
    console.error("Error in timeAgo:", error);
    return "Invalid date";
  }
}
