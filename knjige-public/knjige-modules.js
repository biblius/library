const url = "http://localhost:4000/api/knjige";

//returns all borrowers 
const getRequest = () => {
    let borrowers = fetch(url, {
        method: "GET",
        mode: 'cors',
        "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }).then(jsonResponse => {
            return jsonResponse;
        })
    return borrowers;
}

const postRequest = (borrowerName, borrowedBook) => {
    const date = new Date();
    const body = {
        name: borrowerName,
        book: borrowedBook,
        dateBorrowed: date.toDateString()
    }
    console.log(body);
    fetch(url, {
        method: "POST",
        headers: {
            mode: 'cors',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
        },
        body: JSON.stringify(body)
    })

}

const deleteRequest = (id) => {
    let newUrl = `${url}/${id}`
    fetch(newUrl, {
        method: 'DELETE',
        headers: {
            mode: 'cors',
            "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
        }
    })
}

const addNotesPut = (id, note) => {
    let body = {
        notes: note
    }
    let newUrl = `${url}/${id}`
    fetch(newUrl, {
        method: 'PUT',
        headers: {
            mode: 'cors',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
        },
        body: JSON.stringify(body)
    })
}

const deleteNotesPut = (id, note) => {
    let body = {
        notes: note,
        deleteNote: true
    }
    let newUrl = `${url}/${id}`
    fetch(newUrl, {
        method: 'PUT',
        headers: {
            mode: 'cors',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
        },
        body: JSON.stringify(body)
    })
}

const toggleColor = button => {
    if (!button.style['background-color']) { button.style['background-color'] = "azure"; }
    if (button.style['background-color'] == "azure") {
        button.style['background-color'] = "rgb(149, 104, 167)";
    }
    else {
        button.style['background-color'] = "azure";
    }

}
//expects an object with key value pairs corresponding to attribute value pairs
const setAttributes = (el, attributes) => {
    for (let key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
}

const requests = { getRequest, postRequest, deleteRequest, addNotesPut, deleteNotesPut, toggleColor, setAttributes }
export default requests;

