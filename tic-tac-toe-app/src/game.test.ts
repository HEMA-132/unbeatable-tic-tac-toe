import { describe, expect, it } from 'vitest'
import { bestMove, createBoard, getOutcome, type Board, type Mark } from './game'

describe('getOutcome', () => {
  it('detects a win and returns its winning line', () => {
    const board: Board = ['X', 'X', 'X', 'O', 'O', null, null, null, null]

    expect(getOutcome(board)).toEqual({ winner: 'X', line: [0, 1, 2], draw: false })
  })

  it('detects a draw without a winner', () => {
    const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']

    expect(getOutcome(board)).toEqual({ winner: null, line: [], draw: true })
  })

  it('returns no outcome while a game is still in progress', () => {
    expect(getOutcome(createBoard())).toBeNull()
  })
})

describe('bestMove', () => {
  it('takes an immediate win', () => {
    const board: Board = ['X', 'X', null, 'O', 'O', null, null, null, null]

    expect(bestMove(board, 'X')).toBe(2)
  })

  it('blocks an immediate opponent win', () => {
    const board: Board = ['X', 'X', null, 'O', null, null, null, null, null]

    expect(bestMove(board, 'O')).toBe(2)
  })

  it('finds an immediate win when playing O', () => {
    const board: Board = ['X', 'X', null, 'O', 'O', null, 'X', null, null]

    expect(bestMove(board, 'O')).toBe(5)
  })

  it('does not mutate the supplied board', () => {
    const board = createBoard()

    bestMove(board, 'X')

    expect(board).toEqual(createBoard())
  })

  it('returns no move after a round is already over', () => {
    const board: Board = ['X', 'X', 'X', 'O', 'O', null, null, null, null]

    expect(bestMove(board, 'O')).toBe(-1)
  })
})

describe('perfect-play verification', () => {
  it('never loses against any human play, for either mark and either starter', () => {
    const marks: Mark[] = ['X', 'O']

    for (const humanMark of marks) {
      const aiMark: Mark = humanMark === 'X' ? 'O' : 'X'

      for (const humanStarts of [true, false]) {
        const board = createBoard()
        let initialTurn: Mark = humanStarts ? humanMark : aiMark

        if (initialTurn === aiMark) {
          board[bestMove(board, aiMark)] = aiMark
          initialTurn = humanMark
        }

        const verifyEveryHumanLine = (position: Board, turn: Mark): void => {
          const outcome = getOutcome(position)
          if (outcome) {
            expect(outcome.winner).not.toBe(humanMark)
            return
          }

          if (turn === humanMark) {
            for (let index = 0; index < position.length; index += 1) {
              if (position[index] !== null) continue
              const nextPosition = [...position]
              nextPosition[index] = humanMark
              verifyEveryHumanLine(nextPosition, aiMark)
            }
            return
          }

          const index = bestMove(position, aiMark)
          expect(index).toBeGreaterThanOrEqual(0)
          const nextPosition = [...position]
          nextPosition[index] = aiMark
          verifyEveryHumanLine(nextPosition, humanMark)
        }

        verifyEveryHumanLine(board, initialTurn)
      }
    }
  })
})