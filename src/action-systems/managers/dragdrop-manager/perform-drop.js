export async function performDrop(dragElement, placeholder, options) {
    await gotoBounds(placeholder._bounds);
    placeholder.parentElement.replaceChild(dragElement, placeholder);
    cleanElements(dragElement, placeholder);
}

function gotoBounds(bounds) {
    return new Promise(resolve => {
        resolve();
    })
}

function cleanElements(dragElement, placeholder) {
    delete dragElement._bounds;
    dragElement.style.width = "";
    dragElement.style.height = "";
    dragElement.style.rotate = "";
    dragElement.style.translate = "";

    delete placeholder._bounds;
}
