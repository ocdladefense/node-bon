import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import Toc from './Toc.jsx';
import Form from './Form.jsx';



export default function Layout() {

    let params = useParams();
    let chapterNumber = params.chapterId;
    let formId = params.formId;




    return (
        <div class="grid grid-cols-6 gap-4 bg-white">
            <div class="col-span-2 p-4 border-r border-solid border-gray-400"><Toc activeChapter={chapterNumber} activeForm={formId} /></div>
            <div class="col-span-4 p-4"><Form chapterNumber={chapterNumber} formId={formId} /></div>
        </div>
    );
};

