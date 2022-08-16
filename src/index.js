import "../node_modules/modern-normalize/modern-normalize.css";
import "../node_modules/basiclightbox/dist/basicLightbox.min.css";
import "../node_modules/flatpickr/dist/flatpickr.min.css";
import "./styles.css";

import { v4 as uuidv4 } from "uuid";
import debounce from "lodash.debounce";
import * as basicLightbox from "basiclightbox";
import flatpickr from "flatpickr";
import { Loading } from "notiflix";
import { Item } from "./js/todoObj";
import { createTodo, readTodos, updateTodo, deleteTodo } from "./js/apiService";
import { generateModal, generateItem } from "./js/templates";

const refs = {
  todoList: document.querySelector(".todos-list"),
  deadlineInput: document.querySelector(".js-form").elements.todoDeadline,
  form: document.querySelector(".js-form"),
  picker: document.querySelector(".js-picker"),
  filterInput: document.querySelector(".filters__input"),
};

let items = [];
let filter = "";
let sortBy = "";
const fp = flatpickr(refs.deadlineInput, {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
});

const sort = function (array) {
  switch (sortBy) {
    case "":
      return array;
    case "asc-alphabet":
      return [...array].sort((a, b) => a.text.localeCompare(b.text));
    case "desc-alphabet":
      return [...array].sort((a, b) => b.text.localeCompare(a.text));
    case "asc-date":
      return [...array].sort((a, b) => a.date - b.date);
    case "desc-date":
      return [...array].sort((a, b) => b.date - a.date);
    case "by-done":
      return [...array].sort((a, b) => b.isDone - a.isDone);
    case "by-not-done":
      return [...array].sort((a, b) => a.isDone - b.isDone);
  }
};

const render = function () {
  const filteredItems = filter
    ? items.filter(({ text }) =>
        text.toLowerCase().includes(filter.toLowerCase())
      )
    : items;
  const sortedItems = sort(filteredItems);
  const markup = sortedItems.map(generateItem).join("");
  refs.todoList.innerHTML = "";
  refs.todoList.insertAdjacentHTML("beforeend", markup);
};

const removeItem = (idToRemove) => {
  items = items.filter(({ id }) => id !== idToRemove);
  deleteTodo(idToRemove);
};

const showModal = (idToShow) => {
  const currentItem = items.find(({ id }) => id === idToShow);
  const instance = basicLightbox.create(generateModal(`${currentItem.text}`));
  instance
    .element()
    .querySelector("button")
    .addEventListener("click", () => {
      instance.close();
    });
  instance.show();
};
const updateItem = (idToUpdate) => {
  const index = items.findIndex((item) => item.id === idToUpdate);
  items[index].isDone = !items[index].isDone;
  updateTodo(idToUpdate, items[index]);
};

const onButtonClick = ({ type, id }) => {
  switch (type) {
    case "view":
      showModal(id);
      break;
    case "remove":
      removeItem(id);
      break;
  }
};
const handleItemCLick = function (event) {
  const parent = event.target.closest(".todos-list__item");
  switch (event.target.nodeName) {
    case "BUTTON":
      onButtonClick({ type: event.target.dataset.type, id: parent.dataset.id });
      break;
    case "INPUT":
      updateItem(parent.dataset.id);
      break;
  }
  render();
};

const handleFormSubmit = function (event) {
  event.preventDefault();
  const newTodo = new Item({
    text: event.currentTarget.elements.todoName.value,
    date: Date.now(),
    done: false,
    deadline: new Date(fp.selectedDates[0]).getTime(),
  });

  createTodo(newTodo).then(({ id }) => {
    items.unshift({ ...newTodo, id });
    render();
  });
  event.currentTarget.reset();
};

refs.form.addEventListener("submit", handleFormSubmit);

refs.filterInput.addEventListener(
  "input",
  debounce((event) => {
    filter = event.target.value;
    render();
  }, 300)
);

refs.picker.addEventListener("change", (event) => {
  sortBy = event.currentTarget.value;
  render();
});

refs.todoList.addEventListener("click", handleItemCLick);
Loading.dots();

readTodos().then((value) => {
  Loading.remove();
  items = value;
  render();
});
