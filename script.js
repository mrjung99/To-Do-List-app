window.onload = () => {
  fetchTaskOnTable();
};

//show quotes
const quotes = [
  "Small steps every day lead to big results.",
  "Start where you are. Use what you have. Do what you can.",
  "Don't watch the clock, do what it does. Keep going.",
  "Done is better than perfect.",
  "Dream big. Plan smart. Execute daily.",
  "Turn chaos into checkmarks.",
];

const quoteBox = document.querySelector(".quote-box");
let index = 0;
function showQuotes() {
  quoteBox.style.opacity = 0;

  setTimeout(() => {
    quoteBox.innerHTML = `<em>${quotes[index]}</em>`;
    quoteBox.style.opacity = 1;
    index = (index + 1) % quotes.length;
  }, 1000);
}

showQuotes();
setInterval(showQuotes, 5000);

//==========================================================================
const addTaskBtn = document.querySelector(".search-box button");
const popUp = document.querySelector(".pop-up");
const contentContainer = document.querySelector(".content");
const taskInput = document.getElementById("add-task");
const dateInput = document.getElementById("add-date");
const fields = document.querySelector(".fields");
const taskError = document.querySelector(".error-message1");
const dateError = document.querySelector(".error-message2");
const successContainer = document.querySelector(".successful-container");
const successMessage = document.querySelector(".success-heading");
const searchBox = document.querySelector(".search-box input");

let currentEditingKey = null; // Holds the key of the task being edited.
// If null, it means a new task is being added.
// Used to decide whether to update or create in localStorage.

//show add task box on click addTask button
addTaskBtn.addEventListener("click", () => {
  popUpDilogue("Add Task");
});

//pop-up box (add-edit)
const popUpDilogue = (task) => {
  popUp.style.display = "flex";
  const heading = document.querySelector(".top h3");
  heading.textContent = task;
};

//Hide pop-up (add-edit)
const closeBtn = document.querySelector(".top i");
const closePopUp = () => {
  popUp.style.display = "none";
  taskInput.value = "";
  dateInput.value = "";
  taskInput.style.border = "";
  dateInput.style.border = "";
  taskError.textContent = "";
  dateError.textContent = "";
};
closeBtn.addEventListener("click", closePopUp);

//save data to the local storage
const saveAndValidate = () => {
  const task = taskInput.value.trim();
  const date = dateInput.value.trim();

  taskInput.style.border = "";
  dateInput.style.border = "";

  if (task === "" || date === "") {
    if (task === "") {
      showValidationMsg("Please enter task.", taskError, taskInput);
    }
    if (date === "") {
      showValidationMsg("Please enter date.", dateError, dateInput);
    }
    return;
  }

  const key = Date.now();
  const data = {
    task: task,
    date: date,
    status: "scheduled",
  };

  if (currentEditingKey) {
    //for editing the task and saving it to localstorage
    localStorage.setItem(currentEditingKey, JSON.stringify(data));
    showSuccessfulMsg("Task saved successfully");
    currentEditingKey = null;
  } else {
    //to add the task to the localstorage
    localStorage.setItem(key, JSON.stringify(data));
    showSuccessfulMsg("Task added successfully");
  }

  closePopUp();
  document.querySelector(".tbody").innerHTML = "";
  fetchTaskOnTable();
};

const showValidationMsg = (errorMsg, errorBox, inputBox) => {
  errorBox.textContent = errorMsg;
  errorBox.style.color = "rgb(162, 6, 6)";
  errorBox.style.width = "95%";
  errorBox.style.textAlign = "left";
  errorBox.style.fontSize = "0.7rem";
  inputBox.style.border = "1px solid rgb(162, 6, 6)";
};

taskInput.addEventListener("input", (event) => {
  event.target.style.border = "";
  taskError.style.display = "none";
});

dateInput.addEventListener("input", (event) => {
  event.target.style.border = "";
  dateError.style.display = "none";
});

