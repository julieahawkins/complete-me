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

  it('Should have a count prop with a default setting of 0', () => {
    const trie = new Trie();
    assert.deepEqual(trie.count, 0);
  });

  describe('INSERT', () => {
    it('should take in a word', () => {
      const trie = new Trie();
      trie.insert('PIZZA');
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

    it('should not duplicate nodes when words are inserted with existing node creations', () => {
      const trie = new Trie();
      trie.insert('apple');
      trie.insert('appeal');
      assert.equal(trie.root.children.a.children.p.children.p.children.l.letter, 'l');
      assert.equal(trie.root.children.a.children.p.children.p.children.e.letter, 'e');
    });
  });

  describe('SUGGEST', () => {
    it('Should take in a string', () => {  
      const trie = new Trie();
      trie.insert('pizza');
      trie.insert('apple');
      trie.insert('appeal');
      assert.deepEqual(trie.suggest('piz'), ['pizza']);
    });

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
    it('Should insert 235886 words from dictionary', () => {
      const trie = new Trie();
      trie.populate(dictionary);
      assert.equal(trie.count, 235886);
    });
  });

  describe('SELECT', () => {
    it('Should select a word from SUGGEST and give that word priority for next SUGGEST (small sample)', () => {
      const trie = new Trie();
      trie.insert('pizza');
      trie.insert('apple');
      trie.insert('appeal');
      trie.suggest('app');
      trie.select('appeal');
      assert.deepEqual(trie.suggest('app'), ['appeal', 'apple']);
    });

    it('Should select a word from SUGGEST and give that word priority for next SUGGEST (large sample)', () => {
      const trie = new Trie();
      trie.populate(dictionary);
      trie.suggest('piz'); //=> ['pize', 'pizza', 'pizzeria', 'pizzicato', 'pizzle']
      trie.select('pizzle');
      assert.deepEqual(trie.suggest('piz'), ['pizzle', 'pize', 'pizza', 'pizzeria', 'pizzicato']);
    });
  });
});
