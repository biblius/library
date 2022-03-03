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
const borrowerContainer = document.querySelector('#borrower-container');

//adds the necessary html elements for each borrower
const appendBorrowers = () => {
    for (let i = 0; i < borrowers.length; i++) {
        const borrowerEntry = document.createElement('li')
        borrowerEntry.classList.add('borrower-entry')      
        const pName = document.createElement('p')
        const pBook = document.createElement('p')
        const pDate = document.createElement('p')
        pName.innerHTML = `Name: ${borrowers[i].name}`
        pBook.innerHTML = `Book: ${borrowers[i].book}`
        pDate.innerHTML = `Date: ${borrowers[i].dateBorrowed}`
        borrowerEntry.appendChild(pName)
        borrowerEntry.appendChild(pBook)
        borrowerEntry.appendChild(pDate)

        //create note list only if notes exist
        if (borrowers[i].notes.length > 0) {
            //create note container and its note list
            const noteContainer = document.createElement('div');
            const noteList = document.createElement('ul');
            //set their classes
            noteContainer.classList.add('note-container')
            noteList.classList.add('note-list')
            //append all notes from the array to note list
            borrowers[i].notes.forEach(noteEl => {
                const note = document.createElement('li');
                note.innerHTML = `${noteEl}`;
                noteList.appendChild(note);
            })
            //append them to the container
            noteContainer.appendChild(noteList);
            borrowerEntry.appendChild(noteContainer);
        }

        //create remove borrower icon with corresponding borrower id and tooltip
        const tooltip = document.createElement('div');
        const tooltipText = document.createElement('span');
        tooltip.classList.add('tooltip');
        tooltipText.classList.add('tooltip-text');
        tooltipText.innerHTML = "Remove Borrower";

        const buttonRemove = document.createElement('i');
        buttonRemove.innerHTML = "remove_circle_outline";
        setAttributes(buttonRemove, {
            "class": "material-icons btn-remove tooltip",
            "id": `remove-${borrowers[i]._id}`,
            "onClick": 'window.location.reload();'
        });
        tooltip.appendChild(tooltipText);
        buttonRemove.appendChild(tooltip);

        //the add note button is the only one with the id exactly equal to the borrower
        const buttonAddNote = document.createElement('button');
        buttonAddNote.classList.add("btn-note");
        buttonAddNote.innerHTML = "Add Note";
        buttonAddNote.setAttribute("id", `${borrowers[i]._id}`);
        borrowerEntry.appendChild(buttonAddNote);

        //create remove note button only if the note exists
        if (borrowers[i].notes.length > 0) {
            let buttonRemNote = document.createElement('button');
            buttonRemNote.classList.add("btn-note-rem");
            buttonRemNote.innerHTML = "Remove Notes";
            buttonRemNote.setAttribute("id", `rem-note-${borrowers[i]._id}`);
            borrowerEntry.appendChild(buttonRemNote);
        }
        borrowerEntry.appendChild(buttonRemove);
        borrowerContainer.appendChild(borrowerEntry);
    }
}

//if there are no borrowers just send a message
if (borrowers.length > 0) {
    appendBorrowers();
} else {
    let p = document.createElement('p');
    p.innerHTML = "No borrowers... yet";
    borrowerContainer.appendChild(p);
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
//on click remove all notes from borrower
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
            form.appendChild(input);
            form.appendChild(submit);
            button.after(form);
            //on submit send put request with the value from the text area
            submit.addEventListener('click', () => {
                addNotesPut(submit.id, input.value);
            })
        } else {
            button.parentElement.querySelector(".note-form").remove();
        }
    })
})
