import { TableOfContents as IconTableOfContents } from 'lucide-react';





export default function ChapterToolbar({ bookId, label, name, openModal }) {

    return (
        <h2 style={{ borderRadius: "0px 0px 8px 8px", zIndex: "100" }} className="my-0 mt-8 sticky top-0 p-4 bg-ocdla-dark-blue text-white">
            <span style={{ cursor: "pointer", display: "inline-block", verticalAlign: "middle", marginRight: "1.0rem" }}>
                <a onClick={openModal}>
                    <IconTableOfContents />
                </a>
            </span>
            {bookId.toUpperCase()} | {label} - {name}
        </h2>
    );
}
