document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('issueForm')) {
        setupIssueForm();
    }
    if (document.getElementById('openIssuesList')) {
        displayAllIssues();
        setupFilters();
        loadProjectsForFilter();
    }
    if (document.getElementById('issueSummary')) {
        displayIssueDetails();
    }
});

function loadProjectsForFilter() {
    const projectFilter = document.getElementById('filterProject');
    if (projectFilter) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectFilter.appendChild(option);
        });
    }
}

function setupIssueForm() {
    const form = document.getElementById('issueForm');
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    //to load projects and people into dropdowns
    loadProjectsDropdown();
    loadPeopleDropdown();

    if (editId) {
        const titleEl = document.querySelector('.display-6');
        if (titleEl) titleEl.innerText = "Edit Issue";
        
        const issues = JSON.parse(localStorage.getItem('issues')) || [];
        const issueToEdit = issues.find(i => i.id == editId);
        
        if (issueToEdit) {
            if (document.getElementById('issueId')) document.getElementById('issueId').value = issueToEdit.id;
            document.getElementById('summary').value = issueToEdit.summary;
            document.getElementById('description').value = issueToEdit.description;
            document.getElementById('priority').value = issueToEdit.priority;
            document.getElementById('targetDate').value = issueToEdit.targetDate;
            document.getElementById('status').value = issueToEdit.status;
            document.getElementById('projectId').value = issueToEdit.projectId || issueToEdit.project;
            document.getElementById('assignedTo').value = issueToEdit.assignedPersonId || '';
            document.getElementById('targetDate').value = issueToEdit.targetResolutionDate || issueToEdit.targetDate;
            document.getElementById('actualDate').value = issueToEdit.actualResolutionDate || '';
            document.getElementById('resolutionSummary').value = issueToEdit.resolutionSummary || '';
        }
    }

    form.onsubmit = function(e) {
        e.preventDefault();
        
        const issueData = {
            id: document.getElementById('issueId').value || Date.now().toString(),
            summary: document.getElementById('summary').value,
            description: document.getElementById('description').value,
            priority: document.getElementById('priority').value,
            status: document.getElementById('status').value,
            projectId: document.getElementById('projectId').value,
            assignedPersonId: document.getElementById('assignedTo').value || null,
            targetResolutionDate: document.getElementById('targetDate').value || null,
            actualResolutionDate: document.getElementById('actualDate').value || null,
            resolutionSummary: document.getElementById('resolutionSummary').value || null,
            createdAt: new Date().toISOString().slice(0,10)
        };
        
        // Get project name for display
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const project = projects.find(p => p.id === issueData.projectId);
        issueData.project = project ? project.name : 'Unknown';
        
        // Get person name for display
        const people = JSON.parse(localStorage.getItem('people')) || [];
        const person = people.find(p => p.id === issueData.assignedPersonId);
        issueData.assignee = person ? `${person.name} ${person.surname}` : 'Unassigned';
        issueData.targetDate = issueData.targetResolutionDate;

        let issues = JSON.parse(localStorage.getItem('issues')) || [];
        const existingIndex = issues.findIndex(i => i.id == issueData.id);

       if (existingIndex !== -1) {
            issues[existingIndex] = issueData;
        } else {
            issues.push(issueData);
        }
        
        localStorage.setItem('issues', JSON.stringify(issues));
        
        // Also save to main BugTrackerData
        const mainData = JSON.parse(localStorage.getItem('BugTrackerData'));
        if (mainData) {
            const bugIndex = mainData.bugs.findIndex(b => b.id == issueData.id);
            const bugData = {
                id: issueData.id,
                summary: issueData.summary,
                description: issueData.description,
                priority: issueData.priority,
                status: issueData.status,
                targetResolutionDate: issueData.targetResolutionDate,
                actualResolutionDate: issueData.actualResolutionDate,
                resolutionSummary: issueData.resolutionSummary,
                projectId: issueData.projectId,
                assignedPersonId: issueData.assignedPersonId,
                createdAt: issueData.createdAt
            };
            if (bugIndex !== -1) {
                mainData.bugs[bugIndex] = bugData;
            } else {
                mainData.bugs.push(bugData);
            }
            localStorage.setItem('BugTrackerData', JSON.stringify(mainData));
        }
        
        showToast('Issue saved successfully!');
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    };
}

