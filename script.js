document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('issueForm')) {
        setupIssueForm();
    }
    if (document.getElementById('openIssuesList')) {
        displayAllIssues();
        setupFilters();
    }
    if (document.getElementById('issueDetailCard')) {
        displayIssueDetails();
    }
});

function setupIssueForm() {
    const form = document.getElementById('issueForm');
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');

    if (editId) {
        const titleEl = document.querySelector('.display-6');
        if (titleEl) titleEl.innerText = "Edit Issue";
        
        const issues = JSON.parse(localStorage.getItem('issues')) || [];
        const issueToEdit = issues.find(i => i.id == editId);
        
        if (issueToEdit) {
            if (document.getElementById('issueId')) document.getElementById('issueId').value = issueToEdit.id;
            document.getElementById('summary').value = issueToEdit.summary;
            document.getElementById('description').value = issueToEdit.description;
            document.getElementById('project').value = issueToEdit.project;
            document.getElementById('assignee').value = issueToEdit.assignee;
            document.getElementById('priority').value = issueToEdit.priority;
            document.getElementById('targetDate').value = issueToEdit.targetDate;
            document.getElementById('status').value = issueToEdit.status;
        }
    }

    form.onsubmit = function(e) {
        e.preventDefault();
        
        const issueData = {
            id: (editId) ? editId : Date.now().toString(),
            summary: document.getElementById('summary').value,
            description: document.getElementById('description').value,
            project: document.getElementById('project').value,
            assignee: document.getElementById('assignee').value,
            priority: document.getElementById('priority').value,
            targetDate: document.getElementById('targetDate').value,
            status: document.getElementById('status').value,
            createdDate: new Date().toLocaleDateString()
        };

        let issues = JSON.parse(localStorage.getItem('issues')) || [];
        
        if (editId) {
            issues = issues.map(i => i.id === editId ? issueData : i);
        } else {
            issues.push(issueData);
        }

        localStorage.setItem('issues', JSON.stringify(issues));
        alert("Issue saved successfully!");
        window.location.href = 'index.html';
    };
}

function displayAllIssues() {
    const openList = document.getElementById('openIssuesList');
    const progressList = document.getElementById('progressIssuesList');
    const resolvedList = document.getElementById('resolvedIssuesList');
    const template = document.getElementById('issueCardTemplate');

    openList.innerHTML = '';
    progressList.innerHTML = '';
    resolvedList.innerHTML = '';

    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    const projectFilter = document.getElementById('filterProject').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    let counts = { open: 0, progress: 0, resolved: 0 };

    issues.forEach(issue => {
        const matchesProject = projectFilter === 'all' || issue.project === projectFilter;
        const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
        const matchesSearch = issue.summary.toLowerCase().includes(searchText) || 
                              issue.assignee.toLowerCase().includes(searchText);

        if (matchesProject && matchesPriority && matchesSearch) {
            const clone = template.content.cloneNode(true);
            
            clone.querySelector('.issue-summary').innerText = issue.summary;
            clone.querySelector('.issue-description').innerText = issue.description;
            clone.querySelector('.issue-project').innerText = issue.project;
            clone.querySelector('.issue-assignee').innerText = issue.assignee;
            clone.querySelector('.issue-due-date').innerText = issue.targetDate;
            
            const badge = clone.querySelector('.priority-badge');
            badge.innerText = issue.priority;
            badge.className = `badge bg-${getPriorityColor(issue.priority)} text-uppercase`;

            clone.querySelector('.view-issue-btn').onclick = () => {
                window.location.href = `issue-detail.html?id=${issue.id}`;
            };

            if (issue.status === 'open') {
                openList.appendChild(clone);
                counts.open++;
            } else if (issue.status === 'in-progress' || issue.status === 'progress') {
                progressList.appendChild(clone);
                counts.progress++;
            } else if (issue.status === 'resolved') {
                resolvedList.appendChild(clone);
                counts.resolved++;
            }
        }
    });

    if (document.getElementById('openCount')) document.getElementById('openCount').innerText = counts.open;
    if (document.getElementById('progressCount')) document.getElementById('progressCount').innerText = counts.progress;
    if (document.getElementById('resolvedCount')) document.getElementById('resolvedCount').innerText = counts.resolved;
}

function getPriorityColor(p) {
    if (p === 'high') return 'danger';
    if (p === 'medium') return 'warning';
    return 'info';
}

function displayIssueDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    const issue = issues.find(i => i.id == id);

    if (issue) {
        document.getElementById('issueTitle').innerText = issue.summary;
        document.getElementById('issueDescription').innerText = issue.description;
        document.getElementById('issueStatus').innerText = issue.status;
        document.getElementById('issueAssignee').innerText = issue.assignee;
        if(document.getElementById('issueProject')) document.getElementById('issueProject').innerText = issue.project;
        if(document.getElementById('issueTargetDate')) document.getElementById('issueTargetDate').innerText = issue.targetDate;
        
        document.getElementById('deleteIssueBtn').onclick = function() {
            if (confirm("Delete this issue?")) {
                const updated = issues.filter(i => i.id != id);
                localStorage.setItem('issues', JSON.stringify(updated));
                window.location.href = 'index.html';
            }
        };

        document.getElementById('editIssueBtn').onclick = function() {
            window.location.href = `issue-form.html?id=${id}`;
        };
    }
}

function setupFilters() {
    document.getElementById('filterProject').onchange = displayAllIssues;
    document.getElementById('filterPriority').onchange = displayAllIssues;
    document.getElementById('searchInput').oninput = displayAllIssues;
    if (document.getElementById('resetFilters')) {
        document.getElementById('resetFilters').onclick = () => {
            document.getElementById('filterProject').value = 'all';
            document.getElementById('filterPriority').value = 'all';
            document.getElementById('searchInput').value = '';
            displayAllIssues();
        };
    }
}
