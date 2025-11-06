


export default function ChapterHeader({ label, name, authors }) {

    return (
        <>
            <h2 className="text-3xl font-bold my-2">{label} - {name}</h2>
            <h3 className="text-xl font-italic my-1">{authors}</h3>
        </>
    )
}
