
export default function BookHeader({ title, edition, editor }) {
    return (
        <div class="bg-ocdla-dark-blue text-white p-16 pb-20">
            <p>OCDLA Books Online</p>
            <h1 class="text-4xl font-bold">{title}</h1>
            <p class="mt-4">Edited by {editor}</p>
            <p class="mt-4">{edition}</p>
        </div>
    );
}
