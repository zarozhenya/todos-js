export class Item {
  constructor({ id, text, date, done, deadline }) {
    this.text = text;
    this.date = date;
    this.isDone = done;
    this.deadline = deadline;
  }
}
