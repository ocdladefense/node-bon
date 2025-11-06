





export default function Appendices({ files }) {
    return (
        <div id="appendices" className="space-y-4">
            {files.map(file => {

                let parts = file.id.split('-');
                let book = parts.shift();
                let chapter = parts.shift();

                let path = "/data/" + book + "/appendices/" + [book, chapter].join('-') + "/";
                let url = path + file.url;
                console.log(parts, book, chapter);


                return (<div key={file.name} className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <a href={url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Appendix {file.id.split('-')[2].toUpperCase()}: {file.name}
                    </a>
                </div>)
            })}
        </div>
    );
}
