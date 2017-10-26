const Node = require('./lib/Node.js');
const Trie = require('./lib/Trie.js');

module.exports = {
  Node,
  Trie
}

const wordTrie = new Trie();
const input  = document.querySelector('input');

wordTrie.populate(['blue', 'green', 'boy', 'gary', 'appeal', 'apple', 'appear']);

input.addEventListener('keyup', inputSuggest);

function inputSuggest() {
  let suggestions = wordTrie.suggest(input.value);

  suggestions.forEach((word) => {
    const suggestList = document.querySelector('#suggestions');
    suggestList.innerHTML += word
  })
};

