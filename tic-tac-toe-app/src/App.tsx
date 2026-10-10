import { useEffect, useState } from 'react'
import {
  bestMove,
  createBoard,
  getOutcome,
  type Board,
  type GameOutcome,
  type Mark,
} from './game'
import './App.css'

type FirstPlayer = 'you' | 'ai'

type Scoreboard = {
  human: number
  ai: number
  draws: number
}

function addOutcomeToScore(score: Scoreboard, result: GameOutcome, humanMark: Mark): Scoreboard {
  if (result.draw) return { ...score, draws: score.draws + 1 }
  return result.winner === humanMark
    ? { ...score, human: score.human + 1 }
    : { ...score, ai: score.ai + 1 }
}

function Cell({
  value,
  highlighted,
  lastMove,
  disabled,
  onClick,
  index,
}: {
  value: Mark | null
  highlighted: boolean
  lastMove: boolean
  disabled: boolean
  onClick: () => void
  index: number
}) {
  return (
    <button
      className={`board-cell${value ? ` mark-${value.toLowerCase()}` : ''}${highlighted ? ' winning-cell' : ''}${lastMove ? ' last-move-cell' : ''}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square ${index + 1}${value ? `, ${value}` : ', empty'}`}
    >
      {value && <span className="mark" key={value}>{value}</span>}
    </button>
  )
}

