---
title: "作用域和闭包"
date: "2024-03-20"
tags: ["JavaScript", "面试重点"]
description: "深入理解 JavaScript 中的作用域和闭包机制"
---

# JavaScript 作用域和闭包完全指南

## 1. 作用域基础

### 1.1 什么是作用域？

作用域是指程序中定义变量的区域，它决定了如何查找变量，也就是确定当前执行代码对变量的访问权限。JavaScript 中主要有以下几种作用域：

- 全局作用域
- 函数作用域
- 块级作用域（ES6引入）

```javascript
// 全局作用域
const globalVar = 'I am global';

function exampleFunction() {
  // 函数作用域
  const functionVar = 'I am function-scoped';
  
  if (true) {
    // 块级作用域
    let blockVar = 'I am block-scoped';
    const alsoBlockScoped = 'Me too';
  }
}
```

### 1.2 作用域链

作用域链是 JavaScript 引擎查找变量的路径。当访问一个变量时，会：
1. 首先在当前作用域查找
2. 如果找不到，就会向上级作用域查找
3. 直到找到该变量或到达全局作用域
4. 如果全局作用域也没有找到，则返回 undefined

```javascript
const global = 'global';

function outer() {
  const outerVar = 'outer';
  
  function inner() {
    const innerVar = 'inner';
    console.log(innerVar); // 'inner'
    console.log(outerVar); // 'outer'
    console.log(global);   // 'global'
  }
  
  inner();
}
```

## 2. 闭包详解

### 2.1 什么是闭包？

闭包是函数和其周围状态（词法环境）的引用的组合。换句话说，闭包让你可以从内部函数访问外部函数的作用域。

```javascript
function createCounter() {
  let count = 0;  // 私有变量
  
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.getCount());  // 0
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
```

### 2.2 闭包的实际应用场景

1. **数据私有化**
```javascript
function createUser(name) {
  let password = '123456'; // 私有变量
  
  return {
    getName() { return name; },
    login(pwd) { return pwd === password; }
  };
}

const user = createUser('张三');
console.log(user.getName());  // '张三'
console.log(user.password);   // undefined
console.log(user.login('123456')); // true
```

2. **函数工厂**
```javascript
function multiply(x) {
  return function(y) {
    return x * y;
  };
}

const multiplyByTwo = multiply(2);
const multiplyByThree = multiply(3);

console.log(multiplyByTwo(4));   // 8
console.log(multiplyByThree(4)); // 12
```

3. **模块化模式**
```javascript
const calculator = (function() {
  let result = 0;
  
  return {
    add(x) {
      result += x;
      return this;
    },
    subtract(x) {
      result -= x;
      return this;
    },
    getResult() {
      return result;
    }
  };
})();

calculator.add(5).subtract(2);
console.log(calculator.getResult()); // 3
```

## 3. 面试常见问题

### 3.1 闭包的优缺点

优点：
- 数据私有化
- 保持数据在内存中
- 避免全局变量污染
- 可以实现模块化

缺点：
- 内存占用较大
- 可能造成内存泄漏
- 处理不当会影响性能

### 3.2 经典面试题

**问题1：下面代码输出什么？**
```javascript
for (var i = 1; i <= 5; i++) {
  setTimeout(() => console.log(i), 0);
}
```
答案：输出五个 6

解释：由于 var 声明的变量是函数作用域，循环结束后 i 变成了 6，而 setTimeout 的回调是在下一个事件循环才执行，此时访问到的 i 都是同一个，值为 6。

**正确的写法：**
```javascript
// 方法1：使用 let
for (let i = 1; i <= 5; i++) {
  setTimeout(() => console.log(i), 0);
}

// 方法2：使用闭包
for (var i = 1; i <= 5; i++) {
  ((j) => {
    setTimeout(() => console.log(j), 0);
  })(i);
}
```

### 3.3 实战技巧

1. **防抖函数**
```javascript
function debounce(fn, delay) {
  let timer = null;
  
  return function(...args) {
    if (timer) clearTimeout(timer);
    
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 使用示例
const handleSearch = debounce((text) => {
  console.log('Searching:', text);
}, 300);
```

2. **节流函数**
```javascript
function throttle(fn, interval) {
  let last = 0;
  
  return function(...args) {
    const now = Date.now();
    
    if (now - last >= interval) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 使用示例
const handleScroll = throttle(() => {
  console.log('Scrolling...');
}, 200);
```

## 4. 注意事项

1. 及时清理不再使用的闭包，避免内存泄漏
2. 不要在循环中创建函数，可能导致性能问题
3. 使用闭包时注意 this 的指向问题
4. 在需要时才使用闭包，不要过度使用

## 5. ES6+ 中的新特性与闭包

ES6+ 引入了一些新特性，可以帮助我们更好地处理作用域和闭包相关的问题：

```javascript
// 使用 let 和 const 创建块级作用域
{
  let blockScoped = 'only available in this block';
  const alsoBlockScoped = 'me too';
}

// 箭头函数与闭包
const adder = x => y => x + y;
const add5 = adder(5);
console.log(add5(3)); // 8

// 使用 class 语法糖
class Counter {
  #count = 0;  // 私有字段
  
  increment() {
    return ++this.#count;
  }
  
  get value() {
    return this.#count;
  }
}
```

记住，理解闭包不仅是为了应对面试，更是为了写出更好的代码。在实际开发中，合理使用闭包可以让代码更加模块化、可维护，同时避免全局变量污染。 