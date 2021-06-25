import { FormEvent, useState } from 'react'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'
import '../styles/auth.scss'
import {Button} from '../components/Button'
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export function NewRoom(){

  const [newRoom, setNewRoom] = useState('');

  async function handleCreateRoom(event: FormEvent){
    event.preventDefault();
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
          <h2>Criar sala</h2>
          <div className="separator">ou entre em uma sala</div>
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