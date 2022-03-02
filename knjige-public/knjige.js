//const apiKey = 'zfvkWnoZUfIOmqgKoS1QglRDT8bTFAxIeE3D26n8WCBvmD9tW3LQkZEvTTqNYm0H';
//const url = `mongodb+srv://biblius:shallamalla031@cluster0.nbxyh.mongodb.net/knjigga`

import requests from "./knjige-modules.js";
const { postRequest, getRequest, deleteRequest, addNotesPut, deleteNotesPut, toggleColor, setAttributes } = requests;


//insert borrowers to database
const nameInputAdd = document.querySelector('#borrower-name-add');
const bookInputAdd = document.querySelector('#book-input-add');
const addButton = document.getElementById('add-button');
addButton.addEventListener('click', () => {
    const name = nameInputAdd.value;
    const book = bookInputAdd.value;
    postRequest(name, book);
})


//on page load grab all borrowers from db and insert them to borrowers grid
const borrowers = await getRequest();
const borrowerList = document.querySelector('#borrower-list');

//function that adds the necessary html elements for borrower
const appendBorrowers = () => {
    for (let i = 0; i < borrowers.length; i++) {
        const borrowerEntry = document.createElement('li')       
        const pName = document.createElement('p')
        const pBook = document.createElement('p')
        const pDate = document.createElement('p')
        pName.innerHTML = `Name: ${borrowers[i].name}`
        pBook.innerHTML = `Book: ${borrowers[i].book}`
        pDate.innerHTML = `Date: ${borrowers[i].dateBorrowed}`
        borrowerEntry.appendChild(pName)
        borrowerEntry.appendChild(pBook)
        borrowerEntry.appendChild(pDate)
        //appends note field only if it already exists
        if (borrowers[i].notes.length > 0) {
            const pNote = document.createElement('p');
            pNote.innerHTML = `Notes: ${borrowers[i].notes}`;
            borrowerEntry.appendChild(pNote);
        }
        //note, remove note, and remove borrower buttons with corresponding borrower ids
        let buttonRemove = document.createElement('i');
        buttonRemove.innerHTML = "remove_circle_outline";
        setAttributes(buttonRemove, {
            "class": "material-icons btn-remove",
            "id": `remove-${borrowers[i]._id}`,
            "onClick": 'window.location.reload();'
        })

        //the add note button is the only one with the id exactly equal to its user
        let buttonAddNote = document.createElement('button');
        buttonAddNote.classList.add("btn-note");
        buttonAddNote.innerHTML = "Add Note";
        buttonAddNote.setAttribute("id", `${borrowers[i]._id}`);

        //add remove note button only if the note exists
        borrowerEntry.appendChild(buttonAddNote);
        if (borrowers[i].notes.length > 0) {
            let buttonRemNote = document.createElement('button');
            buttonRemNote.classList.add("btn-note-rem");
            buttonRemNote.innerHTML = "Remove Notes";
            buttonRemNote.setAttribute("id", `rem-note-${borrowers[i]._id}`);
            borrowerEntry.appendChild(buttonRemNote);
        }
        borrowerEntry.appendChild(buttonRemove);
        borrowerList.appendChild(borrowerEntry);
    }
}

//if there are no borrowers just send a message
if (borrowers.length > 0) {
    appendBorrowers();
} else {
    let p = document.createElement('p');
    p.innerHTML = "No borrowers... yet";
    borrowerList.appendChild(p);
}

//select buttons so we can target them with event listeners
const addNotes = document.querySelectorAll(".btn-note");
const remNotes = document.querySelectorAll(".btn-note-rem");
const removeBorrower = document.querySelectorAll(".btn-remove");

//on click remove the corresponding user from the borrowers
removeBorrower.forEach(button => {
    button.addEventListener('click', () => {
        console.log(button)
        borrowers.forEach(borrower => {
            if (button.getAttribute('id') === `remove-${borrower._id}`) {
                deleteRequest(borrower._id);
            }
        })
    })
})
//on click remove note from borrower
remNotes.forEach(button => {
    button.addEventListener('click', () => {
        borrowers.forEach(borrower => {
            if (borrower.notes.length > 0) {
                if (button.getAttribute('id') === `rem-note-${borrower._id}`) {
                    deleteNotesPut(borrower._id, "");
                    window.location.reload();
                }
            }
        })
    })
})

//add event listener which opens textarea to add notes for each addnote btn
addNotes.forEach(button => {
    button.addEventListener('click', () => {
        toggleColor(button)
        //adds form only if it doesn't exist, otherwise remove it
        if (button.parentElement.querySelector(".note-form") == null) {
            let form = document.createElement('form');
            setAttributes(form, {
                "class": "note-form",
                "method": "get",
                "action": "./index.html"
            });
            let input = document.createElement('textarea');
            setAttributes(input, {
                "rows": 4,
                "cold": 20,
                "required": ""
            });
            let submit = document.createElement('input');
            setAttributes(submit, {
                "id": button.id,
                "type": "submit",
                "value": "Submit",
            });
            button.after(form);
            form.appendChild(input);
            form.appendChild(submit);
            //adds event handler for put requests
            submit.addEventListener('click', () => {
                console.log(submit.id);
                addNotesPut(submit.id, input.value);
            })
        } else {
            button.parentElement.querySelector(".note-form").remove();
        }
    })
})
