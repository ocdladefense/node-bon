import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import Toc from './Toc.jsx';
import ChapterContents from './ChapterContents.jsx';


export default function Layout() {



    return (
        <div className="grid grid-cols-6 gap-4 bg-white">
            <div className="col-span-2 p-4 border-r border-solid border-gray-400 sticky top-0"><Toc /></div>
            <div className="col-span-4 p-4"><ChapterContents /></div>
        </div>
    );
};

