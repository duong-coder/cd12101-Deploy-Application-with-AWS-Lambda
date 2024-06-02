const HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true
}

export class TodosStatus {
    static OK(data) {
        return {
            statusCode: 200,
            headers: HEADERS,
            body: JSON.stringify({
                ...data
            })
          }
    }

    static CREATED(data) {
        return {
            statusCode: 201,
            headers: HEADERS,
            body: JSON.stringify({
              ...data
            })
        }
    }
}