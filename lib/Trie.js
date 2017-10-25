// import fs from 'fs';
const fs = require('fs');

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')

// import Node from './Node'
const Node = require('../lib/Node.js');

// export default 
module.exports = class Trie {
  constructor() {
    this.root = new Node('');
    this.count = 0;
    this.selections = [];
  }

  insert(word) {
    word = word.toLowerCase();
    word = word.split('');

    let currentPosition = this.root.children;
    let currentParent = this.root;

    word.forEach((letter) => {
      if (!currentPosition[letter]) {
        currentPosition[letter] = new Node(letter);
      } 
      currentPosition = currentPosition[letter].children;
      currentParent = currentParent.children[letter]; 
    })
    currentParent.isWord = true;
    this.count++;
    // console.log(JSON.stringify(this, null, 2))
  }

  suggest(str) {
    str = str.split('');

    let currentNode = this.root;
    str.forEach((letter) => {
      currentNode = currentNode.children[letter];
      if (currentNode === null) {
        return null;
      }
    })

    return this.findSuggestions(currentNode, str.join(''));
  }

  findSuggestions(currentNode, str) {
    let childrenLetters = Object.keys(currentNode.children);
    let suggestions = [];

    childrenLetters.forEach((childLetter) => {
      let letterNode = currentNode.children[childLetter];
      let newPhrase = str + childLetter;
      if (letterNode.children === {}) {
        suggestions.push(newPhrase);
      } else if (letterNode.isWord) {
        suggestions.push(newPhrase);
        suggestions.push(...this.findSuggestions(letterNode, newPhrase));
      } else {
        suggestions.push(...this.findSuggestions(letterNode, newPhrase));
      }
    });
    // return suggestions;
    return this.prioritizeSuggestions(suggestions)
  }

  populate(dictionary) {
    dictionary.forEach((word) => {
      this.insert(word)
    })
  }

  select(word) {
    this.selections.push({word: 1})
    console.log(this.selections)
    //selected word should be listed first next time suggest is called
  }

  prioritizeSuggestions(suggestions) {
    return suggestions
  }
}
