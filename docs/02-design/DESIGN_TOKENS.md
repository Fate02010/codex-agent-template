# 设计 Tokens

## 文档信息

- 文档类型：模板（首次执行 Skill 后覆盖）
- 生成 Skill：`ui-design-spec`
- 上游输入：`PRD_RECTIFIED.md`、`MVP_SCOPE.md`、`UI_DESIGN_SPEC.md`
- 版本：v0.0
- 日期：—
- 状态：模板 → 草稿 → 已冻结

## 目标

定义跨页面统一视觉变量（颜色、字体、间距、圆角、阴影、层级、断点、动效），作为 `prototype-build` 与前端实现的一致性基线。

## 范围

- 在范围内：视觉变量与语义命名规范
- 不在范围内：具体业务页面布局

## 1. 颜色 Tokens

| Token | 值 | 用途 | 备注 |
|---|---|---|---|
| `--color-primary` |  | 主操作色 |  |
| `--color-success` |  | 成功态 |  |
| `--color-warning` |  | 警告态 |  |
| `--color-danger` |  | 错误态 |  |
| `--color-text-primary` |  | 一级文本 |  |

## 2. 字体 Tokens

| Token | 值 | 用途 |
|---|---|---|
| `--font-family-base` |  | 默认字体 |
| `--font-size-base` |  | 正文字号 |
| `--font-size-title` |  | 标题字号 |
| `--font-weight-medium` |  | 中等字重 |

## 3. 间距与尺寸 Tokens

| Token | 值 | 用途 |
|---|---|---|
| `--space-2` |  | 紧凑间距 |
| `--space-4` |  | 常规间距 |
| `--space-6` |  | 页面区块间距 |
| `--control-height-md` |  | 中尺寸控件高度 |

## 4. 圆角、阴影、层级 Tokens

| Token | 值 | 用途 |
|---|---|---|
| `--radius-sm` |  | 小圆角 |
| `--radius-md` |  | 常规圆角 |
| `--shadow-card` |  | 卡片阴影 |
| `--z-modal` |  | 弹层层级 |

## 5. 断点与布局 Tokens

| Token | 值 | 用途 |
|---|---|---|
| `--breakpoint-desktop` | 1366px | 桌面断点 |
| `--breakpoint-mobile` | 375px | 移动断点（按需） |
| `--container-max-width` |  | 主容器最大宽度 |

## 6. 动效 Tokens（按需）

| Token | 值 | 用途 |
|---|---|---|
| `--motion-duration-fast` |  | 快速反馈动效 |
| `--motion-duration-base` |  | 常规切换动效 |
| `--motion-ease-standard` |  | 标准缓动曲线 |

## 异常与边界

- 新增视觉变量必须先登记 Token，再进入原型与代码实现。
- 不允许在原型或代码中使用未登记的硬编码视觉值。

## 变更记录

| 版本 | 日期 | 说明 |
|---|---|---|
| — | — | — |
