import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import Toc from './Toc.jsx';
import Form from './Form.jsx';



export default function Layout() {

    let [formId, setFormId] = useState(null);

    let setActiveForm = function(formId) {
        // let chapterId = e.target.dataset.chapterId;
        // let formId = e.target.dataset.formId;
        console.log(formId);
        setFormId(formId);
    };

    return (
        <div class="grid grid-cols-6 gap-4 bg-white">
            <div class="col-span-2 p-4 border-r border-solid border-gray-400"><Toc setActiveForm={setActiveForm} /></div>
            <div class="col-span-4 p-4">{!formId ? "" : <Form formId={formId} />}</div>
        </div>
    );
};

