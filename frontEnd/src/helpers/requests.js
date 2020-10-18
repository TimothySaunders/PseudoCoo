
    export function uploadImage(file) {
        return fetch("api/images", {
            method: "POST",
            headers: {"Content-Type": "image/jpg"},
            body: file
        })
        .then(res => console.log(res));
    }

    export function getSaves(){
        return fetch("api/saves")
        .then(res => res.json())
    }


