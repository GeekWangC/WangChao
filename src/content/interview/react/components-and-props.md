---
title: "组件和Props"
date: "2024-03-20"
tags: ["React", "面试重点", "组件"]
description: "深入理解 React 组件化开发和 Props 数据流"
---

# React 组件与 Props 完全指南

## 1. React 组件基础

### 1.1 组件的定义方式

React 组件可以通过函数组件或类组件的方式定义：

```jsx
// 函数组件（推荐）
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 类组件
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

### 1.2 组件的生命周期

```jsx
class LifecycleComponent extends React.Component {
  // 挂载阶段
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  static getDerivedStateFromProps(props, state) {
    // 返回新状态或 null
    return null;
  }

  componentDidMount() {
    // 组件挂载后执行
  }

  // 更新阶段
  shouldComponentUpdate(nextProps, nextState) {
    // 返回 true 或 false
    return true;
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 返回值传递给 componentDidUpdate
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 组件更新后执行
  }

  // 卸载阶段
  componentWillUnmount() {
    // 组件卸载前执行
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

## 2. Props 详解

### 2.1 Props 的特性

1. 只读性（Immutable）
```jsx
function Button(props) {
  // ❌ 错误：不能修改 props
  props.color = 'red';
  
  // ✅ 正确：使用 props
  return <button style={{ color: props.color }}>{props.children}</button>;
}
```

2. 默认值设置
```jsx
function Button({ color = 'blue', text = 'Click me' }) {
  return <button style={{ color }}>{text}</button>;
}

// 或者使用 defaultProps
Button.defaultProps = {
  color: 'blue',
  text: 'Click me'
};
```

### 2.2 Props 验证

```jsx
import PropTypes from 'prop-types';

function User({ name, age, email, children }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
      {children}
    </div>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  email: PropTypes.string,
  children: PropTypes.node,
  onSubmit: PropTypes.func,
  style: PropTypes.object,
  status: PropTypes.oneOf(['active', 'inactive']),
  data: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string
  })
};
```

## 3. 组件通信

### 3.1 父子组件通信

```jsx
// 父组件
function Parent() {
  const [count, setCount] = useState(0);
  
  const handleIncrement = () => {
    setCount(prev => prev + 1);
  };
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <Child count={count} onIncrement={handleIncrement} />
    </div>
  );
}

// 子组件
function Child({ count, onIncrement }) {
  return (
    <div>
      <p>Current count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}
```

### 3.2 跨层级组件通信

```jsx
// 创建 Context
const ThemeContext = React.createContext('light');

// 提供者
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 中间组件
function Toolbar() {
  return <ThemedButton />;
}

// 消费者
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>Themed Button</button>;
}
```

## 4. 组件复用模式

### 4.1 高阶组件（HOC）

```jsx
function withLogger(WrappedComponent) {
  return function WithLoggerComponent(props) {
    useEffect(() => {
      console.log('Component mounted:', WrappedComponent.name);
      return () => {
        console.log('Component will unmount:', WrappedComponent.name);
      };
    }, []);
    
    return <WrappedComponent {...props} />;
  };
}

// 使用 HOC
const EnhancedComponent = withLogger(MyComponent);
```

### 4.2 Render Props

```jsx
class Mouse extends React.Component {
  state = { x: 0, y: 0 };
  
  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  };
  
  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.render(this.state)}
      </div>
    );
  }
}

// 使用 Render Props
<Mouse render={({ x, y }) => (
  <h1>鼠标位置：{x}, {y}</h1>
)} />
```

### 4.3 自定义 Hooks

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return size;
}

// 使用自定义 Hook
function App() {
  const { width, height } = useWindowSize();
  return <div>Window size: {width} x {height}</div>;
}
```

## 5. 性能优化

### 5.1 React.memo

```jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* 渲染逻辑 */
}, (prevProps, nextProps) => {
  // 返回 true 如果不需要重新渲染
  return prevProps.id === nextProps.id;
});
```

### 5.2 useMemo 和 useCallback

```jsx
function SearchResults({ query, data }) {
  // 缓存计算结果
  const filteredData = useMemo(() => {
    return data.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [data, query]);
  
  // 缓存回调函数
  const handleClick = useCallback((id) => {
    console.log('Item clicked:', id);
  }, []);
  
  return (
    <ul>
      {filteredData.map(item => (
        <li key={item.id} onClick={() => handleClick(item.id)}>
          {item.title}
        </li>
      ))}
    </ul>
  );
}
```

## 6. 最佳实践

### 6.1 组件设计原则

1. 单一职责
```jsx
// ❌ 错误：职责过多
function UserProfile({ user }) {
  return (
    <div>
      <UserInfo user={user} />
      <UserPosts user={user} />
      <UserSettings user={user} />
    </div>
  );
}

// ✅ 正确：拆分组件
function UserProfile({ user }) {
  return <UserInfo user={user} />;
}

function UserPosts({ user }) {
  return <PostList posts={user.posts} />;
}
```

2. 组件命名规范
```jsx
// ✅ 使用 PascalCase 命名组件
function UserProfile() {}

// ✅ 使用前缀区分相似组件
function AdminUserProfile() {}
function ClientUserProfile() {}
```

### 6.2 Props 命名规范

```jsx
// ✅ 布尔值 props 使用 is/has 前缀
<Modal isOpen={true} hasCloseButton={false} />

// ✅ 事件处理函数使用 handle/on 前缀
<button onClick={handleClick} onMouseEnter={handleMouseEnter} />

// ✅ render props 使用 render 前缀
<List renderItem={item => <Item {...item} />} />
```

## 7. 常见面试题

1. 类组件和函数组件的区别？
2. React.memo 和 useMemo 的区别？
3. 为什么不能直接修改 props？
4. Context 的使用场景和注意事项？
5. 如何优化组件性能？

记住：
1. 理解组件的生命周期
2. 掌握 Props 的特性和验证
3. 熟悉组件通信方式
4. 了解组件复用模式
5. 注意性能优化方案 