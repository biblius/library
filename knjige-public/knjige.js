//const apiKey = 'zfvkWnoZUfIOmqgKoS1QglRDT8bTFAxIeE3D26n8WCBvmD9tW3LQkZEvTTqNYm0H';
//const url = `mongodb+srv://biblius:shallamalla031@cluster0.nbxyh.mongodb.net/knjigga`

import requests from "./knjige-modules.js";
const { getBorrowers,
    getHistory,
    postRequest,
    deleteRequest,
    addNotesPut,
    deleteNotes,
    toggleColor,
    setAttributes,
    formatDate
} = requests;

//on page load grab all borrowers from db and insert them to borrowers grid
const borrowers = await getBorrowers();
const borrowerContainer = document.querySelector('.borrower-container');

//do the same for history
const history = await getHistory();
const historyContainer = document.querySelector('.history-list');

const appendHistory = () => {
    history.forEach(entry => {
        entry.date = formatDate(entry.date);
        const listing = document.createElement('li');
        for (let key in entry) {
            if (entry[key] != entry._id && entry[key] != entry.__v) {
                const p = document.createElement('p');
                p.innerHTML = `${key} : ${entry[key]}`;
                listing.appendChild(p);
            }
        }
        historyContainer.appendChild(listing);
    })
}
appendHistory();

//insert borrowers to database
const nameInputAdd = document.querySelector('#borrower-name-add');
const bookInputAdd = document.querySelector('#book-input-add');
const addButton = document.getElementById('add-button');
addButton.addEventListener('click', () => {
    const name = nameInputAdd.value;
    const book = bookInputAdd.value;
    if (name && book) {
        postRequest(name, book);
    }
})

//adds the necessary html elements for each borrower
const appendBorrowers = () => {
    for (let i = 0; i < borrowers.length; i++) {
        
        const borrowerCard = document.createElement('li');
        borrowerCard.classList.add('borrower-card');
        borrowerCard.setAttribute("id", `borrower-${borrowers[i]._id}`);
        
        ///////////////Name, book, date/////////////////////
        const pName = document.createElement('p');
        pName.innerHTML = `Name: ${borrowers[i].name}`;
        
        const pBook = document.createElement('p');
        pBook.innerHTML = `Book: ${borrowers[i].book}`;

        const pDate = document.createElement('p');
        const date = formatDate(borrowers[i].dateBorrowed);
        pDate.innerHTML = `Date: ${date}`;

        borrowerCard.appendChild(pName);
        borrowerCard.appendChild(pBook);
        borrowerCard.appendChild(pDate);
        
        ////////////////////Show notes button////////////////////////
        const buttonShowNotes = document.createElement('button');
        buttonShowNotes.innerHTML = "Show notes";
        buttonShowNotes.classList.add("btn-show-notes");
        buttonShowNotes.setAttribute("id", `show-notes-${borrowers[i]._id}`);
        borrowerCard.appendChild(buttonShowNotes);
        

        ////////////////////Remove borrower icon and tooltip/////////////////////////
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
        borrowerCard.appendChild(buttonRemove);

        borrowerContainer.appendChild(borrowerCard);
    }
}
//Creates a note container with add/remove note buttons and appends notes to it
//if any are present. 
const showNotes = (card) => {
    
    //create note container and list
    const noteContainer = document.createElement('div');
    const noteList = document.createElement('ul');
    noteContainer.classList.add('note-container');
    noteList.classList.add('note-list');

    //Find borrower and append the notes to the list, if no notes present send msg
    const foundBorrower = borrowers.find(borrower => card.id.slice(9) === borrower._id);
    if (foundBorrower.notes.length > 0) {
        const notes = foundBorrower.notes
        notes.forEach(note => {
            let el = document.createElement('li');
            el.innerHTML = `${note}`;
            noteList.appendChild(el);
        })
    } else {
        const msg = document.createElement('p');
        msg.innerHTML = "You haven't added any notes yet";
        noteList.appendChild(msg);
    }
    noteContainer.appendChild(noteList);
    
    //////////////Add note button////////////////////////////
    const buttonAddNote = document.createElement('button');
    buttonAddNote.classList.add("btn-note");
    buttonAddNote.innerHTML = "Add Note";
    buttonAddNote.addEventListener('click', () => {
        toggleColor(buttonAddNote);
        if (buttonAddNote.parentElement.querySelector(".note-form") == null) {
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
                "id": foundBorrower._id,
                "type": "submit",
                "value": "Submit",
            });
            form.appendChild(input);
            form.appendChild(submit);
            buttonAddNote.after(form);
            //on submit send put request with the value from the text area
            submit.addEventListener('click', () => {
                if (input.value) {
                    addNotesPut(submit.id, input.value);
                }
            })
        } else {
            buttonAddNote.parentElement.querySelector(".note-form").remove();
        }
    })
    noteContainer.appendChild(buttonAddNote);

    //////////Remove notes button//////////////
    if (foundBorrower.notes.length > 0) {
        const buttonRemNote = document.createElement('button');
        buttonRemNote.classList.add("btn-note-rem");
        buttonRemNote.innerHTML = "Remove Notes";
        noteContainer.appendChild(buttonRemNote);
        buttonRemNote.addEventListener('click', () => {
            deleteNotes(foundBorrower._id, "");
            window.location.reload();
        })
    }
    card.insertBefore(noteContainer, card.children[card.children.length - 1])
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
const showNotesButtons = document.querySelectorAll(".btn-show-notes");
const removeBorrowerButtons = document.querySelectorAll(".btn-remove");

//show notes if they are hidden, otherwise hide them
showNotesButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.parentElement.querySelector('.note-container') == null) {
            showNotes(document.querySelector(`#borrower-${button.getAttribute('id').slice(11)}`));
            button.innerHTML = "Hide notes"
        } else {
            button.parentElement.querySelector('.note-container').remove();
            button.innerHTML = "Show notes"
        }
    })
})

//on click remove the corresponding user from the borrowers
removeBorrowerButtons.forEach(button => {
    button.addEventListener('click', () => {
        borrowers.forEach(borrower => {
            if (button.getAttribute('id') === `remove-${borrower._id}`) {
                deleteRequest(borrower._id);
            }
        })
    })
})
