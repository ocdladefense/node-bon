import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { getContent } from '../js/utils/book.js';



/*
async function getBonChapter(book = "tnb", chapter = "1") {

    return await fetch(`/data/${book}/${book}-${chapter}.html`).then(resp => resp.text());
}

window.getBonChapter = getBonChapter;
*/





export default function ChapterContents() {

    let [content, setContent] = useState(null);
    let params = useParams();
    let bookName = params.bookId;
    let chapterId = params.chapterId;



    useEffect(() => {
        async function fn() {
            let resp = await getContent(bookName, chapterId);
            setContent(resp);
        }
        fn();
    }, [chapterId]);



    return (

        <div className="video-details min-h-screen">

            {content ?
                <div className="video-content relative w-full">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                : ""}

        </div>

    );
};
