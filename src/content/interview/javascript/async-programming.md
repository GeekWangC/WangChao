---
title: "异步编程"
date: "2024-03-20"
tags: ["JavaScript", "面试重点", "异步编程"]
description: "深入理解 JavaScript 中的异步编程模式和最佳实践"
---

# JavaScript 异步编程完全指南

## 1. 异步编程基础

### 1.1 同步与异步的区别

同步编程按顺序执行，后续任务需要等待前面的任务完成。异步编程允许多个任务同时进行，不会阻塞执行流程。

```javascript
// 同步执行
console.log('1');
console.log('2');
console.log('3');

// 异步执行
console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');
// 输出顺序：1, 3, 2
```

### 1.2 JavaScript 的单线程特性

JavaScript 是单线程语言，但通过事件循环（Event Loop）实现异步操作：
- 调用栈（Call Stack）
- 任务队列（Task Queue）
- 微任务队列（Microtask Queue）

## 2. 回调函数

### 2.1 基本使用

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { id: 1, name: 'John' };
    callback(null, data);
  }, 1000);
}

fetchData((error, data) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Data:', data);
});
```

### 2.2 回调地狱问题

```javascript
fetchUserData(userId, (error, user) => {
  if (error) {
    handleError(error);
    return;
  }
  
  fetchUserPosts(user.id, (error, posts) => {
    if (error) {
      handleError(error);
      return;
    }
    
    fetchPostComments(posts[0].id, (error, comments) => {
      if (error) {
        handleError(error);
        return;
      }
      
      // 处理数据...
    });
  });
});
```

## 3. Promise

### 3.1 Promise 基础

```javascript
const promise = new Promise((resolve, reject) => {
  const success = true;
  if (success) {
    resolve('操作成功');
  } else {
    reject(new Error('操作失败'));
  }
});

promise
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

### 3.2 Promise 链式调用

```javascript
function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, name: 'John' });
    }, 1000);
  });
}

function fetchPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, title: 'Post 1' },
        { id: 2, title: 'Post 2' }
      ]);
    }, 1000);
  });
}

fetchUser(1)
  .then(user => fetchPosts(user.id))
  .then(posts => console.log(posts))
  .catch(error => console.error(error));
```

### 3.3 Promise 并发控制

```javascript
// Promise.all
Promise.all([
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
])
.then(([users, posts, comments]) => {
  // 所有请求都完成
})
.catch(error => {
  // 任一请求失败
});

// Promise.race
Promise.race([
  fetch('/api/fast'),
  fetch('/api/slow')
])
.then(result => {
  // 最快的请求完成
});

// Promise.allSettled
Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/posts')
])
.then(results => {
  results.forEach(result => {
    if (result.status === 'fulfilled') {
      console.log('成功:', result.value);
    } else {
      console.log('失败:', result.reason);
    }
  });
});
```

## 4. Async/Await

### 4.1 基本语法

```javascript
async function fetchUserData() {
  try {
    const response = await fetch('/api/user');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// 使用方式
fetchUserData()
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

### 4.2 并发控制

```javascript
// 串行执行
async function fetchSequential() {
  const user = await fetchUser(1);
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  return { user, posts, comments };
}

// 并行执行
async function fetchParallel() {
  const [user, posts] = await Promise.all([
    fetchUser(1),
    fetchPosts(1)
  ]);
  return { user, posts };
}
```

### 4.3 错误处理最佳实践

```javascript
async function fetchData() {
  try {
    const result = await asyncOperation();
    return result;
  } catch (error) {
    if (error instanceof NetworkError) {
      // 处理网络错误
    } else if (error instanceof ValidationError) {
      // 处理验证错误
    } else {
      // 处理其他错误
    }
    throw error; // 重新抛出错误
  } finally {
    // 清理工作
  }
}
```

## 5. 事件循环详解

### 5.1 宏任务与微任务

```javascript
console.log('1');  // 同步任务

setTimeout(() => {
  console.log('2');  // 宏任务
}, 0);

Promise.resolve()
  .then(() => {
    console.log('3');  // 微任务
  });

console.log('4');  // 同步任务

// 输出顺序：1, 4, 3, 2
```

### 5.2 常见任务类型

宏任务（Macrotasks）：
- setTimeout/setInterval
- requestAnimationFrame
- I/O
- UI rendering

微任务（Microtasks）：
- Promise.then/catch/finally
- process.nextTick (Node.js)
- MutationObserver

## 6. 实际应用场景

### 6.1 请求超时处理

```javascript
function timeoutPromise(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), timeout)
    )
  ]);
}

// 使用示例
async function fetchWithTimeout() {
  try {
    const result = await timeoutPromise(
      fetch('https://api.example.com/data'),
      5000  // 5秒超时
    );
    return result.json();
  } catch (error) {
    if (error.message === 'Timeout') {
      console.log('请求超时');
    }
    throw error;
  }
}
```

### 6.2 并发请求限制

```javascript
class RequestQueue {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.running = 0;
  }

  async add(promiseFactory) {
    if (this.running >= this.maxConcurrent) {
      await new Promise(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    try {
      return await promiseFactory();
    } finally {
      this.running--;
      if (this.queue.length > 0) {
        const next = this.queue.shift();
        next();
      }
    }
  }
}

// 使用示例
const queue = new RequestQueue(3);
const urls = ['url1', 'url2', 'url3', 'url4', 'url5'];

urls.forEach(url => {
  queue.add(() => fetch(url));
});
```

## 7. 性能优化

### 7.1 避免阻塞主线程

```javascript
// 不好的实践
function heavyComputation() {
  for (let i = 0; i < 1000000000; i++) {
    // 耗时操作
  }
}

// 好的实践
async function heavyComputation() {
  return new Promise(resolve => {
    setTimeout(() => {
      // 将耗时操作分块处理
      resolve(result);
    }, 0);
  });
}
```

### 7.2 缓存异步结果

```javascript
const memoizedFetch = (() => {
  const cache = new Map();
  
  return async (url) => {
    if (cache.has(url)) {
      return cache.get(url);
    }
    
    const response = await fetch(url);
    const data = await response.json();
    cache.set(url, data);
    return data;
  };
})();
```

## 8. 面试常见问题

1. Promise 和 async/await 的区别
2. 如何处理并发请求
3. 事件循环机制
4. 异步错误处理最佳实践
5. 如何取消异步操作

记住：
1. 理解异步编程的核心概念
2. 掌握不同异步方案的优缺点
3. 熟练使用 Promise 和 async/await
4. 了解事件循环机制
5. 注意性能和错误处理 