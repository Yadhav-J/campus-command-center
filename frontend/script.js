/* =====================================================
   CAMPUS COMMAND CENTER
   COMPLETE FRONTEND JAVASCRIPT
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

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const navBackdrop = document.getElementById("navBackdrop");

function closeMobileMenu() {
    sidebar.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
}


const pageInfo = {

    dashboard: [
        "Dashboard",
        "Your college life, organized."
    ],

    subjects: [
        "Subjects",
        "Manage your academic subjects."
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
    ],

    notes: [
        "Notes",
        "Keep your study notes organized."
    ],

    settings: [
        "Settings",
        "Manage your profile and local data."
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

    if (window.innerWidth <= 650) {
        closeMobileMenu();
    }

}

menuToggle.addEventListener("click", function() {
    const isOpen = sidebar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navBackdrop.addEventListener("click", closeMobileMenu);

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
        closeMobileMenu();
        menuToggle.focus();
    }
});


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


function loadStored(key, fallback) {

    try {

        const value = localStorage.getItem(key);

        if (value !== null) {
            return JSON.parse(value);
        }

        if (window.location.protocol === "http:" || window.location.protocol === "https:") {
            const request = new XMLHttpRequest();
            request.open("GET", "/api/data/" + encodeURIComponent(key), false);
            request.send();

            if (request.status === 200) {
                const serverValue = JSON.parse(request.responseText).value;
                localStorage.setItem(key, JSON.stringify(serverValue));
                return serverValue;
            }
        }

        return fallback;

    } catch (error) {

        return fallback;

    }

}


function saveStored(key, value) {

    localStorage.setItem(key, JSON.stringify(value));

    if (window.location.protocol === "http:" || window.location.protocol === "https:") {
        fetch("/api/data/" + encodeURIComponent(key), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(value)
        }).catch(function() {
            // Local storage keeps the app usable when the backend is unavailable.
        });
    }

}


function showToast(message) {

    const toast = document.getElementById("toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("visible");

    window.setTimeout(function() {
        toast.classList.remove("visible");
    }, 2400);

}


/* =====================================================
   TODAY'S SCHEDULE
   ===================================================== */

const scheduleTimeInput = document.getElementById("scheduleTimeInput");
const scheduleTitleInput = document.getElementById("scheduleTitleInput");
const addScheduleBtn = document.getElementById("addScheduleBtn");
const scheduleList = document.getElementById("scheduleList");
const scheduleEmpty = document.getElementById("scheduleEmpty");

let schedule = loadStored(
    "campusSchedule",
    [
        { time: "08:15", title: "Web Development" },
        { time: "10:00", title: "Data Structures" },
        { time: "13:15", title: "Project Work" }
    ]
);

if (!Array.isArray(schedule)) {
    schedule = [];
}

function formatScheduleTime(time) {
    const parts = time.split(":");
    const hour = Number(parts[0]);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;

    return displayHour + ":" + parts[1] + " " + suffix;
}

function renderSchedule() {
    scheduleList.innerHTML = "";
    scheduleEmpty.hidden = schedule.length > 0;

    schedule.slice().sort(function(first, second) {
        return first.time.localeCompare(second.time);
    }).forEach(function(item) {
        const row = document.createElement("div");
        const time = document.createElement("span");
        const title = document.createElement("strong");
        const actions = document.createElement("div");
        const editBtn = document.createElement("button");
        const deleteBtn = document.createElement("button");

        time.textContent = formatScheduleTime(item.time);
        title.textContent = item.title;
        actions.className = "schedule-actions";
        editBtn.textContent = "Edit";
        deleteBtn.textContent = "Delete";
        editBtn.type = "button";
        deleteBtn.type = "button";

        editBtn.addEventListener("click", function() {
            startScheduleEdit(row, item);
        });

        deleteBtn.addEventListener("click", function() {
            schedule = schedule.filter(function(entry) {
                return entry !== item;
            });
            saveStored("campusSchedule", schedule);
            renderSchedule();
            showToast("Schedule item removed");
        });

        actions.append(editBtn, deleteBtn);
        row.append(time, title, actions);
        scheduleList.append(row);
    });
}

