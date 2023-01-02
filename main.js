// Slect Elements
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButten = document.querySelector(".submit-button");
let resultsContainers = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

// options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let qCount = questionsObject.length;

      //   Create Bullets + set Questions Count
      createBullets(qCount);

      //   Add Questions Data
      addQuestionData(questionsObject[currentIndex], qCount);
      // start countdown
      countdown(10, qCount);

      //   Click on Submit
      submitButten.onclick = () => {
        // Get right Answer
        let theRightAnswer = questionsObject[currentIndex].right_answer;
        // Increase Index
        currentIndex++;
        // Check The Answer
        checkAnswer(theRightAnswer, qCount);

        // remove previouse question
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        //   Add Questions Data
        addQuestionData(questionsObject[currentIndex], qCount);

        //  Handle Bullet Class
        handleBullets();

        // start countdown
        clearInterval(countdownInterval);
        countdown(10, qCount);

        // Show Results
        showResults(qCount);
      };
    }
  };

  myRequest.open("Get", "html_questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  //   Create Spans
  for (let i = 0; i < num; i++) {
    // Create Bullet
    let theBullet = document.createElement("span");

    // checked if first span
    if (i === 0) {
      theBullet.className = "on";
    }
    // append Bullets to Main Bullet Container

    bulletsSpanContainer.appendChild(theBullet);
  }
}

function addQuestionData(obj, count) {
  if (currentIndex < count) {
    //   Create H2 Title
    let questionsTitle = document.createElement("h2");
    //   Apeend h2 to quiz Area
    quizArea.appendChild(questionsTitle);
    //   Create Question Text
    let questionText = document.createTextNode(obj["title"]);
    //   append Text to h2
    questionsTitle.appendChild(questionText);

    //   Create the Answers
    for (let i = 1; i <= 4; i++) {
      //   Create Main Answer Div
      let mainDiv = document.createElement("div");
      // Create class to main div
      mainDiv.className = "answer";
      // create radio input
      let radioInput = document.createElement("input");
      // add type + name + Id + Data-Attribute
      radioInput.name = "question";
      radioInput.type = "radio";
      radioInput.id = `answer_${i}`;
      radioInput.dataset.answer = obj[`answer_${i}`];

      if (i === 1) {
        radioInput.checked = true;
      }

      // create label
      let theLabel = document.createElement("label");
      // add "FOR" attribute
      theLabel.htmlFor = `answer_${i}`;

      // create label text

      let theLabelText = document.createTextNode(obj[`answer_${i}`]);
      // Add Text to the label
      theLabel.appendChild(theLabelText);
      // Add input + label to main div
      mainDiv.appendChild(radioInput);
      mainDiv.appendChild(theLabel);
      // append all answers to answersArea
      answersArea.appendChild(mainDiv);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("question");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }

  if (rAnswer === theChoosenAnswer) {
    rightAnswers++;
    console.log("good answer");
  }
}

function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfSpans = Array.from(bulletsSpans);
  arrayOfSpans.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButten.remove();
    bullets.remove();
    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good </span> ${rightAnswers} from ${count} `;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect </span> ${rightAnswers} from ${count} `;
    } else {
      theResults = `<span class="bad">Bad </span> ${rightAnswers} from ${count} `;
    }
    resultsContainers.innerHTML = theResults;
    resultsContainers.style.padding = "15px";
    resultsContainers.style.marginTop = "15px";
  }
}

function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitButten.click();
        console.log("finished");
      }
    }, 1000);
  }
}
