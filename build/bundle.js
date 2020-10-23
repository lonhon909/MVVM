const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

function readFiles(file) {
  const body = fs.readFileSync(file, 'utf-8');
  const ast = parser.parse(body, {
    sourceType: 'module',
  });
  console.log(ast.program.body);
}

readFiles('./index.js');