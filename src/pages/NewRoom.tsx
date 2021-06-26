import { FormEvent, useState } from 'react'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import {Button} from '../components/Button'
import { Link, useHistory } from 'react-router-dom'
import { database } from '../services/firebase'
import { useAuth } from '../hooks/useAuth'

export function NewRoom(){
  const {user} = useAuth()
  const [newRoom, setNewRoom] = useState('');
  const history = useHistory();

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();

    //validar espaços antes e depois da string
    if(newRoom.trim() === ''){
      return;
    }

    //Referencia para um registro de dado no banco de dados (linha, coluna, categoria)
    const roomRef = database.ref('rooms');

    //criando uma nova sala
    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    });

    history.push(`/rooms/${firebaseRoom.key}`)
    
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
          <h2>Criar sala uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
            type="text" 
            placeholder="Nome da sala"
            value={newRoom}
            onChange={event => setNewRoom(event.target.value)}/>
            <Button type="submit">Criar sala</Button>
          </form>
          <p>Que entrar em uma sala existente: <Link to="/">Clique aqui</Link></p>
        </div>
      </main>
    </div>
  )
}