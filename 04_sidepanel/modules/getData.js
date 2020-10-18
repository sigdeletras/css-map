const url = './data/cities.json'

export default function getData() {
    return fetch(url)
        .then(res => res.json())
        .then(response => {
            const data = response
            return data
        });

}

// https://es.stackoverflow.com/questions/154353/almacenar-valores-en-array-desde-fetch

