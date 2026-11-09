
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
