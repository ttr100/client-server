const express = require('express')

const app = express()
app.use(express.urlencoded({ extended: true }));
const port = 3000

let highScores = [];

function renderIndex(req, res){
  res.send(`
<html>
  <head>
    <title>Client-Server JS</title>
  </head>
  <body>
    <div id="wordToGuess"></div>
    <div id="score"></div>
    <div id="highScoreForm" style="display: none;">
      <p id="message"></p>
      <form action="/scores" method="POST">
        <input type="hidden" name="score" id="scoreInput"/>
        <input type="text" name="playerName"/>
        <button type="submit">Submit</button>
      </form>
    </div>
    <script>
      const elWordToGuess = document.getElementById('wordToGuess')
      const elScore = document.getElementById('score')
      const elHighScoreForm = document.getElementById('highScoreForm')
      const elScoreInput = document.getElementById('scoreInput')
      const elMessage = document.getElementById('message')

      let correctGuess = [];
      let wordToGuess = ''
      let score = 100

      function startGame(word){
        score = 100;
        correctGuess = [];
        wordToGuess = word
        renderWord()
      }

      function renderWord(){
        let wordToDisplay = ''
        let hasUnguessedLetter = false;

        for(let i=0;i<wordToGuess.length;i++){
          if(correctGuess.includes(wordToGuess[i])){
              wordToDisplay += wordToGuess[i];
          }
          else{
              hasUnguessedLetter = true;
              wordToDisplay += '_'
          }
        }

        elWordToGuess.innerHTML = wordToDisplay
        elScore.innerHTML = score

        if( !hasUnguessedLetter ){

            document.removeEventListener('keyup', onKeyPress)
            elMessage.innerText = \`You won! Your score is \${score}\`
            elScoreInput.value = score
            elHighScoreForm.style.display = 'block';
                // OK, win.
        }
        else if(score <= 0){
            startGame('TRUCK')
                // game over
        }
      }

      function onKeyPress(e){
        if( wordToGuess.includes(e.key.toUpperCase()) ){
          correctGuess.push(e.key.toUpperCase())
        }else{
          score -= 20;
        }
        renderWord()
      }

      document.addEventListener('keyup', onKeyPress)

      startGame('HOUSE')
    </script>
  </body>
</html>
  `)
}

function recordHighScore(req, res){
  // <input type="hidden" name="score" id="scoreInput"/>
  // <input type="text" name="playerName"/>
  let scoreRecord = {
    playerName: req.body.playerName,
    score: parseInt(req.body.score)
  }
  highScores.push(scoreRecord)
  res.redirect('/scores')
}

function displayHighScores(req, res){
  let scoreRows = ''
  for(let i=0;i<highScores.length;i++){
    scoreRows += `
      <tr>
        <td>${highScores[i].playerName}</td>
        <td>${highScores[i].score}</td>
      </tr>
    `
  }

  res.send(`
<html>
  <head>
    <title>Client-Server JS</title>
  </head>
  <body>
    <table>
      <thead>
        <th>Player Name</th>
        <th>Score</th>
      </thead>
      <tbody>
        ${scoreRows}
      </tbody>
      <a href="/">Play again</a>
    </table>
  </body>
</html>
`)
}


app.get('/', renderIndex)
app.post('/scores', recordHighScore)
app.get('/scores', displayHighScores)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
