function addTask(description, dueTime) {
  const taskList = document.querySelector("#task_list");
  let due = dueTime
    ? `<span class="due">due ${new Date(dueTime).toString()}</span>`
    : "";

  let newTask = document.createElement("li");
  newTask.innerHTML = `<li>${description}${due}<button class="btn btn-sm btn-outline-danger done" type="button">Done</button></li>`;
  taskList.appendChild(newTask);

  let doneButton = newTask.querySelector(".done");
  doneButton.addEventListener("click", (event) => {
    event.target.parentElement.remove();
  });
}

function dateAndTimeToTimestamp(dateInputElement, timeInputElement) {
  const dueDate = dateInputElement.valueAsNumber; // Returns the timestamp at midnight for the given date
  const dueTime = timeInputElement.valueAsNumber; // Returns the number of milliseconds from midnight to the time

  if (dueDate && dueTime) {
    // The user specified both a due date & due time
    //Add the timezone offset to account for the fact that timestamps are specified by UTC
    const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
    return dueDate + dueTime + timezoneOffset;
  } else {
    // if the user did not specify both a due date and due time, return false
    return false;
  }
}

function triggerAddTask() {
  let descriptionEle = document.querySelector("#task_description_input");
  let dueDateEle = document.querySelector("#duedate_input");
  let dueTimeEle = document.querySelector("#duetime_input");
  let dueTime = dateAndTimeToTimestamp(dueDateEle, dueTimeEle);
  addTask(descriptionEle.value, dueTime);
  descriptionEle.value = "";
}

const addTaskButton = document.querySelector("#add_task");
addTaskButton.addEventListener("click", triggerAddTask);

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    triggerAddTask();
  }
});
