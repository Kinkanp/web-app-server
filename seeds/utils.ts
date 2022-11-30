export function getRandomNumber(): number {
  const from = 0;
  const to = 999;

  return Math.floor(Math.random() * (from - to) + to);
}