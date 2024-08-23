export const MD5 = async (text: string) => {
  const hashBuffer = await crypto.subtle.digest('MD5', new TextEncoder().encode(text));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
