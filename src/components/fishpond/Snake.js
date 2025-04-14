import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/snake.css';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 200;
const SPEED_INCREMENT = 10;

const Snake = () => {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 }
  ]);
  const [food, setFood] = useState({ x: 15, y: 10 });
  const [direction, setDirection] = useState('right');
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [touchStart, setTouchStart] = useState(null);
  const gameLoopRef = useRef();
  const lastDirectionRef = useRef(direction);

  // 从localStorage加载最高分
  useEffect(() => {
    const savedBestScore = localStorage.getItem('snake_best_score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // 生成新的食物位置
  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  // 检查碰撞
  const checkCollision = useCallback((head) => {
    // 检查墙壁碰撞
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    // 检查自身碰撞
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, [snake]);

  // 移动蛇
  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    const head = { ...snake[0] };
    lastDirectionRef.current = direction;

    switch (direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
      default:
        break;
    }

    if (checkCollision(head)) {
      setGameOver(true);
      return;
    }

    const newSnake = [head];
    const ateFood = head.x === food.x && head.y === food.y;

    if (ateFood) {
      setScore(prevScore => {
        const newScore = prevScore + 10;
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('snake_best_score', newScore.toString());
        }
        return newScore;
      });
      setFood(generateFood());
      setSpeed(prevSpeed => Math.max(prevSpeed - SPEED_INCREMENT, 50));
      newSnake.push(...snake);
    } else {
      newSnake.push(...snake.slice(0, -1));
    }

    setSnake(newSnake);
  }, [snake, direction, food, gameOver, isPaused, generateFood, checkCollision, bestScore]);

  // 游戏循环
  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, speed]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;

      const key = e.key;
      const currentDirection = lastDirectionRef.current;

      if (key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (
        (key === 'ArrowUp' && currentDirection !== 'down') ||
        (key === 'w' && currentDirection !== 'down')
      ) {
        setDirection('up');
      } else if (
        (key === 'ArrowDown' && currentDirection !== 'up') ||
        (key === 's' && currentDirection !== 'up')
      ) {
        setDirection('down');
      } else if (
        (key === 'ArrowLeft' && currentDirection !== 'right') ||
        (key === 'a' && currentDirection !== 'right')
      ) {
        setDirection('left');
      } else if (
        (key === 'ArrowRight' && currentDirection !== 'left') ||
        (key === 'd' && currentDirection !== 'left')
      ) {
        setDirection('right');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // 触摸控制
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || gameOver) return;

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    const currentDirection = lastDirectionRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 50 && currentDirection !== 'left') {
        setDirection('right');
      } else if (dx < -50 && currentDirection !== 'right') {
        setDirection('left');
      }
    } else {
      if (dy > 50 && currentDirection !== 'up') {
        setDirection('down');
      } else if (dy < -50 && currentDirection !== 'down') {
        setDirection('up');
      }
    }

    setTouchStart(null);
  };

  // 重置游戏
  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ]);
    setFood(generateFood());
    setDirection('right');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(false);
    lastDirectionRef.current = 'right';
  };

  return (
    <div className="snake-game">
      <div className="game-header">
        <div className="scores">
          <div className="score-box">
            <span className="score-label">分数</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-box">
            <span className="score-label">最高分</span>
            <span className="score-value">{bestScore}</span>
          </div>
        </div>
        <button className="reset-button" onClick={resetGame}>
          重新开始
        </button>
      </div>

      <div 
        className="game-board"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div 
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`
          }}
        >
          {snake.map((segment, index) => (
            <motion.div
              key={`${segment.x}-${segment.y}`}
              className={`snake-segment ${index === 0 ? 'head' : ''}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{
                gridColumn: segment.x + 1,
                gridRow: segment.y + 1
              }}
            />
          ))}
          <motion.div
            className="food"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              gridColumn: food.x + 1,
              gridRow: food.y + 1
            }}
          />
        </div>
      </div>

      <div className="controls-hint">
        <p>使用方向键或WASD移动 | 空格键暂停</p>
        <p>触摸设备可以滑动控制方向</p>
      </div>

      <AnimatePresence>
        {(gameOver || isPaused) && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="overlay-content">
              <h2>{gameOver ? '游戏结束!' : '游戏暂停'}</h2>
              {gameOver && <p>最终得分: {score}</p>}
              <button onClick={gameOver ? resetGame : () => setIsPaused(false)}>
                {gameOver ? '再来一局' : '继续游戏'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Snake; 