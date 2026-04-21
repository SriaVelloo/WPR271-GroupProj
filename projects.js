const PROJECT_KEY = "projects";

// function: helpers
function getProjects() {
    return JSON.parse(localStorage.getItem(PROJECT_KEY)) || [];
}

function saveProjects(projects) {
    localStorage.setItem(PROJECT_KEY, JSON.stringify(projects));
}

// MODAL
function openProjectModal(project = null) {
    document.getElementById("projectForm").reset();

    if (project) {
        document.querySelector(".modal-title").textContent = "Edit Project";
        document.getElementById("projectId").value = project.id;
        document.getElementById("projectIdInput").value = project.id;
        document.getElementById("projectName").value = project.name;
    } else {
        document.querySelector(".modal-title").textContent = "Add Project";
        document.getElementById("projectId").value = "";
    }
}

// saving the person
function saveProject() {
    let projects = getProjects();

    const id = document.getElementById("projectId").value;
    const newId = document.getElementById("projectIdInput").value;

    // USERNAME VALIDATION CHECK
    if (projects.some(p => p.id === newId && p.id != id)) {
        showToast("Project ID already exists!");
        return;
    }

    const project = {
        id: newId,
        name: document.getElementById("projectName").value
    };

    const index = projects.findIndex(p => p.id == id);

    if (index > -1) {
        projects[index] = project;
    } else {
        projects.push(project);
    }

    saveProjects(projects);
    renderProjects();

    const modalEl = document.getElementById("projectModal");
    bootstrap.Modal.getInstance(modalEl)?.hide();
    showToast("Project saved successfully!");
}

// displaying people
function renderProjects() {
    const projects = getProjects();
    const issues = JSON.parse(localStorage.getItem("issues")) || [];
    const table = document.getElementById("projectsTableBody");

if (projects.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="text-center py-4">No projects yet</td></tr>`;
        return;
    }

    table.innerHTML = "";

    projects.forEach(p => {
        const count = issues.filter(i => i.projectId == p.id).length;

        table.innerHTML += `
        <tr>
            <td>${p.id}</td>
            <td>${p.name}</td>
            <td>${count}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editProject('${p.id}')">
                    Edit
                </button>
            </td>
        </tr>`;
    });
}

// edits
function editProject(id) {
    const project = getProjects().find(p => p.id == id);
    openProjectModal(project);
    new bootstrap.Modal(document.getElementById("projectModal")).show();
}

// alert!
function showToast(message) {
    const toastEl = document.getElementById("liveToast");
    toastEl.querySelector(".toast-body").textContent = message;
    new bootstrap.Toast(toastEl).show();
}


document.addEventListener("DOMContentLoaded", renderProjects);
