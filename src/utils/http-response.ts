import type { Context } from 'hono'

interface ApiResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
}

export const HttpResponse = {
  // Sucesso
  s200: <T>(c: Context, data: T, message = 'OK') => 
    c.json<ApiResponse<T>>({ status: 200, message, data }, 200),

  s201: <T>(c: Context, data: T, message = 'Created') => 
    c.json<ApiResponse<T>>({ status: 201, message, data }, 201),

  s204: (c: Context) => c.body(null, 204),

  // Erros de Cliente
  s400: (c: Context, message = 'Bad Request', data?: any) => 
    c.json<ApiResponse>({ status: 400, message, data }, 400),

  s401: (c: Context, message = 'Unauthorized') => 
    c.json<ApiResponse>({ status: 401, message }, 401),

  s403: (c: Context, message = 'Forbidden') => 
    c.json<ApiResponse>({ status: 403, message }, 403),

  s404: (c: Context, message = 'Not Found') => 
    c.json<ApiResponse>({ status: 404, message }, 404),

  // Erro de Servidor
  s500: (c: Context, message = 'Internal Server Error', error?: any) => 
    c.json<ApiResponse>({ status: 500, message, data: error }, 500),
}
