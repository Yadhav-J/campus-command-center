// ======================================================
// CAMPUS COMMAND CENTER
// COMPLETE SCRIPT.JS
// ======================================================



// ======================================================
// TASK TRACKER
// ======================================================

const taskInput =
    document.getElementById("taskInput");

const addTaskBtn =
    document.getElementById("addTaskBtn");

const taskList =
    document.getElementById("taskList");


let tasks =
    JSON.parse(
        localStorage.getItem("tasks")
    ) || [];



function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}



function displayTasks() {

    taskList.innerHTML = "";


    tasks.forEach(
        function(task, index) {

            const li =
                document.createElement("li");


            if (task.completed) {

                li.classList.add(
                    "completed"
                );

            }


            li.innerHTML = `

                <span>
                    ${task.text}
                </span>

                <button
                    onclick="completeTask(${index})"
                >
                    ${
                        task.completed
                        ? "Undo"
                        : "Complete"
                    }
                </button>

                <button
                    onclick="deleteTask(${index})"
                >
                    Delete
                </button>

            `;


            taskList.appendChild(li);

        }
    );


    updateOverview();

}



function addTask() {

    const text =
        taskInput.value.trim();


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

    tasks[index].completed =
        !tasks[index].completed;


    saveTasks();

    displayTasks();

}



function deleteTask(index) {

    tasks.splice(index, 1);


    saveTasks();

    displayTasks();

}



addTaskBtn.addEventListener(
    "click",
    addTask
);


displayTasks();





// ======================================================
// EXAM COUNTDOWN
// ======================================================

const examCountdown =
    document.getElementById(
        "examCountdown"
    );


const examDate =
    new Date(
        "September 8, 2026 09:00:00"
    ).getTime();



function updateCountdown() {

    const now =
        new Date().getTime();


    const difference =
        examDate - now;


    if (difference <= 0) {

        examCountdown.textContent =
            "Exam Started";

        return;

    }


    const days =
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                difference /
                (1000 * 60 * 60)
            ) % 24
        );


    const minutes =
        Math.floor(
            (
                difference /
                (1000 * 60)
            ) % 60
        );


    const seconds =
        Math.floor(
            (
                difference /
                1000
            ) % 60
        );


    examCountdown.textContent =
        `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;

}


updateCountdown();


setInterval(
    updateCountdown,
    1000
);





// ======================================================
// STUDY PLANNER
// ======================================================

const subjectInput =
    document.getElementById(
        "subjectInput"
    );


const priorityInput =
    document.getElementById(
        "priorityInput"
    );


const addStudyBtn =
    document.getElementById(
        "addStudyBtn"
    );


const studyList =
    document.getElementById(
        "studyList"
    );


const studyProgress =
    document.getElementById(
        "studyProgress"
    );


const studyPercentage =
    document.getElementById(
        "studyPercentage"
    );


let studySessions =
    JSON.parse(
        localStorage.getItem(
            "studySessions"
        )
    ) || [];



function saveStudySessions() {

    localStorage.setItem(
        "studySessions",
        JSON.stringify(
            studySessions
        )
    );

}



function addStudySession() {

    const subject =
        subjectInput.value.trim();


    const priority =
        priorityInput.value;


    if (subject === "") {

        alert(
            "Please enter a subject."
        );

        return;

    }


    studySessions.push({

        subject: subject,

        priority: priority,

        completed: false

    });


    saveStudySessions();

    displayStudySessions();


    subjectInput.value = "";

}



function displayStudySessions() {

    studyList.innerHTML = "";


    studySessions.forEach(
        function(session, index) {

            const li =
                document.createElement("li");


            if (session.completed) {

                li.classList.add(
                    "completed"
                );

            }


            li.innerHTML = `

                <span>

                    ${session.subject}

                    -

                    ${session.priority}

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



function completeStudy(index) {

    studySessions[index].completed =
        !studySessions[index].completed;


    saveStudySessions();

    displayStudySessions();

}



