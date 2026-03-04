

let counter = 0;
let funcs = [];
let chain = [];



export function domReady(cb) {


    if (counter === 0)
    {
        document.addEventListener('DOMContentLoaded', async () => {
            funcs.forEach((fn, index, arr) => {
                let previous = index === 0 ? Promise.resolve() : arr[index - 1];
                previous.then(fn);
            });
        });
    }

    if (['interactive', 'complete'].includes(document.readyState))
    {
        let previous = chain.length > 0 ? chain[chain.length - 1] : Promise.resolve();
        let current = previous.then(cb);
        chain.push(current);
    } else
    {
        funcs.push(cb);
    }

    counter++;
}



export default function waitUntil(func, wait) {
    let timeout;

    return function(...args) {
        const context = this;

        clearTimeout(timeout); // Clear the existing timer

        timeout = setTimeout(() => {
            func.apply(context, args); // Execute the function after the wait
        }, wait);
    };
}


export function injectScriptElement(src) {
    let tag = document.createElement('script');
    tag.src = src;


    if (firstScriptTag == null)
    {
        (document.body || document.head).appendChild(tag);
    }
    else
    {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    return tag;
}
