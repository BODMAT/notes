//! Global
var changeOptionOn = false;

// условие для закрытия открытых при открытии новых (маразм написал ахах)
function closeChangebleMode(): void {
    if (changeOptionOn) {
        changeOptionOn = false;
        document.querySelectorAll(".large-textarea").forEach(elem => {
            const parentOfElemWithOpenedChangeMod = elem.closest(".main__note");
            const currentBtnEl: HTMLButtonElement = parentOfElemWithOpenedChangeMod.querySelector(".main__change");

            const svgWrite = currentBtnEl.querySelector<SVGElement>("svg");
            const gElement = svgWrite.querySelector("g");
            const currentFill = gElement.getAttribute("fill");
            if (currentFill === "#fff") {
                gElement.setAttribute("fill", "#000");
                changeNoteToReadeble(currentBtnEl);
            }
        })
    }
}

// Форматирование даты
function formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
    return date.toLocaleString('en-US', options);
}

// Фильтрация notes
const filterEl = document.querySelector<HTMLDivElement>(".main__filter");
const filterByEl = document.querySelector<HTMLDivElement>(".main__filter-by");

filterEl.addEventListener("click", event => {
    event.preventDefault();

    closeChangebleMode();

    const allNotes = document.querySelectorAll(".main__note");
    const notesArray = Array.from(allNotes);
    if (filterByEl.textContent === "By date") {
        filterByEl.textContent = "By name";

        notesArray.sort((a, b) => {
            const titleA = a.querySelector(".main__title").textContent.trim();
            const titleB = b.querySelector(".main__title").textContent.trim();

            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });
    } else {
        filterByEl.textContent = "By date";

        notesArray.sort((a, b) => {
            const dateA = new Date(a.querySelector(".main__date").textContent.trim());
            const dateB = new Date(b.querySelector(".main__date").textContent.trim());
            if (dateA.getTime() < dateB.getTime()) {
                return 1;
            }
            if (dateA.getTime() > dateB.getTime()) {
                return -1;
            }
            return 0;
        });
    }
    const notesContainer = document.querySelector(".main__notes");

    // Удаляем все элементы note из контейнера
    while (notesContainer.firstChild) {
        notesContainer.removeChild(notesContainer.firstChild);
    }

    // Добавляем отсортированные элементы note обратно в контейнер
    notesArray.forEach((note) => {
        notesContainer.appendChild(note);
    });
})

// notes open/close
const noteTextEls = document.querySelectorAll<HTMLDivElement>(".main__text");
noteTextEls.forEach(textEl => textEl.classList.add("smaller-text"));

const noteEls = document.querySelectorAll<HTMLDivElement>(".main__note");
noteEls.forEach((noteEl: HTMLDivElement) => {
    noteEl.style.cursor = "zoom-in";
    noteEl.addEventListener("click", (event) => {
        // Проверяем, что event.target является экземпляром Element
        if (event.target instanceof Element && !changeOptionOn) {
            // Проверяем, что событие не начиналось от элементов noteChangeBtnEls или noteDeleteBtnEls (таким образом обхожу по типу погружения)
            if (!event.target.closest('.main__change') && !event.target.closest('.main__delete')) {
                event.preventDefault();

                if (noteEl.querySelector(".main__text")?.classList.contains("smaller-text")) {
                    noteEl.style.cursor = "zoom-out";
                } else {
                    noteEl.style.cursor = "zoom-in";
                }
                noteEl.querySelector(".main__text")?.classList.toggle("smaller-text");
            }
        }
    });
});


// notes write (+svg manipulations)
function changeNoteToWritable(btnChangeElement: HTMLButtonElement): void {

    closeChangebleMode();

    const allNotesEl = document.querySelectorAll<HTMLElement>(".main__note");
    allNotesEl.forEach(note => {
        note.style.cursor = "zoom-in";
        note.querySelector(".main__text")?.classList.add("smaller-text");
    });

    const parentNote = btnChangeElement.closest<HTMLDivElement>(".main__note");
    parentNote.style.cursor = "default";
    parentNote.querySelector(".main__text")?.classList.remove("smaller-text");
    changeOptionOn = true;

    let strOfText = parentNote.querySelector(".main__text").textContent;
    parentNote.querySelector(".main__text").remove();

    let strOfTitle = parentNote.querySelector(".main__title").textContent;
    parentNote.querySelector(".main__title").remove();

    const newPlaceholder: HTMLTextAreaElement = document.createElement("textarea");
    newPlaceholder.placeholder = "Write your notes here";
    newPlaceholder.classList.add("large-textarea");
    newPlaceholder.value = strOfText;
    const topEl: HTMLDivElement = btnChangeElement.closest(".main__top");
    topEl.insertAdjacentElement("afterend", newPlaceholder);

    const newInput: HTMLInputElement = document.createElement("input");
    newInput.placeholder = "Title";
    newInput.type = "text";
    newInput.classList.add("small-input");
    newInput.value = strOfTitle;
    topEl.insertAdjacentElement("afterbegin", newInput);

    newPlaceholder.style.height = 'auto'; /* Reset the height to its default value */
    newPlaceholder.style.height = newPlaceholder.scrollHeight + 5 + 'px'; /* Set the height based on the content */
    document.querySelector('.large-textarea').addEventListener('input', function () {
        this.style.height = 'auto'; /* Reset the height to its default value */
        this.style.height = this.scrollHeight + 5 + 'px'; /* Set the height based on the content */
    });

    const date: HTMLDivElement = parentNote.querySelector(".main__date");
    const myDate = new Date();
    date.textContent = formatDate(myDate);

    newPlaceholder.focus()

    btnChangeElement.addEventListener("click", event => {
        event.preventDefault();
        const svgWrite = btnChangeElement.querySelector<SVGElement>("svg");
        const gElement = svgWrite.querySelector("g");
        const currentFill = gElement.getAttribute("fill");
        if (currentFill === "#fff") {
            gElement.setAttribute("fill", "#000");
            changeNoteToReadeble(btnChangeElement);
        }
    })

    document.addEventListener("keydown", event => {
        if (event.key === "Enter" && document.activeElement !== newPlaceholder) {
            const svgWrite = btnChangeElement.querySelector<SVGElement>("svg");
            const gElement = svgWrite.querySelector("g");
            const currentFill = gElement.getAttribute("fill");
            if (currentFill === "#fff") {
                gElement.setAttribute("fill", "#000");
                changeNoteToReadeble(btnChangeElement);
            }
        }
    });
}


