export function createJsonResponse(body: object): Response {
    return new Response(JSON.stringify(body), {
      headers: {
        'content-type': 'application/json',
      },
    });
  }

  export function createJsonResponseWithStatus(body: object, status: number): Response {
    return new Response(JSON.stringify(body), {
      headers: {
        'content-type': 'application/json',
      },
      status: status
    });
  }