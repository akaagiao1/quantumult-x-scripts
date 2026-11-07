/* Bilibili splash: Quantumult X response-body script. No logging or network. */
(function () {
  var original = typeof $response.body === 'string' ? $response.body : '';
  try {
    var match = /^https:\/\/app\.bilibili\.com\/x\/v2\/splash\/(list|show)(?:\?|$)/.exec($request.url);
    if (!match || !original) return $done({});
    var obj = JSON.parse(original);
    if (!obj || obj.code !== 0 || !obj.data || typeof obj.data !== 'object' || Array.isArray(obj.data)) return $done({});
    var fields = match[1] === 'list' ? ['list', 'show', 'keep_ids'] : ['show'];
    var changed = false;
    fields.forEach(function (key) {
      if (Array.isArray(obj.data[key])) {
        if (obj.data[key].length) changed = true;
        obj.data[key] = [];
      }
    });
    return changed ? $done({ body: JSON.stringify(obj) }) : $done({});
  } catch (_) {
    return $done({});
  }
})();