// methods to rewrite for normal
function changeNoteToReadeble(btnChangeElement: HTMLButtonElement): void {

    const parentNote = btnChangeElement.closest<HTMLDivElement>(".main__note");

    parentNote.style.cursor = "zoom-in";
    parentNote.querySelector(".main__text")?.classList.add("smaller-text");
    changeOptionOn = false;

    const strEl: HTMLTextAreaElement = parentNote.querySelector(".large-textarea");
    const strOfText: string = strEl.value;
    parentNote.querySelector(".large-textarea").remove();

    const titleEl: HTMLInputElement = parentNote.querySelector(".small-input");
    const strOfTitle: string = titleEl.value;
    parentNote.querySelector(".small-input").remove();

    // если пуст - удалить
    if (!strOfText.trim() && !strOfTitle.trim()) {
        parentNote.remove();
    }

    const newDiv: HTMLDivElement = document.createElement("div");
    newDiv.classList.add("main__text");
    newDiv.textContent = strOfText;
    const topEl: HTMLDivElement = btnChangeElement.closest(".main__top");
    topEl.insertAdjacentElement("afterend", newDiv);

    const newH2: HTMLHeadingElement = document.createElement("h2");
    newH2.classList.add("main__title");
    newH2.textContent = strOfTitle;

    topEl.insertAdjacentElement("afterbegin", newH2);

    watchChanges(btnChangeElement)
}

function watchChanges(btnEl: HTMLButtonElement): void {
    btnEl.addEventListener("click", (event) => {
        event.preventDefault();
        const svgWrite = btnEl.querySelector<SVGElement>("svg");
        const gElement = svgWrite.querySelector("g");
        const currentFill = gElement.getAttribute("fill");
        if (currentFill === "#000") {
            gElement.setAttribute("fill", "#fff");

            changeNoteToWritable(btnEl)
        }
    });
}

// notes delete (+svg manipulations)
function watchDelete(btnEl: HTMLButtonElement): void {
    btnEl.addEventListener("click", (event) => {
        event.preventDefault();

        const allNotesEl = document.querySelectorAll<HTMLElement>(".main__note");
        allNotesEl.forEach(note => {
            note.style.cursor = "zoom-in";
            note.querySelector(".main__text")?.classList.add("smaller-text");
        });

        const svgWrite = btnEl.querySelector<SVGElement>("svg");
        const gElement = svgWrite.querySelector("g");
        const pathElement = gElement.querySelectorAll("path");
        pathElement.forEach(path => {
            path.setAttribute("fill", "#fff");
        });

        setTimeout(() => {
            const deleteQuestion = confirm("Are you sure you want to delete note?");
            if (deleteQuestion) {
                const parentNote = btnEl.closest(".main__note");
                parentNote.remove();
            } else {
                pathElement.forEach(path => {
                    path.setAttribute("fill", "#000");
                });
            }
        }, 10);
        changeOptionOn = false;
    });
}

//! start pos
const noteChangeBtnEls = document.querySelectorAll<HTMLButtonElement>(".main__change");
noteChangeBtnEls.forEach((btnEl: HTMLButtonElement) => {
    watchChanges(btnEl);
});

const noteDeleteBtnEls = document.querySelectorAll<HTMLButtonElement>(".main__delete");
noteDeleteBtnEls.forEach((btnEl: HTMLButtonElement) => {
    watchDelete(btnEl);
});

