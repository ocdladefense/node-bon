import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";


let covers = ["tnb-cover.png", "clfb-cover.png"];


export default function BookCovers() {

    let navigate = useNavigate();

    return <div className="grid grid-cols-12 gap-4 bg-white min-h-screen">
        <div className="col-span-4 phone:col-span-6">
            <a className="cursor-pointer" onClick={() => navigate("/formbook/1")}>
                <img src="/images/covers/clfb-cover.png" />
            </a>
        </div>
        <div className="col-span-4 phone:col-span-6">
            <a className="cursor-pointer" onClick={() => navigate("/book/tnb/1")}>
                <img src="/images/covers/tnb-cover.png" />
            </a>
        </div>

    </div>
};

