import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  const { request } = context
  const url = new URL(request.url)

  // Solo protegemos rutas que comienzan con /clientes
  if (!url.pathname.startsWith('/clientes')) {
    return next()
  }

  // Credenciales desde variables de entorno (Vercel)
  const USER = import.meta.env.CLIENTS_USER
  const PASSWORD = import.meta.env.CLIENTS_PASSWORD

  // Header Authorization
  const authHeader = request.headers.get('authorization')

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return new Response('Acceso restringido', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Clientes Kumera"'
      }
    })
  }

  // Decodificamos base64
  const base64Credentials = authHeader.replace('Basic ', '')
  const decoded = atob(base64Credentials)
  const [user, password] = decoded.split(':')

  // Validamos credenciales
  if (user !== USER || password !== PASSWORD) {
    return new Response('Credenciales inválidas', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Clientes Kumera"'
      }
    })
  }

  // Credenciales correctas → continuar
  return next()
})
