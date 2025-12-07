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

    // 👉 2. Auto-respuesta para el usuario (template premium con CTA y footer)
    await resend.emails.send({
      from: 'Kümera Web <contacto@kumeraweb.com>',
      to: email,
      subject: 'Hemos recibido tu mensaje ✔️',
      html: `
  <div style="
    background: #f5f7fa;
    padding: 40px 0;
    font-family: 'Segoe UI', sans-serif;
  ">
    <div style="
      max-width: 540px;
      margin: 0 auto;
      background: #ffffff;
      padding: 32px;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      text-align: center;
    ">
      
      <!-- LOGO -->
      <img 
        src="https://kumeraweb.com/logo.png"
        alt="Kümera Logo"
        style="
          width: 90px;
          height: 90px;
          border-radius: 50%;
          margin-bottom: 20px;
        "
      />

      <!-- TITULO -->
      <h2 style="margin: 0; font-size: 26px; font-weight: 600; color: #0f172a;">
        ¡Gracias por escribirnos, ${nombre}!
      </h2>

      <!-- TEXTO PRINCIPAL -->
      <p style="
        font-size: 16px;
        line-height: 1.7;
        color: #475569;
        margin: 16px 0 28px;
      ">
        Tu mensaje llegó correctamente a nuestro equipo.  
        Te responderemos dentro de las próximas <strong>24 horas</strong>.
      </p>

      <!-- CTA BUTTON -->
      <a 
        href="https://kumeraweb.com"
        style="
          display: inline-block;
          padding: 14px 28px;
          background: #2563eb;
          color: white;
          border-radius: 8px;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
          margin-bottom: 32px;
        "
      >
        Visitar nuestro sitio
      </a>

      <!-- FIRMA -->
      <p style="
        font-size: 15px;
        color: #0f172a;
        margin-top: 0;
      ">
        Un abrazo,<br>
        <strong>Equipo Kümera</strong>
      </p>

      <hr style="margin: 30px 0; border: 0; border-top: 1px solid #e2e8f0;" />

      <!-- FOOTER CORPORATIVO -->
      <div style="font-size: 13px; color: #64748b;">
        <p style="margin: 4px 0;"><strong>Kümera Servicios Digitales</strong></p>
        <p style="margin: 4px 0;">Santiago, Chile</p>
        <p style="margin: 4px 0;">
          Sitio Web: <a href="https://kumeraweb.com" style="color: #2563eb; text-decoration: none;">kumeraweb.com</a>
        </p>
        <p style="margin: 4px 0;">© ${new Date().getFullYear()} Kümera. Todos los derechos reservados.</p>
      </div>

    </div>
  </div>
  `
    })

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (error) {
    console.error('Error enviando correo:', error)
    return new Response(JSON.stringify({ error: 'Error sending email.' }), { status: 500 })
  }
}
