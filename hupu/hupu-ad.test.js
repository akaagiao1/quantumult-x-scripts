// Run with: node hupu/hupu-ad.test.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const script = fs.readFileSync(path.join(__dirname, 'hupu-ad-test.js'), 'utf8');
const conf = fs.readFileSync(path.join(__dirname, 'hupu-ad.conf'), 'utf8');
const rule = conf.split('\n').find(line => line.includes(' url script-response-body '));
assert(rule, 'rewrite rule missing');
const pattern = new RegExp(rule.split(' url script-response-body ')[0]);
function run(url, body) {
  const calls = [];
  vm.runInNewContext(script, { $request: { url }, $response: { body }, $done: value => calls.push(value) });
  assert.strictEqual(calls.length, 1, 'must call $done exactly once');
  return calls[0];
}
const base = 'https://goblin.hupu.com/3/';
const input = JSON.stringify({ ad_code: 1, ads: [{ id: 'synthetic' }], other: 'keep' });
for (const version of ['8.2.67', '8.2.68']) {
  for (const endpoint of ['v3', 'batch']) {
    for (const query of ['', '?sample=1']) {
      const url = base + version + '/interfaceAd/getOther/' + endpoint + query;
      assert(pattern.test(url), url);
      const result = run(url, input);
      assert.deepStrictEqual(JSON.parse(result.body), { ad_code: 1, ads: [], other: 'keep' });
    }
  }
}
for (const url of [
  base + '8.2.66/interfaceAd/getOther/v3',
  base + '8.2.69/interfaceAd/getOther/batch',
  base + '8.2.68/interfaceAd/getOther/v3/extra',
  base + '8.2.68/interfaceAd/getOther/v30',
  'https://goblin.hupu.com.evil.example/3/8.2.68/interfaceAd/getOther/v3',
  'http://goblin.hupu.com/3/8.2.68/interfaceAd/getOther/v3'
]) {
  assert(!pattern.test(url), url);
  assert.strictEqual(Object.keys(run(url, input)).length, 0);
}
const url = base + '8.2.68/interfaceAd/getOther/v3';
for (const body of [undefined, '', 'not json', 'null', '[]', '{}',
  '{"ad_code":0,"ads":[1]}', '{"ad_code":1,"ads":[]}',
  '{"ad_code":1,"ads":{}}', '{"ad_code":"1","ads":[1]}']) {
  assert.strictEqual(Object.keys(run(url, body)).length, 0, String(body));
}
console.log('Hupu rewrite and response tests passed');
