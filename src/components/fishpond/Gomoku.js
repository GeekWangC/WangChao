import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import '../../styles/gomoku.css';

const BOARD_SIZE = 15;
const WIN_CONDITION = 5;

const Gomoku = () => {
  const [board, setBoard] = useState(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [lastMove, setLastMove] = useState(null);

  // 检查是否获胜
  const checkWin = useCallback((row, col, player) => {
    const directions = [
      [[0, 1], [0, -1]], // 水平
      [[1, 0], [-1, 0]], // 垂直
      [[1, 1], [-1, -1]], // 对角线
      [[1, -1], [-1, 1]] // 反对角线
    ];

    for (const [dir1, dir2] of directions) {
      let count = 1;
      
      // 向一个方向检查
      for (const [dx, dy] of [dir1, dir2]) {
        let x = row + dx;
        let y = col + dy;
        while (
          x >= 0 && x < BOARD_SIZE &&
          y >= 0 && y < BOARD_SIZE &&
          board[x][y] === player
        ) {
          count++;
          x += dx;
          y += dy;
        }
      }

      if (count >= WIN_CONDITION) return true;
    }
    return false;
  }, [board]);

  // AI下棋
  const makeAIMove = useCallback(() => {
    if (gameOver) return;

    // 增强AI策略：评估每个位置的分数，同时考虑进攻和防守
    let bestScore = -Infinity;
    let bestMove = null;

    // 首先检查是否有必胜或必防的位置
    const criticalMove = findCriticalMove();
    if (criticalMove) {
      bestMove = criticalMove;
    } else {
      // 如果没有关键位置，则评估所有可能的位置
      for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
          if (board[i][j] === null) {
            // 评估进攻分数
            const attackScore = evaluatePosition(i, j, false);
            // 评估防守分数（模拟玩家在此位置下子）
            const defenseScore = evaluatePosition(i, j, true);
            // 综合评分，进攻和防守都要考虑
            const score = Math.max(attackScore, defenseScore * 0.9);
            
            if (score > bestScore) {
              bestScore = score;
              bestMove = [i, j];
            }
          }
        }
      }
    }

    if (bestMove) {
      const [row, col] = bestMove;
      const newBoard = [...board];
      newBoard[row][col] = false;
      setBoard(newBoard);
      setLastMove([row, col]);

      if (checkWin(row, col, false)) {
        setGameOver(true);
        setWinner('AI');
      } else {
        setIsPlayerTurn(true);
      }
    }
  }, [board, gameOver, checkWin]);

  // 寻找关键位置（必胜或必防）
  const findCriticalMove = () => {
    // 检查AI是否有必胜位置
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === null) {
          // 模拟AI在此位置下子
          board[i][j] = false;
          if (checkWin(i, j, false)) {
            board[i][j] = null;
            return [i, j];
          }
          board[i][j] = null;
        }
      }
    }

    // 检查是否需要阻止玩家获胜
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === null) {
          // 模拟玩家在此位置下子
          board[i][j] = true;
          if (checkWin(i, j, true)) {
            board[i][j] = null;
            return [i, j];
          }
          board[i][j] = null;
        }
      }
    }

    return null;
  };

  // 评估位置分数
  const evaluatePosition = (row, col, isPlayer) => {
    let score = 0;
    const directions = [
      [[0, 1], [0, -1]], // 水平
      [[1, 0], [-1, 0]], // 垂直
      [[1, 1], [-1, -1]], // 对角线
      [[1, -1], [-1, 1]] // 反对角线
    ];

    // 临时在此位置下子进行评估
    board[row][col] = isPlayer;

    for (const [dir1, dir2] of directions) {
      let count = 1;
      let blocked = 0;
      let space = 0;
      
      // 向两个方向检查
      for (const [dx, dy] of [dir1, dir2]) {
        let x = row + dx;
        let y = col + dy;
        let tempCount = 0;
        let tempSpace = 0;
        
        // 检查连续棋子
        while (
          x >= 0 && x < BOARD_SIZE &&
          y >= 0 && y < BOARD_SIZE &&
          board[x][y] === isPlayer
        ) {
          tempCount++;
          x += dx;
          y += dy;
        }
        
        // 检查空位
        if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === null) {
          tempSpace++;
          x += dx;
          y += dy;
          // 再检查一个空位后的情况
          if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] === isPlayer) {
            tempCount++;
          }
        }
        
        if (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE && board[x][y] !== null) {
          blocked++;
        }
        
        count += tempCount;
        space += tempSpace;
      }

      // 根据连子数、空位和被封堵情况评分
      if (count >= WIN_CONDITION) score += 100000;
      else if (count === 4) {
        if (blocked === 0) score += 10000; // 活四
        else if (blocked === 1) score += 1000; // 冲四
      }
      else if (count === 3) {
        if (blocked === 0) score += 1000; // 活三
        else if (blocked === 1) score += 100; // 眠三
      }
      else if (count === 2) {
        if (blocked === 0) score += 100; // 活二
        else if (blocked === 1) score += 10; // 眠二
      }
      
      // 考虑空位的影响
      if (space > 0) score *= (1 + space * 0.1);
    }

    // 恢复棋盘状态
    board[row][col] = null;
    return score;
  };

  // 处理玩家点击
  const handleClick = (row, col) => {
    if (!isPlayerTurn || gameOver || board[row][col] !== null) return;

    const newBoard = [...board];
    newBoard[row][col] = true;
    setBoard(newBoard);
    setLastMove([row, col]);

    if (checkWin(row, col, true)) {
      setGameOver(true);
      setWinner('玩家');
    } else {
      setIsPlayerTurn(false);
    }
  };

  // AI回合
  useEffect(() => {
    if (!isPlayerTurn && !gameOver) {
      const timer = setTimeout(makeAIMove, 500);
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, gameOver, makeAIMove]);

  // 重置游戏
  const resetGame = () => {
    setBoard(Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(null)));
    setIsPlayerTurn(true);
    setGameOver(false);
    setWinner(null);
    setLastMove(null);
  };

  return (
    <div className="gomoku-container">
      <div className="game-info">
        <h2>五子棋</h2>
        <p>{gameOver ? `游戏结束！${winner}获胜！` : `当前回合: ${isPlayerTurn ? '玩家' : 'AI'}`}</p>
        <button onClick={resetGame} className="reset-button">重新开始</button>
      </div>
      
      <div className="board-container">
        <div className="gomoku-board">
          {/* 渲染15x15的网格，形成交叉点 */}
          {Array(15).fill().map((_, i) => (
            Array(15).fill().map((_, j) => {
              // 判断是否是天元或星位
              const isCenter = i === 7 && j === 7;
              const isStar = (
                (i === 3 && j === 3) || (i === 3 && j === 11) ||
                (i === 11 && j === 3) || (i === 11 && j === 11)
              );
              
              return (
                <motion.div
                  key={`${i}-${j}`}
                  className={`board-cell ${lastMove?.[0] === i && lastMove?.[1] === j ? 'last-move' : ''}`}
                  data-position={isCenter ? 'center' : isStar ? 'star' : ''}
                  onClick={() => handleClick(i, j)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {board[i][j] !== null && (
                    <motion.div
                      className={`piece ${board[i][j] ? 'player' : 'ai'}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                  )}
                </motion.div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gomoku; 