function App() {
  const [humanMark, setHumanMark] = useState<Mark>('X')
  const [firstPlayer, setFirstPlayer] = useState<FirstPlayer>('you')
  const [board, setBoard] = useState<Board>(createBoard)
  const [currentTurn, setCurrentTurn] = useState<Mark | null>('X')
  const [outcome, setOutcome] = useState<GameOutcome | null>(null)
  const [moveCount, setMoveCount] = useState(0)
  const [lastMove, setLastMove] = useState<number | null>(null)
  const [thinking, setThinking] = useState(false)
  const [scoreboard, setScoreboard] = useState<Scoreboard>({ human: 0, ai: 0, draws: 0 })

  const aiMark: Mark = humanMark === 'X' ? 'O' : 'X'

  function startRound(mark = humanMark, starter = firstPlayer) {
    setBoard(createBoard())
    setOutcome(null)
    setMoveCount(0)
    setLastMove(null)
    setThinking(starter === 'ai')
    setCurrentTurn(starter === 'you' ? mark : mark === 'X' ? 'O' : 'X')
  }

  function recordOutcome(result: GameOutcome) {
    setOutcome(result)
    setCurrentTurn(null)
    setScoreboard((score) => addOutcomeToScore(score, result, humanMark))
  }

  function playHumanMove(index: number) {
    if (board[index] !== null || currentTurn !== humanMark || outcome || thinking) return

    const nextBoard = [...board]
    nextBoard[index] = humanMark
    setLastMove(index)
    setBoard(nextBoard)
    setMoveCount((count) => count + 1)

    const result = getOutcome(nextBoard)
    if (result) {
      recordOutcome(result)
    } else {
      setThinking(true)
      setCurrentTurn(aiMark)
    }
  }

  useEffect(() => {
    if (outcome || currentTurn !== aiMark) return

    const timer = window.setTimeout(() => {
      const index = bestMove(board, aiMark)
      if (index < 0) {
        setThinking(false)
        return
      }

      const nextBoard = [...board]
      nextBoard[index] = aiMark
      setLastMove(index)
      setBoard(nextBoard)
      setMoveCount((count) => count + 1)

      const result = getOutcome(nextBoard)
      if (result) {
        setOutcome(result)
        setCurrentTurn(null)
        setScoreboard((score) => addOutcomeToScore(score, result, humanMark))
      } else {
        setCurrentTurn(humanMark)
      }
      setThinking(false)
    }, 420)

    return () => window.clearTimeout(timer)
  }, [aiMark, board, currentTurn, humanMark, outcome])

  const status = outcome
    ? outcome.draw
      ? "It's a tie! Great minds think alike! 😲"
      : outcome.winner === humanMark
        ? 'You outsmarted me! 🎉'
        : 'Bot wins this round! 🤖'
    : thinking
      ? 'Hmm… let me think! 🤔'
      : currentTurn === humanMark
        ? 'Your turn, superstar!'
        : "Bot's turn!"

  const statusCaption = outcome
    ? outcome.draw
      ? 'That was a clever match!'
      : outcome.winner === humanMark
        ? 'You found a brilliant line!'
        : 'Ready to play again?'
    : thinking
      ? 'Picking my next move…'
      : currentTurn === humanMark
        ? 'Pick any open square to start.'
        : 'Finding a clever move!'

  const outcomeMood = outcome
    ? outcome.draw
      ? 'draw'
      : outcome.winner === humanMark
        ? 'player-win'
        : 'bot-win'
    : thinking
      ? 'thinking'
      : 'ready'

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Play Pal home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
          <span>PLAY PAL<span className="brand-period">.</span></span>
        </a>
        <div className="topbar-right">
          <span className="online-indicator"><i /> READY TO PLAY</span>
          <span className="version-label">ROUND 01</span>
        </div>
      </header>

      <div className="page-content" id="home">
        <section className="game-heading" aria-labelledby="page-title">
          <div className="heading-copy">
            <div className="eyebrow"><span>01</span> A LITTLE FRIENDLY COMPETITION</div>
            <h1 id="page-title">Think you can beat me?</h1>
            <p className="heading-subtitle">Come on, give it a try!</p>
          </div>
          <div className="heading-side">
            <div className={`mascot-stage mood-${outcomeMood}`}>
              <div className="mascot-speech">Bet you can't beat me!</div>
              <div className="robot-toy" role="img" aria-label="A friendly little robot mascot">
                <span className="robot-antenna"><i /></span>
                <span className="robot-arm robot-arm-left" />
                <span className="robot-arm robot-arm-right" />
                <span className="robot-head"><i /><i /><b /></span>
                <span className="robot-body"><i /></span>
              </div>
              <span className="toy-token toy-x" aria-hidden="true">X</span>
              <span className="toy-token toy-o" aria-hidden="true">O</span>
            </div>
            <div className="difficulty-badge"><span className="difficulty-icon" aria-hidden="true">✳</span><span><b>Your cheeky little challenger</b><small>OPTIMAL MOVES, BIG SMILES</small></span></div>
          </div>
        </section>

        <section className="play-layout" aria-label="Tic-tac-toe game">
          <div className="arena-panel">
            <div className="arena-topline">
              <div className="player-chip human-chip">
                <span className={`player-symbol symbol-${humanMark.toLowerCase()}`}>{humanMark}</span>
                <span><small>PLAYER 01</small><b>YOU</b></span>
              </div>
              <div className={`round-status mood-${outcomeMood}`} aria-live="polite">
                <span className={`status-dot${thinking ? ' is-thinking' : ''}`} />
                <b>{status}</b>
                <small>{statusCaption}</small>
                {outcomeMood === 'player-win' && (
                  <span className="celebration-stars" aria-hidden="true">
                    <i>✦</i><i>✧</i><i>✦</i><i>✧</i>
                  </span>
                )}
              </div>
              <div className="player-chip ai-chip">
                <span><small>PLAYER 02</small><b>THE BRAINY BOT</b></span>
                <span className={`player-symbol symbol-${aiMark.toLowerCase()}`}>{aiMark}</span>
              </div>
            </div>

            <div className="board-frame">
              <div className="board" role="group" aria-label="Tic-tac-toe board">
                {board.map((value, index) => (
                  <Cell
                    key={index}
                    index={index}
                    value={value}
                    highlighted={outcome?.line.includes(index) ?? false}
                    lastMove={lastMove === index}
                    disabled={Boolean(value) || Boolean(outcome) || thinking || currentTurn !== humanMark}
                    onClick={() => playHumanMove(index)}
                  />
                ))}
              </div>
              <div className="board-coordinates" aria-hidden="true"><span>A</span><span>B</span><span>C</span></div>
            </div>

            <div className="arena-footer">
              <span><i className="pulse-line" /> {thinking ? 'ANALYZING POSITION' : 'LIVE MATCH'}</span>
              <span>MOVE <b>{String(moveCount).padStart(2, '0')}</b><em>/ 09</em></span>
            </div>
          </div>

          <aside className="control-panel" aria-label="Game controls and score">
            <section className="score-section">
              <div className="section-label"><span>01</span> OUR PLAYTIME</div>
              <div className="score-main">
                <div><span className="score-caption">YOUR WINS</span><strong>{String(scoreboard.human).padStart(2, '0')}</strong></div>
                <span className="score-divider">:</span>
                <div className="machine-score"><span className="score-caption">AI WINS</span><strong>{String(scoreboard.ai).padStart(2, '0')}</strong></div>
              </div>
              <div className="draw-row"><span>DRAWS</span><b>{String(scoreboard.draws).padStart(2, '0')}</b></div>
            </section>

            <section className="settings-section">
              <div className="section-label"><span>02</span> PICK YOUR SIDE</div>
              <fieldset className="setting-group">
                <legend>Your symbol</legend>
                <div className="segmented-control">
                  {(['X', 'O'] as const).map((mark) => (
                    <button
                      className={humanMark === mark ? `selected symbol-${mark.toLowerCase()}` : ''}
                      type="button"
                      key={mark}
                      aria-pressed={humanMark === mark}
                      onClick={() => {
                        setHumanMark(mark)
                        startRound(mark)
                      }}
                    >{mark}</button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="setting-group">
                <legend>First move</legend>
                <div className="segmented-control first-move-control">
                  {(['you', 'ai'] as const).map((starter) => (
                    <button
                      className={firstPlayer === starter ? 'selected' : ''}
                      type="button"
                      key={starter}
                      aria-pressed={firstPlayer === starter}
                      onClick={() => {
                        setFirstPlayer(starter)
                        startRound(humanMark, starter)
                      }}
                    >{starter === 'you' ? 'YOU' : 'AI'}</button>
                  ))}
                </div>
              </fieldset>
            </section>

            <div className="action-buttons">
              <button className="restart-button" type="button" onClick={() => startRound()}>
                <span aria-hidden="true">↻</span> Play Again!
              </button>
              <button className="reset-button" type="button" onClick={() => {
                setScoreboard({ human: 0, ai: 0, draws: 0 })
                startRound()
              }}>
                Clear the Scores
              </button>
            </div>

            <div className="engine-note"><span className="engine-glyph">⌘</span><span><b>ALPHA-BETA ENGINE</b><small>Every outcome already mapped.</small></span><i className="engine-state">ACTIVE</i></div>
          </aside>
        </section>

        <footer className="page-footer"><span>BUILT FOR THE LOVE OF THE GAME.</span><span>PLAY SMART. <b>PLAY ANYWAY.</b></span></footer>
      </div>
    </main>
  )
}

export default App
