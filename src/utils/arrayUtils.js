// Array utility functions

export function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Helper to fetch JSON content from a URL
export async function fetchJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch JSON from ${url}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}