function startScheduleEdit(row, item) {
    row.innerHTML = "";

    const timeInput = document.createElement("input");
    const titleInput = document.createElement("input");
    const actions = document.createElement("div");
    const saveBtn = document.createElement("button");
    const cancelBtn = document.createElement("button");

    timeInput.type = "time";
    timeInput.value = item.time;
    timeInput.className = "schedule-edit-input";
    titleInput.type = "text";
    titleInput.value = item.title;
    titleInput.className = "schedule-edit-input";
    saveBtn.textContent = "Save";
    cancelBtn.textContent = "Cancel";
    saveBtn.type = "button";
    cancelBtn.type = "button";
    actions.className = "schedule-actions";

    saveBtn.addEventListener("click", function() {
        const title = titleInput.value.trim();

        if (!timeInput.value || !title) {
            showToast("Add a time and activity name");
            return;
        }

        item.time = timeInput.value;
        item.title = title;
        saveStored("campusSchedule", schedule);
        renderSchedule();
        showToast("Schedule updated");
    });

    cancelBtn.addEventListener("click", renderSchedule);
    actions.append(saveBtn, cancelBtn);
    row.append(timeInput, titleInput, actions);
    titleInput.focus();
}

addScheduleBtn.addEventListener("click", function() {
    const title = scheduleTitleInput.value.trim();

    if (!scheduleTimeInput.value || !title) {
        showToast("Add a time and activity name");
        return;
    }

    schedule.push({
        time: scheduleTimeInput.value,
        title: title
    });

    saveStored("campusSchedule", schedule);
    scheduleTimeInput.value = "";
    scheduleTitleInput.value = "";
    renderSchedule();
    showToast("Schedule item added");
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


let tasks = loadStored("campusTasks", []);

if (!Array.isArray(tasks)) {
    tasks = [];
}


function saveTasks() {

    saveStored(
        "campusTasks",
        tasks
    );

}


function renderTasks() {

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

        if (event.key === "Enter") {

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


let studySessions = loadStored("campusStudy", []);

if (!Array.isArray(studySessions)) {
    studySessions = [];
}


function saveStudy() {

    saveStored(
        "campusStudy",
        studySessions
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

        if (event.key === "Enter") {

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

const examNameInput = document.getElementById("examName");
const examSubjectInput = document.getElementById("examSubject");
const examDateInput = document.getElementById("examDateInput");
const addExamBtn = document.getElementById("addExamBtn");
const examList = document.getElementById("examList");
const examNameDisplay = document.getElementById("examNameDisplay");
const examDateDisplay = document.getElementById("examDateDisplay");

let exams = loadStored("campusExams", [
    {
        name: "Digital Image Processing",
        subject: "Digital Image Processing",
        date: "2026-09-08T09:00"
    }
]);

if (!Array.isArray(exams)) {
    exams = [];
}


function saveExams() {
    saveStored("campusExams", exams);
}


function getUpcomingExam() {
    const now = Date.now();

    return exams
        .filter(function(exam) {
            return new Date(exam.date).getTime() > now;
        })
        .sort(function(first, second) {
            return new Date(first.date) - new Date(second.date);
        })[0] || null;
}


function renderExams() {
    examList.innerHTML = "";

    exams.forEach(function(exam, index) {
        const card = document.createElement("article");
        card.className = "project-card";

        const title = document.createElement("h3");
        title.textContent = exam.name;

        const subject = document.createElement("p");
        subject.textContent = exam.subject;

        const date = document.createElement("p");
        date.textContent = new Date(exam.date).toLocaleString();

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            exams.splice(index, 1);
            saveExams();
            renderExams();
            updateCountdown();
        });

        card.appendChild(title);
        card.appendChild(subject);
        card.appendChild(date);
        card.appendChild(deleteButton);
        examList.appendChild(card);
    });
}


function addExam() {
    if (!examNameInput.value.trim() || !examDateInput.value) {
        return;
    }

    exams.push({
        name: examNameInput.value.trim(),
        subject: examSubjectInput.value.trim() || "General",
        date: examDateInput.value
    });

    saveExams();
    renderExams();
    updateCountdown();
    examNameInput.value = "";
    examSubjectInput.value = "";
    examDateInput.value = "";
}


addExamBtn.addEventListener("click", addExam);


function updateCountdown() {

    const upcomingExam = getUpcomingExam();

    if (!upcomingExam) {
        examNameDisplay.textContent = "No upcoming exams";
        examDateDisplay.textContent = "Add an exam to start a countdown.";
        examCountdown.textContent = "No upcoming exam";
        dashboardExamCountdown.textContent = "No upcoming exam";
        return;
    }

    examNameDisplay.textContent = upcomingExam.name;
    examDateDisplay.textContent = new Date(upcomingExam.date).toLocaleString();

    const now = new Date().getTime();


    const difference =
        new Date(upcomingExam.date).getTime() - now;


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


renderExams();
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


let assignments = loadStored("campusAssignments", []);

if (!Array.isArray(assignments)) {
    assignments = [];
}


function saveAssignments() {

    saveStored(
        "campusAssignments",
        assignments
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


            card.appendChild(title);

            card.appendChild(subject);

            card.appendChild(deadline);

            card.appendChild(priority);

            card.appendChild(status);


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


    if (current === "Pending") {

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


let projects = loadStored("campusProjects", []);

if (!Array.isArray(projects)) {
    projects = [];
}


function saveProjects() {

    saveStored(
        "campusProjects",
        projects
    );

}


function updateProject(index) {

    const project = projects[index];
    const progress = window.prompt("Progress (0-100)", project.progress);

    if (progress === null) {
        return;
    }

    project.progress = Math.min(100, Math.max(0, Number(progress) || 0));
    project.status = project.progress === 100 ? "Completed" : project.status;

    saveProjects();
    renderProjects();
    showToast("Project updated");

}


function cycleProjectStatus(index) {

    const statuses = ["Planning", "In Progress", "Completed"];
    const currentIndex = statuses.indexOf(projects[index].status);
    projects[index].status = statuses[(currentIndex + 1) % statuses.length];

    saveProjects();
    renderProjects();
    showToast("Project status updated");

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
            Math.min(
                Math.max(
                    progress || 0,
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


            const progressBar =
                document.createElement(
                    "div"
                );

            progressBar.className =
                "project-progress-bar";


            const progress =
                document.createElement(
                    "div"
                );

            progress.className =
                "project-progress";


            progress.style.width =
                project.progress +
                "%";


            progressBar.appendChild(
                progress
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
                progressBar
            );

            const editBtn = document.createElement("button");
            editBtn.textContent = "Update Progress";
            editBtn.addEventListener("click", function() {
                updateProject(index);
            });

            const statusBtn = document.createElement("button");
            statusBtn.textContent = "Change Status";
            statusBtn.addEventListener("click", function() {
                cycleProjectStatus(index);
            });

            card.appendChild(editBtn);
            card.appendChild(statusBtn);


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
                    showToast("Project deleted");

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

const languagesInput =
    document.getElementById("languagesInput");

const codingLanguages =
    document.getElementById("codingLanguages");

const updateCodingBtn =
    document.getElementById(
        "updateCodingBtn"
    );


let codingData = loadStored("campusCoding", {

        problems: 0,

        hours: 0,

        projects: 0,

        streak: 0,

        languages: []

    });

if (!codingData || typeof codingData !== "object") {
    codingData = {
        problems: 0,
        hours: 0,
        projects: 0,
        streak: 0,
        languages: []
    };
}

if (!Array.isArray(codingData.languages)) {
    codingData.languages = [];
}


function saveCoding() {

    saveStored(
        "campusCoding",
        codingData
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

    codingLanguages.textContent = codingData.languages.length
        ? codingData.languages.join(", ")
        : "No languages added yet.";


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

    codingData.languages = languagesInput.value
        .split(",")
        .map(function(language) {
            return language.trim();
        })
        .filter(Boolean);


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

    languagesInput.value = "";
    showToast("Coding statistics updated");

}


updateCodingBtn.addEventListener(
    "click",
    updateCoding
);



/* =====================================================
   SUBJECTS
   ===================================================== */

const subjectNameInput =
    document.getElementById(
        "subjectNameInput"
    );

const subjectCodeInput =
    document.getElementById(
        "subjectCodeInput"
    );

const addSubjectBtn =
    document.getElementById(
        "addSubjectBtn"
    );

const subjectList =
    document.getElementById(
        "subjectList"
    );


let subjects = loadStored("campusSubjects", []);

if (!Array.isArray(subjects)) {
    subjects = [];
}


function saveSubjects() {

    saveStored(
        "campusSubjects",
        subjects
    );

}


function addSubject() {

    const name =
        subjectNameInput.value.trim();

    const code =
        subjectCodeInput.value.trim();


    if (name === "") {

        alert(
            "Please enter a subject name."
        );

        return;

    }


    subjects.push({

        name: name,

        code: code,

        progress: 0

    });


    saveSubjects();

    renderSubjects();


    subjectNameInput.value = "";

    subjectCodeInput.value = "";

}


function renderSubjects() {

    subjectList.innerHTML = "";


    subjects.forEach(
        function(subject, index) {

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
                "📚 " +
                subject.name;


            const code =
                document.createElement(
                    "p"
                );

            code.textContent =
                "Code: " +
                (
                    subject.code ||
                    "Not specified"
                );


            const progressText =
                document.createElement(
                    "p"
                );

            progressText.textContent =
                "Progress: " +
                subject.progress +
                "%";


            const progressBar =
                document.createElement(
                    "div"
                );

            progressBar.className =
                "project-progress-bar";


            const progress =
                document.createElement(
                    "div"
                );

            progress.className =
                "project-progress";


            progress.style.width =
                subject.progress +
                "%";


            progressBar.appendChild(
                progress
            );


            card.appendChild(title);

            card.appendChild(code);

            card.appendChild(
                progressText
            );

            card.appendChild(
                progressBar
            );


            const progressBtn =
                document.createElement(
                    "button"
                );


            progressBtn.textContent =
                "Add 10%";


            progressBtn.addEventListener(
                "click",
                function() {

                    subject.progress =
                        Math.min(
                            subject.progress + 10,
                            100
                        );


                    saveSubjects();

                    renderSubjects();

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

                    subjects.splice(
                        index,
                        1
                    );


                    saveSubjects();

                    renderSubjects();

                }
            );


            card.appendChild(
                progressBtn
            );

            card.appendChild(
                deleteBtn
            );


            subjectList.appendChild(
                card
            );

        }
    );

}


addSubjectBtn.addEventListener(
    "click",
    addSubject
);


subjectNameInput.addEventListener(
    "keypress",
    function(event) {

        if (event.key === "Enter") {

            addSubject();

        }

    }
);


/* =====================================================
   NOTES
   ===================================================== */

const noteTitle =
    document.getElementById("noteTitle");

const noteSubject =
    document.getElementById("noteSubject");

const noteContent =
    document.getElementById("noteContent");

const addNoteBtn =
    document.getElementById("addNoteBtn");

const noteList =
    document.getElementById("noteList");

let notes = loadStored("campusNotes", []);

if (!Array.isArray(notes)) {
    notes = [];
}


function renderNotes() {

    noteList.innerHTML = "";

    notes.forEach(function(note, index) {

        const card = document.createElement("article");
        card.className = "project-card note-card";

        const title = document.createElement("h3");
        title.textContent = note.title;

        const subject = document.createElement("p");
        subject.textContent = note.subject || "General";

        const content = document.createElement("p");
        content.className = "note-content";
        content.textContent = note.content;

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function() {
            const updatedContent = window.prompt("Edit note", note.content);

            if (updatedContent === null || !updatedContent.trim()) {
                return;
            }

            note.content = updatedContent.trim();
            saveStored("campusNotes", notes);
            renderNotes();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function() {
            notes.splice(index, 1);
            saveStored("campusNotes", notes);
            renderNotes();
        });

        card.appendChild(title);
        card.appendChild(subject);
        card.appendChild(content);
        card.appendChild(editButton);
        card.appendChild(deleteButton);
        noteList.appendChild(card);

    });

}


function addNote() {

    const title = noteTitle.value.trim();
    const subject = noteSubject.value.trim();
    const content = noteContent.value.trim();

    if (!title || !content) {
        return;
    }

    notes.push({ title: title, subject: subject, content: content });
    saveStored("campusNotes", notes);
    renderNotes();

    noteTitle.value = "";
    noteSubject.value = "";
    noteContent.value = "";

}


addNoteBtn.addEventListener("click", addNote);


/* =====================================================
   SETTINGS
   ===================================================== */

const displayNameInput =
    document.getElementById("displayNameInput");

const saveSettingsBtn =
    document.getElementById("saveSettingsBtn");

const clearDataBtn =
    document.getElementById("clearDataBtn");

const themeInput =
    document.getElementById("themeInput");

const profileName =
    document.getElementById("profileName");

const welcomeTitle =
    document.getElementById("welcomeTitle");

let settings = loadStored("campusSettings", {
    displayName: "YADHU",
    theme: "dark"
});

if (!settings || typeof settings !== "object") {
    settings = { displayName: "YADHU", theme: "dark" };
}

displayNameInput.value = settings.displayName || "YADHU";
themeInput.value = settings.theme || "dark";


function applySettings() {

    const name = settings.displayName || "YADHU";
    document.body.classList.toggle("light-theme", settings.theme === "light");
    profileName.textContent = "👤 " + name;
    welcomeTitle.textContent = "Good afternoon, " + name + " 👋";

}


applySettings();


function saveSettings() {

    settings.displayName = displayNameInput.value.trim() || "YADHU";
    settings.theme = themeInput.value;
    saveStored("campusSettings", settings);
    applySettings();
    showToast("Settings saved");

}


saveSettingsBtn.addEventListener("click", saveSettings);

clearDataBtn.addEventListener("click", function() {

    if (!window.confirm("Clear all Campus Command Center data?")) {
        return;
    }

    clearLocalAppData();
    Promise.all(appDataKeys.map(function(key) {
        return fetch("/api/data/" + encodeURIComponent(key), { method: "DELETE" });
    })).finally(function() {
        window.location.reload();
    });

});



/* =====================================================
   DASHBOARD UPDATE
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


    dashboardTasks.textContent =
        incompleteTasks;


    dashboardProjects.textContent =
        projects.length;


    dashboardAssignments.textContent =
        incompleteAssignments;


    dashboardStreak.textContent =
        codingData.streak +
        " Days";


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


    dashboardProgress.textContent =
        percentage + "%";


    dashboardProgressBar.style.width =
        percentage + "%";

}


/* =====================================================
   AUTHENTICATION
   ===================================================== */

const authScreen = document.getElementById("authScreen");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const authNameLabel = document.getElementById("authNameLabel");
const authNameInput = document.getElementById("authNameInput");
const authEmailInput = document.getElementById("authEmailInput");
const authPasswordInput = document.getElementById("authPasswordInput");
const authError = document.getElementById("authError");
const authSubmit = document.getElementById("authSubmit");
const authToggle = document.getElementById("authToggle");
const logoutBtn = document.getElementById("logoutBtn");
let authMode = "login";

const appDataKeys = [
    "campusSchedule", "campusTasks", "campusStudy", "campusExams",
    "campusAssignments", "campusProjects", "campusCoding", "campusSubjects",
    "campusNotes", "campusSettings"
];

function clearLocalAppData() {
    appDataKeys.forEach(function(key) {
        localStorage.removeItem(key);
    });
}

function updateAuthMode() {
    const registering = authMode === "register";

    authTitle.textContent = registering ? "Create your account" : "Welcome back";
    authSubtitle.textContent = registering
        ? "Create a private academic dashboard."
        : "Sign in to access your academic dashboard.";
    authNameLabel.hidden = !registering;
    authNameInput.required = registering;
    authPasswordInput.autocomplete = registering ? "new-password" : "current-password";
    authSubmit.textContent = registering ? "Create account" : "Sign in";
    authToggle.textContent = registering ? "Already have an account? Sign in" : "Create an account";
    authError.textContent = "";
}

authToggle.addEventListener("click", function() {
    authMode = authMode === "login" ? "register" : "login";
    updateAuthMode();
});

logoutBtn.addEventListener("click", function() {
    clearLocalAppData();
    window.location.href = "/api/auth/logout";
});

authForm.addEventListener("submit", async function(event) {
    event.preventDefault();
    authError.textContent = "";
    authSubmit.disabled = true;

    try {
        const response = await fetch(authMode === "register" ? "/api/auth/register" : "/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: authNameInput.value.trim(),
                email: authEmailInput.value.trim(),
                password: authPasswordInput.value
            })
        });
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Authentication failed");
        }

        clearLocalAppData();
        window.location.reload();
    } catch (error) {
        authError.textContent = error.message;
        authSubmit.disabled = false;
    }
});

fetch("/api/auth/me")
    .then(function(response) {
        if (!response.ok) {
            throw new Error("Not signed in");
        }

        return response.json();
    })
    .then(function(result) {
        settings.displayName = result.user.name;
        applySettings();
        document.body.classList.remove("auth-required");
    })
    .catch(function() {
        document.body.classList.add("auth-required");
    });



/* =====================================================
   INITIALIZE EVERYTHING
   ===================================================== */

showPage("dashboard");

renderSchedule();

renderTasks();

renderStudy();

renderAssignments();

renderProjects();

renderCoding();

renderSubjects();

updateDashboard();
