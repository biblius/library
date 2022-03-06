const url = "http://localhost:4000/api/knjige";

//returns all borrowers 
const getBorrowers = () => {
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

//returns all borrowers 
const getHistory = () => {
    let history = fetch(url + '/history', {
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
    return history;
}

const postRequest = (borrowerName, borrowedBook) => {
    const date = new Date();
    const body = {
        name: borrowerName,
        book: borrowedBook,
        dateBorrowed: date
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

const deleteNotes = (id, note) => {
    let newUrl = `${url}/${id}/notes`
    fetch(newUrl, {
        method: 'DELETE',
        headers: {
            mode: 'cors',
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "http://127.0.0.1:4000"
        }
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

//formats the date to a human readable format
const formatDate = (dateString) => {
    dateString = dateString.replaceAll('-', '/')
        .replace('T', ', ')
        .slice(0, 17)
    return dateString;
}

const requests = {
    getBorrowers,
    postRequest,
    deleteRequest,
    addNotesPut,
    deleteNotes,
    toggleColor,
    setAttributes,
    formatDate,
    getHistory
}
export default requests;

