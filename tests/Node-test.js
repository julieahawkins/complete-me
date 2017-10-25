// import { assert } from 'chai'
// import Node from '../lib/Node'
const chai = require('chai');
const assert = chai.assert;

const Node = require('../lib/Node.js')
let node;

describe('Node', () => {
  beforeEach(() => {
    node = new Node('p');
  })

  it('Should be a function', () => {
    assert.isFunction(Node, true);
  });

  it('Should take in a letter and assign it to letter prop', () => {
    // let node = new Node('p');
    assert.equal(node.letter, 'p');
  });

  it('Should have child prop and the value should be set to an object', () => {
    // let node = new Node('p');
    assert.deepEqual(node.children, {});
  });

  it('Should have a prop isWord with a default setting of false', () => {
    // let node = new Node('p');
    assert.equal(node.isWord, false);
  });
});