function deleteStudy(index) {

    studySessions.splice(
        index,
        1
    );


    saveStudySessions();

    displayStudySessions();

}



function updateStudyProgress() {

    const total =
        studySessions.length;


    if (total === 0) {

        studyProgress.style.width =
            "0%";

        studyPercentage.textContent =
            "0%";

        return;

    }


    const completed =
        studySessions.filter(
            function(session) {

                return session.completed;

            }
        ).length;


    const percentage =
        Math.round(
            (
                completed /
                total
            ) * 100
        );


    studyProgress.style.width =
        percentage + "%";


    studyPercentage.textContent =
        percentage + "%";

}



addStudyBtn.addEventListener(
    "click",
    addStudySession
);


displayStudySessions();





// ======================================================
// PROJECT MANAGER
// ======================================================

const projectNameInput =
    document.getElementById(
        "projectNameInput"
    );


const technologyInput =
    document.getElementById(
        "technologyInput"
    );


const githubInput =
    document.getElementById(
        "githubInput"
    );


const progressInput =
    document.getElementById(
        "progressInput"
    );


const deadlineInput =
    document.getElementById(
        "deadlineInput"
    );


const statusInput =
    document.getElementById(
        "statusInput"
    );


const addProjectBtn =
    document.getElementById(
        "addProjectBtn"
    );


const projectList =
    document.getElementById(
        "projectList"
    );


let projects =
    JSON.parse(
        localStorage.getItem(
            "projects"
        )
    ) || [];



function saveProjects() {

    localStorage.setItem(
        "projects",
        JSON.stringify(
            projects
        )
    );

}



function addProject() {

    const name =
        projectNameInput.value.trim();


    const technology =
        technologyInput.value.trim();


    const github =
        githubInput.value.trim();


    const progress =
        Number(
            progressInput.value
        );


    const deadline =
        deadlineInput.value;


    const status =
        statusInput.value;


    if (
        name === "" ||
        technology === "" ||
        deadline === ""
    ) {

        alert(
            "Please fill Project Name, Technology and Deadline."
        );

        return;

    }


    if (
        isNaN(progress) ||
        progress < 0 ||
        progress > 100
    ) {

        alert(
            "Progress must be between 0 and 100."
        );

        return;

    }


    projects.push({

        name: name,

        technology: technology,

        github: github,

        progress: progress,

        deadline: deadline,

        status: status

    });


    saveProjects();

    displayProjects();


    projectNameInput.value = "";

    technologyInput.value = "";

    githubInput.value = "";

    progressInput.value = "";

    deadlineInput.value = "";

    statusInput.value =
        "Planning";


    updateOverview();

}



function displayProjects() {

    projectList.innerHTML = "";


    projects.forEach(
        function(project, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "project-card"
            );


            card.innerHTML = `

                <h3>
                    ${project.name}
                </h3>

                <p>
                    <strong>
                        Technology:
                    </strong>

                    ${project.technology}
                </p>

                <p>
                    <strong>
                        Status:
                    </strong>

                    ${project.status}
                </p>

                <p>
                    <strong>
                        Deadline:
                    </strong>

                    ${project.deadline}
                </p>

                <p>
                    <strong>
                        Progress:
                    </strong>

                    ${project.progress}%
                </p>


                <div
                    class="project-progress-bar"
                >

                    <div
                        class="project-progress"
                        style="width: ${project.progress}%"
                    ></div>

                </div>


                ${
                    project.github
                    ?
                    `

                    <button
                        onclick="openGithub('${project.github}')"
                    >
                        GitHub
                    </button>

                    `
                    :
                    ""
                }


                <button
                    onclick="deleteProject(${index})"
                >
                    Delete
                </button>

            `;


            projectList.appendChild(
                card
            );

        }
    );


    updateOverview();

}



function openGithub(url) {

    window.open(
        url,
        "_blank"
    );

}



