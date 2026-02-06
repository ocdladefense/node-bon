import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from "react-router-dom";
import { getContent } from '../../js/utils/book.js';




export default function ChapterContents() {

    let [content, setContent] = useState(null);
    const { isLoggedIn } = useOutletContext();
    let params = useParams();
    let bookId = params.bookId;
    let chapterId = params.chapterId;

    // Determine if the user has access to the book and chapter.
    let [hasAccess, setHasAccess] = useState(false); // Default to true for now.



    useEffect(() => {

        async function checkAccess() {
            // Placeholder for access check logic.
            // For now, we assume access is granted.
            let hasAccess = await Promise.resolve(isLoggedIn);
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
        !hasAccess ? <div className="mt-8 text-center text-gray-500"><a style={{ color: "blue", textDecoration: "underline" }} href="/login">Login for access to this chapter.</a></div> :
            <>
                {content ? <>
                    <div className="mt-8" dangerouslySetInnerHTML={{ __html: content }} />
                </> : ""}
            </>
    )
};
