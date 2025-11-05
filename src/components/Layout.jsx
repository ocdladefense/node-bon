import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import useModal from './hooks/useModal.js';
import Modal from './ui/Modal.jsx';
import Toc from './Toc.jsx';
import ChapterContents from './ChapterContents.jsx';
import BookHeader from './BookHeader.jsx';
import BookPicker from './BookPicker.jsx';
import { getBookMetadata, getChapterMetadata } from '../js/utils/book.js';


export default function Layout() {

    const { isOpen, modalContent, openModal, closeModal } = useModal();
    let params = useParams();
    let bookId = params.bookId;
    let chapterId = params.chapterId;
    let [book, setBook] = useState({ title: "", edition: "" });
    let [chapter, setChapter] = useState({ title: "", editor: "", edition: "" });

    useEffect(() => {
        async function fn() {
            let book = await getBookMetadata(bookId);
            let chapter = await getChapterMetadata(bookId, chapterId);
            setBook(book);
            setChapter(chapter);
        }
        fn();
    }, [chapterId, bookId]);


    let title = "Table of Contents";

    const handleOpenCustomModal = () => {
        openModal(
            <div >
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                <Toc action={closeModal} />
            </div>
        );
    };

    return (
        <>
            <BookPicker />
            <BookHeader title={book.title} edition={book.edition} editor={book.editor} />
            <div className="grid grid-cols-8 gap-4 bg-white">
                <Modal isOpen={isOpen} content={modalContent} onClose={closeModal} />
                <div style={{ position: "sticky", top: "75px", height: "100vh", overflowY: "auto" }} className="hidden tablet:block col-span-2 p-4 border-r border-solid border-gray-400">
                    <Toc />
                </div>
                <div className="tablet:col-span-6 col-span-8 p-4">
                    <button onClick={handleOpenCustomModal}>Table of Contents</button>
                    <ChapterContents openModal={handleOpenCustomModal} label={chapter.label} name={chapter.name} authors={chapter.authors || book.editor} bookId={bookId} />
                </div>
            </div>
        </>
    );
};

