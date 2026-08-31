// ======================================================
// CAMPUS COMMAND CENTER - SCRIPT.JS
// ======================================================


// ======================================================
// TASK TRACKER
// ======================================================

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function displayTasks() {

    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {

        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <span>${task.text}</span>

            <button onclick="completeTask(${index})">
                ${task.completed ? "Undo" : "Complete"}
            </button>

            <button onclick="deleteTask(${index})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });
}

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {
        return;
    }

    tasks.push({
        text: text,
        completed: false
    });

    saveTasks();
    displayTasks();

    taskInput.value = "";
}

function completeTask(index) {

    tasks[index].completed = !tasks[index].completed;

    saveTasks();
    displayTasks();
}

function deleteTask(index) {

    tasks.splice(index, 1);

    saveTasks();
    displayTasks();
}

addTaskBtn.addEventListener("click", addTask);

displayTasks();



// ======================================================
// EXAM COUNTDOWN
// ======================================================

const examCountdown =
    document.getElementById("examCountdown");

const examDate =
    new Date("September 8, 2026 09:00:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();

    const difference = examDate - now;

    if (difference <= 0) {

        examCountdown.textContent =
            "Exam Started";

        return;
    }

    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );

    examCountdown.textContent =
        `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;
}

updateCountdown();

setInterval(updateCountdown, 1000);



// ======================================================
// STUDY PLANNER
// ======================================================

const subjectInput =
    document.getElementById("subjectInput");

const priorityInput =
    document.getElementById("priorityInput");

const addStudyBtn =
    document.getElementById("addStudyBtn");

const studyList =
    document.getElementById("studyList");

const studyProgress =
    document.getElementById("studyProgress");

const studyPercentage =
    document.getElementById("studyPercentage");


// Load study sessions
let studySessions =
    JSON.parse(
        localStorage.getItem("studySessions")
    ) || [];


// Save study sessions
function saveStudySessions() {

    localStorage.setItem(
        "studySessions",
        JSON.stringify(studySessions)
    );
}


// Add study session
function addStudySession() {

    const subject =
        subjectInput.value.trim();

    const priority =
        priorityInput.value;


    // Prevent empty input
    if (subject === "") {

        alert("Please enter a subject.");

        return;
    }


    // Create study session
    const session = {

        subject: subject,

        priority: priority,

        completed: false

    };


    // Add to array
    studySessions.push(session);


    // Save
    saveStudySessions();


    // Display
    displayStudySessions();


    // Clear input
    subjectInput.value = "";

}


// Display study sessions
function displayStudySessions() {

    studyList.innerHTML = "";


    studySessions.forEach(
        function(session, index) {

            const li =
                document.createElement("li");


            if (session.completed) {

                li.classList.add("completed");

            }


            li.innerHTML = `

                <span>
                    ${session.subject}
                    - ${session.priority}
                </span>

                <button
                    onclick="completeStudy(${index})"
                >
                    ${
                        session.completed
                        ? "Undo"
                        : "Complete"
                    }
                </button>

                <button
                    onclick="deleteStudy(${index})"
                >
                    Delete
                </button>

            `;


            studyList.appendChild(li);

        }
    );


    updateStudyProgress();
}


// Complete study session
function completeStudy(index) {

    studySessions[index].completed =
        !studySessions[index].completed;


    saveStudySessions();

    displayStudySessions();
}


// Delete study session
function deleteStudy(index) {

    studySessions.splice(index, 1);


    saveStudySessions();

    displayStudySessions();
}


// Calculate progress
function updateStudyProgress() {

    if (studySessions.length === 0) {

        studyProgress.style.width = "0%";

        studyPercentage.textContent = "0%";

        return;
    }


    let completedSessions = 0;


    studySessions.forEach(
        function(session) {

            if (session.completed) {

                completedSessions++;

            }

        }
    );


    const percentage =
        Math.round(
            (completedSessions /
            studySessions.length) * 100
        );


    studyProgress.style.width =
        percentage + "%";


    studyPercentage.textContent =
        percentage + "%";
}


// Connect button
addStudyBtn.addEventListener(
    "click",
    addStudySession
);


// Display saved sessions
displayStudySessions();
// ======================================================
// PROJECT MANAGER
// ======================================================

// Get project elements
const projectNameInput =
    document.getElementById("projectNameInput");

const technologyInput =
    document.getElementById("technologyInput");

const githubInput =
    document.getElementById("githubInput");

const progressInput =
    document.getElementById("progressInput");

const deadlineInput =
    document.getElementById("deadlineInput");

const statusInput =
    document.getElementById("statusInput");

const addProjectBtn =
    document.getElementById("addProjectBtn");

const projectList =
    document.getElementById("projectList");


// Load projects from LocalStorage
let projects =
    JSON.parse(
        localStorage.getItem("projects")
    ) || [];


// Save projects
function saveProjects() {

    localStorage.setItem(
        "projects",
        JSON.stringify(projects)
    );
}


// Add project
function addProject() {

    const projectName =
        projectNameInput.value.trim();

    const technology =
        technologyInput.value.trim();

    const github =
        githubInput.value.trim();

    const progress =
        Number(progressInput.value);

    const deadline =
        deadlineInput.value;

    const status =
        statusInput.value;


    // Check required fields
    if (
        projectName === "" ||
        technology === "" ||
        deadline === ""
    ) {

        alert(
            "Please fill Project Name, Technology and Deadline."
        );

        return;
    }


    // Check progress
    if (
        progress < 0 ||
        progress > 100 ||
        isNaN(progress)
    ) {

        alert(
            "Progress must be between 0 and 100."
        );

        return;
    }


    // Create project
    const project = {

        name: projectName,

        technology: technology,

        github: github,

        progress: progress,

        deadline: deadline,

        status: status

    };


    // Add project
    projects.push(project);


    // Save
    saveProjects();


    // Display
    displayProjects();


    // Clear form
    projectNameInput.value = "";
    technologyInput.value = "";
    githubInput.value = "";
    progressInput.value = "";
    deadlineInput.value = "";
    statusInput.value = "Planning";
}


// Display projects
function displayProjects() {

    projectList.innerHTML = "";


    projects.forEach(
        function(project, index) {

            const card =
                document.createElement("div");

            card.classList.add("project-card");


            card.innerHTML = `

                <h3>
                    ${project.name}
                </h3>

                <p>
                    <strong>Technology:</strong>
                    ${project.technology}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${project.status}
                </p>

                <p>
                    <strong>Deadline:</strong>
                    ${project.deadline}
                </p>

                <p>
                    <strong>Progress:</strong>
                    ${project.progress}%
                </p>

                <div class="project-progress-bar">

                    <div
                        class="project-progress"
                        style="width: ${project.progress}%"
                    ></div>

                </div>

                ${
                    project.github
                    ? `
                        <button
                            onclick="openGithub('${project.github}')"
                        >
                            GitHub
                        </button>
                    `
                    : ""
                }

                <button
                    onclick="deleteProject(${index})"
                >
                    Delete
                </button>

            `;


            projectList.appendChild(card);

        }
    );
}


// Open GitHub repository
function openGithub(url) {

    window.open(
        url,
        "_blank"
    );
}


// Delete project
function deleteProject(index) {

    projects.splice(index, 1);

    saveProjects();

    displayProjects();
}


// Add project button
addProjectBtn.addEventListener(
    "click",
    addProject
);


// Display saved projects when page loads
displayProjects();