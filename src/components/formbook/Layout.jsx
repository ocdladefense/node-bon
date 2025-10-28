import { useParams } from "react-router";
import useModal from '../hooks/useModal.js';
import Modal from '../ui/Modal.jsx';
import Toc from './Toc.jsx';
import Form from './Form.jsx';


export default function Layout() {

    let params = useParams();
    let chapterId = params.chapterId;
    let formId = params.formId;

    const { isOpen, modalContent, openModal, closeModal } = useModal();

    let title = "MY TOC";

    const handleOpenCustomModal = () => {
        openModal(
            <div >
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                <Toc activeChapter={chapterId} activeForm={formId} action={closeModal} />
            </div>
        );
    };



    return (
        <div className="grid grid-cols-6 gap-4 bg-white">
            <div className="hidden tablet:block tablet:col-span-2 p-4 border-r border-solid border-gray-400 sticky top-0">
                <Toc activeChapter={chapterId} activeForm={formId} />
            </div>
            <div className="tablet:col-span-4 col-span-6 p-4">
                <button onClick={handleOpenCustomModal}>Table of Contents</button>
                {!formId ? "" : <Form chapterNumber={chapterId} formId={formId} />}
            </div>
            <Modal isOpen={isOpen} content={modalContent} onClose={closeModal} />
        </div>
    );
};

