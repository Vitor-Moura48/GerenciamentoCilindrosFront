export function formatMinutesToHoursAndMinutes(totalMinutes: number): string {
  if (isNaN(totalMinutes) || totalMinutes < 0) {
    return 'N/A';
  }

  // Arredonda para o minuto mais próximo para evitar casas decimais na exibição final
  const roundedTotalMinutes = Math.round(totalMinutes);

  const hours = Math.floor(roundedTotalMinutes / 60);
  const minutes = roundedTotalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes}min`);
  }

  return parts.join(' ');
}
