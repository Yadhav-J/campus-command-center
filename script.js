/* =====================================================
   CAMPUS COMMAND CENTER
   COMPLETE JAVASCRIPT
   ===================================================== */


/* =====================================================
   SAFE LOCAL STORAGE
   ===================================================== */

function getStorage(key, fallback) {

    try {

        const data = localStorage.getItem(key);

        if (!data) {
            return fallback;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "LocalStorage error:",
            error
        );

        return fallback;
    }
}


function setStorage(key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (error) {

        console.error(
            "Unable to save data:",
            error
        );

    }

}


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


    if (
        pageInfo[pageName] &&
        pageTitle &&
        pageSubtitle
    ) {

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
    getStorage(
        "campusTasks",
        []
    );


function saveTasks() {

    setStorage(
        "campusTasks",
        tasks
    );

}


function renderTasks() {

    if (!taskList) {
        return;
    }


    taskList.innerHTML = "";


    if (tasks.length === 0) {

        taskList.innerHTML = `
            <li class="empty-state">
                No tasks added yet.
            </li>
        `;

        updateDashboard();

        return;
    }


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

    if (!taskInput) {
        return;
    }


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

    if (
        !tasks[index]
    ) {
        return;
    }


    tasks[index].completed =
        !tasks[index].completed;


    saveTasks();

    renderTasks();

}


function deleteTask(index) {

    if (
        index < 0 ||
        index >= tasks.length
    ) {
        return;
    }


    tasks.splice(
        index,
        1
    );


    saveTasks();

    renderTasks();

}


if (addTaskBtn) {

    addTaskBtn.addEventListener(
        "click",
        addTask
    );

}


if (taskInput) {

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

}


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
    getStorage(
        "campusStudy",
        []
    );


function saveStudy() {

    setStorage(
        "campusStudy",
        studySessions
    );

}


function renderStudy() {

    if (!studyList) {
        return;
    }


    studyList.innerHTML = "";


    if (studySessions.length === 0) {

        studyList.innerHTML = `
            <li class="empty-state">
                No study sessions added yet.
            </li>
        `;

        updateStudyProgress();

        return;
    }


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

    if (
        !subjectInput ||
        !priorityInput
    ) {
        return;
    }


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


    if (studyProgress) {

        studyProgress.style.width =
            percentage + "%";

    }


    if (studyPercentage) {

        studyPercentage.textContent =
            percentage + "%";

    }


    updateDashboard();

}


if (addStudyBtn) {

    addStudyBtn.addEventListener(
        "click",
        addStudy
    );

}


if (subjectInput) {

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

}


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


        if (dashboardExamCountdown) {

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


    if (dashboardExamCountdown) {

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
    getStorage(
        "campusAssignments",
        []
    );


function saveAssignments() {

    setStorage(
        "campusAssignments",
        assignments
    );

}


function addAssignment() {

    if (
        !assignmentName ||
        !assignmentSubject ||
        !assignmentDeadline ||
        !assignmentPriority
    ) {
        return;
    }


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

    if (!assignmentList) {
        return;
    }


    assignmentList.innerHTML = "";


    if (assignments.length === 0) {

        assignmentList.innerHTML = `
            <div class="empty-state">
                No assignments added yet.
            </div>
        `;

        updateAssignmentStats();

        return;
    }


    assignments.forEach(
        function(assignment, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "assignment-card";


            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                assignment.name;


            const subject =
                document.createElement(
                    "p"
                );

            subject.textContent =
                "Subject: " +
                assignment.subject;


            const deadline =
                document.createElement(
                    "p"
                );

            deadline.textContent =
                "Deadline: " +
                assignment.deadline;


            const priority =
                document.createElement(
                    "p"
                );

            priority.textContent =
                "Priority: " +
                assignment.priority;


            const status =
                document.createElement(
                    "p"
                );

            status.textContent =
                "Status: " +
                assignment.status;


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


            card.appendChild(title);

            card.appendChild(subject);

            card.appendChild(deadline);

            card.appendChild(priority);

            card.appendChild(status);

            card.appendChild(statusBtn);

            card.appendChild(deleteBtn);


            assignmentList.appendChild(
                card
            );

        }
    );


    updateAssignmentStats();

}


function changeAssignmentStatus(index) {

    if (
        !assignments[index]
    ) {
        return;
    }


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

    if (
        index < 0 ||
        index >= assignments.length
    ) {
        return;
    }


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


    const totalElement =
        document.getElementById(
            "totalAssignments"
        );

    const pendingElement =
        document.getElementById(
            "pendingAssignments"
        );

    const progressElement =
        document.getElementById(
            "progressAssignments"
        );

    const completedElement =
        document.getElementById(
            "completedAssignments"
        );


    if (totalElement) {
        totalElement.textContent =
            total;
    }


    if (pendingElement) {
        pendingElement.textContent =
            pending;
    }


    if (progressElement) {
        progressElement.textContent =
            inProgress;
    }


    if (completedElement) {
        completedElement.textContent =
            completed;
    }


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


    const percentageElement =
        document.getElementById(
            "assignmentPercentage"
        );


    if (percentageElement) {

        percentageElement.textContent =
            percentage + "%";

    }


    const progressBar =
        document.getElementById(
            "assignmentProgressBar"
        );


    if (progressBar) {

        progressBar.style.width =
            percentage + "%";

    }


    const chartTotal =
        Math.max(
            total,
            1
        );


    const pendingBar =
        document.getElementById(
            "pendingBar"
        );


    const progressBarChart =
        document.getElementById(
            "progressBar"
        );


    const completedBar =
        document.getElementById(
            "completedBar"
        );


    if (pendingBar) {

        pendingBar.style.height =
            (
                pending /
                chartTotal
            ) * 100 + "%";

    }


    if (progressBarChart) {

        progressBarChart.style.height =
            (
                inProgress /
                chartTotal
            ) * 100 + "%";

    }


    if (completedBar) {

        completedBar.style.height =
            (
                completed /
                chartTotal
            ) * 100 + "%";

    }


    updateDashboard();

}


if (addAssignmentBtn) {

    addAssignmentBtn.addEventListener(
        "click",
        addAssignment
    );

}


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
    getStorage(
        "campusProjects",
        []
    );


function saveProjects() {

    setStorage(
        "campusProjects",
        projects
    );

}


function addProject() {

    if (
        !projectName ||
        !projectTechnology ||
        !projectDeadline ||
        !projectStatus
    ) {
        return;
    }


    const name =
        projectName.value.trim();


    const technology =
        projectTechnology.value.trim();


    const github =
        projectGithub
        ? projectGithub.value.trim()
        : "";


    const progress =
        projectProgress
        ? Number(
            projectProgress.value
        )
        : 0;


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


    const safeProgress =
        isNaN(progress)
        ? 0
        : Math.min(
            Math.max(
                progress,
                0
            ),
            100
        );


    projects.push({

        name: name,

        technology: technology,

        github: github,

        progress:
            safeProgress,

        deadline: deadline,

        status: status

    });


    saveProjects();

    renderProjects();


    projectName.value = "";

    projectTechnology.value = "";

    if (projectGithub) {
        projectGithub.value = "";
    }

    if (projectProgress) {
        projectProgress.value = "";
    }

    projectDeadline.value = "";

}


function renderProjects() {

    if (!projectList) {
        return;
    }


    projectList.innerHTML = "";


    if (projects.length === 0) {

        projectList.innerHTML = `
            <div class="empty-state">
                No projects added yet.
            </div>
        `;

        updateDashboard();

        return;
    }


    projects.forEach(
        function(project, index) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "project-card";


            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                project.name;


            const technology =
                document.createElement(
                    "p"
                );

            technology.textContent =
                "Technology: " +
                project.technology;


            const deadline =
                document.createElement(
                    "p"
                );

            deadline.textContent =
                "Deadline: " +
                project.deadline;


            const status =
                document.createElement(
                    "p"
                );

            status.textContent =
                "Status: " +
                project.status;


            const progressText =
                document.createElement(
                    "p"
                );

            progressText.textContent =
                "Progress: " +
                project.progress +
                "%";


            const progressContainer =
                document.createElement(
                    "div"
                );

            progressContainer.className =
                "project-progress-bar";


            const progressBar =
                document.createElement(
                    "div"
                );

            progressBar.className =
                "project-progress";


            progressBar.style.width =
                project.progress + "%";


            progressContainer.appendChild(
                progressBar
            );


            card.appendChild(title);

            card.appendChild(
                technology
            );

            card.appendChild(
                deadline
            );

            card.appendChild(
                status
            );

            card.appendChild(
                progressText
            );

            card.appendChild(
                progressContainer
            );


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

                        let url =
                            project.github.trim();


                        if (
                            !/^https?:\/\//i.test(
                                url
                            )
                        ) {

                            url =
                                "https://" +
                                url;

                        }


                        window.open(
                            url,
                            "_blank",
                            "noopener,noreferrer"
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


if (addProjectBtn) {

    addProjectBtn.addEventListener(
        "click",
        addProject
    );

}


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
    getStorage(
        "campusCoding",
        {
            problems: 0,
            hours: 0,
            projects: 0,
            streak: 0,
            lastUpdate: null
        }
    );


if (
    codingData.lastUpdate === undefined
) {

    codingData.lastUpdate =
        null;

}


function saveCoding() {

    setStorage(
        "campusCoding",
        codingData
    );

}


function getTodayString() {

    const today =
        new Date();

    return today.toISOString()
        .split("T")[0];

}


function renderCoding() {

    if (codingProblems) {

        codingProblems.textContent =
            codingData.problems;

    }


    if (codingHours) {

        codingHours.textContent =
            codingData.hours;

    }


    if (codingProjects) {

        codingProjects.textContent =
            codingData.projects;

    }


    if (codingStreak) {

        codingStreak.textContent =
            codingData.streak +
            " Days";

    }


    updateDashboard();

}


function updateCoding() {

    if (
        !problemsInput ||
        !hoursInput ||
        !codingProjectsInput
    ) {
        return;
    }


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


    const today =
        getTodayString();


    if (
        codingData.problems > 0
    ) {

        if (
            codingData.lastUpdate !==
            today
        ) {

            codingData.streak++;

            codingData.lastUpdate =
                today;

        }

    }


    saveCoding();

    renderCoding();


    problemsInput.value = "";

    hoursInput.value = "";

    codingProjectsInput.value = "";

}


if (updateCodingBtn) {

    updateCodingBtn.addEventListener(
        "click",
        updateCoding
    );

}


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


    /* =================================================
       OVERALL PROGRESS
       ================================================= */

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

showPage(
    "dashboard"
);

renderTasks();

renderStudy();

renderAssignments();

renderProjects();

renderCoding();

updateAssignmentStats();

updateStudyProgress();

updateDashboard();

updateCountdown();