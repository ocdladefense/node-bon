import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from 'react-router-dom';



async function getBonChapter(book = "tnb", chapter = "1") {

    return await fetch(`https://ocdla.app/content/uploads/modules/bon/${book}-${chapter}.html`).then(resp => resp.text());
}

window.getBonChapter = getBonChapter;





export function Book() {

    let [content, setContent] = useState(null);
    let params = useParams();
    let bookName = params.bookId;



    useEffect(() => {
        async function fn() {
            let resp = await fetch("/toc").then(resp => resp.json());
            setContent(resp);
        }
        fn();
    }, []);


    let theList = [];



    for (let chapter in content) {

        let docs = content[chapter];
        theList.push(<Documents key={chapter} title={chapter} docs={docs} />);
    }


    return (

        <div className="video-details bg-zinc-900 min-h-screen">

            {theList}

        </div>

    );
};


function Documents({ title, docs }) {
    return (
        <div className="documents mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#c5baba" }}>{title}</h2>
            <ul>
                {docs.map((doc, index) => (
                    <li key={index} style={{ color: "#c5baba" }} className="mb-2">{doc}</li>
                ))}
            </ul>
        </div>
    )
}




export default function VideoDetails() {

    let [content, setContent] = useState(null);
    let params = useParams();
    let bookName = params.bookId;
    let chapterNumber = params.chapterId;

    // Use react-router-dom hook.
    let { parser, user } = useOutletContext();

    let navigate = useNavigate();



    useEffect(() => {
        async function fn() {
            let resp = await getBonChapter(bookName, chapterNumber);
            setContent(resp);
        }
        fn();
    }, []);



    return (

        <div className="video-details bg-zinc-900 min-h-screen">

            {content ?
                <div className="video-content relative w-full">
                    <div style={{ color: "#c5baba" }} dangerouslySetInnerHTML={{ __html: content }} />
                </div>
                : ""}

        </div>

    );
};
