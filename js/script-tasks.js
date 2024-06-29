"use strict";
// События когда чекбокс отмечен
function pushDownTask(itemTask) {
    const tasksContainer = document.querySelector(".task__items");
    itemTask.classList.add("moving-down");
    tasksContainer.appendChild(itemTask);
    setTimeout(() => {
        itemTask.classList.remove("moving-down");
    }, 1);
}
function pushTopTask(itemTask) {
    const tasksContainer = document.querySelector(".task__items");
    itemTask.classList.add("moving-top");
    tasksContainer.insertBefore(itemTask, tasksContainer.firstChild);
    setTimeout(() => {
        itemTask.classList.remove("moving-top");
    }, 1);
}
//Возможность отмечать task
function abilityToTick(able) {
    const allCheckboxes = document.querySelectorAll(".checkbox");
    allCheckboxes.forEach((checkbox) => {
        if (able) {
            checkbox.disabled = false;
        }
        else {
            checkbox.disabled = true;
        }
    });
}
;
//Валидация ввода даты
function validateDate(dateInput) {
    dateInput.addEventListener("input", function () {
        // Удалить все символы, кроме цифр
        var value = this.value.replace(/\D/g, "");
        // Добавить точки между днем, месяцем и годом
        value = value.replace(/(\d{2})(\d)/, "$1.$2");
        value = value.replace(/(\d{2})\.(\d{2})(\d)/, "$1.$2.$3");
        // Установить максимальное значение для дня, месяца и года
        var today = new Date();
        var maxDay = (today.getMonth() === 1) ? 29 : 31; // Максимальное количество дней в месяце
        var maxMonth = 12;
        var maxYear = 9999;
        // Проверить, что день, месяц и год в пределах допустимых значений
        var day = parseInt(value.split(".")[0], 10) || 0;
        var month = parseInt(value.split(".")[1], 10) || 0;
        var year = parseInt(value.split(".")[2], 10) || 0;
        if (day > maxDay || month > maxMonth || year > maxYear) {
            value = value.replace(/\d+$/, ""); // Удалить последние цифры, если они превышают максимальное значение
        }
        // Установить новое значение для элемента ввода даты
        this.value = value;
    });
}
//Изменение цвета кнопки
function changeColorFor(buttonToChange) {
    const svgWrite = buttonToChange.querySelector("svg");
    const gElement = svgWrite.querySelector("g");
    const currentFill = gElement.getAttribute("fill");
    if (currentFill === "#fff") {
        gElement.setAttribute("fill", "#000");
    }
    else {
        gElement.setAttribute("fill", "#fff");
    }
}
//Проверка дедлайна
function checkDeadline(date) {
    const dateString = date.textContent;
    var dateParts = dateString.split(".");
    var dateObject = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    var currentDate = new Date();
    const parentTask = date.closest(".task__item");
    if (dateObject.getTime() < currentDate.getTime()) {
        // Дата в прошлом
        parentTask.classList.add("task__item-deadlined");
    }
    else if (parentTask.classList.contains("task__item-deadlined")) {
        parentTask.classList.remove("task__item-deadlined");
    }
}
document.querySelectorAll(".task__date-info").forEach((date) => {
    checkDeadline(date);
    setInterval(() => checkDeadline(date), 60000);
});
function setTaskActive(checkbox) {
    const parentTask = checkbox.closest(".task__item");
    if (checkbox.checked) {
        parentTask.classList.add("active-checkbox-parent");
        pushDownTask(parentTask);
    }
    else {
        parentTask.classList.remove("active-checkbox-parent");
        pushTopTask(parentTask);
    }
}
const allCheckboxes = document.querySelectorAll(".checkbox");
allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", event => {
        setTaskActive(checkbox);
    });
});
function closeOtherTasks() {
    if (!!document.querySelector(".inputDate-task") && !!document.querySelector(".textArea-task")) {
        TaskToReadable(document.querySelector(".inputDate-task").closest(".task__item").querySelector(".task__change"));
    }
}
//! РЕДАКТИРОВАНИЕ TASK
function TaskToWritable(changeButton) {
    //для того чтобы одновременно можно было редачить только 1 таск
    closeOtherTasks();
    const parentTask = changeButton.closest(".task__item");
    const textEl = parentTask.querySelector(".task__text");
    const dateEl = parentTask.querySelector(".task__date-info");
    if (!!textEl && !!dateEl) {
        changeColorFor(changeButton);
        abilityToTick(false);
        const textStr = textEl.textContent;
        const dateStr = dateEl.textContent;
        textEl.remove();
        dateEl.remove();
        const textArea = document.createElement("textarea");
        const inputDate = document.createElement("input");
        textArea.classList.add("textArea-task");
        inputDate.classList.add("inputDate-task");
        textArea.value = textStr;
        inputDate.value = dateStr;
        parentTask.querySelector(".task__info").prepend(textArea);
        parentTask.querySelector(".task__date").append(inputDate);
        textArea.style.height = 'auto'; /* Reset the height to its default value */
        textArea.style.height = textArea.scrollHeight + 5 + 'px'; /* Set the height based on the content */
        document.querySelector('.textArea-task').addEventListener('input', function () {
            this.style.height = 'auto'; /* Reset the height to its default value */
            this.style.height = this.scrollHeight + 5 + 'px'; /* Set the height based on the content */
        });
        validateDate(inputDate);
        textArea.focus();
        changeButton.addEventListener("click", event => {
            TaskToReadable(changeButton);
        });
        document.addEventListener("keydown", event => {
            if (event.key === "Enter" && document.activeElement !== textArea) {
                TaskToReadable(changeButton);
            }
        });
    }
}
function TaskToReadable(changeButton) {
    const parentTask = changeButton.closest(".task__item");
    const textArea = parentTask.querySelector(".textArea-task");
    const inputDate = parentTask.querySelector(".inputDate-task");
    if (!!textArea && !!inputDate) {
        //Если так вышло что полность пуст то убрать
        if (!textArea.value && !inputDate.value) {
            parentTask.remove();
            return;
        }
        changeColorFor(changeButton);
        abilityToTick(true);
        const textStr = textArea.value;
        const dateStr = inputDate.value;
        textArea.remove();
        inputDate.remove();
        const textEl = document.createElement("div");
        const dateEl = document.createElement("div");
        textEl.classList.add("task__text");
        dateEl.classList.add("task__date-info");
        textEl.textContent = textStr;
        dateEl.textContent = dateStr;
        parentTask.querySelector(".task__info").prepend(textEl);
        parentTask.querySelector(".task__date").append(dateEl);
        checkDeadline(dateEl);
        changeButton.addEventListener("click", event => {
            TaskToWritable(changeButton);
        });
    }
}
const changeButtons = document.querySelectorAll(".task__change");
changeButtons.forEach((changeButton) => {
    changeButton.addEventListener("click", event => {
        TaskToWritable(changeButton);
    });
});
//! ADD TASK
const addTask = document.querySelector(".task__add-note");
addTask.addEventListener("click", event => {
    event.preventDefault();
    const taskTemlate = ` <div class="task__item">
                                <label class="task__checkbox">
                                    <input class="checkbox" type="checkbox">
                                    <span class="custom-checkbox"></span>
                                </label>
                                <div class="task__info">
                                    <div class="task__text"></div>
                                    <div class="task__bottom">
                                        <div class="task__date">
                                            <div class="task__static-info">Deadline by: </div>
                                            <div class="task__date-info"></div>
                                        </div>
                                        <div class="task__bottom-buttons">
                                            <button class="task__change">
                                                <svg enable-background="new 0 0 64 64" height="40px" id="Layer_1"
                                                    version="1.1" viewBox="0 0 64 64" width="40px" xml:space="preserve"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    xmlns:xlink="http://www.w3.org/1999/xlink">
                                                    <g fill="#000">
                                                        <path
                                                            d="M55.736,13.636l-4.368-4.362c-0.451-0.451-1.044-0.677-1.636-0.677c-0.592,0-1.184,0.225-1.635,0.676l-3.494,3.484   l7.639,7.626l3.494-3.483C56.639,15.998,56.639,14.535,55.736,13.636z" />
                                                        <polygon
                                                            points="21.922,35.396 29.562,43.023 50.607,22.017 42.967,14.39    " />
                                                        <polygon points="20.273,37.028 18.642,46.28 27.913,44.654  " />
                                                        <path
                                                            d="M41.393,50.403H12.587V21.597h20.329l5.01-5H10.82c-1.779,0-3.234,1.455-3.234,3.234v32.339   c0,1.779,1.455,3.234,3.234,3.234h32.339c1.779,0,3.234-1.455,3.234-3.234V29.049l-5,4.991V50.403z" />
                                                    </g>
                                                </svg>
                                            </button>
                                            <button class="task__delete">
                                                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                                    <defs>
                                                        <style>
                                                            .cls-1 {
                                                                fill: none;
                                                            }
                                                        </style>
                                                    </defs>
                                                    <title />
                                                    <g data-name="Layer 2" id="Layer_2">
                                                        <path
                                                            d="M20,29H12a5,5,0,0,1-5-5V12a1,1,0,0,1,2,0V24a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V12a1,1,0,0,1,2,0V24A5,5,0,0,1,20,29Z"
                                                            fill="#000" />
                                                        <path d="M26,9H6A1,1,0,0,1,6,7H26a1,1,0,0,1,0,2Z" fill="#000" />
                                                        <path
                                                            d="M20,9H12a1,1,0,0,1-1-1V6a3,3,0,0,1,3-3h4a3,3,0,0,1,3,3V8A1,1,0,0,1,20,9ZM13,7h6V6a1,1,0,0,0-1-1H14a1,1,0,0,0-1,1Z"
                                                            fill="#000" />
                                                        <path
                                                            d="M14,23a1,1,0,0,1-1-1V15a1,1,0,0,1,2,0v7A1,1,0,0,1,14,23Z"
                                                            fill="#000" />
                                                        <path
                                                            d="M18,23a1,1,0,0,1-1-1V15a1,1,0,0,1,2,0v7A1,1,0,0,1,18,23Z"
                                                            fill="#000" />
                                                    </g>
                                                    <g id="frame">
                                                        <rect class="cls-1" height="38" width="38" />
                                                    </g>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
    document.querySelector(".task__items").insertAdjacentHTML("afterbegin", taskTemlate);
    TaskToWritable(document.querySelector(".task__change"));
    const checkbox = document.querySelector(".checkbox");
    checkbox.addEventListener("change", event => {
        setTaskActive(checkbox);
    });
    waitDeleteTask(document.querySelector(".task__delete"));
});
//! DELETE TASK
function waitDeleteTask(buttonDelete) {
    buttonDelete.addEventListener("click", (event) => {
        event.preventDefault();
        const svgWrite = buttonDelete.querySelector("svg");
        const gElement = svgWrite.querySelector("g");
        const pathElement = gElement.querySelectorAll("path");
        pathElement.forEach(path => {
            path.setAttribute("fill", "#fff");
        });
        setTimeout(() => {
            const deleteQuestion = confirm("Are you sure you want to delete task?");
            if (deleteQuestion) {
                const parentNote = buttonDelete.closest(".task__item");
                parentNote.remove();
            }
            else {
                pathElement.forEach(path => {
                    path.setAttribute("fill", "#000");
                });
            }
        }, 10);
    });
}
const deleteTaskBtns = document.querySelectorAll(".task__delete");
deleteTaskBtns.forEach((button) => {
    waitDeleteTask(button);
});
//! Filter
const filterTaskBtn = document.querySelector(".task__filter");
const filterByTaskEl = document.querySelector(".task__filter-by");
filterTaskBtn.addEventListener("click", event => {
    event.preventDefault();
    const tasksArray = Array.from(document.querySelectorAll(".task__item"));
    if (filterByTaskEl.textContent === "From newest") {
        filterByTaskEl.textContent = "From oldest";
        tasksArray.sort((a, b) => {
            const dateA = new Date(a.querySelector(".task__date-info").textContent.trim().split(".").reverse().join("-"));
            const dateB = new Date(b.querySelector(".task__date-info").textContent.trim().split(".").reverse().join("-"));
            const yearA = dateA.getFullYear();
            const monthA = dateA.getMonth();
            const dayA = dateA.getDate();
            const yearB = dateB.getFullYear();
            const monthB = dateB.getMonth();
            const dayB = dateB.getDate();
            if (yearA < yearB) {
                return -1;
            }
            if (yearA > yearB) {
                return 1;
            }
            if (monthA < monthB) {
                return -1;
            }
            if (monthA > monthB) {
                return 1;
            }
            if (dayA < dayB) {
                return -1;
            }
            if (dayA > dayB) {
                return 1;
            }
            return 0;
        });
    }
    else {
        filterByTaskEl.textContent = "From newest";
        tasksArray.sort((a, b) => {
            const dateA = new Date(a.querySelector(".task__date-info").textContent.trim().split(".").reverse().join("-"));
            const dateB = new Date(b.querySelector(".task__date-info").textContent.trim().split(".").reverse().join("-"));
            const yearA = dateA.getFullYear();
            const monthA = dateA.getMonth();
            const dayA = dateA.getDate();
            const yearB = dateB.getFullYear();
            const monthB = dateB.getMonth();
            const dayB = dateB.getDate();
            if (yearA < yearB) {
                return 1;
            }
            if (yearA > yearB) {
                return -1;
            }
            if (monthA < monthB) {
                return 1;
            }
            if (monthA > monthB) {
                return -1;
            }
            if (dayA < dayB) {
                return 1;
            }
            if (dayA > dayB) {
                return -1;
            }
            return 0;
        });
    }
    const tasksContainer = document.querySelector(".task__items");
    // Удаляем все элементы note из контейнера
    while (tasksContainer.firstChild) {
        tasksContainer.removeChild(tasksContainer.firstChild);
    }
    // Добавляем отсортированные элементы note обратно в контейнер
    tasksArray.forEach((task) => {
        tasksContainer.appendChild(task);
    });
});
//# sourceMappingURL=script-tasks.js.map