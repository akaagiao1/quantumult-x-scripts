
# Quantumult X 脚本与远程重写

按应用分类的自用 Quantumult X 脚本及远程重写，持续更新。

## 远程重写订阅

### 虎扑去广告（测试版）

```text
https://raw.githubusercontent.com/akaagiao1/quantumult-x-scripts/main/hupu/hupu-ad.conf
```

针对抓包中虎扑 8.2.67 的两个广告接口。所需 hostname：`goblin.hupu.com`。

### 哔哩哔哩开屏去广告（测试版）

```text
https://raw.githubusercontent.com/akaagiao1/quantumult-x-scripts/main/bilibili/splash.conf
```

处理抓包中开屏 list 和 show 接口，清空相关素材及展示列表，包括将来可能出现的非广告开屏素材。品牌开屏等其他接口未覆盖。所需 hostname：`app.bilibili.com`。

### 添加方法

1. 复制所需链接，在 Quantumult X 的重写资源（远程重写）中添加并启用。
2. 更新资源，确认加载成功；各资源已包含所需 hostname。
3. 启用重写和 MITM，安装并信任 Quantumult X MITM 证书。
4. 退出并重新打开对应 App 测试。如之前添加了相同本地规则，建议关闭或删除，避免重复。

## 目录结构

```text
quantumult-x-scripts/
├── README.md
├── hupu/
│   ├── hupu-ad.conf       # 虎扑远程重写
│   └── hupu-ad-test.js    # 虎扑测试脚本
└── bilibili/
    ├── splash.conf        # B站开屏远程重写
    └── splash.js          # B站开屏脚本
```

规则为测试版，可能出现留白、未覆盖或版本更新失效；异常响应原样放行。

## 隐私提醒

请勿上传抓包、Cookie、令牌或其他个人敏感信息。
