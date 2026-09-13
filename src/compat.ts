// Polyfill/runtime compatibility helper: Ensure window.fetch / globalThis.fetch can be
// assigned to in strict-mode modules or polyfills (e.g. formdata-polyfill, ad scripts)
// without encountering "TypeError: Cannot set property fetch of #<Window> which has only a getter"
(function ensureFetchWritable() {
  try {
    const targets = [
      typeof window !== 'undefined' ? window : null,
      typeof globalThis !== 'undefined' ? globalThis : null
    ].filter(Boolean) as (Window | typeof globalThis)[];

    for (const target of targets) {
      if ('fetch' in target) {
        let currentFetch = target.fetch;
        try {
          Object.defineProperty(target, 'fetch', {
            get: () => currentFetch,
            set: (newFetch: typeof window.fetch) => {
              currentFetch = newFetch;
            },
            configurable: true,
            enumerable: true
          });
        } catch {
          // If property cannot be reconfigured, ignore
        }
      }
    }
  } catch {
    // Ignore any environment restrictions
  }
})();

export {};
