class Stack {
  constructor() {
    this.items = [];
    this.count = 0;
  }

  size() {
    return this.count;
  }

  push(...items) {
    items.forEach(item => {
      this.items.push(item);
      this.count = this.count + 1;
    });
  }

  pop() {
    if (this.count > 0) {
      this.count = this.count - 1;
    }

    return this.items.pop();
  }
}
module.exports = Stack;
