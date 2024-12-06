import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';


const App = () => {
  const [triviaQuestion, setQuestion] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [currentPoints, setCurrentPoints] = useState(0);
  const [blockButton,setBlockButton] = useState(true)


  function combineAllAnswers(incorrectAnswers, correctAnswer) {
    let answers = [correctAnswer, ...incorrectAnswers];
    answers.sort(() => Math.random() - 0.5);
    setAllAnswers(answers);
  }


  async function getTriviaData() {
    setBlockButton(true)
    const resp = await axios.get("https://opentdb.com/api.php?amount=1");
    setQuestion(resp.data.results[0].question);
    combineAllAnswers(resp.data.results[0].incorrect_answers,resp.data.results[0].correct_answer)
    setCorrectAnswer(resp.data.results[0].correct_answer);
  }

  useEffect(() => {
    getTriviaData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBlockButton(false)
    }, 5000);

    return () => clearTimeout(timeoutId);
  }, [triviaQuestion]);

  function verifyAnswer(selectedAnswer) {
    if (selectedAnswer === correctAnswer) {
      getTriviaData();
      setCurrentPoints(currentPoints + 1);
    } else {
      if (currentPoints > 0) {
        setCurrentPoints(currentPoints - 1);
      }
      
    }
  }

  return <div>
    <header>
      <div className='container'>

        <h1>TRIVIA QUIZ</h1>

          <div className='points'>
            Current Points: {currentPoints}
          </div>
          <br />

            <div>

              <div className='question' dangerouslySetInnerHTML={{__html:triviaQuestion}}/>

              <br />

              <div className='buttons'>
                { allAnswers.map((answer, index) =>
                    <div key={index}>
                      <button className='button' key={index} onClick={() => verifyAnswer(answer)} dangerouslySetInnerHTML={{__html:answer}} disabled={blockButton}/>
                    </div>
                  ) }
              </div>

            </div>
          


        </div>
    </header>
  </div>
}

export default App;
