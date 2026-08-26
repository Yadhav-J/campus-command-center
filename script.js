const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

displayTasks();

addTaskBtn.addEventListener("click", addTask);

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const task = {
        text: taskText,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    taskInput.value = "";
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


function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));
}
const examDate = new Date("September 8, 2026 09:00:00").getTime();

const countdown = setInterval(function() {

    const now = new Date().getTime();

    const difference = examDate - now;

    if (difference <= 0) {

        document.getElementById("examCountdown").innerHTML =
            "Exam Started";

        clearInterval(countdown);

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

    document.getElementById("examCountdown").innerHTML =
        `${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`;

}, 1000);