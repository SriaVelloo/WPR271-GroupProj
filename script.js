document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('issueForm')) {
        setupIssueForm();
    }
    if (document.getElementById('issuesContainer')) {
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
        document.getElementById('formTitle').innerText = "Edit Existing Issue";
        const issues = JSON.parse(localStorage.getItem('issues')) || [];
        const issueToEdit = issues.find(i => i.id == editId);
        
        if (issueToEdit) {
            document.getElementById('issueId').value = issueToEdit.id;
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
            id: document.getElementById('issueId').value || Date.now(),
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
        
        if (document.getElementById('issueId').value) {
            issues = issues.map(i => i.id == issueData.id ? issueData : i);
        } else {
            issues.push(issueData);
        }

        localStorage.setItem('issues', JSON.stringify(issues));
        alert("Issue saved successfully!");
        window.location.href = 'index.html';
    };
}

function displayAllIssues() {
    const container = document.getElementById('issuesContainer');
    const issues = JSON.parse(localStorage.getItem('issues')) || [];
    const projectFilter = document.getElementById('filterProject').value;
    const priorityFilter = document.getElementById('filterPriority').value;
    const searchText = document.getElementById('searchInput').value.toLowerCase();

    container.innerHTML = '';

    const filteredIssues = issues.filter(issue => {
        const matchesProject = projectFilter === 'all' || issue.project === projectFilter;
        const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
        const matchesSearch = issue.summary.toLowerCase().includes(searchText) || 
                              issue.assignee.toLowerCase().includes(searchText);
        return matchesProject && matchesPriority && matchesSearch;
    });

    filteredIssues.forEach(issue => {
        const card = `
            <div class="col-md-4 mb-3">
                <div class="card shadow-sm border-left-${issue.priority}">
                    <div class="card-body">
                        <h5 class="card-title">${issue.summary}</h5>
                        <p class="badge bg-${getStatusColor(issue.status)}">${issue.status}</p>
                        <p class="text-muted small">Assigned to: ${issue.assignee}</p>
                        <a href="issue-detail.html?id=${issue.id}" class="btn btn-sm btn-outline-primary">View Details</a>
                    </div>
                </div>
            </div>`;
        container.innerHTML += card;
    });
}

function getStatusColor(status) {
    if (status === 'open') return 'warning';
    if (status === 'resolved') return 'success';
    if (status === 'overdue') return 'danger';
    return 'secondary';
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
        
        document.getElementById('deleteIssueBtn').onclick = function() {
            if (confirm("Are you sure you want to delete this bug?")) {
                const updatedIssues = issues.filter(i => i.id != id);
                localStorage.setItem('issues', JSON.stringify(updatedIssues));
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
}
