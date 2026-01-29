export const contact = {
  email: 'contacto@kumeraweb.com',
  phone: '+56994186218',
  whatsapp: {
    phone: '+56994186218',

    messages: {
      default: 'Hola, me gustaría hablar sobre un proyecto.',
      web: 'Hola, me gustaría cotizar un sitio web.',
      ads: 'Hola, quiero mejorar o iniciar campañas de Google Ads.',
      shopify: 'Hola, quiero cotizar un ecommerce en Shopify.',
      apps: 'Hola, tengo una idea para una app móvil y quiero evaluarla.'
    }
  },
  address: 'Santiago, Chile'
}

export const getWhatsAppUrl = (message: string) => {
  const phoneDigits = contact.whatsapp.phone.replace(/\D/g, '')
  return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
}
