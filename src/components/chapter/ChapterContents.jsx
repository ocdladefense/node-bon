import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { getContent } from '../../js/utils/book.js';




export default function ChapterContents() {

    let [content, setContent] = useState(null);
    let params = useParams();
    let bookId = params.bookId;
    let chapterId = params.chapterId;

    // Determine if the user has access to the book and chapter.
    let [hasAccess, setHasAccess] = useState(false); // Default to true for now.



    useEffect(() => {

        async function checkAccess() {
            // Placeholder for access check logic.
            // For now, we assume access is granted.
            let hasAccess = await Promise.resolve(true);
            setHasAccess(hasAccess);
        }
        checkAccess();
    });



    useEffect(() => {
        async function fn() {
            let resp = await getContent(bookId, chapterId);
            setContent(resp);
        }
        fn();
    }, [hasAccess, chapterId, bookId]);



    return (
        <>
            {content ? <>
                <div className="mt-8" dangerouslySetInnerHTML={{ __html: content }} />
            </> : ""}
        </>
    )
};
