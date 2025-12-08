# Implementation Plan

- [x] 1. 创建基础类型定义和数据模型



  - [x] 1.1 创建 `src/types/news.ts` 定义 NewsItem、NewsSource、PublishType 等类型


    - 定义资讯数据结构和来源枚举
    - 定义发布类型枚举
    - _Requirements: 1.1, 1.3_
  - [x] 1.2 创建 `src/types/editor.ts` 定义 EditorContent、AIGenerationRequest/Response 等类型


    - 定义编辑器内容数据结构
    - 定义 AI 服务请求响应类型
    - _Requirements: 2.1, 2.2_
  - [ ]* 1.3 编写属性测试：资讯卡片数据完整性
    - **Property 1: 资讯卡片数据完整性**
    - **Validates: Requirements 1.3**

- [x] 2. 创建 NewsPanel 组件（左栏）


  - [x] 2.1 创建 `src/components/News/NewsTabs.tsx` 资讯来源标签组件


    - 实现微信爆文、小红书爆文、知乎爆款、抖音爆款标签切换
    - _Requirements: 1.1, 1.2_
  - [x] 2.2 创建 `src/components/News/NewsCard.tsx` 资讯卡片组件


    - 展示标题、推荐指数、摘要、作者、来源、发布时间
    - 实现选中状态高亮
    - 实现发布类型按钮（动态、文章、视频）
    - _Requirements: 1.3, 1.4, 1.5_
  - [x] 2.3 创建 `src/components/News/NewsList.tsx` 资讯列表组件


    - 实现资讯列表渲染和滚动加载
    - _Requirements: 1.2, 1.3_
  - [x] 2.4 创建 `src/components/News/NewsPanel.tsx` 资讯面板主组件


    - 整合 NewsTabs、NewsList 组件
    - 管理资讯选择状态
    - _Requirements: 1.1, 1.2, 1.4_
  - [ ]* 2.5 编写属性测试：资讯选中状态传递
    - **Property 2: 资讯选中状态传递**
    - **Validates: Requirements 1.4, 4.3**

- [x] 3. 创建 AIEditorPanel 组件（中栏）


  - [x] 3.1 创建 `src/services/ai.ts` AI 服务接口


    - 定义 AI 内容生成服务接口
    - 实现 mock 数据用于开发测试
    - _Requirements: 2.2_
  - [x] 3.2 创建 `src/components/Editor/AIEditorPanel.tsx` AI 编辑面板组件


    - 根据 publishType 显示对应编辑表单
    - 集成 AI 生成功能和加载状态
    - 保留现有配置项（标题、摘要、封面、图片、视频）
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 2.6_
  - [x] 3.3 实现内容覆盖确认逻辑


    - 检测已有手动输入内容
    - 显示覆盖确认对话框
    - _Requirements: 5.3, 5.4_
  - [ ]* 3.4 编写属性测试：发布类型与表单映射
    - **Property 3: 发布类型与表单映射**
    - **Validates: Requirements 2.1**
  - [ ]* 3.5 编写属性测试：AI 生成内容填充
    - **Property 4: AI 生成内容填充**
    - **Validates: Requirements 2.2, 2.4**
  - [ ]* 3.6 编写属性测试：编辑操作配置项保留
    - **Property 5: 编辑操作配置项保留**
    - **Validates: Requirements 2.6**
  - [ ]* 3.7 编写属性测试：内容覆盖确认
    - **Property 10: 内容覆盖确认**
    - **Validates: Requirements 5.3, 5.4**

- [x] 4. Checkpoint - 确保所有测试通过

  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. 重构 PlatformPanel 组件（右栏）


  - [x] 5.1 创建 `src/components/Platform/PlatformPanel.tsx` 平台选择面板组件


    - 从现有 DynamicTab/ArticleTab 提取平台选择逻辑
    - 实现根据 publishType 过滤平台列表
    - 保留现有平台选择和持久化功能
    - _Requirements: 3.1, 3.2, 3.3_
  - [x] 5.2 实现发布功能集成


    - 整合 AI 编辑区域内容
    - 调用现有 funcPublish 发布逻辑
    - _Requirements: 3.4_
  - [ ]* 5.3 编写属性测试：平台类型过滤
    - **Property 6: 平台类型过滤**
    - **Validates: Requirements 3.2**
  - [ ]* 5.4 编写属性测试：平台选择持久化
    - **Property 7: 平台选择持久化**
    - **Validates: Requirements 3.3**
  - [ ]* 5.5 编写属性测试：发布数据完整性
    - **Property 8: 发布数据完整性**
    - **Validates: Requirements 3.4**
  - [ ]* 5.6 编写属性测试：发布按钮可用性
    - **Property 9: 发布按钮可用性**
    - **Validates: Requirements 4.5**

- [x] 6. 创建 ThreeColumnLayout 布局组件


  - [x] 6.1 创建 `src/components/Layout/ThreeColumnLayout.tsx` 三栏布局组件


    - 实现左中右三栏布局结构
    - 实现响应式布局（小屏幕垂直堆叠）
    - 管理三栏之间的数据流和状态
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
  - [x] 6.2 集成 NewsPanel、AIEditorPanel、PlatformPanel 组件

    - 实现组件间数据传递
    - 实现状态同步
    - _Requirements: 4.3, 4.4, 4.5_

- [x] 7. 改造 Options 页面



  - [x] 7.1 修改 `src/options/index.tsx` 集成三栏布局

    - 替换现有 Tabs 布局为 ThreeColumnLayout
    - 保留 Header 和基础样式
    - _Requirements: 4.1_
  - [x] 7.2 保留手动输入兼容模式

    - 支持不选择资讯直接手动输入
    - 保留现有的 URL 导入功能
    - _Requirements: 5.1, 5.2_

- [x] 8. Final Checkpoint - 确保所有测试通过


  - Ensure all tests pass, ask the user if questions arise.
