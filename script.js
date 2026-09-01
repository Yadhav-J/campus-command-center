```javascript
/* =====================================================
   CAMPUS COMMAND CENTER
   COMPLETE JAVASCRIPT
   ===================================================== */


/* =====================================================
   NAVIGATION
   ===================================================== */

const navItems =
    document.querySelectorAll(".nav-item");

const pages =
    document.querySelectorAll(".page");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");


const pageInfo = {

    dashboard: [
        "Dashboard",
        "Your college life, organized."
    ],

    tasks: [
        "Task Tracker",
        "Manage your daily tasks."
    ],

    study: [
        "Study Planner",
        "Plan and track your study sessions."
    ],

    assignments: [
        "Assignment Tracker",
        "Track your assignments."
    ],

    exams: [
        "Exam Countdown",
        "Keep track of upcoming exams."
    ],

    projects: [
        "Project Manager",
        "Manage your projects."
    ],

    coding: [
        "Coding Tracker",
        "Track your programming progress."
    ]

};


function showPage(pageName) {

    pages.forEach(function(page) {

        page.classList.remove(
            "active-page"
        );

    });


    navItems.forEach(function(item) {

        item.classList.remove(
            "active"
        );

    });


    const selectedPage =
        document.getElementById(pageName);


    if (selectedPage) {

        selectedPage.classList.add(
            "active-page"
        );

    }


    navItems.forEach(function(item) {

        if (
            item.dataset.page ===
            pageName
        ) {

            item.classList.add(
                "active"
            );

        }

    });


    if (pageInfo[pageName]) {

        pageTitle.textContent =
            pageInfo[pageName][0];

        pageSubtitle.textContent =
            pageInfo[pageName][1];

    }

}


navItems.forEach(function(item) {

    item.addEventListener(
        "click",
        function() {

            showPage(
                item.dataset.page
            );

        }
    );

});



/* =====================================================
   TASK TRACKER
   ===================================================== */

const taskInput =
    document.getElementById(
        "taskInput"
    );

const addTaskBtn =
    document.getElementById(
        "addTaskBtn"
    );

const taskList =
    document.getElementById(
        "taskList"
    );


let tasks =
    JSON.parse(
        localStorage.getItem(
            "campusTasks"
        )
    ) || [];


function saveTasks() {

    localStorage.setItem(
        "campusTasks",
        JSON.stringify(tasks)
    );

}


function renderTasks() {

    if (!taskList) {
        return;
    }


    taskList.innerHTML = "";


    tasks.forEach(
        function(task, index) {

            const li =
                document.createElement(
                    "li"
                );


            if (task.completed) {

                li.classList.add(
                    "completed"
                );

            }


            const span =
                document.createElement(
                    "span"
                );


            span.textContent =
                task.text;


            const completeBtn =
                document.createElement(
                    "button"
                );


            completeBtn.textContent =
                task.completed
                ? "Undo"
                : "Complete";


            completeBtn.addEventListener(
                "click",
                function() {

                    toggleTask(index);

                }
            );


            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.textContent =
                "Delete";


            deleteBtn.addEventListener(
                "click",
                function() {

                    deleteTask(index);

                }
            );


            li.appendChild(span);

            li.appendChild(
                completeBtn
            );

            li.appendChild(
                deleteBtn
            );


            taskList.appendChild(li);

        }
    );


    updateDashboard();

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

    renderTasks();


    taskInput.value = "";

}


function toggleTask(index) {

    tasks[index].completed =
        !tasks[index].completed;


    saveTasks();

    renderTasks();

}


function deleteTask(index) {

    tasks.splice(
        index,
        1
    );


    saveTasks();

    renderTasks();

}


addTaskBtn.addEventListener(
    "click",
    addTask
);


taskInput.addEventListener(
    "keypress",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            addTask();

        }

    }
);



/* =====================================================
   STUDY PLANNER
   ===================================================== */

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
            "campusStudy"
        )
    ) || [];


function saveStudy() {

    localStorage.setItem(
        "campusStudy",
        JSON.stringify(
            studySessions
        )
    );

}


function renderStudy() {

    studyList.innerHTML = "";


    studySessions.forEach(
        function(session, index) {

            const li =
                document.createElement(
                    "li"
                );


            if (session.completed) {

                li.classList.add(
                    "completed"
                );

            }


            const span =
                document.createElement(
                    "span"
                );


            span.textContent =
                `${session.subject} - ${session.priority}`;


            const completeBtn =
                document.createElement(
                    "button"
                );


            completeBtn.textContent =
                session.completed
                ? "Undo"
                : "Complete";


            completeBtn.addEventListener(
                "click",
                function() {

                    studySessions[index].completed =
                        !studySessions[index].completed;

                    saveStudy();

                    renderStudy();

                }
            );


            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.textContent =
                "Delete";


            deleteBtn.addEventListener(
                "click",
                function() {

                    studySessions.splice(
                        index,
                        1
                    );

                    saveStudy();

                    renderStudy();

                }
            );


            li.appendChild(span);

            li.appendChild(
                completeBtn
            );

            li.appendChild(
                deleteBtn
            );


            studyList.appendChild(li);

        }
    );


    updateStudyProgress();

}


function addStudy() {

    const subject =
        subjectInput.value.trim();


    if (subject === "") {

        return;

    }


    studySessions.push({

        subject: subject,

        priority:
            priorityInput.value,

        completed: false

    });


    saveStudy();

    renderStudy();


    subjectInput.value = "";

}


function updateStudyProgress() {

    const total =
        studySessions.length;


    const completed =
        studySessions.filter(
            function(session) {

                return session.completed;

            }
        ).length;


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


    studyProgress.style.width =
        percentage + "%";


    studyPercentage.textContent =
        percentage + "%";


    updateDashboard();

}


addStudyBtn.addEventListener(
    "click",
    addStudy
);


subjectInput.addEventListener(
    "keypress",
    function(event) {

        if (
            event.key ===
            "Enter"
        ) {

            addStudy();

        }

    }
);



/* =====================================================
   EXAM COUNTDOWN
   ===================================================== */

const examCountdown =
    document.getElementById(
        "examCountdown"
    );

const dashboardExamCountdown =
    document.getElementById(
        "dashboardExamCountdown"
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

        if (examCountdown) {

            examCountdown.textContent =
                "Exam Started";

        }


        if (
            dashboardExamCountdown
        ) {

            dashboardExamCountdown.textContent =
                "Exam Started";

        }


        return;

    }


    const days =
        Math.floor(
            difference /
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    const hours =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60 *
                    60
                )
            ) % 24
        );


    const minutes =
        Math.floor(
            (
                difference /
                (
                    1000 *
                    60
                )
            ) % 60
        );


    const seconds =
        Math.floor(
            (
                difference /
                1000
            ) % 60
        );


    const text =
        `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;


    if (examCountdown) {

        examCountdown.textContent =
            text;

    }


    if (
        dashboardExamCountdown
    ) {

        dashboardExamCountdown.textContent =
            text;

    }

}


