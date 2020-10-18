
export function uploadImage(file) {
    const fd = new FormData();
    fd.append('sudoku', file);
    return fetch("api/images", {
        method: "POST",
        // headers: {"Content-Type": "image/jpeg"},
        body: fd
    })
        .then(res => res.blob());
}

export function getSaves() {
    return fetch("api/saves")
        .then(res => res.json())
}


