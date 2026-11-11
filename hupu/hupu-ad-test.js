// Quantumult X: clear ads only in the captured Hupu endpoints.
(function () {
  try {
    var url = $request.url || "";
    var pattern = /^https:\/\/goblin\.hupu\.com\/3\/8\.2\.(?:67|68)\/interfaceAd\/getOther\/(?:v3|batch)(?:\?|$)/;
    if (!pattern.test(url) || typeof $response.body !== "string") return $done({});
    var data = JSON.parse($response.body);
    if (!data || typeof data !== "object" || Array.isArray(data) || data.ad_code !== 1 || !Array.isArray(data.ads) || data.ads.length === 0) return $done({});
    data.ads = [];
    return $done({ body: JSON.stringify(data) });
  } catch (e) { return $done({}); }
})();
