export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export function formatDate(rawDate){
  const date = new Date(rawDate);
  const formatted = date.toLocaleDateString('es-CO', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC'
});

return formatted;
}