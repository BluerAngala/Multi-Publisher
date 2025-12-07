---
inclusion: fileMatch
fileMatchPattern: ['*.tsx']
---
# UI 和样式开发指南

## 组件库
- 使用 HeroUI 和 Tailwind 进行组件开发和样式设计
- 使用 lucide-react 作为图标库。代码库中有时会使用 @iconify/react，可以忽略
- 使用 Tailwind CSS 实现响应式设计；采用移动优先的方法

## Tailwind CSS 使用规范
- 采用移动优先的响应式设计
```tsx
// ✅ 正确示例
<div className="w-full md:w-1/2 lg:w-1/3">
```

## 布局规范
- 使用 Flexbox 和 Grid 进行布局
- 使用 gap 替代 margin 处理元素间距
```tsx
// ✅ 正确示例
<div className="flex gap-4">
// ❌ 错误示例
<div className="flex [&>*]:mr-4">
```

## 响应式设计断点
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## 无障碍访问规范
- 实现 ARIA 标签
- 确保充足的颜色对比度
- 支持屏幕阅读器
- 添加键盘快捷键
```tsx
// ✅ 正确示例
<button
  aria-label="关闭对话框"
  className="text-gray-500 hover:text-gray-700"
  onClick={onClose}
>
```

## 组件最佳实践
- 组件使用函数式声明
- Props 使用 TypeScript 接口定义
- 实现合适的加载和错误状态
```tsx
interface ButtonProps {
  isLoading?: boolean;
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

function Button({ isLoading, variant = 'primary', children }: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-md',
        variant === 'primary' ? 'bg-primary-600' : 'bg-secondary-600',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
      disabled={isLoading}
    >
      {isLoading ? <LoadingSpinner /> : children}
    </button>
  );
}
```

## 性能优化
- 使用 React.memo() 优化渲染
- 实现组件懒加载
- 优化图片加载
```tsx
// 组件懒加载
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />
});

// 图片优化
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  placeholder="blur"
  priority
/>
```

## 主题和暗色模式
- 使用 `bg-background` 和 `text-foreground`
- 使用 Tailwind 的暗色模式，实现一致的颜色系统
```tsx
// ✅ 正确示例
<div className="bg-background">
  <p className="text-foreground">
```
- 使用语义化的颜色变量
```tsx
// ✅ 正确示例
<button className="bg-primary-600 hover:bg-primary-700">
// ❌ 错误示例
<button className="bg-blue-600 hover:bg-blue-700">
```
