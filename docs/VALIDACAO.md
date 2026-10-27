# Validação da evolução editorial — 23 de outubro de 2026

## Ambiente e execução

Node.js 24.19.0, npm 11.9.0, Vite 8.3.5, Playwright 1.64.1 e Chromium 154. A stack e as dependências foram preservadas. Nenhuma biblioteca nova foi adicionada.

- `npm run build`: concluído, com as duas páginas e os recursos estáticos.
- `npm test`: **11 testes passaram** depois dos ajustes finais.
- Layout, fotos, recursos e axe-core WCAG A/AA e WCAG 2.1 AA em **360, 390, 768, 1024 e 1440 px**: nenhuma violação detectada, nenhum overflow horizontal, erro JavaScript ou resposta de recurso HTTP 4xx/5xx.
- Retrato principal e secundário presentes no HTML inicial; variantes responsivas reais e lazy loading da apresentação verificados.
- Menu mobile, Escape e foco, destinos das âncoras, FAQ por teclado e expansão exclusiva, diálogo de privacidade e preferência de movimento reduzido: passaram.
- **JavaScript desativado**: conteúdo, fotografias, links corretos do WhatsApp, navegação mobile visível, FAQ nativo e página independente de privacidade funcionaram.
- Header sticky de altura constante e estado discreto de rolagem verificados.
- Oito links WhatsApp no HTML (sete na página e um no diálogo): número +55 41 98864-0026 e mensagem do briefing codificada, com noopener/noreferrer. Não foi enviada mensagem nem verificada a titularidade da conta no aplicativo.
- Identificação confirmada preservada: Carol Harder, Psicóloga, CRP 08/19247. Sem alegar anos de experiência clínica a partir de 2012.
- Uma H1 por página, hierarquia semântica, title/description, JSON-LD Person sem avaliações inventadas, favicon e Open Graph básico. Domínio, canonical, imagem social absoluta e sitemap definitivo continuam dependentes da configuração final.
- Nenhuma requisição a fontes, pixels, analytics ou serviços externos durante a navegação de teste. WhatsApp só é acessado quando o link é escolhido.
- As duas prévias HTML exportadas foram verificadas **via HTTP**, incluindo módulos locais embutidos, fotos, fontes, diálogo e link de privacidade sem JavaScript. Sem dependências remotas. A política do Chromium deste ambiente bloqueia `file://`; abertura direta desse protocolo não foi testada aqui.
- Capturas reais desktop e mobile inspecionadas; comparativo gerado a partir do backup real e da captura final. A interface não contém avisos de desenvolvimento ou placeholders.

## Lighthouse — laboratório

Lighthouse 13.5.0, build de produção servido localmente, presets mobile e desktop. Coletas UTC: mobile 2026-10-23T22:26:02.304Z, desktop 2026-10-23T22:26:13.104Z. Relatórios completos HTML e JSON em `artifacts/`.

| Indicador | Mobile | Desktop |
| --- | --- | --- |
| Desempenho | 99/100 | 100/100 |
| Acessibilidade | 100/100 | 100/100 |
| Boas práticas | 100/100 | 100/100 |
| SEO | 66/100 | 66/100 |
| LCP | 2.0 s | 0.5 s |
| CLS | 0.015 | 0.002 |
| TBT | 0 ms | 0 ms |
| FCP | 1.4 s | 0.3 s |

O SEO está reduzido pelo bloqueio intencional à indexação (`noindex, nofollow` e robots Disallow) enquanto faltam os requisitos de publicação. Não foram removidas essas proteções para melhorar a nota. As métricas são desta versão com fotografias reais, em laboratório local, e podem mudar na hospedagem final. TBT não equivale a INP. **INP e métricas de campo não foram medidos.**

## Limites e pendências

- Não se realizou auditoria humana completa de acessibilidade nem ensaio em Safari/Firefox ou dispositivos físicos. O teste automatizado foi executado no Chromium.
- Canva e fontes oficiais CFP/LGPD estavam bloqueados pelo túnel da rede; não se declara revisão das normas vigentes concluída. Não houve repetição de pedidos idênticos sem mudança de configuração.
- `npm run check:publication` continua bloqueando divulgação por domínio ausente, confirmação do canal de direitos LGPD e revisões finais CFP/LGPD. A ausência desses dados fica documentada, sem avisos de desenvolvimento na interface.
- Privacidade informa os recursos efetivamente implementados e o canal profissional existente. Os detalhes específicos da infraestrutura e da retenção precisam ser confirmados com a hospedagem e a profissional antes da publicação.
- Não houve publicação em domínio de produção, mudança do Canva, compra ou integração publicitária.

A versão anterior foi arquivada e validada antes da reformulação. Ver `REFINAMENTO.md` e README.md para manutenção e aprovação final.
