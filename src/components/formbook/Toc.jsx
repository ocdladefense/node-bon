import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import Chapter from './Chapter.jsx';

const chapters = {
    "1": "Chapter 1 Office Forms",
    "2": "Chapter 2 Motions Against the Charging Instrument",
    "3": "Chapter 3 Release From Custody",
    "4": "Chapter 4 Notices",
    "5": "Chapter 5 Dismissal of Charges",
    "6": "Chapter 6 Psychiatric",
    "7": "Chapter 7 Pretrial Motions",
    "8": "Chapter 8 Discovery",
    "9": "Chapter 9 Witnesses",
    "10": "Chapter 10 Consolidation/Severance",
    "11": "Chapter 11 Continuance",
    "12": "Chapter 12 Change of Venue",
    "13": "Chapter 13 Motion to Disqualify Judge",
    "14": "Chapter 14 Withdrawal of Attorney",
    "15": "Chapter 15 Jury Instructions",
    "16": "Chapter 16 Special Problems",
    "17": "Chapter 17 Sentencing, Dispositional, and Post-Trial Matters",
    "18": "Chapter 18 Appeals",
    "19": "Chapter 19 Habeus Corpus"
};



export default function Toc({ action }) {

    // let navigate = useNavigate();
    let numbers = Object.keys(chapters);
    let titles = Object.values(chapters);


    let goto = useNavigate();

    let navigate = function(path) {
        goto(path);
        action && action();
    };


    return (
        <div className="max-h-screen video-details overflow-y-auto">
            <h1>Criminal Law Formbook</h1>
            <h3>2021 Edition</h3>

            <div className="documents mb-8">
                <ul>
                    {numbers.map((number, index) => (
                        <li className="p-1" key={index}>
                            <Chapter navigate={navigate} chapterNumber={number} />
                        </li>
                    ))}
                </ul>
            </div>

        </div>

    );
};