// add notes
const addNoteBtnEl: HTMLButtonElement = document.querySelector(".main__add-note");
const allNotesEl = document.querySelector(".main__notes")
addNoteBtnEl.addEventListener("click", event => {
    event.preventDefault()
    const noteTemplate: string = ` <div class="main__note">
                                <div class="main__top">
                                    <h2 class="main__title"></h2>
                                    <div class="main__top-buttons">
                                        <button class="main__change">
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
                                        <button class="main__delete">
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
                                                    <path d="M14,23a1,1,0,0,1-1-1V15a1,1,0,0,1,2,0v7A1,1,0,0,1,14,23Z"
                                                        fill="#000" />
                                                    <path d="M18,23a1,1,0,0,1-1-1V15a1,1,0,0,1,2,0v7A1,1,0,0,1,18,23Z"
                                                        fill="#000" />
                                                </g>
                                                <g id="frame">
                                                    <rect class="cls-1" height="38" width="38" />
                                                </g>
                                            </svg>
                                        </button>
                                    </div>

                                </div>
                                <div class="main__text"></div>
                                <div class="main__date"></div>
                            </div>`;
    allNotesEl.insertAdjacentHTML("afterbegin", noteTemplate);

    const btnEl: HTMLButtonElement = allNotesEl.querySelector(".main__change")
    const svgWrite = btnEl.querySelector<SVGElement>("svg");
    const gElement = svgWrite.querySelector("g");
    const currentFill = gElement.getAttribute("fill");
    if (currentFill === "#000") {
        gElement.setAttribute("fill", "#fff");
        changeNoteToWritable(btnEl);

        const parentNoteEl: HTMLDivElement = btnEl.closest(".main__note");
        const deleteBtnEl: HTMLButtonElement = parentNoteEl.querySelector(".main__delete");
        watchDelete(deleteBtnEl);
    }
});

//! find notes
const findNoteBtn: HTMLButtonElement = document.querySelector(".main__button");
const findNoteInput: HTMLInputElement = document.querySelector(".main__input");
findNoteBtn.addEventListener("click", event => {
    let found = false;
    if (findNoteInput.value) {
        event.preventDefault();
        closeChangebleMode();

        const strSearch = findNoteInput.value.trim().toLowerCase();
        const notesContainer = document.querySelector(".main__notes");

        document.querySelectorAll(".main__note").forEach(note => {
            const noteTitle = note.querySelector(".main__title").textContent.toLowerCase();
            const noteText = note.querySelector(".main__text").textContent.toLowerCase();

            if (noteTitle.includes(strSearch) || noteText.includes(strSearch)) {
                found = true;
                notesContainer.prepend(note);

                document.querySelectorAll(".main__note").forEach(note => {
                    const noteTitleEl = note.querySelector(".main__title");
                    const noteTextEl = note.querySelector(".main__text");

                    if (noteTextEl.children || noteTitleEl.children) {
                        noteTextEl.innerHTML = noteTextEl.textContent.replace(new RegExp(escapeRegExp(`<span class="highlight-span">(.*?)</span>`), 'g'), '$1');
                        noteTitleEl.innerHTML = noteTitleEl.textContent.replace(new RegExp(escapeRegExp(`<span class="highlight-span">(.*?)</span>`), 'g'), '$1');
                    }
                });
            } else {
                document.querySelectorAll(".main__note").forEach(note => {
                    const noteTitleEl = note.querySelector(".main__title");
                    const noteTextEl = note.querySelector(".main__text");

                    if (noteTextEl.children || noteTitleEl.children) {
                        noteTextEl.innerHTML = noteTextEl.textContent.replace(new RegExp(escapeRegExp(`<span class="highlight-span">(.*?)</span>`), 'g'), '$1');
                        noteTitleEl.innerHTML = noteTitleEl.textContent.replace(new RegExp(escapeRegExp(`<span class="highlight-span">(.*?)</span>`), 'g'), '$1');
                    }
                });
            }
        });
    }

    if (!found) {
        alert("No matches found");

    }

    findNoteInput.value = "";
});

//доп функционал в виде постоянного выделения совпадающих символов
//для избежания ошибок
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

findNoteInput.addEventListener("input", event => {
    closeChangebleMode()
    const strSearch = findNoteInput.value.trim().toLowerCase();
    document.querySelectorAll(".main__note").forEach(note => {
        const noteTitleEl = note.querySelector(".main__title");
        const noteTextEl = note.querySelector(".main__text");

        if (noteTextEl.children || noteTitleEl.children) {
            noteTextEl.innerHTML = noteTextEl.textContent.replace(new RegExp(escapeRegExp(`<span class="highlight-span">(.*?)</span>`), 'g'), '$1');
            noteTitleEl.innerHTML = noteTitleEl.textContent.replace(new RegExp(escapeRegExp(`<span class="highlight-span">(.*?)</span>`), 'g'), '$1');
        }

        if (strSearch && (noteTitleEl.textContent.toLowerCase().includes(strSearch) || noteTextEl.textContent.toLowerCase().includes(strSearch))) {
            noteTextEl.innerHTML = noteTextEl.textContent.replace(new RegExp(escapeRegExp(strSearch), 'gi'), `<span class="highlight-span">$&</span>`);
            noteTitleEl.innerHTML = noteTitleEl.textContent.replace(new RegExp(escapeRegExp(strSearch), 'gi'), `<span class="highlight-span">$&</span>`);
        }
    })
});


