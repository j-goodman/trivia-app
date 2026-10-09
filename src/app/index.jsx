import { useState } from 'react';
import { Button, Platform, ScrollView, StyleSheet, Text, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { BottomTabInset } from '@/constants/theme'

export default function HomeScreen() {
  const [apiKey, setApiKey] = useState('')
  const [category, setCategory] = useState('')
  const [question, setQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [message, setMessage] = useState('')
  const [answer, setAnswer] = useState('')

  async function getQuestion() {
    if (!apiKey || !category) {
      setMessage("Enter a groq API key and a category.")
      return
    }
    setMessage("")
    setAnswer("")

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-20b',
          response_format: {type: 'json_object'},
          messages: [
            {role: 'system', content: 'Create one medium difficulty trivia question about the category. Return JSON with two strings: "question" and "correct_answer". Use a short, unambiguous answer. Do not include any additional text besides the JSON object.'},
            {role: 'user', content: `Category: ${category}`}
          ]
        })
      })
      const responseData = await response.json()
      console.log("Response received")
      console.log(responseData)
      const data = JSON.parse(responseData.choices[0].message.content)
      console.log(data.question)
      console.log(data.correct_answer)
      setQuestion(data.question)
      setCorrectAnswer(data.correct_answer)
    } catch (error) {
      setMessage(`There was an error: ${error.message}`)
    }
  }
  function checkAnswer() {
    if (answer === correctAnswer) {
      setMessage("That's correct!")
    } else {
      setMessage("That's not correct!")
    }
  }

  return (
    <div className="trivia-game-container">
      <h4>API key:</h4>
      <TextInput
        value={apiKey}
        onChangeText={setApiKey}
        />
      <h4>Category:</h4>
      <TextInput
        className="text-input"
        value={category}
        onChangeText={setCategory}
      />
      <h2>{message}</h2>
      <Button
        title="Get question"
        onPress={getQuestion}
      />
      <div>
        <h3>{question}</h3>
        <TextInput
          className="text-input"
          value={answer}
          onChangeText={setAnswer}
        />
        <Button
          title="Check answer"
          onPress={checkAnswer}
        />
      </div>
    </div>
  )
}