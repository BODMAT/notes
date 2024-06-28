"use strict";
// Фильтрация notes
const filterTaskBtn = document.querySelector(".task__filter");
const filterByTaskEl = document.querySelector(".task__filter-by");
filterTaskBtn.addEventListener("click", event => {
    event.preventDefault();
    if (filterByTaskEl.textContent === "From newest") {
        filterByTaskEl.textContent = "From oldest";
    }
    else {
        filterByTaskEl.textContent = "From newest";
    }
});
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
});
const allCheckboxes = document.querySelectorAll(".checkbox");
allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", event => {
        const parentTask = checkbox.closest(".task__item");
        if (checkbox.checked) {
            parentTask.classList.add("active-checkbox-parent");
            pushDownTask(parentTask);
        }
        else {
            parentTask.classList.remove("active-checkbox-parent");
            pushTopTask(parentTask);
        }
    });
});
//! РЕДАКТИРОВАНИЕ TASK
function waitTaskToWritable(changeButton) {
    changeButton.addEventListener("click", event => {
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
            waitTaskToReadable(changeButton);
        }
    });
}
function waitTaskToReadable(changeButton) {
    changeButton.addEventListener("click", event => {
        const parentTask = changeButton.closest(".task__item");
        const textArea = parentTask.querySelector(".textArea-task");
        const inputDate = parentTask.querySelector(".inputDate-task");
        if (!!textArea && !!inputDate) {
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
            waitTaskToWritable(changeButton);
        }
    });
}
const changeButtons = document.querySelectorAll(".task__change");
changeButtons.forEach((changeButton) => {
    waitTaskToWritable(changeButton);
});
//# sourceMappingURL=script-tasks.js.map