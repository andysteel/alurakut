import React, { useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';

interface ErrorMessage {
  error?: string
}

export default function LoginScreen({ error }: ErrorMessage) {

    const [githubUser, setGithubUser] = useState<string>('');
    const router = useRouter();

  return (
    <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
          <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
          <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={async (event) => {
              event.preventDefault();
              await fetch('https://alurakut.vercel.app/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ githubUser })
              })
              .then(async response => {
                const resposta = await response.json();
                nookies.set(null, 'USER_TOKEN', resposta.token, { path: '/', maxAge: 86400 * 1})
              })
              router.push('/');
          }}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
          </p>
            <input
                placeholder="Usuário"
                value={githubUser}
                onChange={(event) => setGithubUser(event.target.value)}
            />
            {error && (
              <p style={{color: 'red'}}>{error}</p>
            )}
            <button type="submit">
              Login
            </button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>
                  ENTRAR JÁ
              </strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => { 
  const { auth } = context.query

  if(auth && auth === 'false') {
    return {
      props: {
        error: 'Usuário não possui permissão',
        
      }
    }
  }

  return {
    props: {
      error: null,
      
    }
  }
}

