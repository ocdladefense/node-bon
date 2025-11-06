import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { getContent } from '../../js/utils/book.js';




export default function ChapterContents() {

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
        <>
            {content ? <>
                <div className="mt-8" dangerouslySetInnerHTML={{ __html: content }} />
            </> : ""}
        </>
    )
};
