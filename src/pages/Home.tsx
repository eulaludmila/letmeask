import { useHistory } from 'react-router-dom'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import googleIconImg from '../assets/images/google-icon.svg'
import '../styles/auth.scss'
import {Button} from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { FormEvent, useState } from 'react'
import { database } from '../services/firebase'
import {Toaster} from 'react-hot-toast';
import { showToast } from '../utils/toast'

export function Home(){
  const {user, signInWithGoogle} = useAuth();
  const history = useHistory();
  const [roomCode, setRoomCode] = useState("");

  async function handleCreateRoom(){
    if(!user){
      await signInWithGoogle();
    }
    history.push('/rooms/new');
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    //validar espaços antes e depois da string
    if(roomCode.trim() === ''){
      showToast('error', 'Não colocar espaços na frente e final de frase');
      return;
    }

    //Referencia para um registro de dado no banco de dados (linha, coluna, categoria)
    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if(!roomRef.exists()){
      showToast('error', 'Essa sala não existe');
      return;
    }

    if(roomRef.val().endedAt){
      showToast('error', 'Sala já foi fechada');
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }
  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas"/>
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire suas dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask"/>
          <button className="create-room" onClick={handleCreateRoom}>
          <img src={googleIconImg} alt="Logo do Google"/>
            Crie sua sala com o Google
          </button>
          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input type="text" value={roomCode} placeholder="Digite o código da sala" onChange={event => setRoomCode(event.target.value)}/>
            <Button disabled={roomCode !== '' ? false : true} type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
      <Toaster/>
    </div>
  )
}