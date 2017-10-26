const Node = require('./lib/Node.js');
const Trie = require('./lib/Trie.js');

module.exports = {
  Node,
  Trie
}

const text = "./dictionary/words"

$.get(text, function (data) {
    let words = data;
    let dictionary = words.toString().trim().split('\n');
    
    wordTrie.populate(dictionary);
  });

const wordTrie = new Trie();

$('input').on('keyup', inputSuggest);
$('#suggest-list').on('click', '.list-item', makeSelection);

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

function makeSelection() {
  wordTrie.select($(this).text());
}




