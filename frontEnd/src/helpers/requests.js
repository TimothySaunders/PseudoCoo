export default function uploadImage(file) {
    const fd = new FormData();
    fd.append('avatar', file);
    fetch("api/images", {
        method: "POST",
        // headers: {"Content-Type": "image/jpeg"},
        body: fd
    })
    .then(res => console.log(res));
}