updateCountdown();

setInterval(
    updateCountdown,
    1000
);



/* =====================================================
   ASSIGNMENT TRACKER
   ===================================================== */

const assignmentName =
    document.getElementById(
        "assignmentName"
    );

const assignmentSubject =
    document.getElementById(
        "assignmentSubject"
    );

const assignmentDeadline =
    document.getElementById(
        "assignmentDeadline"
    );

const assignmentPriority =
    document.getElementById(
        "assignmentPriority"
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
            "campusAssignments"
        )
    ) || [];


function saveAssignments() {

    localStorage.setItem(
        "campusAssignments",
        JSON.stringify(
            assignments
        )
    );

}


function addAssignment() {

    const name =
        assignmentName.value.trim();

    const subject =
        assignmentSubject.value.trim();

    const deadline =
        assignmentDeadline.value;


    if (
        name === "" ||
        subject === "" ||
        deadline === ""
    ) {

        alert(
            "Please fill all fields."
        );

        return;

    }


    assignments.push({

        name: name,

        subject: subject,

        deadline: deadline,

        priority:
            assignmentPriority.value,

        status: "Pending"

    });


    saveAssignments();

    renderAssignments();


    assignmentName.value = "";

    assignmentSubject.value = "";

    assignmentDeadline.value = "";

}


