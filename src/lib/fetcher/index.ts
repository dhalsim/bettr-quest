import type { DataFetcher } from './types';
import { MockDataFetcher } from './mock-fetcher';
import { NostrDataFetcher } from './nostr-fetcher';

let fetcher: DataFetcher | null = null;

export function createFetcher(): DataFetcher {
  if (!fetcher) {
    fetcher = __DEMO__ 
      ? new MockDataFetcher()
      : new NostrDataFetcher();
  }

  return fetcher;
}

// Export a convenient way to use the fetcher
export const dataFetcher = createFetcher(); 