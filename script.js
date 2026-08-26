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