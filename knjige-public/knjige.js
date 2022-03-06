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
            if (entry[key] != entry._id && entry[key] != entry.__v && entry[key] != entry.type) {
                const p = document.createElement('p');
                p.innerHTML = `${key.toUpperCase()} - ${entry[key]}`;
                listing.appendChild(p);
            }
            if(entry[key] === entry.type){
                const p = document.createElement('p');
                p.innerHTML = `${entry[key]}`;
                if(entry[key] === "BORROWED"){
                    p.classList.add('p-borrowed');
                } else {
                    p.classList.add('p-returned');
                }
                listing.appendChild(p);
            }
        }
        historyContainer.appendChild(listing);
    })
}
appendHistory();

/////////Add borrowers to database//////////

//Arrow animation
$('.new-borrower-container h2').on('click', () => {
    if ($('.arrow')[0].style.transform != "rotate(90deg)") {
        $('.arrow')[0].style.animation = "200ms ease-in rotateCW-0-90";
        $('.arrow')[0].style.transform = "rotate(90deg)";
    } else {
        $('.arrow')[0].style.animation = "200ms ease-in rotateCCW-90-0"
        $('.arrow')[0].style.transform = "rotate(0deg)";
    }
    setTimeout(() => $('.arrow')[0].style.animation = null, 200);
    $('.input-field').slideToggle(200);
})

//Creates input fields for post request
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

///////////////////Adds the necessary html elements for each borrower//////////////////////////
const appendBorrowers = (borrowerArray) => {
    for (let i = 0; i < borrowerArray.length; i++) {

        const borrowerCard = document.createElement('li');
        borrowerCard.classList.add('borrower-card');
        borrowerCard.setAttribute("id", `borrower-${borrowerArray[i]._id}`);

        ///////////////Name, book, date/////////////////////
        const pName = document.createElement('p');
        pName.innerHTML = `Name: ${borrowerArray[i].name}`;

        const pBook = document.createElement('p');
        pBook.innerHTML = `Book: ${borrowerArray[i].book}`;

        const pDate = document.createElement('p');
        const date = formatDate(borrowerArray[i].dateBorrowed);
        pDate.innerHTML = `Date: ${date}`;

        borrowerCard.appendChild(pName);
        borrowerCard.appendChild(pBook);
        borrowerCard.appendChild(pDate);

        ////////////////////Show notes button////////////////////////
        const buttonShowNotes = document.createElement('button');
        buttonShowNotes.innerHTML = "Show notes";
        buttonShowNotes.classList.add("btn-show-notes");
        buttonShowNotes.setAttribute("id", `show-notes-${borrowerArray[i]._id}`);
        borrowerCard.appendChild(buttonShowNotes);


        ////////////////////Remove borrower icon/////////////////////////
        const buttonRemove = document.createElement('i');
        buttonRemove.innerHTML = "remove_circle_outline";
        setAttributes(buttonRemove, {
            "class": "material-icons btn-remove tooltip",
            "id": `remove-${borrowerArray[i]._id}`            
        });
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
        msg.innerHTML = "You haven't added any notes";
        msg.classList.add('empty-note-msg')
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
    appendBorrowers(borrowers);
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
                deleteRequest(borrower._id)
                borrowerContainer.removeChild($(`#borrower-${borrower._id}`)[0]);
            }
        })
    })
})