function deleteProject(index) {

    projects.splice(
        index,
        1
    );


    saveProjects();

    displayProjects();

    updateOverview();

}



addProjectBtn.addEventListener(
    "click",
    addProject
);


displayProjects();





// ======================================================
// ASSIGNMENT TRACKER
// ======================================================

const assignmentNameInput =
    document.getElementById(
        "assignmentNameInput"
    );


const assignmentSubjectInput =
    document.getElementById(
        "assignmentSubjectInput"
    );


const assignmentDeadlineInput =
    document.getElementById(
        "assignmentDeadlineInput"
    );


const assignmentPriorityInput =
    document.getElementById(
        "assignmentPriorityInput"
    );


const assignmentStatusInput =
    document.getElementById(
        "assignmentStatusInput"
    );


const addAssignmentBtn =
    document.getElementById(
        "addAssignmentBtn"
    );


const assignmentList =
    document.getElementById(
        "assignmentList"
    );


let assignments =
    JSON.parse(
        localStorage.getItem(
            "assignments"
        )
    ) || [];



function saveAssignments() {

    localStorage.setItem(
        "assignments",
        JSON.stringify(
            assignments
        )
    );

}



function addAssignment() {

    const name =
        assignmentNameInput.value.trim();


    const subject =
        assignmentSubjectInput.value.trim();


    const deadline =
        assignmentDeadlineInput.value;


    const priority =
        assignmentPriorityInput.value;


    const status =
        assignmentStatusInput.value;


    if (
        name === "" ||
        subject === "" ||
        deadline === ""
    ) {

        alert(
            "Please fill Assignment, Subject and Deadline."
        );

        return;

    }


    assignments.push({

        name: name,

        subject: subject,

        deadline: deadline,

        priority: priority,

        status: status

    });


    saveAssignments();

    displayAssignments();


    assignmentNameInput.value = "";

    assignmentSubjectInput.value = "";

    assignmentDeadlineInput.value = "";

    assignmentPriorityInput.value =
        "High";

    assignmentStatusInput.value =
        "Pending";

}



function displayAssignments() {

    assignmentList.innerHTML = "";


    assignments.forEach(
        function(assignment, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.classList.add(
                "assignment-card"
            );


            card.innerHTML = `

                <h3>
                    ${assignment.name}
                </h3>

                <p>
                    <strong>
                        Subject:
                    </strong>

                    ${assignment.subject}
                </p>

                <p>
                    <strong>
                        Deadline:
                    </strong>

                    ${assignment.deadline}
                </p>

                <p>
                    <strong>
                        Priority:
                    </strong>

                    ${assignment.priority}
                </p>


                <span
                    class="assignment-status"
                >
                    ${assignment.status}
                </span>


                <br>


                <button
                    onclick="changeAssignmentStatus(${index})"
                >
                    Change Status
                </button>


                <button
                    onclick="deleteAssignment(${index})"
                >
                    Delete
                </button>

            `;


            assignmentList.appendChild(
                card
            );

        }
    );


    updateAssignmentProgress();

}



function changeAssignmentStatus(index) {

    const current =
        assignments[index].status;


    if (
        current === "Pending"
    ) {

        assignments[index].status =
            "In Progress";

    }

    else if (
        current === "In Progress"
    ) {

        assignments[index].status =
            "Completed";

    }

    else {

        assignments[index].status =
            "Pending";

    }


    saveAssignments();

    displayAssignments();

}



function deleteAssignment(index) {

    assignments.splice(
        index,
        1
    );


    saveAssignments();

    displayAssignments();

}



