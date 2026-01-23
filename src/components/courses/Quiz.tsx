'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, Award, RefreshCw } from 'lucide-react'

interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

interface Props {
  questions: Question[]
  onComplete: (passed: boolean) => void
  passingScore?: number
}

export function Quiz({ questions, onComplete, passingScore = 80 }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correctIndex

  const handleSelect = (index: number) => {
    if (showExplanation) return
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    if (selectedAnswer === question.correctIndex) {
      setScore(score + 1)
    }
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      const finalScore = ((score + (isCorrect ? 0 : 0)) / questions.length) * 100
      setIsComplete(true)
      onComplete(finalScore >= passingScore)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setIsComplete(false)
  }

  const finalPercentage = (score / questions.length) * 100
  const passed = finalPercentage >= passingScore

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 ${
          passed ? 'bg-green-500/20' : 'bg-red-500/20'
        }`}>
          {passed ? (
            <Award className="w-12 h-12 text-green-400" />
          ) : (
            <XCircle className="w-12 h-12 text-red-400" />
          )}
        </div>

        <h2 className="text-3xl font-bold mb-2">
          {passed ? 'Congratulations!' : 'Not Quite...'}
        </h2>

        <p className="text-xl text-white/70 mb-4">
          You scored {score} out of {questions.length}
        </p>

        <div className="w-full max-w-md mx-auto h-4 bg-white/10 rounded-full overflow-hidden mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${finalPercentage}%` }}
            className={`h-full rounded-full ${passed ? 'bg-green-500' : 'bg-red-500'}`}
          />
        </div>

        <p className="text-white/60 mb-8">
          {passed
            ? 'You have passed this quiz and earned credit for the lesson!'
            : `You need ${passingScore}% to pass. Review the material and try again.`}
        </p>

        {!passed && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRetry}
            className="px-6 py-3 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-5 h-5" /> Try Again
          </motion.button>
        )}
      </motion.div>
    )
  }

  return (
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round((currentQuestion / questions.length) * 100)}% complete</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(currentQuestion / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <h2 className="text-2xl font-semibold mb-6">{question.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              let optionClass = 'quiz-option'
              if (showExplanation) {
                if (index === question.correctIndex) {
                  optionClass += ' correct'
                } else if (index === selectedAnswer) {
                  optionClass += ' incorrect'
                }
              } else if (selectedAnswer === index) {
                optionClass += ' selected'
              }

              return (
                <motion.div
                  key={index}
                  whileHover={!showExplanation ? { scale: 1.01 } : {}}
                  whileTap={!showExplanation ? { scale: 0.99 } : {}}
                  onClick={() => handleSelect(index)}
                  className={optionClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                      showExplanation
                        ? index === question.correctIndex
                          ? 'border-green-500 bg-green-500/20'
                          : index === selectedAnswer
                          ? 'border-red-500 bg-red-500/20'
                          : 'border-white/20'
                        : selectedAnswer === index
                        ? 'border-quantum-primary bg-quantum-primary/20'
                        : 'border-white/20'
                    }`}>
                      {showExplanation && index === question.correctIndex && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {showExplanation && index === selectedAnswer && index !== question.correctIndex && (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                      {!showExplanation && (
                        <span className="text-sm text-white/60">
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-xl mb-6 ${
                isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-amber-500/10 border border-amber-500/30'
              }`}
            >
              <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-amber-400'}`}>
                {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
              </p>
              <p className="text-white/70">{question.explanation}</p>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex justify-end">
            {!showExplanation ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="px-6 py-3 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white disabled:opacity-50"
              >
                Check Answer
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-6 py-3 bg-gradient-to-r from-quantum-primary to-quantum-accent rounded-xl font-semibold text-white flex items-center gap-2"
              >
                {currentQuestion < questions.length - 1 ? (
                  <>Next Question <ArrowRight className="w-5 h-5" /></>
                ) : (
                  <>See Results <ArrowRight className="w-5 h-5" /></>
                )}
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
