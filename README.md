# IssueFlow Bug Tracking System

## Table of Contents

* [Introduction](#introduction)
* [Project Overview](#project-overview)
* [Features](#features)
* [System Pages](#system-pages)

  * [Dashboard](#dashboard)
  * [New Issue](#new-issue)
  * [People](#people)
  * [Projects](#projects)
* [Technologies Used](#technologies-used)
* [Data Management](#data-management)
* [Installation](#installation)
* [Usage](#usage)
* [Project Structure](#project-structure)
* [Future Improvements](#future-improvements)
* [Team Members](#team-members)

## Introduction

IssueFlow is a web-based bug tracking system designed to manage and monitor issues within software development projects. The system allows users to create, assign, track, and update issues efficiently within a centralized interface.

## Project Overview

This application demonstrates the core functionality of an issue tracking system using a front-end approach. It enables users to manage projects, assign tasks to individuals, and track the lifecycle of issues from creation to resolution.

## Features

* Create and manage issues (tickets)
* Assign issues to specific users
* View all issues in a structured dashboard
* View detailed information for individual issues
* Edit and update issue details
* Manage people and projects
* Persist data using browser storage (localStorage)

## System Pages

### Dashboard

The dashboard provides an overview of all issues in the system. It displays key information such as issue summary, status, priority, assigned user, and project. This page allows users to quickly assess the state of all recorded issues.

### New Issue

The New Issue page allows users to create a new ticket. Required fields include:

* Issue summary
* Description
* Assigned person
* Project
* Status (open, resolved, overdue)
* Priority (low, medium, high)
* Target resolution date
* Actual resolution date
* Resolution summary

### People

The People page manages individuals who can be assigned to issues. Each person includes:

* Unique ID
* Name and surname
* Email address
* Username

### Projects

The Projects page allows the creation and management of projects. Each project contains:

* Unique ID
* Project name

## Technologies Used

* HTML5 for structuring the application
* CSS3 and Bootstrap for styling and responsive design
* JavaScript for application logic and interactivity
* Web Storage API (localStorage) for data persistence

## Data Management

Our system uses the browser's localStorage to store data. The following entities are persisted:

* Issues
* People
* Projects

The data remains available even after the browser is refreshed, simulating basic database functionality and viewing in the dashboard.

## Installation

1. Download or clone the repository
2. Extract the project files 
3. Open the project folder
4. Launch the application by opening the main HTML file in a web browser

## Usage

1. Navigate to the Dashboard to view all issues
2. Create a new issue using the New Issue page
3. Assign issues to users from the People list
4. Associate issues with projects
5. Update issue details as progress is made
6. Refresh the browser to verify data persistence

## Project Structure

* index.html: Main dashboard interface
* issue-form.html: Issue creation form
* people.html: People management page
* projects.html: Project management page
* style.css: Application styling
* script.js: Core application logic
* storage.js: Web storage API 

## Future Improvements

* Integration with a backend database
* User authentication and role management
* Advanced filtering and search functionality
* File attachments for issues
* Real-time updates
* AI/ML proactive analytics

## Team Members

* Sitolwakhe Maluka – User Interface Design
* Dryden Pienaar – Issue Management Logic
* Tshifhiwa Nengovhela – Data Handling and Storage
* Iman Madikoane – Validation and Testing
* Sria Velloo – Documentation and Presentation
