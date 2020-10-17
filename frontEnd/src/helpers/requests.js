
    export function uploadImage(file) {
        fetch("api/images", {
            method: "POST",
            headers: {"Content-Type": "image/jpg"},
            body: file
        })
        .then(res => console.log(res));
    }

    export function getSaves(){
        fetch("api/saves")
        .then(res => res.json())
        .then(data => console.log(data))
    }


