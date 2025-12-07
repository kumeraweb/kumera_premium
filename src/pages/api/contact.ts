import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const resend = new Resend(import.meta.env.RESEND_API_KEY)

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData()

    const nombre = formData.get('nombre')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const tipo = formData.get('tipo')?.toString() || ''
    const mensaje = formData.get('mensaje')?.toString() || ''

    if (!nombre || !email) {
      return new Response(JSON.stringify({ error: 'Missing required fields.' }), { status: 400 })
    }

    // 👉 1. Email a contacto@kumeraweb.com
    await resend.emails.send({
      from: 'Kümera Web <contacto@kumeraweb.com>',
      to: 'contacto@kumeraweb.com',
      subject: `Nuevo contacto de ${nombre}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Nuevo contacto desde el sitio web</h2>
          <p><strong>Nombre:</strong> ${nombre}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Tipo de proyecto:</strong> ${tipo}</p>
          <p><strong>Mensaje:</strong><br>${mensaje}</p>
        </div>
      `
    })

    // 👉 2. Auto-respuesta para el usuario
    await resend.emails.send({
      from: 'Kümera Web <contacto@kumeraweb.com>',
      to: email,
      subject: 'Hemos recibido tu mensaje ✔️',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>¡Gracias por escribirnos, ${nombre}!</h2>
          <p>Tu mensaje llegó correctamente a nuestro equipo.</p>
          <p>Te responderemos en menos de 24 horas.</p>
          <br />
          <p>Un abrazo,<br>Equipo Kümera</p>
          <hr>
          <small style="color: #666;">Sitio Web: kumeraweb.com</small>
        </div>
      `
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error enviando correo:', error)
    return new Response(JSON.stringify({ error: 'Error sending email.' }), { status: 500 })
  }
}
