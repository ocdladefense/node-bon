import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import { getBookList } from '../js/utils/book.js';

let covers = ["tnb-cover.png", "clfb-cover.png"];


export default function BookCovers() {

    let navigate = useNavigate();
    let [books, setBooks] = useState([]);
    let covers;

    useEffect(() => {
        async function fetchBooks() {
            const bookList = await getBookList();
            setBooks(bookList);
            console.log(bookList);
        }
        fetchBooks();
    }, []);



    let customSort = (a, b) => {
        let order = ["tnb", "dnb", "dsc", "ssm", "fsm", "im", "mhcd", "sem", "vm", "pjm"];
        return order.indexOf(a.shortName) - order.indexOf(b.shortName);
    };

    return <div className="grid grid-cols-12 gap-4 bg-white min-h-screen">

        {books.sort(customSort).map(book => {
            return (
                <div style={{ height: "30%" }} className="tablet:col-span-4 col-span-6">
                    <a className="cursor-pointer" onClick={() => navigate(`/book/${book.shortName}/${book.firstChapter}`)}>
                        <div style={{ color: '#fff', textAlign: 'center', marginBottom: '4px', backgroundImage: `url(/images/covers/${book.shortName}.png)`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }} className="min-h-[200px] tablet:min-h-[480px] bg-ocdla-dark-blue px-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">&nbsp;</div>
                    </a>
                    <strong>{book.name}</strong>
                </div>
            );
        })}
    </div>
};


/*
        <div className="col-span-4 phone:col-span-6">
         <img alt={book.shortName} src={`/images/covers/${book.shortName}-cover.png`} />
            <a className="cursor-pointer" onClick={() => navigate("/formbook/1")}>
                <img src="/images/covers/clfb-cover.png" />
            </a>
        </div>
*/
