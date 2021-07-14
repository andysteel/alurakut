import Box from '../src/components/Box'
import MainGrid from '../src/components/MainGrid'
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import { FormEvent, useState } from 'react';

export interface ProfileSideBarProps {
  githubUser?: string
}

interface Comunidade {
  title: any
  image: any
}

export default function Home() {

  const [comunidades, setComunidades] = useState<Array<Comunidade>>([
    {title: 'Pinterest', image: 'https://mlabs-s3-blog.s3.amazonaws.com/wp-content/uploads/2020/11/09170042/O_que_%C3%A9_Pinterest_header.png'}
  ]);

  function ProfileSidebar(propriedades: ProfileSideBarProps) {

    return (
      <Box>
        <img src={`https://github.com/${propriedades.githubUser}.png`} style={{ borderRadius: '8px' }} />

        <hr />
        <p>
          <a className="boxLink" href={`https://github.com/${propriedades.githubUser}`}>
            @{propriedades.githubUser}
          </a>
        </p>
        <hr />

        <AlurakutProfileSidebarMenuDefault />
      </Box>
    )
  }

    const pessoasFavoritas = [
      'juunegreiros',
      'omariosouto',
      'peas',
      'rafaballerini',
      'marcobrunodev',
      'felipefialho',
      'andysteel'
    ]

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const dadosDoForm = new FormData(event.target as HTMLFormElement);

    const comunidade = {
      title: dadosDoForm.get('title'),
      image: dadosDoForm.get('image')
    }
    const comunidadesAtualizadas = [...comunidades, comunidade];
    setComunidades(comunidadesAtualizadas);
  }

  return (
    <>
    <AlurakutMenu githubUser={'andysteel'}/>
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
      <ProfileSidebar githubUser={'andysteel'} />
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem Vindo(a)
          </h1>
          <OrkutNostalgicIconSet />
        </Box>
        <Box>
          <h2 className="subTitle">O que você deseja fazer ?</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <input 
                type="text" 
                name="title" 
                id="title"
                placeholder="Qual vai ser o nome da sua comunidade ?"
                aria-label="Qual vai ser o nome da dua comunidade ?" 
              />
            </div>
            <div>
              <input 
                type="text" 
                name="image" 
                id="image"
                placeholder="Coloque uma URL para usarmos de capa ?"
                aria-label="Coloque uma URL para usarmos de capa ?" 
              />
            </div>
            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          Comunidades ({comunidades.length})
        </h2>

        <ul>
          {comunidades.map((itemAtual, index) => {
            if(index <= 5) {
              return (
                <li key={`${itemAtual?.title}${index}`}>
                  <a href={`/users/${itemAtual?.title}`}>
                    <img src={itemAtual?.image} />
                    <span>{itemAtual?.title}</span>
                  </a>
                </li>
              )
            }
          })
          }
        </ul>
      </ProfileRelationsBoxWrapper>
      <ProfileRelationsBoxWrapper>
        <h2 className="smallTitle">
          Pessoas da comunidade ({pessoasFavoritas.length})
        </h2>

        <ul>
          {pessoasFavoritas.map((itemAtual, index) => {
            if(index <= 5) {
              return (
                <li key={`${itemAtual}${index}`}>
                  <a href={`/users/${itemAtual}`}>
                    <img src={`https://github.com/${itemAtual}.png`} />
                    <span>{itemAtual}</span>
                  </a>
                </li>
              )
            }
          })}
        </ul>
      </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
  )
}
