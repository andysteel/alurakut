import { NextApiRequest, NextApiResponse } from "next";
import { doQueryRequest, doRequest } from "../../src/lib/RequestApi";

const consultarComunidades =  async (request: NextApiRequest, response: NextApiResponse) => {

    if(request.method === 'GET') {
        const comunidades = await doQueryRequest(`
        query {
            allCommunities {
                title
                id
                imageUrl
            }
        }
        `)
        .then(datoResponse => datoResponse.allCommunities);
        response.status(200).json(comunidades);
    }

    if(request.method === 'POST') {

        const comunidade = await doRequest(request.body, '972039')
        .then(datoResponse => datoResponse)
        response.status(200).json(comunidade);
    }
}

export default consultarComunidades