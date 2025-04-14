import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/game2048.css';

const Game2048 = () => {
  const [board, setBoard] = useState(getInitialBoard());
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // 从localStorage加载最高分
  useEffect(() => {
    const savedBestScore = localStorage.getItem('2048_best_score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
  }, []);

  // 生成初始棋盘
  function getInitialBoard() {
    const board = Array(4).fill().map(() => Array(4).fill(0));
    return addNewTile(addNewTile(board));
  }

  // 添加新数字
  function addNewTile(board) {
    const newBoard = JSON.parse(JSON.stringify(board));
    const emptyTiles = [];
    
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (newBoard[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }
    
    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
    
    return newBoard;
  }

  // 检查游戏是否结束
  function checkGameOver(board) {
    // 检查是否有空格
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
      }
    }
    
    // 检查是否有相邻的相同数字
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && board[i][j] === board[i + 1][j]) ||
          (j < 3 && board[i][j] === board[i][j + 1])
        ) {
          return false;
        }
      }
    }
    
    return true;
  }

  // 移动和合并
  const move = useCallback((direction) => {
    if (gameOver) return;

    let newBoard = JSON.parse(JSON.stringify(board));
    let moved = false;
    let newScore = score;

    // 将方向转换为行/列的遍历顺序
    const [rowStart, rowEnd, rowStep] = direction === 'up' ? [0, 4, 1] : direction === 'down' ? [3, -1, -1] : [0, 4, 1];
    const [colStart, colEnd, colStep] = direction === 'left' ? [0, 4, 1] : direction === 'right' ? [3, -1, -1] : [0, 4, 1];

    // 移动和合并
    if (direction === 'up' || direction === 'down') {
      for (let j = 0; j < 4; j++) {
        let merged = Array(4).fill(false);
        for (let i = rowStart; i !== rowEnd; i += rowStep) {
          if (newBoard[i][j] !== 0) {
            let row = i;
            while (
              row - rowStep >= 0 &&
              row - rowStep < 4 &&
              (newBoard[row - rowStep][j] === 0 ||
                (!merged[row - rowStep] && newBoard[row - rowStep][j] === newBoard[row][j]))
            ) {
              if (newBoard[row - rowStep][j] === newBoard[row][j]) {
                newBoard[row - rowStep][j] *= 2;
                newScore += newBoard[row - rowStep][j];
                merged[row - rowStep] = true;
                newBoard[row][j] = 0;
                moved = true;
                break;
              } else if (newBoard[row - rowStep][j] === 0) {
                newBoard[row - rowStep][j] = newBoard[row][j];
                newBoard[row][j] = 0;
                row -= rowStep;
                moved = true;
              }
            }
          }
        }
      }
    } else {
      for (let i = 0; i < 4; i++) {
        let merged = Array(4).fill(false);
        for (let j = colStart; j !== colEnd; j += colStep) {
          if (newBoard[i][j] !== 0) {
            let col = j;
            while (
              col - colStep >= 0 &&
              col - colStep < 4 &&
              (newBoard[i][col - colStep] === 0 ||
                (!merged[col - colStep] && newBoard[i][col - colStep] === newBoard[i][col]))
            ) {
              if (newBoard[i][col - colStep] === newBoard[i][col]) {
                newBoard[i][col - colStep] *= 2;
                newScore += newBoard[i][col - colStep];
                merged[col - colStep] = true;
                newBoard[i][col] = 0;
                moved = true;
                break;
              } else if (newBoard[i][col - colStep] === 0) {
                newBoard[i][col - colStep] = newBoard[i][col];
                newBoard[i][col] = 0;
                col -= colStep;
                moved = true;
              }
            }
          }
        }
      }
    }

    if (moved) {
      newBoard = addNewTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      
      if (newScore > bestScore) {
        setBestScore(newScore);
        localStorage.setItem('2048_best_score', newScore.toString());
      }
      
      if (checkGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  }, [board, score, bestScore, gameOver]);

  // 键盘控制
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          move('up');
          break;
        case 'ArrowDown':
          move('down');
          break;
        case 'ArrowLeft':
          move('left');
          break;
        case 'ArrowRight':
          move('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  // 触摸控制
  const handleTouchStart = (e) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    setTouchEnd({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const diffX = touchEnd.x - touchStart.x;
    const diffY = touchEnd.y - touchStart.y;
    const minSwipeDistance = 50;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          move('right');
        } else {
          move('left');
        }
      }
    } else {
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          move('down');
        } else {
          move('up');
        }
      }
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // 重新开始游戏
  const resetGame = () => {
    setBoard(getInitialBoard());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game-2048">
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
        className="board"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid">
          {board.map((row, i) => (
            row.map((cell, j) => (
              <motion.div
                key={`${i}-${j}`}
                className={`cell cell-${cell}`}
                initial={{ scale: cell ? 0 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {cell !== 0 && (
                  <motion.div
                    className="cell-content"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {cell}
                  </motion.div>
                )}
              </motion.div>
            ))
          ))}
        </div>
      </div>

      <AnimatePresence>
        {gameOver && (
          <motion.div
            className="game-over"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <h2>游戏结束!</h2>
            <p>最终得分: {score}</p>
            <button onClick={resetGame}>再来一局</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game2048; 