function renderAssignments() {

    assignmentList.innerHTML = "";


    assignments.forEach(
        function(assignment, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "assignment-card";


            card.innerHTML = `

                <h3>
                    ${assignment.name}
                </h3>

                <p>
                    Subject:
                    ${assignment.subject}
                </p>

                <p>
                    Deadline:
                    ${assignment.deadline}
                </p>

                <p>
                    Priority:
                    ${assignment.priority}
                </p>

                <p>
                    Status:
                    <strong>
                        ${assignment.status}
                    </strong>
                </p>

            `;


            const statusBtn =
                document.createElement(
                    "button"
                );


            statusBtn.textContent =
                "Change Status";


            statusBtn.addEventListener(
                "click",
                function() {

                    changeAssignmentStatus(
                        index
                    );

                }
            );


            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.textContent =
                "Delete";


            deleteBtn.addEventListener(
                "click",
                function() {

                    deleteAssignment(
                        index
                    );

                }
            );


            card.appendChild(
                statusBtn
            );

            card.appendChild(
                deleteBtn
            );


            assignmentList.appendChild(
                card
            );

        }
    );


    updateAssignmentStats();

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

    renderAssignments();

}


function deleteAssignment(index) {

    assignments.splice(
        index,
        1
    );


    saveAssignments();

    renderAssignments();

}


function updateAssignmentStats() {

    const total =
        assignments.length;


    const pending =
        assignments.filter(
            function(item) {

                return item.status ===
                    "Pending";

            }
        ).length;


    const inProgress =
        assignments.filter(
            function(item) {

                return item.status ===
                    "In Progress";

            }
        ).length;


    const completed =
        assignments.filter(
            function(item) {

                return item.status ===
                    "Completed";

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
        "progressAssignments"
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
        "assignmentProgressBar"
    ).style.width =
        percentage + "%";


    const chartTotal =
        Math.max(
            total,
            1
        );


    document.getElementById(
        "pendingBar"
    ).style.height =
        (
            pending /
            chartTotal
        ) * 100 + "%";


    document.getElementById(
        "progressBar"
    ).style.height =
        (
            inProgress /
            chartTotal
        ) * 100 + "%";


    document.getElementById(
        "completedBar"
    ).style.height =
        (
            completed /
            chartTotal
        ) * 100 + "%";


    updateDashboard();

}


addAssignmentBtn.addEventListener(
    "click",
    addAssignment
);



/* =====================================================
   PROJECT MANAGER
   ===================================================== */

const projectName =
    document.getElementById(
        "projectName"
    );

const projectTechnology =
    document.getElementById(
        "projectTechnology"
    );

const projectGithub =
    document.getElementById(
        "projectGithub"
    );

const projectProgress =
    document.getElementById(
        "projectProgress"
    );

const projectDeadline =
    document.getElementById(
        "projectDeadline"
    );

const projectStatus =
    document.getElementById(
        "projectStatus"
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
            "campusProjects"
        )
    ) || [];


function saveProjects() {

    localStorage.setItem(
        "campusProjects",
        JSON.stringify(
            projects
        )
    );

}


function addProject() {

    const name =
        projectName.value.trim();

    const technology =
        projectTechnology.value.trim();

    const github =
        projectGithub.value.trim();

    const progress =
        Number(
            projectProgress.value
        );

    const deadline =
        projectDeadline.value;

    const status =
        projectStatus.value;


    if (
        name === "" ||
        technology === "" ||
        deadline === ""
    ) {

        alert(
            "Please fill the required fields."
        );

        return;

    }


    projects.push({

        name: name,

        technology: technology,

        github: github,

        progress:
            isNaN(progress)
            ? 0
            : Math.min(
                Math.max(
                    progress,
                    0
                ),
                100
            ),

        deadline: deadline,

        status: status

    });


    saveProjects();

    renderProjects();


    projectName.value = "";

    projectTechnology.value = "";

    projectGithub.value = "";

    projectProgress.value = "";

    projectDeadline.value = "";

}


function renderProjects() {

    projectList.innerHTML = "";


    projects.forEach(
        function(project, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "project-card";


            card.innerHTML = `

                <h3>
                    ${project.name}
                </h3>

                <p>
                    Technology:
                    ${project.technology}
                </p>

                <p>
                    Deadline:
                    ${project.deadline}
                </p>

                <p>
                    Status:
                    ${project.status}
                </p>

                <p>
                    Progress:
                    ${project.progress}%
                </p>

                <div class="project-progress-bar">

                    <div
                        class="project-progress"
                        style="width:${project.progress}%">
                    </div>

                </div>

            `;


            if (project.github) {

                const githubBtn =
                    document.createElement(
                        "button"
                    );


                githubBtn.textContent =
                    "GitHub";


                githubBtn.addEventListener(
                    "click",
                    function() {

                        window.open(
                            project.github,
                            "_blank"
                        );

                    }
                );


                card.appendChild(
                    githubBtn
                );

            }


            const deleteBtn =
                document.createElement(
                    "button"
                );


            deleteBtn.textContent =
                "Delete";


            deleteBtn.addEventListener(
                "click",
                function() {

                    projects.splice(
                        index,
                        1
                    );

                    saveProjects();

                    renderProjects();

                }
            );


            card.appendChild(
                deleteBtn
            );


            projectList.appendChild(
                card
            );

        }
    );


    updateDashboard();

}


