# Quantumult X 脚本与远程重写

按应用分类的自用 Quantumult X 脚本及远程重写，持续更新。

## 远程重写订阅

### 虎扑去广告（测试版）

订阅链接：

```text
https://raw.githubusercontent.com/akaagiao1/quantumult-x-scripts/main/hupu/hupu-ad.conf
```

#### 添加方法

1. 复制上面的链接，在 Quantumult X 的重写资源（远程重写）中添加并启用。
2. 更新该重写资源，确认资源加载成功；配置已包含所需 hostname：`goblin.hupu.com`。
3. 在 Quantumult X 中启用重写和 MITM，安装并信任 MITM 证书。
4. 退出并重新打开虎扑进行测试。如之前添加了同一规则的本地版本，请关闭或删除，避免重复。

本规则根据抓包适配虎扑 8.2.67 的两个广告接口，仅在响应结构符合预期时清空广告数组；其他情况原样放行。可能存在广告位留白、广告未覆盖或版本更新后失效的情况。

## 目录结构

```text
quantumult-x-scripts/
├── README.md
└── hupu/
    ├── hupu-ad.conf       # 虎扑远程重写订阅
    └── hupu-ad-test.js    # 虎扑测试脚本
```

后续其他应用的脚本和重写会按应用分别存放。

## 隐私提醒

请勿上传抓包、Cookie、令牌或其他个人敏感信息。
