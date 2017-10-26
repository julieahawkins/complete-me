import { assert } from 'chai'
import fs from 'fs';
import Trie from '../lib/Trie'
import Node from '../lib/Node'

const text = "/usr/share/dict/words"
const dictionary = fs.readFileSync(text).toString().trim().split('\n')

describe('Trie', () => {
  it('Should be a function', () => {
    assert.isFunction(Trie, true);
  });

  it('Should have a root node', () => {
    const trie = new Trie();
    assert.deepEqual(trie.root, new Node(''));
  });

  it('Should have a root node that contains an empty string', () => {
    const trie = new Trie();
    assert.deepEqual(trie.root.letter, '');
  })

  it('Should have a word count of 0', () => {
    const trie = new Trie();
    assert.deepEqual(trie.count, 0);
  });

  describe('INSERT', () => {
    it('should take in a word', () => {
      const trie = new Trie();
      trie.insert('pizza');
      assert.equal(trie.count, 1);
      assert.equal(trie.root.children.p.letter, 'p');
    });

    it('should take in another word and the count should go up', () => {
      const trie = new Trie();
      trie.insert('pizza');
      trie.insert('apple');
      assert.equal(trie.count, 2);
      assert.equal(trie.root.children.a.letter, 'a');
      assert.equal(trie.root.children.p.letter, 'p');
    });

    it('should create each letter in a word as a child of the next letter', () => {
      const trie = new Trie();
      trie.insert('pizza');
      assert.equal(trie.root.children.p.children.i.letter, 'i');
      assert.equal(trie.root.children.p.children.i.children.z.letter, 'z');
      assert.equal(trie.root.children.p.children.i.children.z.children.z.letter, 'z');
      assert.equal(trie.root.children.p.children.i.children.z.children.z.children.a.letter, 'a');
    });

    it('should tag the node associatied with the last letter in a word', () => {
      const trie = new Trie();
      trie.insert('pizza');
      assert.equal(trie.root.children.p.children.i.children.z.children.z.children.a.isWord, true);
    });

    it('should not duplicate nodes when words are inserted with existing node creations', () => {
      const trie = new Trie();
      trie.insert('apple');
      trie.insert('appeal');
      assert.equal(trie.root.children.a.children.p.children.p.children.l.letter, 'l');
      assert.equal(trie.root.children.a.children.p.children.p.children.e.letter, 'e');
    });

    it('should not count duplicate words', () => {
      const trie = new Trie();
      trie.insert('cat');
      assert.equal(trie.count, 1);
      trie.insert('dog');
      assert.equal(trie.count, 2);
      trie.insert('cat');
      assert.equal(trie.count, 2);
    })
  });

  describe('SUGGEST', () => {
    it('Should take in a string and return an array', () => {  
      const trie = new Trie();
      trie.insert('pizza');
      assert.deepEqual(trie.suggest('piz'), ['pizza']);
    });

    it('Should return an empty array if the suggestion does not match any words in trie', () => {
      const trie = new Trie();
      trie.insert('pizza');
      trie.insert('apple');
      trie.insert('appeal');
      assert.deepEqual(trie.suggest('!'), []);
      assert.deepEqual(trie.suggest('zzz'), []);
    })

    it('Should suggest all words matching the suggestion (small sample)', () => {
      const trie = new Trie();
      trie.insert('pizza');
      trie.insert('apple');
      trie.insert('appeal');
      assert.deepEqual(trie.suggest('app'), ['apple', 'appeal'])
    });

    it('Should suggest all words matching the suggestion (large sample)', () => {
      const trie = new Trie();
      trie.populate(dictionary);
      assert.deepEqual(trie.suggest('piz'), ['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle'])
    });
  });

  describe('POPULATE', () => {
    it('Should insert 234371 (235886 if not all lowercased) words from dictionary', () => {
      const trie = new Trie();
      trie.populate(dictionary);
      assert.equal(trie.count, 234371);
    });
  });

  describe('SELECT', () => {
    it('Should take in string and returns words that begin with that string (small sample)', () => {
      const trie = new Trie();
      trie.insert('pizza');
      trie.insert('apple');
      trie.insert('appeal');
      trie.suggest('app');
      trie.select('appeal');
      assert.deepEqual(trie.suggest('app'), ['appeal', 'apple']);
    });

    it('Should take in string and returns words that begin with that string (large sample)', () => {
      const trie = new Trie();
      trie.populate(dictionary);
      assert.deepEqual(trie.suggest('piz'), ['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']);
      trie.select('pizzle');
      assert.deepEqual(trie.suggest('piz'), ['pizzle', 'pize', 'pizza', 'pizzeria', 'pizzicato']);
    });

    it('Should increase the popularity of the selected word and give those words priority in the list', () => {
      const trie = new Trie();
      trie.insert('apple');
      trie.insert('appeal');
      trie.insert('appear');
      assert.deepEqual(trie.suggest('app'), ['apple', 'appeal', 'appear']);
      trie.select('appeal');
      assert.equal(trie.root.children.a.children.p.children.p.children.e.children.a.children.l.popularity, 1)
      assert.deepEqual(trie.suggest('app'), ['appeal', 'apple', 'appear']);
      trie.select('apple');
      trie.select('apple');
      assert.equal(trie.root.children.a.children.p.children.p.children.l.children.e.popularity, 2)
      assert.deepEqual(trie.suggest('app'), ['apple', 'appeal', 'appear']);
    });
  });
});
