import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/TapMePlusOne.css';

const TapMePlusOne = () => {
  const { t } = useTranslation();
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');

  const BOARD_SIZE = 5;
  const INITIAL_MOVES = 5;

  // 初始化游戏板
  useEffect(() => {
    initializeBoard();
  }, []);

  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() => 
      Array(BOARD_SIZE).fill().map(() => Math.floor(Math.random() * 3) + 1)
    );
    setBoard(newBoard);
    setScore(0);
    setMoves(INITIAL_MOVES);
    setGameOver(false);
    setMessage('');
  };

  // 处理点击事件
  const handleClick = (row, col) => {
    if (gameOver || moves <= 0) return;

    const newBoard = [...board];
    newBoard[row][col] += 1;
    setBoard(newBoard);

    // 检查是否有连线
    const matches = checkMatches(newBoard);
    if (matches.length > 0) {
      const newScore = score + matches.length;
      setScore(newScore);
      setMoves(prev => prev + 1); // 消除获得额外行动点
      
      // 清除匹配的数字
      const clearedBoard = clearMatches(newBoard, matches);
      setBoard(clearedBoard);
    }

    setMoves(prev => prev - 1);
    if (moves <= 1) {
      setGameOver(true);
      setMessage(t('gameOver'));
    }
  };

  // 检查匹配
  const checkMatches = (board) => {
    const matches = [];
    
    // 检查水平匹配
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE - 2; col++) {
        if (board[row][col] === board[row][col + 1] && 
            board[row][col] === board[row][col + 2]) {
          matches.push({ row, col, direction: 'horizontal' });
        }
      }
    }
    
    // 检查垂直匹配
    for (let col = 0; col < BOARD_SIZE; col++) {
      for (let row = 0; row < BOARD_SIZE - 2; row++) {
        if (board[row][col] === board[row + 1][col] && 
            board[row][col] === board[row + 2][col]) {
          matches.push({ row, col, direction: 'vertical' });
        }
      }
    }
    
    return matches;
  };

  // 清除匹配
  const clearMatches = (board, matches) => {
    const newBoard = board.map(row => [...row]);
    
    matches.forEach(match => {
      if (match.direction === 'horizontal') {
        for (let col = match.col; col < match.col + 3; col++) {
          newBoard[match.row][col] = Math.floor(Math.random() * 3) + 1;
        }
      } else {
        for (let row = match.row; row < match.row + 3; row++) {
          newBoard[row][match.col] = Math.floor(Math.random() * 3) + 1;
        }
      }
    });
    
    return newBoard;
  };

  return (
    <div className="tap-me-plus-one">
      <div className="game-header">
        <div className="score">{t('score')}: {score}</div>
        <div className="moves">{t('moves')}: {moves}</div>
        <button onClick={initializeBoard} className="restart-button">
          {t('restart')}
        </button>
      </div>
      
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="cell"
                onClick={() => handleClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {gameOver && (
        <div className="game-over">
          <p>{message}</p>
          <p>{t('finalScore')}: {score}</p>
        </div>
      )}
    </div>
  );
};

export default TapMePlusOne; 