import { createContext, useState } from 'react'
import runChat from '../config/gemini'

export const Context = createContext()

const ContextProvider = (props) => {
  const [input, setInput] = useState('') // prompt người dùng nhập
  const [recentPrompt, setRecentPrompt] = useState('') // prompt vừa mới nhập
  const [prevPrompts, setPrevPrompts] = useState([]) // danh sách các prompt đã tạo
  const [showResult, setShowResult] = useState(false) // có hiển thị kết quả hay không
  const [loading, setLoading] = useState(false) // hiệu ứng loading
  const [resultData, setResultData] = useState('') // kết quả gemini trả về

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord)
    }, 75 * index)
  }

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }

  const onSent = async (prompt) => {
    setResultData('')
    setLoading(true)
    setShowResult(true)
    let response

    if (prompt !== undefined) {
      response = await runChat(prompt)
      setRecentPrompt(prompt)
    } else {
      setPrevPrompts((prev) => [...prev, input])
      setRecentPrompt(input)
      response = await runChat(input)
    }

    let responseArray = response.split('**')
    let newResponse = ''

    for (let i = 0; i < responseArray.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        newResponse += responseArray[i]
      } else {
        newResponse += '<b>' + responseArray[i] + '</b>'
      }
    }

    let newResponse2 = newResponse.split('*').join('</br>')
    let newResponseArray = newResponse2.split(' ')

    for (let i = 0; i < newResponseArray.length; i++) {
      const nextWord = newResponseArray[i]
      delayPara(i, nextWord + ' ')
    }

    setLoading(false)
    setInput('')
  }

  const contextValue = {
    input,
    setInput,
    recentPrompt,
    setRecentPrompt,
    prevPrompts,
    showResult,
    loading,
    resultData,
    onSent,
    newChat,
  }

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  )
}

export default ContextProvider
