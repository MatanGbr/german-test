import axios from 'axios';
import { useEffect, useState } from 'react';

export const App = () => {
  const [ testCard, setTestCard ] = useState()
  const [ answeredBank, setAnsweredBank ] = useState([])

  const getData = async () => {
    setTestCard()
    try {
      const res = await axios.get(`https://frontend-interview-api.bioz.com/question_data`, { timeout: 3000 ,   raxConfig: {
        retry: 3,
        retryDelay: 4000
      }
      });
      
      const data = res.data;

      if (!answeredBank.includes(data.german_word)) {
        setTestCard(<Card
          word={data.german_word}
          answers={[ data.correct_translation, ...data.random_translations ].sort(() => Math.random() - 0.5)}
          correct={data.correct_translation}
          getData={getData}
        />);
        setAnsweredBank([ data.german_word, ...answeredBank ])
      }
    }
    catch (error) {
      setTestCard(`Internal Server Error`)
      console.error(error);
    }
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <div className={`app`}>

      {testCard}
    </div>
  );
}

const Card = ({ word, answers, correct, getData }) => {

  const [ complete, setComplete ] = useState();

  const handleChange = (e) => {
      setComplete(e.target.value === correct ? true  : false)

  }

  const renderBackground = () => {
    switch (complete) {
      case true: return `yellowgreen`
      case false: return `crimson`
      default: return `white`
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (complete) {
      getData()
    }
  }

  return (
    <form style={{background: renderBackground()}} onSubmit={handleSubmit} onChange={handleChange} className={`card`}>
      How would you translate     {word}?

      <ul>
        {answers.map((answer, i) => <li key={i}>
          <input type={`radio`} name={word} value={answer} id={`${word}_${answer}`} />
          <label htmlFor={`${word}_${answer}`}>
            <span>{ i+1}</span>  {answer}
          </label>
        </li>)}
        <li>

        </li>
      </ul>
      <button disabled={!complete} type={`submit`}>
        Next
      </button>
    </form>
  )
}
