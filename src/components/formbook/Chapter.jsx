import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";





export default function Chapter() {

    let [chapter, setChapter] = useState(null);
    let params = useParams();
    let chapterNumber = params.chapterId;



    useEffect(() => {
        async function fn() {
            let resp = await fetch("/toc/" + chapterNumber).then(resp => resp.json());
            setChapter(resp);
        }
        fn();
    }, []);








    return (
        <div className="video-details min-h-screen">
            <h1>Criminal Law Formbook</h1>
            <h3>2021 Edition</h3>

            {chapter ?
                <div>
                    <h2 className="text-2xl font-bold mb-4">{chapter.name}</h2>
                    <Documents chapterNumber={chapterNumber} title={chapter.name} docs={chapter.files} />
                </div>
                : ""}
        </div>

    );
};


function Documents({ chapterNumber, title, docs }) {

    let navigate = useNavigate();

    return (
        <div className="documents mb-8">
            <ul>
                {docs.map((doc, index) => (
                    <li key={index}>
                        <a href="#" onClick={() => navigate(`/form/${chapterNumber}/${doc}`)} chapterNumberclassName="mb-2">{doc}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

