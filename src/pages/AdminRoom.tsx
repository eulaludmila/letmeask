import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button'
import { useHistory, useParams } from 'react-router-dom'
import '../styles/room.scss'
import { RoomCode } from "../components/RoomCode"
// import { useAuth } from '../hooks/useAuth';
// import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import deleImg from '../assets/images/delete.svg'
import { database } from '../services/firebase';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth()
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id
  const { questions, title } = useRoom(roomId);

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm('Tem certeza que deseja excluir essa pergunta?')){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleEndRoom(){
    database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push(`/`);
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined={true} onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleImg} alt="Excluir"/>
                </button>
              </Question>
            )
          })}
        </div>

      </main>
    </div>
  )
}