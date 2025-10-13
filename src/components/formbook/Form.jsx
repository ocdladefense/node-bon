import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from 'react-router-dom';
import { renderAsync } from 'docx-preview';


async function getForm(chapterId, formId) {

    let resp = await fetch(`/data/clfb/${chapterId}/${formId}`);
    // let resp = await fetch(`/data/clfb/2/${formId}.docx`);

    return await resp.arrayBuffer();
}





export default function Form({ chapterNumber, formId }) {


    let viewerRef = useRef(null);
    let [chapter, setChapter] = useState({});



    useEffect(() => {
        async function fn() {
            let resp1 = await fetch("/toc/clfb/" + chapterNumber).then(resp => resp.json());
            setChapter(resp1);
            let resp2 = await getForm(chapterNumber, formId);
            // setContent(resp);
            renderAsync(resp2, viewerRef.current, null, { inWrapper: true, ignoreWidth: true });
        }
        fn();
    }, [formId]);



    return (

        <div className="video-details min-h-screen pt-4">


            <div className="video-content relative w-full">
                <h1 className="text-xl font-bold">{formId}</h1>
                <h1>Criminal Law Formbook</h1>
                <h3>2021 Edition</h3>
                <h2>{chapter.name}</h2>
                <div className="pt-4" ref={viewerRef} style={{ maxWidth: "90%", overflow: "scroll" }}>

                </div>
            </div>


        </div>

    );
};
