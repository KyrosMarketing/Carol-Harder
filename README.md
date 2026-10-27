# Carol Harder — psicoterapia online

Landing page editorial em português brasileiro. HTML semântico, CSS responsivo e JavaScript, com Vite para desenvolvimento e geração estática. Fontes hospedadas no próprio site, sem framework, analytics, cookies publicitários ou formulário de saúde.

## Executar

Node.js 22.12+ (validado com 24.19) e npm.

```sh
cd /workspace/Carol-Harder
npm ci --cache /workspace/.npm-cache
npm run dev -- --port 5173
```

Para validar a versão estática:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Para gerar uma prévia em um único HTML, com fontes, logotipos e fotos embutidos:

```sh
npm run export:preview
```

Abra `artifacts/carol-harder-preview.html` em um navegador; o arquivo também pode ser servido por HTTP. Mantenha `carol-harder-privacidade.html` na mesma pasta para o link de privacidade funcionar mesmo sem JavaScript. As capturas desktop/mobile estão em `artifacts/`. O exportador embute também dependências de módulos do build.

`dist/` contém a landing page, a página de privacidade e os recursos que podem ser hospedados em um servidor estático. Não depende de backend. Nenhuma publicação foi realizada.

## Cloudflare Pages

Para uma integração com este repositório Git, use a branch `main` (a branch padrão atual também recebe este código), diretório raiz do projeto vazio, comando de build `npm run build` e diretório de saída `dist`. Configure `NODE_VERSION=24.19.0` no ambiente de build.

O Cloudflare precisa executar o build: o `index.html` da raiz é o código-fonte e usa o Vite para incluir estilos, fontes, fotos e links de contato. Não publique a raiz do repositório como arquivos estáticos. Em um projeto criado por upload direto, envie o conteúdo de `dist/` em uma nova implantação; um push no GitHub só dispara atualizações quando existe uma integração Git configurada.

## Testar

```sh
npm run build
npm test
npm run check:publication
```

Os testes usam Chromium em `/usr/bin/chromium`; em outro computador, forneça `CHROMIUM_PATH` com o caminho do executável instalado. O teste inicia o servidor de preview automaticamente. Capturas são gravadas em `artifacts/`.

`check:publication` **deve falhar** enquanto houver dados pendentes. Não ignora autorização de publicação: a hospedagem final exige aprovação da responsável pelo projeto.

## Conteúdo e manutenção

- `index.html`: conteúdo, seções e perguntas frequentes.
- `src/site.config.js`: nome completo, CRP, WhatsApp, redes, domínio, fotos e confirmações.
- `src/privacy-content.html`: texto compartilhado pelo diálogo e pela página de privacidade.
- `privacidade.html`: alternativa navegável sem JavaScript.
- `src/style.css`: composição, cores, tipografia e responsividade.
- `public/images/`: versões oficiais do logotipo e imagens locais.
- `vite.config.js`: metadados, JSON-LD e robots; gera sitemap somente com dados completos.
- `docs/DIAGNOSTICO.md`: fontes, critérios de design e informações pendentes.
- `docs/REFINAMENTO.md`: decisões da evolução editorial e localização da versão preservada.
- `docs/IDENTIDADE.md`: paleta extraída do PDF, família Rubik e critérios de aplicação.
- `docs/VALIDACAO.md`: resultados medidos e limites da validação.
- `docs/FOTOGRAFIAS.md`: fotos selecionadas, origem e variantes otimizadas.

Use o checkout existente: tarefas na nuvem já são isoladas; não crie worktrees sem solicitação.

### Ativar o WhatsApp

Preencha `whatsapp` com país e DDD, apenas dígitos, após confirmação. Os botões passam a abrir `https://wa.me/` com a mensagem do briefing codificada. Não há número fictício. Na ausência do dado, abre-se um aviso de revisão. Confirme em um celular que a conta de destino é a profissional antes de publicar.

### Fotografias e manutenção

As fotos reais recebidas já estão aplicadas: IMG_0900 na abertura e IMG_0934 na apresentação, com seis variantes WebP. Consulte `docs/FOTOGRAFIAS.md`.

Para substituir uma foto, adicione versões otimizadas em `public/images/`, sem alteração facial. Atualize `portraits.hero` ou `portraits.about` e o `portraitSrcsets` correspondente em `src/site.config.js`. Os retratos atuais mantêm a proporção 2:3: o hero tem variantes de 480, 960 e 1440 px de largura; a apresentação, 400, 800 e 1200 px. As dimensões e `sizes` do HTML ficam em `vite.config.js`. A foto principal entra diretamente no HTML com prioridade alta; a apresentação usa lazy loading.

O recorte de exibição usa `object-fit: cover`; ajuste `object-position` no CSS e repita a revisão desktop/mobile. Após qualquer troca, execute build, testes e `export:preview`, pois a prévia HTML embute as fotografias. Meça o desempenho novamente.

### Antes de hospedar

1. Resolver os itens de `npm run check:publication`, revisar dados e política de privacidade e obter aprovação.
2. Confirmar domínio em `site.url`, identidade visual, retratos, CRP, WhatsApp e contato para direitos LGPD.
3. Revisar a política com a profissional, confirmar o canal de direitos LGPD e completar as informações específicas da hospedagem e retenção; validar normas vigentes do CFP.
4. Marcar as revisões no arquivo de configuração somente depois de concluídas e rodar testes novamente.
5. `npm run build`. Publicar apenas `dist/` na hospedagem autorizada, usando HTTPS e cabeçalhos apropriados.
6. Conferir links, telefone, canonical, robots, sitemap, preview social e desempenho no domínio real.

Enquanto houver pendências, o build mantém `noindex, nofollow` e `robots.txt` com `Disallow: /`. Isso evita indexação acidental, mas não é controle de acesso: use hospedagem privada/autenticada para compartilhar rascunhos confidenciais. Não ative pixels, GA4 ou GTM sem uma proposta de mensuração e análise de privacidade previamente aprovada.
