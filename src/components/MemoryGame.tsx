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

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5)
    setCards(shuffledCards)
    setFlippedCards([])
    setScore(0)
    setMoves(0)
    setGameWon(false)
  }

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return
    if (flippedCards.includes(cardId)) return
    if (cards.find((card: Card) => card.id === cardId)?.isMatched) return

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    // Update card state
    setCards((prevCards: Card[]) => 
      prevCards.map((card: Card) => 
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    )

    // Check for match when 2 cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves((prevMoves: number) => prevMoves + 1)
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((card: Card) => card.id === firstId)
      const secondCard = cards.find((card: Card) => card.id === secondId)

      if (firstCard?.emoji === secondCard?.emoji) {
        // Match found
        setScore(prevScore => prevScore + 10)
        setCards((prevCards: Card[]) => 
          prevCards.map((card: Card) => 
            (card.id === firstId || card.id === secondId) 
              ? { ...card, isMatched: true } 
              : card
          )
        )
        setFlippedCards([])

        // Check if game is won - use callback to get latest state
        setCards((prevCards: Card[]) => {
          const updatedCards = prevCards.map((card: Card) => 
            (card.id === firstId || card.id === secondId) 
              ? { ...card, isMatched: true } 
              : card
          )
          if (updatedCards.every((card: Card) => card.isMatched)) {
            setGameWon(true)
          }
          return updatedCards
        })
      } else {
        // No match, flip cards back after delay
        setTimeout(() => {
          setCards((prevCards: Card[]) => 
            prevCards.map((card: Card) => 
              (card.id === firstId || card.id === secondId) 
                ? { ...card, isFlipped: false } 
                : card
            )
          )
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Memory Game 🎭
        </h1>
        
        {/* Game Stats */}
        <div className="flex justify-center gap-8 mb-8">
          <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
            <div className="text-sm text-gray-600">Score</div>
            <div className="text-2xl font-bold text-purple-600">{score}</div>
          </div>
          <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
            <div className="text-sm text-gray-600">Moves</div>
            <div className="text-2xl font-bold text-purple-600">{moves}</div>
          </div>
        </div>

        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-8">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`
                aspect-square rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105
                ${card.isFlipped || card.isMatched 
                  ? 'bg-white' 
                  : 'bg-purple-600 hover:bg-purple-700'
                }
                ${card.isMatched ? 'ring-4 ring-green-400' : ''}
              `}
            >
              <div className="w-full h-full flex items-center justify-center text-4xl">
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </div>
            </div>
          ))}
        </div>

        {/* Game Controls */}
        <div className="text-center">
          <button
            onClick={initializeGame}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            New Game
          </button>
        </div>

        {/* Win Message */}
        {gameWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center max-w-md">
              <h2 className="text-3xl font-bold text-purple-600 mb-4">🎉 Congratulations!</h2>
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
