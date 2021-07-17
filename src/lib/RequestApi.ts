
export interface ComunidadeRequest {
    title: string;
    image_url: string;
    community_slug: string; 
}

const doQueryRequest = (query: string) => {
    
    return fetch('https://graphql.datocms.com/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_DATO_TOKEN_READ}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({query})
    })
    .then(response => response.json())
    .then(response => response.data)
}

const doRequest = (body: any , modelId: string) => {

    const { title, image_url, community_slug } = JSON.parse(body) as ComunidadeRequest;

    let slug = formatSlug(community_slug);
    console.log('slug '+slug)
    const data = {
        "data": {
            "type": "item",
            "attributes": { title, image_url, community_slug: slug },
            "relationships": {
                "item_type": {
                    "data": {
                        "type": "item_type",
                        "id": modelId
                    }
                }
            }
        }
    }

    return fetch('https://site-api.datocms.com/items', {
        method: 'POST',
        headers: {
            'X-Api-Version': '3',
            'Authorization': `Bearer ${process.env.REACT_APP_DATO_TOKEN_WRITE}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => response.data)
}

function formatSlug(community_slug: string) {
    const slugSentence = community_slug.split(' ');
    let slug = '';
    if (slugSentence.length > 1) {
        slug = `${slugSentence[0].toLowerCase()}_${slugSentence[1].toLowerCase()}`;
    } else {
        slug = slugSentence[0].toLowerCase();
    }
    return slug;
}

export { doQueryRequest, doRequest }

