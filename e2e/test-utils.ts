export function createJsonResponse(body: object): Response {
    return new Response(JSON.stringify(body), {
      headers: {
        'content-type': 'application/json',
      },
    });
  }