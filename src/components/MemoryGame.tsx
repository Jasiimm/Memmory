'use client'

import { useState, useEffect } from 'react'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = ['🎮', '🎯', '🎪', '🎨', '🎭', '🎸', '🎺', '🎷']

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Initialize game
  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const gameCards: Card[] = []
    let id = 0

    // Create pairs of cards
    EMOJIS.forEach((emoji: string) => {
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
    
    const clickedCard = cards.find((card: Card) => card.id === cardId)
    if (clickedCard?.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    setCards((prevCards: Card[]) => 
      prevCards.map((card: Card) => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    )

    if (newFlippedCards.length === 2) {
      setIsProcessing(true)
      setMoves((prevMoves: number) => prevMoves + 1)
      
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((card: Card) => card.id === firstId)
      const secondCard = cards.find((card: Card) => card.id === secondId)

      if (firstCard?.emoji === secondCard?.emoji) {
        setScore((prevScore: number) => prevScore + 10)
        
        setCards((prevCards: Card[]) => {
          const updatedCards = prevCards.map((card: Card) => 
            (card.id === firstId || card.id === secondId) 
              ? { ...card, isMatched: true } 
              : card
          )
          
          const allMatched = updatedCards.every((card: Card) => card.isMatched)
          if (allMatched) {
            setGameWon(true)
          }
          
          return updatedCards
        })
        
        setFlippedCards([])
        setIsProcessing(false)
      } else {
        setTimeout(() => {
          setCards((prevCards: Card[]) => 
            prevCards.map((card: Card) => 
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Memory Game
        </h1>
        
        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white rounded-lg p-4 px-6 shadow-xl">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-2xl font-bold text-purple-600">{score}</div>
          </div>
          <div className="bg-white rounded-lg p-4 px-6 shadow-xl">
            <div className="text-sm text-gray-600">Moves</div>
            <div className="text-2xl font-bold text-purple-600">{moves}</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
          {cards.map((card: Card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg cursor-pointer transition-all duration-300 
                flex items-center justify-center text-4xl font-bold
                hover:scale-105
                ${card.isFlipped || card.isMatched 
                  ? (card.isMatched 
                    ? 'bg-white text-gray-800 border-4 border-green-500' 
                    : 'bg-white text-gray-800'
                  )
                  : 'bg-purple-600 text-white hover:bg-purple-700'
                }
                ${isProcessing ? 'pointer-events-none' : ''}
              `}
            >
              {card.isFlipped || card.isMatched ? card.emoji : '?'}
            </div>
          ))}
        </div>

        <div className="text-center">
          <button 
            onClick={initializeGame} 
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold 
                     shadow-xl hover:bg-gray-100 transition-colors duration-300"
          >
            New Game
          </button>
        </div>

        {gameWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center max-w-md">
              <h2 className="text-3xl font-bold text-purple-600 mb-4">
                🎉 Congratulations!
              </h2>
              <p className="text-gray-600 mb-4">
                You won in {moves} moves with a score of {score}!
              </p>
              <button
                onClick={initializeGame}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
