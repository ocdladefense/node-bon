



export default class Cache {

    hits;

    misses;

    results;

    variants;

    static META_KEY = 'district_cache_stats';
    static VARIANTS_KEY = 'district_cache_variants';



    constructor() {
        this.hits = 0;
        this.misses = 0;
        this.results = new Map(); // Store results with zipcode as key
        this.variants = {}; // Store variant data keyed by zipcode
        this.STATS_KEY = Cache.META_KEY; // Key for storing stats
    }

    // Load cache results and stats from localStorage
    static loadFromLocalStorage() {

        let cache = new Cache();


        try
        {
            // Load all items from localStorage that match cache pattern
            for (let i = 0; i < localStorage.length; i++)
            {
                const key = localStorage.key(i);
                // Skip stats key and variants key, load everything else as cache entries
                if (key && key !== Cache.META_KEY && key !== Cache.VARIANTS_KEY)
                {
                    const stored = localStorage.getItem(key);
                    if (stored)
                    {
                        const parsed = JSON.parse(stored);
                        cache.results.set(key, parsed);
                    }
                }
            }

            // Load previous stats, if any.
            const stats = localStorage.getItem(Cache.META_KEY);
            if (stats)
            {
                const { hits, misses } = JSON.parse(stats);
                cache.hits = hits || 0;
                cache.misses = misses || 0;
            }

            // Load variants, if any.
            const variantsData = localStorage.getItem(Cache.VARIANTS_KEY);
            if (variantsData)
            {
                cache.variants = JSON.parse(variantsData);
            }
        } catch (e)
        {
            console.error('Error loading cache from localStorage:', e);
        }
        return cache;
    }


    // Load cache from server
    static async loadFromServer() {
        try {
            // Attempt to fetch cache data from the server
            const response = await fetch('/api/cache');
            if (!response.ok) {
                console.warn(`Failed to load cache from server: ${response.status}`);
                return new Cache();
            }
            // If successful, parse the JSON and create a Cache instance
            const data = await response.json();
            return Cache.fromJSON(data);
        } catch (error) {
            // If there's an error (e.g., network issue), log it and return an empty cache
            console.error('Error loading cache from server:', error);
            return new Cache();
        }
    }

    // Save cache to server
    async saveToServer() {
        try {
            // Convert cache to JSON and send it to the server
            const data = this.toJSON();
            // Use fetch to POST the cache data to the server
            const response = await fetch('/api/cache', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            // Check if the response is OK
            if (!response.ok) {
                console.error(`Failed to save cache to server: ${response.status}`);
                return false;
            }
            return true;
        } catch (error) {
            // Log any errors that occur during the fetch operation
            console.error('Error saving cache to server:', error);
            return false;
        }
    }

    // Convert cache to JSON for storage
    toJSON() {
        // Convert the Map of results to an array of [key, value] pairs for JSON serialization
        return {
            hits: this.hits,
            misses: this.misses,
            results: Array.from(this.results.entries()),
            variants: this.variants
        };
    }

    // Create cache from JSON
    static fromJSON(data) {
        // Create a new Cache instance and populate it with data from JSON
        const cache = new Cache();
        if (data.hits !== undefined) cache.hits = data.hits;
        if (data.misses !== undefined) cache.misses = data.misses;
        if (data.results) {
            cache.results = new Map(data.results);
        }
        if (data.variants) {
            cache.variants = data.variants;
        }
        return cache;
    }

    // Save a single cache entry to localStorage
    saveToLocalStorage() {
        // Save all cache entries to localStorage
        this.results.forEach((result, zipcode) => {
            if (zipcode && result)
            {
                localStorage.setItem(zipcode, JSON.stringify(result));
            }
        });

        // Save stats
        localStorage.setItem(this.STATS_KEY, JSON.stringify({
            hits: this.hits,
            misses: this.misses
        }));

        // Save variants
        localStorage.setItem(Cache.VARIANTS_KEY, JSON.stringify(this.variants));

        // If a variant with the same house and senate already exists in the cache don't save it again

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
    // Returns cached result only if it exists AND no variants exist for this zipcode
    // If variants exist for a zipcode, returns null to force a fresh lookup
    // (since we can't know which variant applies without the full address)
    lookup(zipcode) {
        if (!zipcode) return null; // Guard against undefined zip


        // Check if we have a cached entry for this ZIP
        const cached = this.results.get(zipcode);

        // If variants exist for this zipcode, we can't use cache (return null for fresh lookup)
        // Also return null if no cached entry exists
        if (this.variants[zipcode] || !cached)
        {
            this.misses++;
            return null;
        }

        // Cache hit: we have a result and no conflicting variants
        this.hits++;
        return cached;

    }

    // Store a result in the cache
    put(addr) {
        if (!addr.zip)
        {
            console.warn('Address has no ZIP, skipping cache store:', addr.address);
            return;
        }

        // Create single cache entry for this zipcode
        const store = {
            zipcode: addr.zip,
            house: addr.house,
            senate: addr.senate
        };

        // If either district is null, we might want to skip caching this result or handle it differently
        if (store.house == null || store.senate == null)
        {
            console.warn('Address has null district, skipping cache store:', addr.address);
            return;
        }

        // Check if we already have a cached result for this zipcode
        const existing = this.results.get(addr.zip);

        if (existing)
        {
            // Compare the new result with the existing cached result
            const sameHouse = existing.house === store.house;
            const sameSenate = existing.senate === store.senate;

            // If the districts differ, this is a variant
            if (!sameHouse || !sameSenate)
            {
                // Initialize variants array for this zipcode if it doesn't exist
                if (!this.variants[addr.zip])
                {
                    this.variants[addr.zip] = [];
                }
                
                // Check if this exact variant (same house and senate) already exists
                const variantExists = this.variants[addr.zip].some(v => 
                    v.house === store.house && v.senate === store.senate
                );
                
                // Only store the variant if it doesn't already exist
                if (!variantExists)
                {
                    this.variants[addr.zip].push(store);
                    console.log(`Variant found for ZIP ${addr.zip}: House ${store.house}, Senate ${store.senate}`);
                }
                else
                {
                    console.log(`Variant already exists for ZIP ${addr.zip}: House ${store.house}, Senate ${store.senate}`);
                }
            }
        }

        // Always update the main cache entry with the latest result
        this.results.set(addr.zip, store);
    }

    // Get all cached results
    getResults() {
        return Array.from(this.results.values());
    }

    // Get variants for a specific zipcode (or all variants if no zipcode provided)
    getVariants(zipcode = null) {
        if (zipcode)
        {
            return this.variants[zipcode] || [];
        }
        return this.variants;
    }

    // Clear the cache and reset stats
    clear() {
        this.results.clear();
        this.variants = {};
        this.hits = 0;
        this.misses = 0;

        // Remove all cache entries from localStorage
        for (let i = localStorage.length - 1; i >= 0; i--)
        {
            const key = localStorage.key(i);
            if (key && key !== this.STATS_KEY && key !== Cache.VARIANTS_KEY)
            {
                localStorage.removeItem(key);
            }
        }
        localStorage.removeItem(this.STATS_KEY);
        localStorage.removeItem(Cache.VARIANTS_KEY);
    }
}


