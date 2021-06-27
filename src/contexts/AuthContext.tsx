import { createContext, ReactNode, useState, useEffect } from "react";
import { auth, firebase } from "../services/firebase";
import { showToast } from "../utils/toast";

type AuthContextType = {
  user: User | undefined,
  signInWithGoogle: () => Promise<void>
}

type User = {
  id: string,
  name: string,
  avatar: string
}

type AuthContextProviderProps = {
  children: ReactNode
}
export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props:AuthContextProviderProps){
  
  const [user, setUser] = useState<User>();

  useEffect(() => {
    //Verificar se o usuário já esteve logado, se já esteve realizará o login
    const unsubscribe = auth.onAuthStateChanged(user => {
      
      if (user) {
        const { displayName, photoURL, uid } = user;
        if (!displayName || !photoURL) {
          showToast('error', 'Informações ausentes da Conta do Google');
          return;
        }
        console.log('USER2: ', user);

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL
        })
      }
    })

    //Obrigação de descadastrar/finalizar o evento listener
    return () => {
      unsubscribe();
    }
  }, []);

  async function signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    //Abrir um popUp na tela
    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      const { displayName, photoURL, uid } = result.user;
      if (!displayName || !photoURL) {
        showToast('error', 'Informações ausentes da Conta do Google');
        return;
      }

      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL
      })
    }

  }
  return(
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  )
}