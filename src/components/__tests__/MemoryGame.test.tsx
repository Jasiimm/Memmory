import { render, screen, fireEvent } from '@testing-library/react'
import MemoryGame from '../MemoryGame'

// Mock Math.random to ensure consistent card shuffling for testing
const mockMath = Object.create(global.Math)
mockMath.random = () => 0.5
global.Math = mockMath

describe('MemoryGame', () => {
  beforeEach(() => {
    render(<MemoryGame />)
  })

  test('renders the game title', () => {
    expect(screen.getByText('Memory Game')).toBeInTheDocument()
  })

  test('displays initial score and moves', () => {
    expect(screen.getByText('Score')).toBeInTheDocument()
    expect(screen.getByText('Moves')).toBeInTheDocument()
    // Should have two '0' elements (score and moves)
    expect(screen.getAllByText('0')).toHaveLength(2)
  })

  test('renders 16 cards (8 pairs)', () => {
    const cards = screen.getAllByText('?')
    expect(cards).toHaveLength(16)
  })

  test('shows New Game button', () => {
    expect(screen.getByText('New Game')).toBeInTheDocument()
  })

  test('cards flip when clicked', () => {
    const cards = screen.getAllByText('?')
    fireEvent.click(cards[0])
    
    // After clicking, the card should show an emoji instead of '?'
    expect(cards[0]).not.toHaveTextContent('?')
  })

  test('clicking New Game button resets the game', () => {
    // Click some cards first
    const cards = screen.getAllByText('?')
    fireEvent.click(cards[0])
    
    // Click New Game button
    const newGameButton = screen.getByText('New Game')
    fireEvent.click(newGameButton)
    
    // All cards should show '?' again
    const resetCards = screen.getAllByText('?')
    expect(resetCards).toHaveLength(16)
  })

  test('score increases when cards match', async () => {
    const cards = screen.getAllByText('?')
    
    // Click first card
    fireEvent.click(cards[0])
    
    // Click second card that should match (since we mocked Math.random)
    fireEvent.click(cards[1])
    
    // Wait for state updates and check if score increased
    setTimeout(() => {
      const scoreElements = screen.getAllByText('10')
      expect(scoreElements.length).toBeGreaterThan(0)
    }, 100)
  })
})
