import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { getChapterList } from '../js/utils/book';




export default function Toc({ action }) {

    let [chapterList, setChapterList] = useState([]);
    let params = useParams();
    let bookId = params.bookId;
    let goto = useNavigate();

    let navigate = function(path) {
        goto(path);
        action && action();
    };


    useEffect(() => {
        async function fn() {
            let chapterList = await getChapterList(bookId);
            setChapterList(chapterList);
        }
        fn();
    }, []);


    let theList = [];



    theList = chapterList.map((entry, index) => {
        let chapterNumber = index + 1;
        return (
            <li className="toc-entry mb-2 border-b border-gray-200 py-[0.45rem]" key={index}>
                <a className="cursor-pointer" onClick={() => navigate(`/book/${bookId}/${entry.getUnit()}`)}>
                    <span style={{ color: "rgb(85,100,141)", fontWeight: "bold" }} className="block">{entry.getHeading()}</span>
                    <span className="block">{entry.getName()}</span>
                </a>
            </li>
        )
    });


    return (

        <div className="toc pb-[150px]">
            <ul className="toc-contents">
                {theList}
            </ul>
        </div>

    );
};


