import { AppProps } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { AlurakutStyles } from '../src/lib/AluraKutCommons';

const GlobalStyles = createGlobalStyle`
    
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: sans-serif;
        background-color: #D9E6f6;
        /* background-image: url('/assets/images/social_wallpaper.jpg'); */
    }

    #__next {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }

    img {
        max-width: 100%;
        height: auto;
        display: block;
    }

    ${AlurakutStyles}
`

const theme = {
    colors: {
        primary: 'red',
    }
}

function App({ Component, pageProps }: AppProps) {
    return (
    <>
        <Head>
        <title>Alurakut</title>
            <meta
            name="description"
            content="Projeto criado durante a imersão react da alura."
            />
        </Head>
        <GlobalStyles />
        <ThemeProvider theme={theme}>
            <Component {...pageProps} />
        </ThemeProvider>
    </>
    )
}

export default App;