function updateAssignmentProgress() {

    const total =
        assignments.length;


    const pending =
        assignments.filter(
            function(assignment) {

                return (
                    assignment.status ===
                    "Pending"
                );

            }
        ).length;


    const inProgress =
        assignments.filter(
            function(assignment) {

                return (
                    assignment.status ===
                    "In Progress"
                );

            }
        ).length;


    const completed =
        assignments.filter(
            function(assignment) {

                return (
                    assignment.status ===
                    "Completed"
                );

            }
        ).length;


    document.getElementById(
        "totalAssignments"
    ).textContent =
        total;


    document.getElementById(
        "pendingAssignments"
    ).textContent =
        pending;


    document.getElementById(
        "inProgressAssignments"
    ).textContent =
        inProgress;


    document.getElementById(
        "completedAssignments"
    ).textContent =
        completed;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (
                    completed /
                    total
                ) * 100
            );

    }


    document.getElementById(
        "assignmentPercentage"
    ).textContent =
        percentage + "%";


    document.getElementById(
        "assignmentProgress"
    ).style.width =
        percentage + "%";


    updateOverview();

}



addAssignmentBtn.addEventListener(
    "click",
    addAssignment
);


displayAssignments();





// ======================================================
// CODING TRACKER
// ======================================================

const problemsSolved =
    document.getElementById(
        "problemsSolved"
    );


const codingHours =
    document.getElementById(
        "codingHours"
    );


const codingProjects =
    document.getElementById(
        "codingProjects"
    );


const codingStreak =
    document.getElementById(
        "codingStreak"
    );


const problemsInput =
    document.getElementById(
        "problemsInput"
    );


const hoursInput =
    document.getElementById(
        "hoursInput"
    );


const projectsInput =
    document.getElementById(
        "projectsInput"
    );


const updateCodingBtn =
    document.getElementById(
        "updateCodingBtn"
    );



let codingData =
    JSON.parse(
        localStorage.getItem(
            "codingData"
        )
    ) || {

        problems: 0,

        hours: 0,

        projects: 0,

        streak: 0

    };



function saveCodingData() {

    localStorage.setItem(
        "codingData",
        JSON.stringify(
            codingData
        )
    );

}



function displayCodingData() {

    problemsSolved.textContent =
        codingData.problems;


    codingHours.textContent =
        codingData.hours;


    codingProjects.textContent =
        codingData.projects;


    codingStreak.textContent =
        codingData.streak +
        " Days";


    updateOverview();

}



function updateCodingStats() {

    const problems =
        Number(
            problemsInput.value
        );


    const hours =
        Number(
            hoursInput.value
        );


    const projectsCompleted =
        Number(
            projectsInput.value
        );


    if (
        problems < 0 ||
        hours < 0 ||
        projectsCompleted < 0
    ) {

        alert(
            "Values cannot be negative."
        );

        return;

    }


    codingData.problems =
        problems;


    codingData.hours =
        hours;


    codingData.projects =
        projectsCompleted;


    codingData.streak =
        problems > 0
        ? codingData.streak + 1
        : codingData.streak;


    saveCodingData();

    displayCodingData();


    problemsInput.value = "";

    hoursInput.value = "";

    projectsInput.value = "";

}



updateCodingBtn.addEventListener(
    "click",
    updateCodingStats
);


displayCodingData();





// ======================================================
// DASHBOARD OVERVIEW
// ======================================================

function updateOverview() {

    const taskCount =
        tasks.filter(
            function(task) {

                return !task.completed;

            }
        ).length;


    const projectCount =
        projects.length;


    const totalAssignments =
        assignments.length;


    const completedAssignments =
        assignments.filter(
            function(assignment) {

                return (
                    assignment.status ===
                    "Completed"
                );

            }
        ).length;


    let assignmentProgress = 0;


    if (totalAssignments > 0) {

        assignmentProgress =
            Math.round(
                (
                    completedAssignments /
                    totalAssignments
                ) * 100
            );

    }


    document.getElementById(
        "overviewTasks"
    ).textContent =
        taskCount;


    document.getElementById(
        "overviewProjects"
    ).textContent =
        projectCount;


    document.getElementById(
        "overviewStreak"
    ).textContent =
        codingData.streak +
        " Days";


    document.getElementById(
        "overviewProgress"
    ).textContent =
        assignmentProgress + "%";

}


updateOverview();