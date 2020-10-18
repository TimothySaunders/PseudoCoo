
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

    export function get(url){
        return fetch(url)
        .then(res => res.json())
}


