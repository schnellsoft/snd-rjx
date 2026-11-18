// Minimal browser stand-in for a test runner (no Jest here)

export function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (error) {
    console.error(`✗ ${name}`);
    console.error(error);
  }
}

export function expect(actual) {
  return {
    toEqual(expected) {
      const ok = JSON.stringify(actual) === JSON.stringify(expected);
      if (!ok) {
        throw new Error(
          `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
        );
      }
    },
  };
}
