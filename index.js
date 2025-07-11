let form = document.getElementById("form");
let textInput = document.getElementById("textInput");
let dateInput = document.getElementById("dateInput");
let textarea = document.getElementById("textarea");
let msg = document.getElementById("msg");
let tasks = document.getElementById("tasks");
let emailInput = document.getElementById("emailInput");

let tasksData = JSON.parse(localStorage.getItem("tasksData")) || [];

// Form validation
let formValidation = () => {
    if (textInput.value === "") {
        msg.innerHTML = "Task cannot be blank";
        return false;
    } else {
        msg.innerHTML = "";
        return true;
    }
};

// Add new task
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
        description: textarea.value,
        email: emailInput.value
    };
    tasksData.push(newTask);
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
    renderTasks();
};

// Render tasks, sort by due date, show reminders
function renderTasks() {
    tasks.innerHTML = "";
    tasksData.sort((a, b) => new Date(a.date) - new Date(b.date));
    const today = new Date().toISOString().split('T')[0];
    tasksData.forEach((data, index) => {
        let isDueSoon = data.date === today;
        let taskDiv = document.createElement("div");
        taskDiv.innerHTML = `
            <span class="fw-bold">${data.text}</span>
            <span class="small text-secondary">${data.date}</span>
            <p>${data.description}</p>
            <p class="small text-info">${data.email ? "Reminder Email: " + data.email : ""}</p>
            <span class="options">
                <i class="fas fa-edit" data-index="${index}"></i>
                <i class="fas fa-trash-alt" data-index="${index}"></i>
            </span>
            ${isDueSoon ? '<span class="badge bg-warning text-dark mt-2">Due Today!</span>' : ''}
        `;
        tasks.appendChild(taskDiv);

        // Music reminder and notification
        if (isDueSoon) {
            showReminderPopup(data.text, data.description);
            if (window.Notification && Notification.permission === "granted") {
                new Notification("Music Reminder", {
                    body: `Task "${data.text}" is due today!`,
                });
            } else if (window.Notification && Notification.permission !== "denied") {
                Notification.requestPermission().then(permission => {
                    if (permission === "granted") {
                        new Notification("Music Reminder", {
                            body: `Task "${data.text}" is due today!`,
                        });
                    }
                });
            }
        }

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
            emailInput.value = data.email;
            tasksData.splice(index, 1);
            localStorage.setItem("tasksData", JSON.stringify(tasksData));
            renderTasks();
            let modal = new bootstrap.Modal(form);
            modal.show();
        });
    });
}

// Reset all tasks
document.getElementById("resetTasks").addEventListener("click", function() {
    tasksData = [];
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
    renderTasks();
});

// Dark/Light mode toggle
document.getElementById("toggleMode").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
});

// Show today's date in modal
document.getElementById("addNew").addEventListener("click", function() {
    document.getElementById("todayDate").textContent = new Date().toLocaleDateString();
});

// Restore theme and render tasks on page load
window.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
    renderTasks();
});

// Full screen music reminder popup
function showReminderPopup(title, desc) {
    let popup = document.getElementById("reminderPopup");
    document.getElementById("reminderTitle").textContent = `Music Reminder: ${title}`;
    document.getElementById("reminderDesc").textContent = desc;
    popup.style.display = "flex";
    let audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
    audio.play();
}

document.getElementById("closeReminder").addEventListener("click", function() {
    document.getElementById("reminderPopup").style.display = "none";
});