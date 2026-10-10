export type Mark = 'X' | 'O'
export type CellValue = Mark | null
export type Board = CellValue[]

export type GameOutcome = {
  winner: Mark | null
  line: number[]
  draw: boolean
}

export const WINNING_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const

const MOVE_ORDER = [4, 0, 2, 6, 8, 1, 3, 5, 7]

export function createBoard(): Board {
  return Array<CellValue>(9).fill(null)
}

export function getOutcome(board: Board): GameOutcome | null {
  for (const line of WINNING_LINES) {
    const [first, second, third] = line
    const mark = board[first]

    if (mark && mark === board[second] && mark === board[third]) {
      return { winner: mark, line: [...line], draw: false }
    }
  }

  if (board.every((cell) => cell !== null)) {
    return { winner: null, line: [], draw: true }
  }

  return null
}

function minimax(
  board: Board,
  aiMark: Mark,
  currentMark: Mark,
  depth: number,
  alpha: number,
  beta: number,
): number {
  const outcome = getOutcome(board)

  if (outcome) {
    if (outcome.draw) return 0
    return outcome.winner === aiMark ? 10 - depth : depth - 10
  }

  const isMaximizing = currentMark === aiMark
  let bestScore = isMaximizing ? -Infinity : Infinity

  for (const index of MOVE_ORDER) {
    if (board[index] !== null) continue

    board[index] = currentMark
    const nextMark = currentMark === 'X' ? 'O' : 'X'
    const score = minimax(board, aiMark, nextMark, depth + 1, alpha, beta)
    board[index] = null

    if (isMaximizing) {
      bestScore = Math.max(bestScore, score)
      alpha = Math.max(alpha, bestScore)
    } else {
      bestScore = Math.min(bestScore, score)
      beta = Math.min(beta, bestScore)
    }

    if (beta <= alpha) break
  }

  return bestScore
}

export function bestMove(board: Board, aiMark: Mark): number {
  if (getOutcome(board)) return -1

  let selectedMove = -1
  let bestScore = -Infinity
  const opponent: Mark = aiMark === 'X' ? 'O' : 'X'

  for (const index of MOVE_ORDER) {
    if (board[index] !== null) continue

    board[index] = aiMark
    const score = minimax(board, aiMark, opponent, 1, -Infinity, Infinity)
    board[index] = null

    if (score > bestScore) {
      bestScore = score
      selectedMove = index
    }
  }

  return selectedMove
}