addProjectBtn.addEventListener(
    "click",
    addProject
);



/* =====================================================
   CODING TRACKER
   ===================================================== */

const codingProblems =
    document.getElementById(
        "codingProblems"
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

const codingProjectsInput =
    document.getElementById(
        "codingProjectsInput"
    );

const updateCodingBtn =
    document.getElementById(
        "updateCodingBtn"
    );


let codingData =
    JSON.parse(
        localStorage.getItem(
            "campusCoding"
        )
    ) || {

        problems: 0,

        hours: 0,

        projects: 0,

        streak: 0

    };


function saveCoding() {

    localStorage.setItem(
        "campusCoding",
        JSON.stringify(
            codingData
        )
    );

}


function renderCoding() {

    codingProblems.textContent =
        codingData.problems;


    codingHours.textContent =
        codingData.hours;


    codingProjects.textContent =
        codingData.projects;


    codingStreak.textContent =
        codingData.streak +
        " Days";


    updateDashboard();

}


function updateCoding() {

    codingData.problems =
        Math.max(
            0,
            Number(
                problemsInput.value
            ) || 0
        );


    codingData.hours =
        Math.max(
            0,
            Number(
                hoursInput.value
            ) || 0
        );


    codingData.projects =
        Math.max(
            0,
            Number(
                codingProjectsInput.value
            ) || 0
        );


    if (
        codingData.problems > 0
    ) {

        codingData.streak++;

    }


    saveCoding();

    renderCoding();


    problemsInput.value = "";

    hoursInput.value = "";

    codingProjectsInput.value = "";

}


updateCodingBtn.addEventListener(
    "click",
    updateCoding
);



/* =====================================================
   DASHBOARD
   ===================================================== */

function updateDashboard() {

    const dashboardTasks =
        document.getElementById(
            "dashboardTasks"
        );

    const dashboardProjects =
        document.getElementById(
            "dashboardProjects"
        );

    const dashboardAssignments =
        document.getElementById(
            "dashboardAssignments"
        );

    const dashboardStreak =
        document.getElementById(
            "dashboardStreak"
        );


    const incompleteTasks =
        tasks.filter(
            function(task) {

                return !task.completed;

            }
        ).length;


    const incompleteAssignments =
        assignments.filter(
            function(item) {

                return item.status !==
                    "Completed";

            }
        ).length;


    if (dashboardTasks) {

        dashboardTasks.textContent =
            incompleteTasks;

    }


    if (dashboardProjects) {

        dashboardProjects.textContent =
            projects.length;

    }


    if (dashboardAssignments) {

        dashboardAssignments.textContent =
            incompleteAssignments;

    }


    if (dashboardStreak) {

        dashboardStreak.textContent =
            codingData.streak +
            " Days";

    }


    /* OVERALL PROGRESS */

    const studyTotal =
        studySessions.length;


    const studyCompleted =
        studySessions.filter(
            function(session) {

                return session.completed;

            }
        ).length;


    const assignmentTotal =
        assignments.length;


    const assignmentCompleted =
        assignments.filter(
            function(item) {

                return item.status ===
                    "Completed";

            }
        ).length;


    const total =
        studyTotal +
        assignmentTotal;


    const completed =
        studyCompleted +
        assignmentCompleted;


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


    const dashboardProgress =
        document.getElementById(
            "dashboardProgress"
        );


    const dashboardProgressBar =
        document.getElementById(
            "dashboardProgressBar"
        );


    if (dashboardProgress) {

        dashboardProgress.textContent =
            percentage + "%";

    }


    if (dashboardProgressBar) {

        dashboardProgressBar.style.width =
            percentage + "%";

    }

}



/* =====================================================
   INITIALIZE
   ===================================================== */

showPage("dashboard");

renderTasks();

renderStudy();

renderAssignments();

renderProjects();

renderCoding();

updateDashboard();
```
