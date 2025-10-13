import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { useOutletContext } from 'react-router-dom';






export default function Toc() {

    let [content, setContent] = useState([]);
    let params = useParams();
    let bookId = params.bookId;
    let navigate = useNavigate();


    useEffect(() => {
        async function fn() {
            let resp = await fetch(`/toc/${bookId}`).then(resp => resp.json());
            setContent(resp);
        }
        fn();
    }, []);


    let theList = [];



    theList = content.map((item, index) => {
        return (
            <ul>
                <li key={index} className="mb-2">
                    <a onClick={() => navigate(`/book/${bookId}/${chapterId}`)}>{item}</a>
                </li>
            </ul>
        )
    });


    return (

        <div className="min-h-screen">

            {theList}

        </div>

    );
};


