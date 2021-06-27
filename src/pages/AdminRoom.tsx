import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button'
import { Link, useHistory, useParams } from 'react-router-dom'
import '../styles/room.scss'
import { RoomCode } from "../components/RoomCode"
// import { useAuth } from '../hooks/useAuth';
// import { database } from '../services/firebase';
import { Question } from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'
import { database } from '../services/firebase';
import {Toaster} from 'react-hot-toast';
import { showToast } from '../utils/toast';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const { user } = useAuth()
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id
  const { questions, title,authorId } = useRoom(roomId);

  useEffect(() => {
    console.log('USEEEEER: ', user);
    
  },[user])

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
      showToast('success', 'Pergunta excluída com sucesso!');
    }
  }

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })
    history.push(`/`);

  }

  async function handleCheckQuestionAsAnswered(questionId: string) {

    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
    showToast('success', 'Pergunta finalizada!');

  }

  async function handleHighlightQuestion(questionId: string) {
    console.log('id: ', questionId);

    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
    showToast('success', 'Pergunta respondida com sucesso!');
  }
  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            {user?.id === authorId && <Button isOutlined={true} onClick={handleEndRoom}>Encerrar Sala</Button>}
          </div>
        </div>
      </header>
      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {user?.id !== authorId && <p className="message-criador">Para visualizar essa sala, você deve ser o criador dela :) <Link to="/">clique aqui</Link> para retornar ao início</p>}
          {user?.id === authorId && questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered &&
                  (
                    <>
                      <button type="button" onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                        <img src={checkImg} alt="Marcar pergunta como respondida" />
                      </button>
                      <button type="button" onClick={() => handleHighlightQuestion(question.id)}>
                        <img src={answerImg} alt="Dar destaque à pergunta" />
                      </button>
                    </>
                  )
                }
                <button type="button" onClick={() => handleDeleteQuestion(question.id)}>
                  <img src={deleteImg} alt="Remover Pergunta" />
                </button>
              </Question>
            )
          })}
        </div>

      </main>
      <Toaster/>
    </div>
  )
}