





export default function Appendices({ files }) {
    return (
        <div className="space-y-4">
            {files.map(file => (
                <div key={file.name} className="p-4 border border-gray-300 rounded-lg hover:shadow-lg transition-shadow duration-300">
                    <a href={file.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Appendix {file.id.split('-')[2].toUpperCase()}: {file.name}
                    </a>
                </div>
            ))}
        </div>
    );
}
