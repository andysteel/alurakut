import Box from '../src/components/Box'
import MainGrid from '../src/components/MainGrid'
import { AlurakutMenu, OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AluraKutCommons';
import { FormEvent, useEffect, useState } from 'react';
import ProfileRelationsBox from '../src/components/ProfileRealationsBox';
import { ComunidadeRequest } from '../src/lib/RequestApi';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';

export interface ProfileSideBarProps {
  githubUser?: string
}

interface Comunidade {
  title: string;
  imageUrl: string;
  id?: string;
  slug?: string;
}

interface Seguidor {
  title: string;
  imageUrl: string;
}

interface SeguidorGithub {
  login: string;
  avatar_url: string;
}

export default function Home({ githubUser }: ProfileSideBarProps ) {

  const [comunidades, setComunidades] = useState<Array<Comunidade>>([]);
  const [ seguidores, setSeguidores ] = useState<Seguidor[]>([]);
  const [ pessoasFavoritas, setPessoasFavoritas ] = useState<Seguidor[]>([]);
  const [isButtonDisabled, setIsButtonDisabeld] = useState<boolean>(false);

  useEffect(() => {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(response => response.json())
    .then(response => {
      response.forEach((user: SeguidorGithub ) => { 
        seguidores.push({title: user.login, imageUrl: user.avatar_url})
    
      })
      setSeguidores([...seguidores])
    })

    fetch(`https://api.github.com/users/${githubUser}/following`)
    .then(response => response.json())
    .then(response => {
      response.forEach((user: SeguidorGithub ) => {
        pessoasFavoritas.push({title: user.login, imageUrl: user.avatar_url})
      })
      setPessoasFavoritas([...pessoasFavoritas])
    })

    fetch('/api/comunidades')
    .then(response => response.json())
    .then(datoResponse => setComunidades(datoResponse))
  },[])

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

  const handleSubmit = async (event: FormEvent) => {
    setIsButtonDisabeld(true);
    event.preventDefault();
    const dadosDoForm = new FormData(event.target as HTMLFormElement);

    const comunidade: ComunidadeRequest = {
      "title": dadosDoForm.get('title') as string,
      "image_url": dadosDoForm.get('image') as string,
      "community_slug": dadosDoForm.get('title') as string
    }
    if(comunidade.title.length === 0 || comunidade.image_url.length === 0) {
      alert("Preencha os dois Campos para criar uma comunidade.");
      setIsButtonDisabeld(false);
      return;
    }
    const datoResponse = await fetch('/api/comunidades', {
      method: 'POST',
      body: JSON.stringify(comunidade)
    })
    .then(response => response.json());

    if(datoResponse instanceof Array) {
      let message = ''; 
      datoResponse.forEach(error => {
        const errorCode = error.attributes.code as string;
        const errorField = error.attributes.details.field as string;
        const errorValidation = error.attributes.details.code as string;
        message = `${errorCode} ${errorField} ${errorValidation} \n`
      })
      alert(message);
      setIsButtonDisabeld(false);
      return;
    }

    if(datoResponse) {
      const comunidadeSalva = { 
        id: datoResponse.id, 
        title: datoResponse.attributes.title,
        imageUrl: datoResponse.attributes.image_url,
        slug: datoResponse.attributes.community_slug
      }
      const comunidadesAtualizadas = [...comunidades, comunidadeSalva];
      setComunidades(comunidadesAtualizadas);
      (document.querySelector('#title') as HTMLInputElement).value = "";
      (document.querySelector('#image') as HTMLInputElement).value = "";
    } else {
      alert("Erro ao tentar salvar a comunidade.")
    }
    setIsButtonDisabeld(false);
  }

  return (
    <>
    <AlurakutMenu githubUser={githubUser}/>
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
      <ProfileSidebar githubUser={githubUser} />
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
            <button disabled={isButtonDisabled}>
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBox titulo="Seguidores" items={seguidores}></ProfileRelationsBox>
        <ProfileRelationsBox titulo="Comunidades" items={comunidades}></ProfileRelationsBox>
        <ProfileRelationsBox titulo="Pessoas da comunidade" items={pessoasFavoritas}></ProfileRelationsBox>  
      </div>
    </MainGrid>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {

  const token = nookies.get(context).USER_TOKEN;

  const { isAuthenticated } = await fetch(`${process.env.REACT_APP_URL_AUTH}/api/auth`, {
    headers: {
      Authorization: token
    },
    method: 'POST'
  })
  .then(response => response.json());

  if(!isAuthenticated) {

    nookies.destroy(context,'USER_TOKEN');

    return {
      redirect: {
        destination: '/login?auth=false',
        permanent: false,
      },
    }
  }

  const { githubUser } = JSON.parse(JSON.stringify(jwt.decode(token) as string));
  return {
    props: {
      githubUser
    },
  };
};
