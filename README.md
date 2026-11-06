# Quantumult X 脚本库

按应用分类存放自用测试脚本，后续可继续添加其他应用。

## 目录

- `hupu/`：虎扑脚本
  - `hupu-ad-test.js`：虎扑广告接口响应处理（测试版）

## 虎扑测试配置

在 `[rewrite_local]` 添加：

```ini
^https:\/\/goblin\.hupu\.com\/3\/8\.2\.67\/interfaceAd\/getOther\/(?:v3|batch)(?:\?|$) url script-response-body https://raw.githubusercontent.com/akaagiao1/quantumult-x-scripts/main/hupu/hupu-ad-test.js
```

在 `[mitm]` 的 hostname 中追加 `goblin.hupu.com`，并安装、信任 Quantumult X MITM 证书。启用重写及 MITM 后，重启虎扑测试。

## 注意

- 目前仅针对抓包中 8.2.67 版本的两个广告接口，可能留白或不覆盖其他广告；版本更新后可能失效。
- 仅在响应符合已观察到的结构时清空广告数组；异常时原样放行。
- 请勿上传抓包、Cookie、令牌或个人信息。
