import { useState } from 'react';
import useModal from './hooks/useModal.js';
import Modal from './Modal.jsx';
import Toc from './Toc.jsx';
import ChapterContents from './ChapterContents.jsx';

export default function Layout() {

    const { isOpen, modalContent, openModal, closeModal } = useModal();

    let title = "MY TOC";

    const handleOpenCustomModal = () => {
        openModal(
            <div >
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                <Toc action={closeModal} />
            </div>
        );
    };

    return (
        <div className="grid grid-cols-6 gap-4 bg-white">
            <Modal isOpen={isOpen} content={modalContent} onClose={closeModal} />
            <div className="phone:hidden col-span-2 p-4 border-r border-solid border-gray-400 sticky top-0"><Toc /></div>
            <div className="col-span-4 phone:col-span-6 p-4">
                <button onClick={handleOpenCustomModal}>Open Custom Modal</button>
                <ChapterContents />
            </div>
        </div>
    );
};

