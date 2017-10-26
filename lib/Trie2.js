// This Trie uses a weird object 
// to map out selection preferences

import Node from './Node';

export default class Trie2 {
  constructor() {
    this.root = new Node('');
    this.count = 0;
    this.selections = {};
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
    });

    currentParent.isWord = true;
    this.count++;
  }

  suggest(str) {
    str = str.split('');

    let currentNode = this.root;

    str.forEach((letter) => {
      currentNode = currentNode.children[letter];
    });
    return this.findSuggestions(currentNode, str.join(''));
  }

  findSuggestions(currentNode, str) {
    let childrenLetters = Object.keys(currentNode.children);
    let suggestions = [];

    childrenLetters.forEach((childLetter) => {
      let letterNode = currentNode.children[childLetter];
      let newPhrase = str + childLetter;

      if (letterNode.isWord) {
        suggestions.push(newPhrase);
      }
      suggestions.push(...this.findSuggestions(letterNode, newPhrase));
      
    });
    return this.findSelections(suggestions);
  }

  populate(dictionary) {
    dictionary.forEach((word) => {
      this.insert(word);
    });
  }

  select(word) {
    if (this.selections[word]) {
      this.selections[word]++;
    } else {
      this.selections[word] = 1;
    }
  }

  findSelections(suggestions) {
    suggestions.forEach((word) => {
      if (!this.selections[word]) {
        this.selections[word] = 0;
      }
    });
    for (let j = 0; j < suggestions.length; j++) {
      for (let i = 0; i < suggestions.length - 1; i++) {
        if (this.selections[suggestions[i]] < 
            this.selections[suggestions[i + 1]]) {

          let temp = suggestions[i];

          suggestions[i] = suggestions[i + 1];
          suggestions[i + 1] = temp;
        }
      }
    }
    return suggestions;
  }
}
