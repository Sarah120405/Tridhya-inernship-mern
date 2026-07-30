export function numberGenerator() {
  const randomNumber = Math.floor(Math.random() * 1000000);
  const timestamp = new Date().toISOString();
  return { randomNumber, timestamp };
}
