'use client'

import { useState, useEffect } from 'react'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

export default function Home() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const EMOJIS = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎸', '🎺', '🎷']

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const gameCards: Card[] = []
    let id = 0

    // Create pairs of cards
    EMOJIS.forEach(emoji => {
      gameCards.push({
        id: id++,
        emoji,
        isFlipped: false,
        isMatched: false
      })
      gameCards.push({
        id: id++,
        emoji,
        isFlipped: false,
        isMatched: false
      })
    })

    // Shuffle cards using Fisher-Yates algorithm
    const shuffledCards = [...gameCards]
    for (let i = shuffledCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]]
    }

    setCards(shuffledCards)
    setFlippedCards([])
    setScore(0)
    setMoves(0)
    setGameWon(false)
    setIsProcessing(false)
  }

  const handleCardClick = (cardId: number) => {
    if (isProcessing) return
    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    
    const clickedCard = cards.find(card => card.id === cardId)
    if (clickedCard?.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards(prevCards => 
      prevCards.map(card => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    )

    if (newFlippedCards.length === 2) {
      setIsProcessing(true)
      setMoves(prevMoves => prevMoves + 1)
      
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstId)
      const secondCard = cards.find(card => card.id === secondId)

      if (firstCard?.emoji === secondCard?.emoji) {
        setScore(prevScore => prevScore + 10)
        
        setCards(prevCards => {
          const updatedCards = prevCards.map(card => 
            (card.id === firstId || card.id === secondId) 
              ? { ...card, isMatched: true } 
              : card
          )
          
          const allMatched = updatedCards.every(card => card.isMatched)
          if (allMatched) {
            setGameWon(true)
          }
          
          return updatedCards
        })
        
        setFlippedCards([])
        setIsProcessing(false)
      } else {
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map(card => 
              (card.id === firstId || card.id === secondId) 
                ? { ...card, isFlipped: false } 
                : card
            )
          )
          setFlippedCards([])
          setIsProcessing(false)
        }, 1000)
      }
    }
  }

  return (
    <>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .game-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }
        
        .game-wrapper {
          max-width: 64rem;
          margin: 0 auto;
        }
        
        .game-title {
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .stats-container {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .stat-card {
          background: white;
          border-radius: 0.5rem;
          padding: 1rem 1.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
        }
        
        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
          color: #7c3aed;
        }
        
        .game-board {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          max-width: 32rem;
          margin: 0 auto 2rem auto;
        }
        
        .card {
          aspect-ratio: 1;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
        }
        
        .card:hover {
          transform: scale(1.05);
        }
        
        .card-back {
          background: #7c3aed;
          color: white;
        }
        
        .card-back:hover {
          background: #6d28d9;
        }
        
        .card-front {
          background: white;
          color: #333;
        }
        
        .card-matched {
          background: white;
          color: #333;
          border: 4px solid #10b981;
        }
        
        .card-processing {
          pointer-events: none;
        }
        
        .controls {
          text-align: center;
        }
        
        .new-game-btn {
          background: white;
          color: #7c3aed;
          padding: 0.75rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
        }
        
        .new-game-btn:hover {
          background: #f3f4f6;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
        }
        
        .modal-content {
          background: white;
          border-radius: 0.5rem;
          padding: 2rem;
          text-align: center;
          max-width: 28rem;
        }
        
        .modal-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #7c3aed;
          margin-bottom: 1rem;
        }
        
        .modal-text {
          color: #6b7280;
          margin-bottom: 1rem;
        }
        
        .play-again-btn {
          background: #7c3aed;
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 0.5rem;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        
        .play-again-btn:hover {
          background: #6d28d9;
        }
      `}</style>
      
      <div className="game-container">
        <div className="game-wrapper">
          <h1 className="game-title">Memory Game </h1>
          
          <div className="stats-container">
            <div className="stat-card">
              <div className="stat-label">Score</div>
              <div className="stat-value">{score}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Moves</div>
              <div className="stat-value">{moves}</div>
            </div>
          </div>

          <div className="game-board">
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`card ${
                  card.isFlipped || card.isMatched 
                    ? (card.isMatched ? 'card-matched' : 'card-front')
                    : 'card-back'
                } ${isProcessing ? 'card-processing' : ''}`}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </div>
            ))}
          </div>

          <div className="controls">
            <button onClick={initializeGame} className="new-game-btn">
              New Game
            </button>
          </div>

          {gameWon && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 className="modal-title">🎉 Congratulations!</h2>
                <p className="modal-text">
                  You won in {moves} moves with a score of {score}!
                </p>
                <button onClick={initializeGame} className="play-again-btn">
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}