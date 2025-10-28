import useModal from './hooks/useModal.js';
import Modal from './ui/Modal.jsx';





export default function Sites() {




    return (
        <div className="grid grid-cols-8 gap-4 bg-white">

            <div className="col-span-8 p-4">

                <div className="toc sticky top-0">

                    <h2>Production Sites</h2>
                    <ul className="toc-contents">
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6">
                            <a className="cursor-pointer" href="https://media.ocdla.org" target="_new">
                                <span className="block">OCDLA Media App</span>
                                <span className="block"><a href="https://media.ocdla.org" target="_new">media.ocdla.org</a></span>
                            </a>
                        </li>

                        <li className="toc-entry mb-2 border-b border-gray-200 py-6">
                            <a className="cursor-pointer" href="https://ocdla.org" target="_new">
                                <span className="block">OCDLA Business Website</span>
                                <span className="block"><a href="https://ocdla.org" target="_new">www.ocdla.org</a></span>
                            </a>
                        </li>
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://libraryofdefense.ocdla.org" target="_new">
                                <span className="block">Library of Defense</span>
                                <span className="block"><a href="https://libraryofdefense.ocdla.org" target="_new">libraryofdefense.ocdla.org</a></span>
                            </a>
                        </li>
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6">
                            <a className="cursor-pointer" href="https://ocdla.my.site.com" target="_new">
                                <span className="block">OCDLA Store</span>
                                <span className="block"><a href="https://ocdla.my.site.com" target="_new">www.ocdla.my.site.com</a></span>
                            </a>
                        </li>
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://ocdla.app" target="_new">
                                <span className="block">OCDLA App</span>
                                <span className="block"><a href="https://ocdla.app" target="_new">ocdla.app</a></span>
                            </a>
                        </li>

                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://ors.ocdla.org" target="_new">
                                <span className="block">ORS</span>
                                <span className="block"><a href="https://ors.ocdla.org" target="_new">ors.ocdla.org</a></span>
                            </a>
                        </li>

                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://publish.ocdla.org" target="_new">
                                <span className="block">Publishing Platform</span>
                                <span className="block"><a href="https://publish.ocdla.org" target="_new">publish.ocdla.org</a></span>
                            </a>
                        </li>
                    </ul>

                    <h2>Development Sites</h2>
                    <ul className="toc-contents">

                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://pubs.ocdla.org" target="_new">
                                <span className="block">Books Online Prototype 1</span>
                                <span className="block">pubs.ocdla.org</span>
                            </a>
                        </li>
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://lod2.ocdla.org" target="_new">
                                <span className="block">Books Online Prototype 2</span>
                                <span className="block">bon.ocdla.org</span>
                            </a>
                        </li>
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://thebierelibrary2.ocdla.org/" target="_new">
                                <span className="block">Biere Library React Website</span>
                                <span className="block">thebierelibrary2.ocdla.org</span>
                            </a>
                        </li>
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://thebierelibrary2.ocdla.org/" target="_new">
                                <span className="block">Biere Library Test Website</span>
                                <span className="block">thebierelibrary.ocdla.org</span>
                            </a>
                        </li>

                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://ciderworks.ocdla.org/" target="_new">
                                <span className="block">Ciderworks</span>
                                <span className="block">ciderworks.ocdla.org</span>
                            </a>
                        </li>

                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://waterstreetmarketapartments.com" target="_new">
                                <span className="block">Water Street Market Apartments</span>
                                <span className="block">waterstreetmarketapartments.com</span>
                            </a>
                        </li>

                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://lod2.ocdla.org" target="_new">
                                <span className="block">LOD2 Development</span>
                                <span className="block">lod2.ocdla.org</span>
                            </a>
                        </li>
                        <li className="toc-entry mb-2 border-b border-gray-200 py-6" >
                            <a className="cursor-pointer" href="https://appdev.ocdla.org" target="_new">
                                <span className="block">AppTest</span>
                                <span className="block">appdev.ocdla.org</span>
                            </a>
                        </li>
                    </ul>
                </div>

            </div>
        </div>
    );
};

