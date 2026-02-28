class Cache {
    constructor() {
        this.hits = 0;
        this.misses = 0;
        this.results = new Map(); // Store results with zipcode as key
        this.STATS_KEY = 'district_cache_stats'; // Key for storing stats
        
        // Load existing cache from localStorage
        this.loadFromLocalStorage();
    }

    // Load cache results and stats from localStorage
    loadFromLocalStorage() {
        try {
            // Load all items from localStorage that match cache pattern
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                // Skip stats key, load everything else as cache entries
                if (key && key !== this.STATS_KEY && !key.startsWith('district_cache_stats')) {
                    const stored = localStorage.getItem(key);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        this.results.set(key, parsed);
                    }
                }
            }
            
            // Load stats
            const stats = localStorage.getItem(this.STATS_KEY);
            if (stats) {
                const { hits, misses } = JSON.parse(stats);
                this.hits = hits || 0;
                this.misses = misses || 0;
            }
        } catch (e) {
            console.error('Error loading cache from localStorage:', e);
        }
    }

    // Save a single cache entry to localStorage
    saveToLocalStorage(zipcode, result) {
        try {
            localStorage.setItem(zipcode, JSON.stringify(result));
            
            // Save stats
            localStorage.setItem(this.STATS_KEY, JSON.stringify({
                hits: this.hits,
                misses: this.misses
            }));
        } catch (e) {
            console.error('Error saving cache to localStorage:', e);
        }
    }

    // Get number of cache hits
    getHits() {
        return this.hits;
    }

    // Get number of cache misses
    getMisses() {
        return this.misses;
    }

    // Look up a result by zipcode
    lookUp(zipcode) {
        if (!zipcode) return null; // Guard against undefined zip

        // Check if we have a cached entry for this ZIP
        const cached = this.results.get(zipcode);

        if (cached) {
            this.hits++;
            this.saveToLocalStorage(zipcode, cached);
            return cached;
        }

        // No match found, count as a miss
        this.misses++;
        this.saveToLocalStorage(zipcode, null);
        return null;
    }

    // Store a result in the cache
    storeResult(addr) {
        if (!addr.zip) {
            console.warn('Address has no ZIP, skipping cache store:', addr.address);
            return;
        }

        // Create single cache entry for this zipcode
        const cacheData = {
            zipcode: addr.zip,
            house: addr.house ? addr.house.id : null,
            senate: addr.senate ? addr.senate.id : null
        };

        // Store in memory Map
        this.results.set(addr.zip, cacheData);
        
        // Save to localStorage with zipcode as key
        this.saveToLocalStorage(addr.zip, cacheData);
    }

    // Get all cached results
    getResults() {
        return Array.from(this.results.values());
    }

    // Clear the cache and reset stats
    clear() {
        this.results.clear();
        this.hits = 0;
        this.misses = 0;
        
        // Remove all cache entries from localStorage
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const key = localStorage.key(i);
            if (key && key !== this.STATS_KEY) {
                localStorage.removeItem(key);
            }
        }
        localStorage.removeItem(this.STATS_KEY);
    }
}

export default Cache;
