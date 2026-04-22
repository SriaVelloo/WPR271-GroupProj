// DATA STORE 
let appData = {
    bugs: [],
    people: [],
    projects: []
};

// INITIALISE 
function loadFromLocalStorage() {
    const saved = localStorage.getItem('BugTrackerData');
    if (saved) {
        appData = JSON.parse(saved);
    } else {
        initDefaultData();
    }
    updateOverdueStatus();   // set overdue flags on load

    syncToIssuesStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('BugTrackerData', JSON.stringify(appData));
}

function syncToIssuesStorage() {
    const issues = appData.bugs.map(bug => ({
        id: bug.id,
        summary: bug.summary,
        description: bug.description,
        priority: bug.priority,
        status: bug.status === 'overdue' ? 'open' : bug.status,
        projectId: bug.projectId,
        project: getProjectById(bug.projectId)?.name || 'Unknown',
        assignedPersonId: bug.assignedPersonId,
        assignee: getPersonById(bug.assignedPersonId)?.name || 'Unassigned',
        targetResolutionDate: bug.targetResolutionDate,
        targetDate: bug.targetResolutionDate,
        actualResolutionDate: bug.actualResolutionDate,
        resolutionSummary: bug.resolutionSummary,
        createdAt: bug.createdAt,
        createdDate: bug.createdAt
    }));
    localStorage.setItem('issues', JSON.stringify(issues));
    
    // Also sync projects separately
    localStorage.setItem('projects', JSON.stringify(appData.projects));
    localStorage.setItem('people', JSON.stringify(appData.people));
}

//  DEFAULT DATA (10+ issues, 3 people, 2 projects)
function initDefaultData() {
    // Projects
    appData.projects = [
        { id: "proj_1", name: "E-commerce Website" },
        { id: "proj_2", name: "Mobile Banking App" }
    ];

    // People
    appData.people = [
        { id: "per_1", name: "Alice", surname: "Chen", email: "alice@dev.com", username: "achen" },
        { id: "per_2", name: "Bob", surname: "Smith", email: "bob@dev.com", username: "bsmith" },
        { id: "per_3", name: "Carol", surname: "Jones", email: "carol@dev.com", username: "cjones" }
    ];

    // Helper to format dates
    const today = new Date();
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date(today); lastWeek.setDate(today.getDate() - 7);
    const fmt = d => d.toISOString().slice(0,10);

    // 11 Bugs (more than required)
    appData.bugs = [
        {
            id: "bug_1",
            summary: "Login button does nothing",
            description: "Clicking login has no effect, no error in console.",
            priority: "high",
            status: "open",
            targetResolutionDate: fmt(tomorrow),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_1",
            assignedPersonId: "per_1",
            createdAt: fmt(today)
        },
        {
            id: "bug_2",
            summary: "Checkout crashes on mobile",
            description: "iPhone Safari reloads infinitely on checkout page.",
            priority: "medium",
            status: "overdue",
            targetResolutionDate: fmt(yesterday),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_1",
            assignedPersonId: "per_2",
            createdAt: fmt(lastWeek)
        },
        {
            id: "bug_3",
            summary: "Wrong balance after transfer",
            description: "Balance updates only after page refresh.",
            priority: "high",
            status: "resolved",
            targetResolutionDate: fmt(yesterday),
            actualResolutionDate: fmt(yesterday),
            resolutionSummary: "Fixed cache issue in balance service.",
            projectId: "proj_2",
            assignedPersonId: "per_3",
            createdAt: fmt(lastWeek)
        },
        {
            id: "bug_4",
            summary: "Dark mode toggle not working",
            description: "Icon changes but theme stays light.",
            priority: "low",
            status: "open",
            targetResolutionDate: fmt(tomorrow),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_1",
            assignedPersonId: "per_2",
            createdAt: fmt(today)
        },
        {
            id: "bug_5",
            summary: "Push notifications delayed",
            description: "Notifications arrive 10 minutes late.",
            priority: "medium",
            status: "open",
            targetResolutionDate: fmt(tomorrow),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_2",
            assignedPersonId: "per_1",
            createdAt: fmt(today)
        },
        {
            id: "bug_6",
            summary: "Search filter resets on page 2",
            description: "Pagination loses filter keywords.",
            priority: "medium",
            status: "overdue",
            targetResolutionDate: fmt(lastWeek),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_1",
            assignedPersonId: "per_3",
            createdAt: fmt(lastWeek)
        },
        {
            id: "bug_7",
            summary: "Double VAT for international orders",
            description: "Tax calculated twice for EU customers.",
            priority: "high",
            status: "open",
            targetResolutionDate: fmt(tomorrow),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_1",
            assignedPersonId: "per_2",
            createdAt: fmt(today)
        },
        {
            id: "bug_8",
            summary: "Camera crash on Android 13",
            description: "Permission request causes app crash.",
            priority: "high",
            status: "resolved",
            targetResolutionDate: fmt(yesterday),
            actualResolutionDate: fmt(yesterday),
            resolutionSummary: "Added missing permission check in manifest.",
            projectId: "proj_2",
            assignedPersonId: "per_1",
            createdAt: fmt(lastWeek)
        },
        {
            id: "bug_9",
            summary: "Profile picture >2MB fails",
            description: "Generic error message, no details.",
            priority: "low",
            status: "open",
            targetResolutionDate: fmt(tomorrow),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_2",
            assignedPersonId: "per_3",
            createdAt: fmt(today)
        },
        {
            id: "bug_10",
            summary: "Email sent to wrong user",
            description: "Notification for user A goes to user B.",
            priority: "medium",
            status: "open",
            targetResolutionDate: fmt(tomorrow),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_2",
            assignedPersonId: "per_2",
            createdAt: fmt(today)
        },
        {
            id: "bug_11",
            summary: "Footer overlaps at 768px",
            description: "Responsive breakpoint fails, footer covers text.",
            priority: "low",
            status: "overdue",
            targetResolutionDate: fmt(lastWeek),
            actualResolutionDate: null,
            resolutionSummary: null,
            projectId: "proj_1",
            assignedPersonId: "per_1",
            createdAt: fmt(lastWeek)
        }
    ];
}

