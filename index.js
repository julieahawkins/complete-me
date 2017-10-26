const Node = require('./lib/Node.js');
const Trie = require('./lib/Trie.js');

module.exports = {
  Node,
  Trie
}

const wordTrie = new Trie();

wordTrie.populate(['blue', 'banana', 'green', 'band', 'gary', 'appeal', 'apple', 'appear']);

$('input').on('keyup', inputSuggest);

function inputSuggest() {
  if ($('input').val().length > 2) {
    let suggestions = wordTrie.suggest($('input').val());

    displayList(suggestions);
  } else if ($('input').val().length < 1){
    clearList();
  }
}

function displayList(suggestions) {
  suggestions.forEach((word) => {
    $('#suggest-list').append(`<p class="list-item">${word}</p>`);
  });
}

function clearList() {
  $('.list-item').remove();
}




