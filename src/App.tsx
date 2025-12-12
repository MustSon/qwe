import { useState } from "react";
import { useEffect } from "react";
import Tile from "./components/Tile";
import ImageComponent from "./components/ImageComponent";
import noteImage from "./assets/images/music-notes.png";
import arrowImage from "./assets/images/arrowDown.png";
import Splash from "./components/Splash";
import { useGameLogic, TILES_DATA} from "./UseGameLogic";
import { saveHighscore, loadHighscores } from "./supabase"; 

const GAME_NAME = "QWE";
function App() {
interface Highscore {
  name: string;
  score: number;
}


  const [highscores, setHighscores] = useState<Highscore[]>([]);
  const [showHighscores, setShowHighscores] = useState(false);
  const game = useGameLogic();
  const images = Array(9).fill(noteImage);
  const arrowDownImage = arrowImage;

  useEffect(() => {
    document.body.style.backgroundColor = 'rgba(205, 210, 205, 1)';
    
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.border = "";
    };
  }, [game.started]);

  function renderTiles() {
    return TILES_DATA.map((tile, i) => (
      <Tile
        key={i}
        color={tile.color}
        letter={tile.letter}
        active={tile.letter === game.activeLetter || game.activeTile === i}
        started={game.started||game.menuWait}
      />
    ));
  }

  const handleSaveScore = async () => {
    const playerName = prompt("Enter your name:") || "Anonymous";
    await saveHighscore(playerName, game.score);
    const updated = await loadHighscores();
    setHighscores(updated);
  };

    const handleShowHighscores = async () => {
    const updated = await loadHighscores();
    setHighscores(updated);
    setShowHighscores(true);
  };

  const handleCloseHighscores = () => {
    setShowHighscores(false);
  };

 return (
  <div style={{ cursor: "crosshair" }}>

    <div className="squareContainer">
      {renderTiles()}

      {!game.lost && (
        <div className="imageGrid">
          {images.map((img, i) => (
            <ImageComponent key={i} src={img} width={10} heigth={5} />
          ))}
        </div>
      )}

      {game.started && (
        <div className="score bitcount-grid-single-myheader">
          <div>Score: {game.score}</div>
          <div>Combo: {game.combo.toFixed(1)}X</div>
        </div>
      )}
    </div>

    {game.lost && (
      <div className="afterGame bitcount-grid-single-myheader">
        <div>Game Over!!! Score: {game.score}</div>
        <button
          className="restartButton"
          onClick={() => {
            game.restartGame();
            handleCloseHighscores();
          }}
        >
          Restart
        </button>
        <button className="scoreSaveButton" onClick={handleSaveScore}>
          Save Score
        </button>
        <button className="highScoreButton" onClick={handleShowHighscores}>
          Leaderboard
        </button>
      </div>
    )}

    {game.splashEffect && (
      <Splash
        duration={game.splashTime}
        firstPlayInSequence={game.firstNote}
        gameInterval={game.gameInterval}
      />
    )}

    {!game.started && !game.lost && (
      <>
        <div className="bitcount-grid-single-myheader titleFont">
          {GAME_NAME}
        </div>

        <div className="buttonContainer">
          <button
            className="startButton"
            onClick={() => {
              game.startGame();
              handleCloseHighscores();
            }}
          >
            START
          </button>

          <button className="startButton" onClick={handleShowHighscores}>
            Scoreboard
          </button>
        </div>
      </>
    )}

{showHighscores && !game.lost && (
  <div className="arrowContainer myheader-font">
    <ImageComponent src={arrowDownImage} heigth={1} width={3} />
    <div className="Highscores">Highscores</div>

    <ol>
      {highscores.slice(0, 25).map((h, i) => (
        <li key={i}>
          {h.name}: {h.score}
        </li>
      ))}
    </ol>

    <button className="highScoreButton" onClick={handleCloseHighscores}>
      Back
    </button>
  </div>
)}

{showHighscores && game.lost && (
  <div className="arrowContainer arrowContainer-endgame myheader-font">
    <ImageComponent src={arrowDownImage} heigth={1} width={3} />
    <div className="Highscores">Highscores</div>

    <ol>
      {highscores.slice(0, 25).map((h, i) => (
        <li key={i}>
          {h.name}: {h.score}
        </li>
      ))}
    </ol>

    <button className="highScoreButton" onClick={handleCloseHighscores}>
      Back
    </button>
  </div>
)}


  </div>
);


}

export default App;