import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";





export default function Toc({ action }) {

    let [content, setContent] = useState([]);
    let params = useParams();
    let bookId = params.bookId;
    let goto = useNavigate();

    let navigate = function(path) {
        goto(path);
        action && action();
    };


    useEffect(() => {
        async function fn() {
            let resp = await fetch(`/toc/${bookId}`).then(resp => resp.json());
            setContent(resp);
        }
        fn();
    }, []);


    let theList = [];



    theList = Object.values(content).map((item, index) => {
        let chapterNumber = index + 1;
        return (
            <li className="toc-entry mb-2 border-b border-gray-200 py-6" key={index}>
                <a className="cursor-pointer" onClick={() => navigate(`/book/${bookId}/${chapterNumber}`)}>
                    <span className="block">Chapter {chapterNumber}</span>
                    <span className="block">{item}</span>
                </a>
            </li>
        )
    });


    return (

        <div className="toc sticky top-0">
            <ul className="toc-contents">
                {theList}
            </ul>
        </div>

    );
};


