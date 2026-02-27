class Cache {
    constructor() {
        this.hits = 0;
        this.misses = 0;
        this.results = new Map(); // Store results with zipcode as key and address info as value
        this.STORAGE_KEY = 'district_cache'; // Key for storing cache results in localStorage
        this.STATS_KEY = 'district_cache_stats'; // Separate key for stats to avoid conflicts with results data
        
        // Load existing cache from localStorage
        this.loadFromLocalStorage();
    }

    // Load cache results and stats from localStorage
    loadFromLocalStorage() {
        // Load cached results
        try {
            // Get stored cache data
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Convert array back to Map
                this.results = new Map(parsed);
            }
            
            // Load stats
            const stats = localStorage.getItem(this.STATS_KEY);
            if (stats) {
                // Parse stats and set hits/misses
                const { hits, misses } = JSON.parse(stats);
                this.hits = hits || 0;
                this.misses = misses || 0;
            }
        } catch (e) {
            console.error('Error loading cache from localStorage:', e);
        }
    }

    // Save cache results and stats to localStorage
    saveToLocalStorage() {
        try {
            // Convert Map to array for JSON serialization
            const serialized = JSON.stringify(Array.from(this.results.entries()));
            localStorage.setItem(this.STORAGE_KEY, serialized);
            
            // Save stats
            localStorage.setItem(this.STATS_KEY, JSON.stringify({
                hits: this.hits,
                misses: this.misses
            }));
        } catch (e) {
            console.error('Error saving cache to localStorage:', e);
        }
    }

    // Getters for hits and misses
    getHits() {
        return this.hits;
    }

    // Get number of cache misses
    getMisses() {
        return this.misses;
    }

    // Look up a specific address in the cache by zip and address string
    lookUp(zipcode, addressString = null) {
        if (!zipcode) return null; // Guard against undefined zip

        // Check if we have a zipcode match in the cache
        const cachedEntries = this.results.get(zipcode);

        // If we have cached entries for this ZIP, it's a hit
        if (cachedEntries && cachedEntries.length > 0) {
            // ZIP match counts as a hit
            this.hits++;
            this.saveToLocalStorage();

            // If we have an address string, try to find an exact match
            if (addressString) {
                const exactMatch = cachedEntries.find(entry => entry.address === addressString);
                if (exactMatch) {
                    return exactMatch;
                }
            }

            // Fallback: return the first cached entry for that ZIP
            return cachedEntries[0];
        }

        // No match found, count as a miss
        this.misses++;
        this.saveToLocalStorage();
        return null;
    }

    // Store a result in the cache
    storeResult(addr) {
        if (!addr.zip) {
            console.warn('Address has no ZIP, skipping cache store:', addr.address);
            return;
        }

        // Prepare cache data for storage
        const cacheData = {
            address: addr.address,
            zip: addr.zip,
            location: addr.location ? {
                lat: addr.location.lat(),
                lng: addr.location.lng()
            } : null,
            houseId: addr.house ? addr.house.id : null,
            senateId: addr.senate ? addr.senate.id : null
        };

        // Get existing entries for this ZIP, or initialize an empty array
        const existing = this.results.get(addr.zip) || [];

        // Avoid storing duplicate entries for the same address
        const alreadyStored = existing.find(c => c.address === addr.address);
        if (!alreadyStored) {
            existing.push(cacheData);
            this.results.set(addr.zip, existing);
            this.saveToLocalStorage();
        }
    }

    // Get all cached results as an array
    getResults() {
        return Array.from(this.results.values());
    }

    // Clear the cache and reset stats
    clear() {
        this.results.clear();
        this.hits = 0;
        this.misses = 0;
        localStorage.removeItem(this.STORAGE_KEY);
        localStorage.removeItem(this.STATS_KEY);
    }
}

export default Cache;
