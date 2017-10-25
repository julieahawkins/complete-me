// export default 
module.exports = class Node {
  constructor(letter) {
    this.letter = letter;
    this.children = {};
    this.isWord = false;
  }
};