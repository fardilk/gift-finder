// Simple deterministic 16-hex hash for IDs
// Combines two djb2 variants to produce a 16-character hex string

export function hash16(input: string): string {
  function djb2(str: string, seed = 5381): number {
    let h = seed >>> 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; // h * 33 + c
    }
    return h >>> 0;
  }
  const a = djb2('a:' + input, 5381);
  const b = djb2('b:' + input, 52711);
  const toHex8 = (n: number) => n.toString(16).padStart(8, '0');
  return (toHex8(a) + toHex8(b)).slice(0, 16);
}

export function matchHashedId<T extends string>(ids: T[], hashed: string): T | null {
  // Return matching id if any id hashes to provided 16-hex value
  for (const id of ids) {
    if (hash16(id) === hashed) return id;
  }
  return null;
}
