import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";





export default function Chapter({ chapterId, setActiveForm }) {

    let [chapter, setChapter] = useState(null);
    let params = useParams();
    let chapterNumber = chapterId || params.chapterId;



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
                    <Documents setActiveForm={setActiveForm} chapterNumber={chapterNumber} title={chapter.name} docs={chapter.files} />
                </div>
                : ""}
        </div>

    );
};


function Documents({ docs, setActiveForm }) {

    // let navigate = useNavigate();

    return (
        <div className="documents mb-8">
            <ul>
                {docs.map((doc, index) => (
                    <li className="p-1" key={index}>
                        <a className="cursor-pointer" onClick={() => setActiveForm(doc)} chapterNumberclassName="mb-2">{doc}</a>
                    </li>
                ))}
            </ul>
        </div>
    )
}

