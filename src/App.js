import React from "react"
import './App.css';
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import { useState, useEffect } from 'react';

export default function App() {

  const [dice, setDice] = useState(allNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [counter, setCounter] = useState(0)
  const [startTime, setStartTime] = useState(new Date())
  const [timeToWin, setTimeToWin] = useState(0)

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      const endTime = new Date();
      const totalTime = Math.floor((endTime - startTime) / 1000)
      setTimeToWin(totalTime)
    }
    // eslint-disable-next-line
  }, [dice])


  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (!tenzies) {
      setCounter(prevCount => prevCount + 1)
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ?
          die :
          generateNewDie()
      }))
    } else {
      setDice(allNewDice())
      setTenzies(false)
      setCounter(0)
      setTimeToWin(0)
      setStartTime(new Date())
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ?
        { ...die, isHeld: !die.isHeld } :
        die
    }))
  }

  const diceElements = dice.map(die => (
    <Die
      key={die.id}
      value={die.value}
      isHeld={die.isHeld}
      holdDice={() => holdDice(die.id)}
    />
  ))

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same.
        Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      {tenzies && <h3 className="instructions">It took {counter} rolls and {timeToWin} seconds to win!</h3>}
      <button
        className="roll-dice"
        onClick={rollDice}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  )
}
