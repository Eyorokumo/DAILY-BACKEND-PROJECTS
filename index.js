let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");

let tasksData = JSON.parse(localStorage.getItem("tasksData")) || [];

let formValidation = () => {
    if (textInput.value === "") {
        msg.innerHTML = "Task cannot be blank";
        return false;
    } else {
        msg.innerHTML = "";
        return true;
    }
};

form.addEventListener("submit", function(event) {
    event.preventDefault();
    if (formValidation()) {
        acceptData();
        form.reset();
        let modal = bootstrap.Modal.getInstance(form);
        if (modal) modal.hide();
    }
});

let acceptData = () => {
    let newTask = {
        text: textInput.value,
        date: dateInput.value,
        description: textarea.value
    };
    tasksData.push(newTask);
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
    renderTasks();
};

function renderTasks() {
    tasks.innerHTML = "";
    tasksData.forEach((data, index) => {
        let taskDiv = document.createElement("div");
        taskDiv.innerHTML = `
            <span class="fw-bold">${data.text}</span>
            <span class="small text-secondary">${data.date}</span>
            <p>${data.description}</p>
            <span class="options">
                <i class="fas fa-edit" data-index="${index}"></i>
                <i class="fas fa-trash-alt" data-index="${index}"></i>
            </span>
        `;
        tasks.appendChild(taskDiv);

        // Delete functionality
        taskDiv.querySelector(".fa-trash-alt").addEventListener("click", function() {
            tasksData.splice(index, 1);
            localStorage.setItem("tasksData", JSON.stringify(tasksData));
            renderTasks();
        });

        // Edit functionality
        taskDiv.querySelector(".fa-edit").addEventListener("click", function() {
            textInput.value = data.text;
            dateInput.value = data.date;
            textarea.value = data.description;
            tasksData.splice(index, 1);
            localStorage.setItem("tasksData", JSON.stringify(tasksData));
            renderTasks();
            let modal = new bootstrap.Modal(form);
            modal.show();
        });
    });

document.getElementById("resetTasks").addEventListener("click", function() {
    tasksData = [];
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
    renderTasks();
});


document.getElementById("toggleMode").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

}

// Load tasks on page load
window.addEventListener("DOMContentLoaded", renderTasks);