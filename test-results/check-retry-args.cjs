const pattern = process.argv[2];
console.log(JSON.stringify(pattern.slice(0, 65)));
console.log(new RegExp(pattern).test('assistant-ui Stop stops the exact remote stream, retains the draft and rejects late tokens'));
