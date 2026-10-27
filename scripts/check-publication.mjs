import { publicationIssues } from '../src/site.config.js';
if (publicationIssues.length) {
  console.error('Publicação pendente:\n' + publicationIssues.map(x => `- ${x}`).join('\n'));
  process.exitCode = 1;
} else console.log('Dados obrigatórios preenchidos. Publicar ainda depende de autorização expressa.');
