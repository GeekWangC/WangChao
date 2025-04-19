---
title: "Hooks使用"
date: "2024-03-20"
tags: ["React", "面试重点", "Hooks"]
description: "深入理解 React Hooks 的使用方法和最佳实践"
---

# React Hooks 完全指南

## 1. Hooks 基础

### 1.1 useState

状态管理的基础 Hook：

```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}

// 使用函数式更新
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  return (
    <button onClick={increment}>
      Count: {count}
    </button>
  );
}
```

### 1.2 useEffect

处理副作用的 Hook：

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  
  // 基本用法
  useEffect(() => {
    fetchUser(userId).then(data => setUser(data));
  }, [userId]);
  
  // 清理函数
  useEffect(() => {
    const subscription = api.subscribe(userId);
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);
  
  if (!user) return <div>Loading...</div>;
  return <div>{user.name}</div>;
}
```

### 1.3 useContext

跨组件共享状态：

```jsx
const ThemeContext = React.createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const theme = useContext(ThemeContext);
  return (
    <button className={theme}>
      Theme Button
    </button>
  );
}
```

## 2. 进阶 Hooks

### 2.1 useReducer

复杂状态管理：

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  );
}
```

### 2.2 useCallback

记忆化回调函数：

```jsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  const handleSearch = useCallback(async () => {
    const data = await fetchResults(query);
    setResults(data);
  }, [query]);
  
  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <ResultsList results={results} />
    </div>
  );
}
```

### 2.3 useMemo

记忆化计算结果：

```jsx
function ProductList({ products, filter }) {
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [products, filter]);
  
  return (
    <ul>
      {filteredProducts.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

## 3. 自定义 Hooks

### 3.1 创建自定义 Hook

```jsx
function useLocalStorage(key, initialValue) {
  // 状态初始化
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });
  
  // 更新函数
  const setValue = value => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [storedValue, setValue];
}

// 使用自定义 Hook
function App() {
  const [name, setName] = useLocalStorage('name', 'Bob');
  return (
    <input
      type="text"
      value={name}
      onChange={e => setName(e.target.value)}
    />
  );
}
```

### 3.2 常用自定义 Hooks

```jsx
// 1. useDebounce
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

// 2. useFetch
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        setData(json);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return { data, loading, error };
}
```

## 4. Hooks 规则

### 4.1 Hook 使用规则

1. 只在最顶层使用 Hooks
```jsx
// ❌ 错误：条件语句中使用 Hook
function Example() {
  if (condition) {
    useEffect(() => {});
  }
}

// ✅ 正确：最顶层使用 Hook
function Example() {
  useEffect(() => {
    if (condition) {
      // 执行操作
    }
  });
}
```

2. 只在 React 函数中使用 Hooks
```jsx
// ❌ 错误：在普通函数中使用 Hook
function normalFunction() {
  const [state, setState] = useState(0);
}

// ✅ 正确：在 React 组件中使用 Hook
function Component() {
  const [state, setState] = useState(0);
}
```

### 4.2 依赖项处理

```jsx
function SearchComponent({ searchTerm }) {
  // ❌ 错误：缺少依赖项
  useEffect(() => {
    performSearch(searchTerm);
  }, []);
  
  // ✅ 正确：包含所有依赖项
  useEffect(() => {
    performSearch(searchTerm);
  }, [searchTerm]);
  
  // ✅ 正确：使用 useCallback 避免无限循环
  const handleSearch = useCallback(() => {
    performSearch(searchTerm);
  }, [searchTerm]);
}
```

## 5. 性能优化

### 5.1 避免重复渲染

```jsx
function TodoList({ todos, onToggle }) {
  // ✅ 使用 useCallback 记忆化回调函数
  const handleToggle = useCallback((id) => {
    onToggle(id);
  }, [onToggle]);
  
  // ✅ 使用 useMemo 记忆化计算结果
  const completedTodos = useMemo(() => {
    return todos.filter(todo => todo.completed);
  }, [todos]);
  
  return (
    <div>
      <CompletedTodos todos={completedTodos} />
      <RemainingTodos 
        todos={todos} 
        onToggle={handleToggle}
      />
    </div>
  );
}
```

### 5.2 状态管理优化

```jsx
// ❌ 过于频繁的状态更新
function Counter() {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(count + 1);
    setCount(count + 1);
  };
  
  // ✅ 使用函数式更新
  const betterIncrement = () => {
    setCount(prev => prev + 1);
    setCount(prev => prev + 1);
  };
}
```

## 6. 实际应用场景

### 6.1 表单处理

```jsx
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e.preventDefault();
    try {
      await onSubmit(values);
    } catch (error) {
      setErrors(error.errors);
    }
  }, [values]);
  
  return { values, errors, handleChange, handleSubmit };
}

// 使用
function LoginForm() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    email: '',
    password: ''
  });
  
  const onSubmit = async (data) => {
    await loginUser(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}
      
      <input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
      />
      {errors.password && <span>{errors.password}</span>}
      
      <button type="submit">Login</button>
    </form>
  );
}
```

### 6.2 数据获取

```jsx
function useApi(url) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    loading: true,
    error: null
  });
  
  useEffect(() => {
    let mounted = true;
    
    const fetchData = async () => {
      dispatch({ type: 'FETCH_START' });
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (mounted) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        }
      } catch (error) {
        if (mounted) {
          dispatch({ type: 'FETCH_ERROR', payload: error });
        }
      }
    };
    
    fetchData();
    
    return () => {
      mounted = false;
    };
  }, [url]);
  
  return state;
}
```

## 7. 常见问题与解决方案

1. 闭包陷阱
```jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  // ❌ 错误：使用旧的 count 值
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // ✅ 正确：使用函数式更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
}
```

2. 条件渲染中的 Hooks
```jsx
function UserProfile({ isLoggedIn }) {
  // ❌ 错误：条件渲染中使用 Hooks
  if (isLoggedIn) {
    useEffect(() => {
      // ...
    });
  }
  
  // ✅ 正确：在 Hook 内部使用条件语句
  useEffect(() => {
    if (isLoggedIn) {
      // ...
    }
  }, [isLoggedIn]);
}
```

记住：
1. 理解 Hooks 的基本原理
2. 遵循 Hooks 的使用规则
3. 合理使用依赖项
4. 注意性能优化
5. 掌握常见问题的解决方案 