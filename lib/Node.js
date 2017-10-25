export default class Node {
  constructor(letter) {
    this.letter = letter;
    this.children = {};
    this.isWord = false;
    this.popularity = 0;
  }
}