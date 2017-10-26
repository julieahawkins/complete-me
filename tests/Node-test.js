import { assert } from 'chai'
import Node from '../lib/Node'

let node;

describe('Node', () => {
  beforeEach(() => {
    node = new Node('p');
  })

  it('Should be a function', () => {
    assert.isFunction(Node, true);
  });

  it('Should take in a letter', () => {
    assert.equal(node.letter, 'p');
  });

  it('Should have children and the value should be set to an object', () => {
    assert.deepEqual(node.children, {});
  });

  it('Should have a prop isWord with a default setting of false', () => {
    assert.equal(node.isWord, false);
  });

  it('Should have a popularity of 0', () => {
    assert.equal(node.popularity, 0);
  });
});