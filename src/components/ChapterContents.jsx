import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";



async function getBonChapter(book = "tnb", chapter = "1") {

    return await fetch(`/data/${book}/${book}-${chapter}.html`).then(resp => resp.text());
}

window.getBonChapter = getBonChapter;






export default function ChapterContents() {

    let [content, setContent] = useState(null);
    let params = useParams();
    let bookName = params.bookId;
    let chapterNumber = params.chapterId;



    useEffect(() => {
        async function fn() {
            let resp = await getBonChapter(bookName, chapterNumber);
            setContent(resp);
        }
        fn();
    }, []);



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
