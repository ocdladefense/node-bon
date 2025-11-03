import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { getContent } from '../js/utils/book.js';




export default function ChapterContents({ label, name, authors }) {

    let [content, setContent] = useState(null);
    let params = useParams();
    let bookId = params.bookId;
    let chapterId = params.chapterId;



    useEffect(() => {
        async function fn() {
            let resp = await getContent(bookId, chapterId);
            setContent(resp);
        }
        fn();
    }, [chapterId, bookId]);



    return (

        <div className="video-details min-h-screen">

            {content ?
                <div className="video-content relative w-full">
                    <h2 className="text-3xl font-bold my-0">{label} - {name}</h2>
                    <h3 className="my-0">{authors}</h3>
                    <h2 style={{ borderRadius: "0px 0px 8px 8px", zIndex: "100" }} className="my-0 sticky top-0 p-4 bg-ocdla-dark-blue text-white">{bookId.toUpperCase()} | {label} - {name}</h2>
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                : ""}

        </div>

    );
};
