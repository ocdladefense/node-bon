export default class Entry {
    #id;
    #name;
    #label;

    constructor(name, label, id) {
        this.#id = id;
        this.#name = name;
        this.#label = label;
    }

    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getHeading() {
        return this.#label;
    }

    getHref() {
        return "/" + this.getId().replace("-", "/");
    }

    // Return only the unit portion of the ID
    // Example: for "tnb-1.2", return "1.2"
    getUnit() {
        return this.getId().split("-")[1];
    }

    isChapter() {
        return this.#label.includes("Chapter");
    }

    getBook() {
        return this.#id.split("-")[0];
    }

    getUnit() {
        return this.#id.split("-")[1];
    }

    toNode() {
        // Make our table of contents link from our ID.
        // This is the entire item as well, since we want it all to be clickable
        const href = this.getHref();
        const a = document.createElement("a");
        a.setAttribute("id", this.getId());
        a.setAttribute("href", href);
        a.setAttribute("title", " - " + this.getName());
        a.setAttribute("class", "nav-item");
        a.setAttribute("data-book", this.getBook());
        a.setAttribute("data-unit", this.getUnit());

        // Get the name of our TOC item
        // Example: Crime Seriousness Rankings
        const div = document.createElement("div");
        div.setAttribute("class", "chapter-name");
        div.innerHTML = this.getName();

        // Get the label of our TOC item
        // Example: Chapter 1
        const span = document.createElement("span");
        span.setAttribute("class", "label");
        span.innerHTML = this.getHeading();

        // We don't want sections to have labels
        if (this.isChapter()) {
            a.appendChild(span);
        }

        a.appendChild(div);

        return a;
    }
}
