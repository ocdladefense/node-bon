import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";





export default function Chapter({ navigate, chapterNumber }) {

    let [chapter, setChapter] = useState(null);


    useEffect(() => {
        async function fn() {
            let resp = await fetch("/toc/clfb/" + chapterNumber).then(resp => resp.json());
            setChapter(resp);
        }
        fn();
    }, []);








    return (
        <div className="video-details">


            {chapter ?
                <div>
                    <h2 className="text-large font-bold mb-4">{chapter.name}</h2>
                    <Documents navigate={navigate} chapterNumber={chapterNumber} docs={chapter.files} />
                </div>
                : ""}
        </div>

    );
};


function Documents({ navigate, docs, chapterNumber }) {

    return (
        <div className="documents mb-8">
            <ul>
                {docs.map((doc, index) => (
                    <li className="p-1" key={index}>
                        <a className="mb-2 cursor-pointer" onClick={() => navigate(`/formbook/${chapterNumber}/${doc}`)}>{doc}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