//  AUTO-OVERDUE LOGIC 
function updateOverdueStatus() {
    const today = new Date().toISOString().slice(0,10);
    let changed = false;
    appData.bugs.forEach(bug => {
        if (bug.status === "open" && bug.targetResolutionDate < today) {
            bug.status = "overdue";
            changed = true;
        }
    });
    if (changed) saveToLocalStorage();
}

//  CRUD: BUGS 
function getAllBugs() {
    return [...appData.bugs];
}

function getBugById(id) {
    return appData.bugs.find(b => b.id === id);
}

function saveBug(bugData) {
    // If no id, create new bug
    if (!bugData.id) {
        bugData.id = "bug_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6);
        bugData.createdAt = new Date().toISOString().slice(0,10);
        bugData.status = "open";
        bugData.actualResolutionDate = null;
        bugData.resolutionSummary = null;
        appData.bugs.push(bugData);
    } else {
        // Update existing bug
        const index = appData.bugs.findIndex(b => b.id === bugData.id);
        if (index !== -1) {
            // If resolution date is provided, mark as resolved
            if (bugData.actualResolutionDate && bugData.actualResolutionDate !== "") {
                bugData.status = "resolved";
            } else {
                // If resolution date removed and bug was resolved, revert to open (overdue will be recalculated)
                if (bugData.status === "resolved") bugData.status = "open";
            }
            appData.bugs[index] = bugData;
        } else {
            console.error("Bug not found for update:", bugData.id);
            return false;
        }
    }
    saveToLocalStorage();
    updateOverdueStatus();   // re-evaluate overdue after save
    return true;
}

function deleteBug(id) {
    appData.bugs = appData.bugs.filter(b => b.id !== id);
    saveToLocalStorage();
}

// CRUD: PEOPLE 
function getAllPeople() {
    return [...appData.people];
}

function getPersonById(id) {
    return appData.people.find(p => p.id === id);
}

function savePerson(personData) {
    if (!personData.id) {
        // Check unique username
        if (appData.people.some(p => p.username === personData.username)) {
            console.warn("Username already exists");
            return false;
        }
        personData.id = "per_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
        appData.people.push(personData);
    } else {
        const index = appData.people.findIndex(p => p.id === personData.id);
        if (index !== -1) appData.people[index] = personData;
    }
    saveToLocalStorage();
    return true;
}

function deletePerson(id) {
    // Prevent deletion if assigned to any bug
    const isAssigned = appData.bugs.some(b => b.assignedPersonId === id);
    if (isAssigned) {
        console.warn("Cannot delete person assigned to bugs");
        return false;
    }
    appData.people = appData.people.filter(p => p.id !== id);
    saveToLocalStorage();
    return true;
}

//  CRUD: PROJECTS 
function getAllProjects() {
    return [...appData.projects];
}

function getProjectById(id) {
    return appData.projects.find(p => p.id === id);
}

function saveProject(projectData) {
    if (!projectData.id) {
        projectData.id = "proj_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
        appData.projects.push(projectData);
    } else {
        const index = appData.projects.findIndex(p => p.id === projectData.id);
        if (index !== -1) appData.projects[index] = projectData;
    }
    saveToLocalStorage();
    return true;
}

function deleteProject(id) {
    // Prevent deletion if project has bugs
    const hasBugs = appData.bugs.some(b => b.projectId === id);
    if (hasBugs) {
        console.warn("Cannot delete project with existing bugs");
        return false;
    }
    appData.projects = appData.projects.filter(p => p.id !== id);
    saveToLocalStorage();
    return true;
}

// EXPOSE GLOBAL API 
window.BugTrackerAPI = {

    // Bugs
    getAllBugs,
    getBugById,
    saveBug,
    deleteBug,
    // People
    getAllPeople,
    getPersonById,
    savePerson,
    deletePerson,
    // Projects
    getAllProjects,
    getProjectById,
    saveProject,
    deleteProject
};

// INITIALISE ON LOAD
loadFromLocalStorage();
