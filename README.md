
# Quantumult X 脚本与远程重写

按应用分类的自用 Quantumult X 脚本及远程重写，持续更新。

## 远程重写订阅

### 虎扑去广告（测试版）

```text
https://raw.githubusercontent.com/akaagiao1/quantumult-x-scripts/main/hupu/hupu-ad.conf
```

针对抓包中虎扑 8.2.67 的广告接口。MITM 域名：`goblin.hupu.com`。

### 哔哩哔哩开屏去广告（测试版）

```text
https://raw.githubusercontent.com/akaagiao1/quantumult-x-scripts/main/bilibili/splash.conf
```

清空开屏素材及展示列表，可能包括非广告素材；品牌开屏等其他接口未覆盖。

### 哔哩哔哩信息流广告和底栏会员购（测试版）

```text
https://raw.githubusercontent.com/akaagiao1/quantumult-x-scripts/main/bilibili/feed-mall.conf
```

仅过滤抓包中识别出的信息流广告卡片和底栏会员购入口；混合横幅及“我的”页面的会员购订单不处理，其他广告类型可能仍存在。

### 添加方法

1. 复制所需链接，在 Quantumult X 的重写资源（远程重写）中添加并启用。
2. 更新资源，确认加载成功；各资源已包含所需 hostname（B站为 `app.bilibili.com`）。
3. 启用重写和 MITM，安装并信任 Quantumult X MITM 证书。
4. 完全退出并重新打开对应 App 测试；避免启用重复的同类规则。

## 目录结构

```text
quantumult-x-scripts/
├── README.md
├── hupu/
│   ├── hupu-ad.conf
│   └── hupu-ad-test.js
└── bilibili/
    ├── splash.conf
    ├── splash.js
    ├── feed-mall.conf
    └── bili-feed-mall.js
```

规则为测试版，可能出现留白、未覆盖或版本更新失效；异常响应原样放行。

## 隐私提醒

请勿上传抓包、Cookie、令牌或其他个人敏感信息。
