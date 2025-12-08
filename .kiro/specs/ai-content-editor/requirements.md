# Requirements Document

## Introduction

本功能旨在将现有的 Options 页面改造为三栏布局，新增资讯选择区域（左栏）和 AI 内容生成编辑区域（中栏），保留现有的发布平台选择区域（右栏）。用户可以从左侧选择资讯来源，中间区域通过 AI 自动生成内容初稿，右侧选择发布平台进行多平台同步发布。

## Glossary

- **资讯区域（News Panel）**: 左侧栏，用于展示和选择不同平台的热门资讯内容
- **AI 编辑区域（AI Editor Panel）**: 中间栏，根据选中的资讯和发布类型，调用 AI 生成内容初稿
- **发布平台区域（Platform Panel）**: 右侧栏，用于选择目标发布平台（保留现有功能）
- **资讯来源（News Source）**: 提供热门内容的平台，如微信爆文、小红书爆文、知乎爆款、抖音爆款等
- **发布类型（Publish Type）**: 内容发布的形式，包括动态、文章、视频等
- **AI 工作流（AI Workflow）**: 后台 AI 服务，根据资讯内容和发布类型生成对应格式的内容

## Requirements

### Requirement 1

**User Story:** As a 内容创作者, I want to 浏览和选择热门资讯, so that 我可以快速找到有价值的内容素材进行二次创作。

#### Acceptance Criteria

1. WHEN 用户打开 Options 页面 THEN THE 资讯区域 SHALL 显示资讯来源标签页（微信爆文、小红书爆文、知乎爆款、抖音爆款等）
2. WHEN 用户切换资讯来源标签 THEN THE 资讯区域 SHALL 加载并显示对应平台的热门资讯列表
3. WHEN 资讯列表加载完成 THEN THE 资讯区域 SHALL 以卡片形式展示每条资讯的标题、推荐指数、内容摘要、作者、来源和发布时间
4. WHEN 用户点击资讯卡片 THEN THE 资讯区域 SHALL 高亮选中状态并将资讯数据传递给 AI 编辑区域
5. WHEN 资讯卡片被选中 THEN THE 资讯卡片 SHALL 显示可用的发布类型按钮（发布动态、发布文章、发布视频）

### Requirement 2

**User Story:** As a 内容创作者, I want to 使用 AI 自动生成内容初稿, so that 我可以节省内容创作时间并保持内容质量。

#### Acceptance Criteria

1. WHEN 用户选择资讯并点击发布类型按钮 THEN THE AI 编辑区域 SHALL 根据发布类型显示对应的编辑表单
2. WHEN AI 编辑区域接收到资讯数据 THEN THE AI 编辑区域 SHALL 调用后台 AI 工作流生成内容初稿
3. WHEN AI 正在生成内容 THEN THE AI 编辑区域 SHALL 显示加载状态和生成进度提示
4. WHEN AI 生成完成 THEN THE AI 编辑区域 SHALL 将生成的内容填充到对应的表单字段中
5. WHEN 内容生成后 THEN THE AI 编辑区域 SHALL 允许用户手动修改和编辑所有生成的内容
6. WHEN 用户编辑内容 THEN THE AI 编辑区域 SHALL 保留现有的配置项（标题、摘要、封面图、图片、视频等）

### Requirement 3

**User Story:** As a 内容创作者, I want to 保留现有的发布平台选择功能, so that 我可以继续使用熟悉的多平台发布流程。

#### Acceptance Criteria

1. WHEN 页面加载完成 THEN THE 发布平台区域 SHALL 显示与现有功能相同的平台选择界面
2. WHEN 用户选择发布类型 THEN THE 发布平台区域 SHALL 根据发布类型过滤显示支持的平台列表
3. WHEN 用户勾选平台 THEN THE 发布平台区域 SHALL 保存选择状态到本地存储
4. WHEN 用户点击发布按钮 THEN THE 发布平台区域 SHALL 将 AI 编辑区域的内容同步到所有选中的平台

### Requirement 4

**User Story:** As a 内容创作者, I want to 在三栏布局中流畅操作, so that 我可以高效完成从选题到发布的完整工作流。

#### Acceptance Criteria

1. WHEN 页面加载完成 THEN THE Options 页面 SHALL 显示左中右三栏布局，各栏宽度比例合理
2. WHEN 浏览器窗口宽度变化 THEN THE 三栏布局 SHALL 响应式调整，在小屏幕上垂直堆叠显示
3. WHEN 用户在资讯区域选择内容 THEN THE AI 编辑区域 SHALL 实时响应并更新显示状态
4. WHEN 用户在 AI 编辑区域编辑内容 THEN THE 发布平台区域 SHALL 保持可见并可随时操作
5. WHEN 用户完成内容编辑 THEN THE 发布按钮 SHALL 在发布平台区域可见且可点击

### Requirement 5

**User Story:** As a 内容创作者, I want to 手动输入内容而不依赖资讯选择, so that 我可以灵活选择是否使用 AI 辅助创作。

#### Acceptance Criteria

1. WHEN 用户未选择任何资讯 THEN THE AI 编辑区域 SHALL 允许用户直接手动输入内容
2. WHEN 用户在 AI 编辑区域手动输入内容 THEN THE AI 编辑区域 SHALL 保留现有的所有手动输入功能
3. WHEN 用户已手动输入内容后选择资讯 THEN THE AI 编辑区域 SHALL 提示用户是否覆盖现有内容
4. WHEN 用户选择不覆盖 THEN THE AI 编辑区域 SHALL 保留用户手动输入的内容