function loadProjectsDropdown() {
    const projectSelect = document.getElementById('projectId');
    if (projectSelect) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projectSelect.innerHTML = '<option value="">Select a project...</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            projectSelect.appendChild(option);
        });
    }
}

function loadPeopleDropdown() {
    const peopleSelect = document.getElementById('assignedTo');
    if (peopleSelect) {
        const people = JSON.parse(localStorage.getItem('people')) || [];
        peopleSelect.innerHTML = '<option value="">Unassigned</option>';
        people.forEach(person => {
            const option = document.createElement('option');
            option.value = person.id;
            option.textContent = `${person.name} ${person.surname} (${person.username})`;
            peopleSelect.appendChild(option);
        });
    }
} 

function displayAllIssues() {
    const openList = document.getElementById('openIssuesList');
    const progressList = document.getElementById('progressIssuesList');
    const resolvedList = document.getElementById('resolvedIssuesList');
    const template = document.getElementById('issueCardTemplate');

    if (!template) return;

    openList.innerHTML = '';
    progressList.innerHTML = '';
    resolvedList.innerHTML = '';

    let issues = JSON.parse(localStorage.getItem('issues')) || [];

    
    const projectFilterEl = document.getElementById('filterProject');
    const priorityFilterEl = document.getElementById('filterPriority');
    const searchInputEl = document.getElementById('searchInput');
    
    const projectFilter = projectFilterEl ? projectFilterEl.value : 'all';
    const priorityFilter = priorityFilterEl ? priorityFilterEl.value : 'all';
    const searchText = searchInputEl && searchInputEl.value ? searchInputEl.value.trim().toLowerCase() : '';

    let counts = { open: 0, progress: 0, resolved: 0 };

    issues.forEach(issue => {
        const matchesProject = projectFilter === 'all' || issue.projectId === projectFilter;
        const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
        const matchesSearch = (issue.summary && issue.summary.toLowerCase().includes(searchText)) || 
                              (issue.assignee && issue.assignee.toLowerCase().includes(searchText));

        if (matchesProject && matchesPriority && matchesSearch) {
            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.issue-summary').innerText = issue.summary;
            clone.querySelector('.issue-description').innerText = issue.description;
            clone.querySelector('.issue-project').innerText = issue.project;
            clone.querySelector('.issue-assignee').innerText = issue.assignee;
            clone.querySelector('.issue-due-date').innerText = issue.targetDate;
            
            const badge = clone.querySelector('.priority-badge');
            const priority = issue.priority || 'low';
            badge.innerText = priority.toUpperCase();
            badge.className = `badge bg-${getPriorityColor(issue.priority)} text-uppercase`;

            const card = clone.querySelector('.issue-card');
            card.setAttribute('data-issue-id', issue.id);
            
            clone.querySelector('.view-issue-btn').onclick = () => {
                window.location.href = `issue-detail.html?id=${encodeURIComponent(issue.id)}`;
            };
            
            const status = issue.status || 'open';
            if (status === 'open') {
                openList.appendChild(clone);
                counts.open++;
            } else if (status === 'in-progress' || status === 'progress') {
                progressList.appendChild(clone);
                counts.progress++;
            } else if (status === 'resolved') {
                resolvedList.appendChild(clone);
                counts.resolved++;
            }
        }
    }); 

    if (document.getElementById('openCount')) document.getElementById('openCount').innerText = counts.open;
    if (document.getElementById('progressCount')) document.getElementById('progressCount').innerText = counts.progress;
    if (document.getElementById('resolvedCount')) document.getElementById('resolvedCount').innerText = counts.resolved;

    // Show empty state messages if no issues in any column
    if (openList.children.length === 0) {
        openList.innerHTML = '<div class="text-center text-muted py-4">No open issues</div>';
    }
    if (progressList.children.length === 0) {
        progressList.innerHTML = '<div class="text-center text-muted py-4">No issues in progress</div>';
    }
    if (resolvedList.children.length === 0) {
        resolvedList.innerHTML = '<div class="text-center text-muted py-4">No resolved issues</div>';
    }
}

