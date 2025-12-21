export function formatDate(date) {
  const options = { month: 'short', day: 'numeric', year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
}