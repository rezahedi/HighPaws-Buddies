export function formatRelativeDate(inputDate: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'few seconds ago';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 31536000) {
    // Within the current year
    return inputDate.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric' });
  } else {
    // Previous years
    return inputDate.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).slice(0, -6);
  }
}