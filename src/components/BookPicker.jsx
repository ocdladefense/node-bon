import { useParams, useNavigate } from "react-router";


export default function BookPicker({ activeBookId }) {

    let navigate = useNavigate();

    return (
        <div id="bookpicker" style={{ maxWidth: "100%", overflowX: "hidden" }} class="top-0 z-5 bg-white lg:static lg:top-auto lg:z-auto lg:bg-transparent overflow-x-clip">
            <section class="flex items-center border border-t-0 p-0 tablet:p-4 capitalize text-black lg:h-16">
                <ul class="flex flex-wrap items-center whitespace-pre">
                    <li>
                        <select onChange={e => navigate(`/book/${e.target.value}/${e.target.options[e.target.selectedIndex].dataset.default}`)} name="breadcrumbs-dropdown" id="breadcrumbs-dropdown" class="max-w-[400px]">
                            <option key="fsm" value="fsm" data-default="1" selected={activeBookId === "fsm" || undefined}>Felony Sentencing Manual</option>
                            <option key="dsc" selected={activeBookId === "dsc" || undefined} value="dsc" data-default="1">Defending Sex Cases</option>
                            <option key="dnb" selected={activeBookId === "dnb" || undefined} value="dnb" data-default="1">DUII Notebook: A Comprehensive Guide to Your DUII Case</option>
                            <option key="im" selected={activeBookId === "im" || undefined} value="im" data-default="1">Investigators Manual</option>
                            <option key="mhcd" selected={activeBookId === "mhcd" || undefined} value="mhcd" data-default="1">Mental Health and Criminal Defense</option>
                            <option key="ssm" selected={activeBookId === "ssm" || undefined} value="ssm" data-default="1a">Search and Seizure Manual</option>
                            <option key="pjm" selected={activeBookId === "pjm" || undefined} value="pjm" data-default="1">Post Judgment and Extraordinary Remedies</option>
                            <option key="vm" selected={activeBookId === "vm" || undefined} value="vm" data-default="1">Still at War</option>
                            <option key="tnb" selected={activeBookId === "tnb" || undefined} value="tnb" data-default="1">The Trial Notebook</option>
                            <option key="sem" selected={activeBookId === "sem" || undefined} value="sem" data-default="1">Scientific Evidence: A Manual for Oregon Defense Attorneys</option>
                        </select>
                    </li>
                </ul>
            </section>
        </div>
    );
}
