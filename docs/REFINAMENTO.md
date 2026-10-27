# Evolução editorial — 23 de outubro de 2026

## Direção e preservação

O pedido de transformação foi aplicado ao projeto existente, mantendo Vite, HTML semântico, CSS e JavaScript, a Rubik local, os cinco tons do manual, os logotipos Carol Harder, as seis variantes fotográficas WebP, o WhatsApp confirmado e as oito seções da jornada. Não houve troca de framework, nova biblioteca, geração de retratos ou alteração facial.

A versão anterior está preservada e o ZIP foi validado: `/workspace/backups/carol-harder-antes-refinamento-editorial-20261023.zip`. Os originais fotográficos continuam em `/workspace/carol-materials/photos/`. Os prints anteriores publicados permanecem recuperáveis pelo commit `b920ef0060eec1500eb594b927d258378c141779`; esse commit contém somente a imagem antiga, não os fontes da aplicação.

## Composição final

| Área | Evolução |
| --- | --- |
| Hero | Masthead tipográfico acima da fotografia, deslocado na grade de 12 colunas. Retrato retangular amplo à esquerda e introdução recuada à direita. A frase foi preservada. Arco, cartão inclinado, selo e índices decorativos eliminados. |
| Apresentação | Título, coluna de formação/credenciais, texto e retrato possuem alinhamentos próprios. Formação concluída em 2012 evidenciada sem converter em tempo de experiência. |
| Acolhimento | Sálvia preservado; título em escala ampla e apoio abaixo da divisória criam uma pausa no ritmo da página. |
| TCC | Sigla vinculada ao nome e à explicação; lista de definições distingue pensamentos, emoções e comportamentos, contextualizando suas relações. Não apresenta uma sequência causal rígida. |
| Atendimento | Sequência ordenada de três linhas, com números, títulos e descrições alinhados. Sem setas em elementos não clicáveis. |
| FAQ | Disclosure nativo exclusivo, área de toque ampla, plus/minus em CSS, foco e animação progressiva onde suportada. Funciona por teclado e sem JavaScript. |
| Encerramento | Fundo oliva e conceito preservados, hierarquia ampliada e CTA creme com contraste. Ornamento de fundo removido. |
| Header/footer | Cabeçalho sticky de altura constante, logo discretamente compacto ao rolar, menu mobile e rodapé com registro e telefone confirmados. Sem avisos de desenvolvimento na interface. |

## Sistema visual

Container máximo 1360 px; grade editorial de 12 colunas; Rubik 300/400/500; hero desktop até 84 px; títulos de seção de aproximadamente 40–58 px; texto corrido de 16–17 px, entrelinha 1,65–1,75. Rótulos e legendas são usados apenas em funções identificáveis. Os tokens oficiais permanecem em `src/style.css`.

O mobile foi reorganizado: título, síntese e CTA antecedem o retrato retangular; a expressão “mais cuidado” não se divide em duas linhas. Credenciais e segundo retrato compartilham uma faixa, com a leitura biográfica em largura completa abaixo. Etapas em linhas, FAQ amplo e CTA final têm regras próprias para telas estreitas.

## Interação e implementação

- Feedback de cor e deslocamento mínimo das setas apenas em links reais.
- Header sticky com altura constante, scroll passivo e requestAnimationFrame.
- Navegação mobile por teclado, Escape, fechamento ao navegar/clicar fora e foco no destino.
- FAQ nativo e animação de altura como melhoria progressiva; `prefers-reduced-motion` desativa movimentos.
- Imagens presentes no HTML inicial com srcset/sizes, hero prioritário e apresentação lazy; originais não retocados.
- WhatsApp inserido no build, sem depender de JavaScript no navegador.
- Privacidade em diálogo como melhoria progressiva e também em `/privacidade.html`; o conteúdo é compartilhado em `src/privacy-content.html`.
- Prévia exportada inclui fontes, imagens e dependências de módulos como dados locais; ambos os HTMLs devem permanecer juntos para a navegação de privacidade sem JavaScript.

## Revisão e limites

Prints reais nas larguras 360, 390, 768, 1024 e 1440 px. Inspeção desktop, mobile, tablet, apresentação e comparação com a versão anterior. Em seguida foram corrigidos o corte de linha de “mais cuidado” no mobile e a posição mais alta do CTA desktop. Os testes foram repetidos depois desses ajustes.

Resultados e métricas atuais em `VALIDACAO.md`. O site não foi implantado em domínio de produção e o Canva não foi alterado. Arquivos de revisão para download não equivalem à publicação do site. Domínio, infraestrutura de hospedagem, confirmação do canal de direitos LGPD e revisão final CFP/LGPD continuam necessários antes da divulgação. Não se declara conformidade normativa integral ou métricas de campo medidas.
