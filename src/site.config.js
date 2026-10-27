/** Dados confirmados pelo briefing. Preencher lacunas somente com confirmação da profissional. */
export const site = {
  name: 'Carol Harder',
  fullName: 'Carol Harder',
  crp: '08/19247',
  whatsapp: '5541988640026', // Formato internacional: somente dígitos, com código de país e DDD.
  instagram: '', // URL HTTPS oficial, depois de confirmada.
  url: 'https://carolharder.com.br', // Domínio confirmado e já utilizado pela profissional.
  // Asset público também incluído na exportação; URL HTTPS funciona no pipeline HTML atual.
  sharingImage: 'https://raw.githubusercontent.com/KyrosMarketing/Carol-Harder/ajustes-pontuais-20261026-5d13776/carol-harder-compartilhamento-v1.png',
  privacyContact: '', // E-mail profissional para questões de privacidade.
  portraits: { hero: '/images/carol-hero-960.webp', about: '/images/carol-about-800.webp' },
  portraitSrcsets: {
    hero: '/images/carol-hero-480.webp 480w, /images/carol-hero-960.webp 960w, /images/carol-hero-1440.webp 1440w',
    about: '/images/carol-about-400.webp 400w, /images/carol-about-800.webp 800w, /images/carol-about-1200.webp 1200w',
  }, // Caminhos locais em public/images. Não usar fotos de banco.
  brandConfirmed: true, // Paleta extraída da página 6 do PDF; Rubik nas aplicações.
  legalReviewed: false,
  privacyReviewed: false,
  whatsappMessage: 'Olá, Carol! Conheci seu site e gostaria de saber mais sobre os atendimentos online e a disponibilidade de horários.',
};
export const whatsappUrl = /^\d{12,15}$/.test(site.whatsapp)
  ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage)}`
  : '';
export const publicationIssues = [
  !site.fullName && 'Nome profissional completo',
  !/^\d{2}\/\d{4,8}$/.test(site.crp) && 'CRP válido e confirmado (região/número)',
  !whatsappUrl && 'WhatsApp profissional com país e DDD',
  !/^https:\/\/[^/]+\/?$/.test(site.url) && 'Domínio HTTPS definitivo',
  !site.privacyContact && 'Contato profissional para privacidade',
  !site.portraits.hero && 'Retrato profissional principal',
  !site.portraits.about && 'Retrato profissional de apresentação',
  !site.brandConfirmed && 'Paleta e tipografia oficiais',
  !site.legalReviewed && 'Revisão das normas vigentes do CFP e da identificação profissional',
  !site.privacyReviewed && 'Revisão da política de privacidade e dos dados da responsável',
].filter(Boolean);
