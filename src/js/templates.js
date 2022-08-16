import moment from "moment";

// const formatDate = (dateMilis) => {
//   const createdAt = new Date(dateMilis);
//   const year = createdAt.getFullYear();
//   const month = String(createdAt.getMonth() + 1).padStart(2, "0");
//   const day = String(createdAt.getDate()).padStart(2, "0");
//   const hours = String(createdAt.getHours()).padStart(2, "0");
//   const minutes = String(createdAt.getMinutes()).padStart(2, "0");
//   const seconds = String(createdAt.getSeconds()).padStart(2, "0");
//   const formattedDate = `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
//   return formattedDate;
// };

export const generateModal = (text = "") => {
  return `
      <div class="modal">
        <button type="button" class="modal__btn">x</button>
        <p>${text}</p>
      </div>`;
};

export const generateItem = function ({ id, text, date, isDone, deadline }) {
  const formattedStartDate = moment(date).format("YYYY-MM-DD hh:mm:ss A");
  const formattedEndDate = deadline
    ? moment(deadline).format("YYYY-MM-DD hh:mm:ss A")
    : "None";
  return `<li class="todos-list__item" data-id="${id}">
            <input type="checkbox" name="todo-done" ${
              isDone ? "checked" : ""
            } />
            <div class="todos-list__text">
              <p class="todos-list__name">${text}</p>
              <p class="todos-list__date">Created: ${formattedStartDate}</p>
              <p class="todos-list__date">Deadline: ${formattedEndDate}</p>
            </div>
            <button type="button" class="todos-list__btn todos-list__btn--success" data-type="view">view</button>
            <button type="button" class="todos-list__btn" data-type="remove">x</button>
          </li>`;
};
