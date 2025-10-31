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

    return <div className="grid grid-cols-12 gap-4 bg-white min-h-screen">

        {books.map(book => {
            return (
                <div className="col-span-4 phone:col-span-6">
                    <a className="cursor-pointer" onClick={() => navigate(`/book/${book.shortName}/1`)}>
                        <div style={{ color: '#fff', backgroundColor: '#1329a8ff', height: '200px', paddingTop: '50px', textAlign: 'center', marginBottom: '4px' }}>
                            <strong>{book.name}</strong>
                        </div>
                    </a>
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
