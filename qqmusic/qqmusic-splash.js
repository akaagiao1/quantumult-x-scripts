
/*
 * QQ音乐 · 开屏广告清理（Quantumult X 响应脚本）
 * 目标：POST https://tmead.y.qq.com/maproxy/getInfo
 * 仅处理开屏位 pos_id=30090301 / position=300903 的广告素材与轮播控制字段，
 * 以及顶层 disable_feature_splash。其他广告位与字段不动。
 * 用字符偏移切片替换，不重新序列化整包，保留 64 位数字精度；异常原样放行。
 */
(function () {
  'use strict';
  var TARGET = /^https?:\/\/(?:tmead|music)\.y\.qq\.com\/maproxy\/getInfo(?:[?#]|$)/i;
  var SPLASH_IDS = { '30090301': 1, '300903': 1 };
  var ZERO_FIELDS = ['need_splash_rotation', 'splash_rotation_num', 'tme_splash_times', 'previous_splash_count', 'need_show_ams_splash'];
  function Cursor(t) { this.t = t; this.p = 0; }
  Cursor.prototype.ws = function () { var t = this.t; while (this.p < t.length) { var c = t.charCodeAt(this.p); if (c === 32 || c === 9 || c === 10 || c === 13) this.p++; else break; } };
  Cursor.prototype.str = function () {
    var t = this.t, s = this.p;
    if (t.charAt(this.p) !== '"') throw new Error('str');
    this.p++;
    while (this.p < t.length) { var c = t.charAt(this.p++); if (c === '\\') this.p++; else if (c === '"') return { start: s, end: this.p, raw: t.slice(s, this.p) }; }
    throw new Error('unterminated');
  };
  Cursor.prototype.val = function (depth) {
    if (depth > 64) throw new Error('deep');
    this.ws();
    var t = this.t, start = this.p, c = t.charAt(this.p);
    if (c === '"') { var s = this.str(); return { k: 's', start: start, end: s.end, v: JSON.parse(s.raw) }; }
    if (c === '{' || c === '[') {
      var isObj = c === '{', close = isObj ? '}' : ']', mem = [];
      this.p++; this.ws();
      if (t.charAt(this.p) === close) { this.p++; return { k: isObj ? 'o' : 'a', start: start, end: this.p, m: mem }; }
      for (;;) {
        this.ws();
        if (isObj) {
          var key = this.str();
          this.ws(); if (t.charAt(this.p) !== ':') throw new Error('colon'); this.p++;
          mem.push({ key: JSON.parse(key.raw), v: this.val(depth + 1) });
        } else mem.push({ v: this.val(depth + 1) });
        this.ws();
        var d = t.charAt(this.p);
        if (d === ',') { this.p++; continue; }
        if (d === close) { this.p++; break; }
        throw new Error('sep');
      }
      return { k: isObj ? 'o' : 'a', start: start, end: this.p, m: mem };
    }
    while (this.p < t.length && ',}] \t\r\n'.indexOf(t.charAt(this.p)) < 0) this.p++;
    if (this.p === start) throw new Error('tok');
    var raw = t.slice(start, this.p), v;
    if (raw === 'null') v = null; else if (raw === 'true') v = true; else if (raw === 'false') v = false;
    else { v = Number(raw); if (!isFinite(v)) throw new Error('num'); }
    return { k: 'x', start: start, end: this.p, v: v, raw: raw };
  };
  function get(o, key) { if (!o || o.k !== 'o') return null; for (var i = 0; i < o.m.length; i++) if (o.m[i].key === key) return o.m[i].v; return null; }
  try {
    if (!TARGET.test($request.url || '') || !$response || typeof $response.body !== 'string') return $done({});
    var text = $response.body, cur = new Cursor(text), root = cur.val(0);
    cur.ws();
    if (cur.p !== text.length || !root || root.k !== 'o') return $done({});
    var edits = [];
    var d = get(root, 'disable_feature_splash');
    if (d && d.k === 'x' && d.raw !== 'true' && d.raw !== '1') edits.push([d.start, d.end, d.raw === 'false' ? 'true' : '1']);
    var list = get(root, 'rpt_msg_pos_ad_info');
    if (list && list.k === 'a') {
      list.m.forEach(function (item) {
        var posId = get(item.v, 'pos_id'), pos = get(item.v, 'position');
        var hit = (posId && posId.k === 's' && SPLASH_IDS[String(posId.v)]) || (pos && (pos.k === 's' || pos.k === 'x') && SPLASH_IDS[String(pos.v)]);
        if (!hit) return;
        var ads = get(item.v, 'rpt_msg_ad_info');
        if (!ads || ads.k !== 'a') return;
        if (ads.m.length) edits.push([ads.start, ads.end, '[]']);
        ZERO_FIELDS.forEach(function (f) {
          var fv = get(item.v, f);
          if (fv && fv.k === 'x' && fv.raw !== '0') edits.push([fv.start, fv.end, '0']);
        });
      });
    }
    if (!edits.length) return $done({});
    edits.sort(function (a, b) { return b[0] - a[0]; });
    var out = text;
    edits.forEach(function (e) { out = out.slice(0, e[0]) + e[2] + out.slice(e[1]); });
    JSON.parse(out);
    return $done({ body: out });
  } catch (_) { return $done({}); }
})();
