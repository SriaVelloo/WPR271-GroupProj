const PEOPLE_KEY = "people";

// function:helpers 
function getPeople() {
    return JSON.parse(localStorage.getItem(PEOPLE_KEY)) || [];
}

function savePeople(people) {
    localStorage.setItem(PEOPLE_KEY, JSON.stringify(people));
}

// MODAL 
function openPersonModal(person = null) {
    document.getElementById("personForm").reset();

    if (person) {
        document.getElementById("personModalTitle").textContent = "Edit Person";
        document.getElementById("personId").value = person.id;
        document.getElementById("firstName").value = person.firstName;
        document.getElementById("lastName").value = person.lastName;
        document.getElementById("email").value = person.email;
        document.getElementById("username").value = person.username;
    } else {
        document.getElementById("personModalTitle").textContent = "Add Person";
        document.getElementById("personId").value = "";
    }
}

// saving the person
function savePerson() {
    let people = getPeople();

    const id = document.getElementById("personId").value;
    const username = document.getElementById("username").value;

    // USERNAME VALIDATION CHECK
    if (people.some(p => p.username === username && p.id != id)) {
        showToast("Username already exists!");
        return; //stops function immediately
    }

    const newPerson = {
        id: id || Date.now(),
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
        username: username, //username assignment
        profilePic: ""
    };

    // profile picture handling
    const file = document.getElementById("profilePic").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            newPerson.profilePic = e.target.result;
            saveToStorage(newPerson);
        };
         reader.readAsDataURL(file);
    } else {
        saveToStorage(newPerson);
    }
}

function saveToStorage(person) {
    let people = getPeople(); //calls to retrieve all stored people

    const index = people.findIndex(p => p.id == person.id);

    if (index > -1) {
        people[index] = person; //person exists (UPDATE)
    } else {
        people.push(person); //person does not exist (CREATE)
    }

    savePeople(people);
    renderPeople(); //refreshes the UI

    bootstrap.Modal.getInstance(document.getElementById("personModal")).hide();
    showToast("Person saved successfully!");
}

// displaying people
function renderPeople() { //runs whenever we want to display or refresh the list of people
    const people = getPeople();
    const grid = document.getElementById("peopleGrid");

    if (people.length === 0) {
        grid.innerHTML = `<div class="col-12 text-center py-5">No people added yet</div>`;
        return;
    }

    grid.innerHTML = ""; //removes everything currently inside the grid

    people.forEach(p => { //goes through each person object
        grid.innerHTML += ` 
        <div class="col-md-4 mb-3">
            <div class="card shadow-sm"> 
                <div class="card-body text-center">
                    <img src="${p.profilePic || 'https://via.placeholder.com/80'}"  
                         class="rounded-circle mb-2" width="80" height="80">
                    <h5>${p.firstName} ${p.lastName}</h5>
                    <p class="text-muted">@${p.username}</p>
                    <p>${p.email}</p>
                    <button class="btn btn-sm btn-outline-primary" onclick='editPerson(${JSON.stringify(p)})'>Edit</button>
                </div>
            </div>
        </div>`;
    });
}

// edits
function editPerson(person) {
    openPersonModal(person);
    new bootstrap.Modal(document.getElementById("personModal")).show();
}

// alert!
function showToast(message) {
    const toastEl = document.getElementById("liveToast");
    toastEl.querySelector(".toast-body").textContent = message;
    new bootstrap.Toast(toastEl).show();
}


 
document.addEventListener("DOMContentLoaded", renderPeople);