const showSuccessfulMsg = (msg) => {
  successMessage.innerText = msg;
  successContainer.style.display = "flex";
};

const hideSuccessBox = () => {
  successContainer.style.display = "none";
};

//===============================================================================
//this will fetch data to the table from localstorage
const fetchTaskOnTable = () => {
  const tbody = document.querySelector(".tbody");
  const keys = Object.keys(localStorage);
  let serialNo = 1;

  for (let key of keys) {
    const data = JSON.parse(localStorage.getItem(key));
    const tbodyRow = `
              <tr>
                <td>${serialNo++}</td>
                <td>${data.task[0].toUpperCase()}${data.task.slice(1)}</td>
                <td>${data.date}</td>
                <td>
                  <select onChange="setStatus(event,'${key}')">
                    <option value="scheduled" ${
                      data.status === "scheduled" ? "selected" : ""
                    }>Scheduled</option>
                    <option value="inprogress" ${
                      data.status === "inprogress" ? "selected" : ""
                    }>Inprogress</option>
                    <option value="cancled" ${
                      data.status === "cancled" ? "selected" : ""
                    }>Cancled</option>
                    <option value="completed" ${
                      data.status === "completed" ? "selected" : ""
                    }>Completed</option>
                  </select>
                </td>

                <td>
                  <button onclick='editTask(${JSON.stringify({
                    ...data,
                    key,
                  })})' class="edit-btn">
                    <i class="ri-pencil-fill"></i>
                  </button>
                  <button onclick="deleteTask('${key}')" class="delete-btn">
                    <i class="ri-delete-bin-7-line delete"></i>
                  </button>
                </td>
              </tr>
            `;

    tbody.innerHTML += tbodyRow;
  }
};


//detelet task
const deleteTask = (key) => {
  localStorage.removeItem(key);
  document.querySelector(".tbody").innerHTML = "";
  fetchTaskOnTable();
};

//delete task
const editTask = (taskData) => {
  taskInput.value = taskData.task;
  dateInput.value = taskData.date;
  popUpDilogue("Edit Task");
  currentEditingKey = taskData.key;
};

const setStatus = (event, key) => {
  const status = event.target.value;
  const data = JSON.parse(localStorage.getItem(key));
  data.status = status;
  localStorage.setItem(key, JSON.stringify(data));
};

//================================================================
//search and filter data
searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase().trim();
  filterTask(query);
});

const filterTask = (query) => {
  const tbody = document.querySelector(".tbody");
  tbody.innerHTML = "";

  let serialNo = 1;

  const keys = Object.keys(localStorage);
  for (let key of keys) {
    const data = JSON.parse(localStorage.getItem(key));

    if (
      data.task.toLowerCase().includes(query) ||
      data.date.includes(query) ||
      data.status.includes(query)
    ) {
      const tbodyRow = `
              <tr>
                <td>${serialNo++}</td>
                <td>${data.task[0].toUpperCase()}${data.task.slice(1)}</td>
                <td>${data.date}</td>
                <td>
                  <select onChange="setStatus(event,'${key}')">
                    <option value="scheduled" ${
                      data.status === "scheduled" ? "selected" : ""
                    }>Scheduled</option>
                    <option value="inprogress" ${
                      data.status === "inprogress" ? "selected" : ""
                    }>Inprogress</option>
                    <option value="cancled" ${
                      data.status === "cancled" ? "selected" : ""
                    }>Cancled</option>
                    <option value="completed" ${
                      data.status === "completed" ? "selected" : ""
                    }>Completed</option>
                  </select>
                </td>

                <td>
                  <button onclick='editTask(${JSON.stringify({
                    ...data,
                    key,
                  })})' class="edit-btn">
                    <i class="ri-pencil-fill"></i>
                  </button>
                  <button onclick="deleteTask('${key}')" class="delete-btn">
                    <i class="ri-delete-bin-7-line delete"></i>
                  </button>
                </td>
              </tr>
            `;

      tbody.innerHTML += tbodyRow;
    }
  }
};
