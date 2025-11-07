import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router";
import useModal from './hooks/useModal.js';
import Modal from './ui/Modal.jsx';
import Toc from './Toc.jsx';
import ChapterContents from './chapter/ChapterContents.jsx';
import BookHeader from './BookHeader.jsx';
import BookPicker from './BookPicker.jsx';
import { getBookMetadata, getChapterMetadata } from '../js/utils/book.js';
import Appendices from './ui/Appendices.jsx';
import ChapterHeader from './chapter/ChapterHeader.jsx';
import ChapterToolbar from './chapter/ChapterToolbar.jsx';



export default function Layout() {

    const { isOpen, modalContent, openModal, closeModal } = useModal();
    let params = useParams();
    let bookId = params.bookId;
    let chapterId = params.chapterId;
    let [book, setBook] = useState({ title: "", edition: "", editor: "" });
    let [chapter, setChapter] = useState({ label: "", name: "", authors: "", appendices: [] });

    useEffect(() => {
        const files = [{ name: "Appendix A: Glossary.pdf", url: "/appendices/glossary.pdf" },
        { name: "Appendix B: Bibliography.pdf", url: "/appendices/bibliography.pdf" },
        { name: "Appendix C: Index.pdf", url: "/appendices/index.pdf" }];

        async function fn() {
            let book = await getBookMetadata(bookId);
            let chapter = await getChapterMetadata(bookId, chapterId);
            // chapter.appendices = files;
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
                    <div className="min-h-screen">
                        <div className="relative w-full">
                            <ChapterHeader label={chapter.label} name={chapter.name} authors={chapter.authors} />
                            <ChapterToolbar bookId={bookId} label={chapter.label} name={chapter.name} openModal={handleOpenCustomModal} />
                            {chapter.hasAppendices ? <a href="#appendices" className="text-l font-bold mt-4 block relative left-0 top-0 mt-10 mr-4 text-sm text-blue-600 hover:underline">View {chapter.appendices.length || ""} Appendices in this chapter</a> : ""}
                            <ChapterContents openModal={handleOpenCustomModal} label={chapter.label} name={chapter.name} authors={chapter.authors || book.editor} bookId={bookId} />
                            {chapter.hasAppendices ? <Appendices files={chapter.appendices} /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