function getPriorityColor(p) {
    if (p === 'high') return 'danger';
    if (p === 'medium') return 'warning';
    return 'info';
}

function displayIssueDetails() {
    // Ensure data is synced from storage.js if needed
    if (typeof loadFromLocalStorage === 'function') {
        loadFromLocalStorage();
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    const issue = issues.find(i => String(i.id) === String(id) || i.id == id);

    if (!issue) {
        const titleEl = document.getElementById('issueSummary');
        const descEl = document.getElementById('issueDescription');
        if (titleEl) titleEl.textContent = 'Issue not found';
        if (descEl) descEl.textContent = 'The requested issue could not be found.';
        return;
    }

    const titleEl = document.getElementById('issueSummary');
    const descEl = document.getElementById('issueDescription');
    const statusBadge = document.getElementById('issueStatusBadge');
    const priorityEl = document.getElementById('issuePriority');
    const projEl = document.getElementById('issueProject');
    const assigneeEl = document.getElementById('issueAssignee');
    const targetEl = document.getElementById('issueTargetDate');
    const actualEl = document.getElementById('issueActualDate');
    const resolutionEl = document.getElementById('issueResolution');
    
    if (titleEl) titleEl.textContent = issue.summary || '';
    if (descEl) descEl.textContent = issue.description || '';
    if (statusBadge) statusBadge.textContent = issue.status || 'open';
    if (priorityEl) priorityEl.textContent = issue.priority || '-';
    if (projEl) projEl.textContent = issue.project || 'Unknown';
    if (assigneeEl) assigneeEl.textContent = issue.assignee || 'Unassigned';
    if (targetEl) targetEl.textContent = issue.targetDate || '-';
    if (actualEl) actualEl.textContent = issue.actualResolutionDate || '-';
    if (resolutionEl) resolutionEl.textContent = issue.resolutionSummary || 'No resolution summary provided yet.';
        
    const deleteBtn = document.getElementById('deleteIssueBtn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', function() {
            if (confirm("Delete this issue?")) {
                const updated = issues.filter(i => String(i.id) !== String(id));
                localStorage.setItem('issues', JSON.stringify(updated));
                window.location.href = 'index.html';
            }
        });
    }

    const editBtn = document.getElementById('editIssueBtn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = 'issue-form.html?id=' + encodeURIComponent(id);
        });
    }
}

function setupFilters() {
    const pf = document.getElementById('filterProject');
    const pr = document.getElementById('filterPriority');
    const si = document.getElementById('searchInput');
    if (pf) {
        pf.addEventListener('change', displayAllIssues);
        pf.value = 'all';
    }
    if (pr) {
        pr.addEventListener('change', displayAllIssues);
        pr.value = 'all';
    }
    if (si) {
        si.addEventListener('input', displayAllIssues);
        si.value = '';
    }
    const rf = document.getElementById('resetFilters');
    if (rf) {
        rf.addEventListener('click', function() {
            if (pf) pf.value = 'all';
            if (pr) pr.value = 'all';
            if (si) si.value = '';
            displayAllIssues();
        });
    }
}


function showToast(message) {
    const toastEl = document.getElementById('liveToast');
    if (toastEl) {
        toastEl.querySelector('.toast-body').textContent = message;
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
    } else {
        alert(message);
    }
}
