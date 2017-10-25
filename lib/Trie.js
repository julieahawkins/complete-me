import Node from './Node';

export default class Trie {
  constructor() {
    this.root = new Node('');
    this.count = 0;
  }

  insert(word) {
    word = word.toLowerCase().split('');

    let currentPosition = this.root.children;
    let currentParent = this.root;

    word.forEach((letter) => {
      if (!currentPosition[letter]) {
        currentPosition[letter] = new Node(letter);
      } 
      currentPosition = currentPosition[letter].children;
      currentParent = currentParent.children[letter]; 
    });
    if (!currentParent.isWord) {
      this.count++;
      currentParent.isWord = true;
    }
  }

  suggest(str) {
    str = str.toLowerCase().split('');

    let currentNode = this.root;

    str.forEach((letter) => {
      if (currentNode && currentNode.children) {
        currentNode = currentNode.children[letter];
      }
    });
    if (!currentNode || !currentNode.children) {
      return [];
    } else {
      return this.findSuggestions(currentNode, str.join(''));
    }
  }

  findSuggestions(currentNode, str, suggestions = []) {
    let childrenLetters = Object.keys(currentNode.children);

    childrenLetters.forEach((childLetter) => {
      let letterNode = currentNode.children[childLetter];
      let newPhrase = str + childLetter;

      if (letterNode.isWord) {
        suggestions.push(
          {word: newPhrase, selectCount: letterNode.popularity}
        );
      }      
      this.findSuggestions(letterNode, newPhrase, suggestions);
    });
    return this.sortSuggestions(suggestions);
  }

  sortSuggestions(suggestions) {
    suggestions.sort((a, b) => {
      return b.selectCount - a.selectCount;
    });
    return suggestions.map((wordObj) => {
      return wordObj.word;
    });
  }

  populate(wordArray) {
    wordArray.forEach((word) => {
      this.insert(word);
    });
  }

  select(word) {
    let currentNode = this.root;

    word = word.split('');
    word.forEach((letter) => {
      currentNode = currentNode.children[letter];
    });
    currentNode.popularity++;
  }
}
