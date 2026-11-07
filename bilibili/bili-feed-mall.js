/* Bilibili: targeted feed ads and bottom mall tab; preserve original JSON numbers. */
(function () {
'use strict';
try {
 var url=$request.url||'';
 var feed=/^https:\/\/app\.bilibili\.com\/x\/v2\/feed\/index(?:\?|$)/.test(url);
 var tabs=/^https:\/\/app\.bilibili\.com\/x\/resource\/show\/tab\/v2(?:\?|$)/.test(url);
 if ((!feed&&!tabs)||!$response||typeof $response.body!=='string') return $done({});
 var text=$response.body; JSON.parse(text);
 var target=feed?'items':'bottom',p=0,candidates=[];
 function ws(){while(p<text.length&&/[\x20\t\r\n]/.test(text[p]))p++;}
 function stringToken(){var start=p++;while(p<text.length){var c=text[p++];if(c==='\\')p++;else if(c==='"')return text.slice(start,p);}throw new Error('string');}
 function value(path){
  ws();var start=p,c=text[p];
  if(c==='"')stringToken();
  else if(c==='{'){p++;ws();while(text[p]!=='}'){var key=JSON.parse(stringToken());ws();if(text[p++]!==':')throw new Error('object');value(path.concat(key));ws();if(text[p]===','){p++;ws();}else break;}if(text[p++]!=='}')throw new Error('object end');}
  else if(c==='['){p++;ws();var elements=[];while(text[p]!==']'){ws();var a=p;value(path.concat('*'));var b=p;elements.push([a,b]);ws();if(text[p]===','){p++;ws();}else break;}if(text[p++]!==']')throw new Error('array end');if(path.length===2&&path[0]==='data'&&path[1]===target)candidates.push({start:start,end:p,elements:elements});}
  else while(p<text.length&&!/[\x20\t\r\n,\]}]/.test(text[p]))p++;
 }
 value([]);ws();if(p!==text.length||candidates.length!==1)return $done({});
 var array=candidates[0],kept=[],removed=0;
 array.elements.forEach(function(pair){
  var raw=text.slice(pair[0],pair[1]),x=JSON.parse(raw),drop=false;
  if(x&&typeof x==='object'&&!Array.isArray(x)){
   if(feed)drop=x.card_type==='cm_v2'&&(x.card_goto==='ad_av'||x.card_goto==='ad_inline_eggs')&&x.ad_info&&typeof x.ad_info==='object'&&!Array.isArray(x.ad_info);
   else drop=x.id===3609&&x.name==='会员购'&&x.tab_id==='会员购Bottom'&&x.uri==='bilibili://mall/abhome';
  }
  if(drop)removed++;else kept.push(raw);
 });
 if(!removed)return $done({});
 return $done({body:text.slice(0,array.start)+'['+kept.join(',')+']'+text.slice(array.end)});
}catch(_){return $done({});}
})();
