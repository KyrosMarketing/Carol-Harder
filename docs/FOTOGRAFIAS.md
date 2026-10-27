# Fotografias profissionais

Fonte: Arquivo.zip enviado pelo usuário, transferido com sucesso em 23/10/2026 (31.962.956 bytes). Quatro JPEGs verticais 3333×5000 px foram inspecionados. Arquivos auxiliares __MACOSX foram ignorados.

| Original | Uso | Critério |
| --- | --- | --- |
| IMG_0900.jpg | Abertura | Olhar para a câmera, expressão acolhedora e blusa verde em harmonia com a paleta |
| IMG_0934.jpg | Apresentação | Retrato sentado, aproximação visual e blusa caramelo |
| IMG_0899.jpg | Reserva, sem uso na página | Alternativa de olhar lateral à foto da abertura |
| IMG_0909.jpg | Reserva, sem uso na página | Alternativa de composição sentada |

A seleção usa duas fotografias para manter a composição editorial leve. Nenhuma face ou característica de aparência foi alterada. Orientação EXIF normalizada e perfil de cor convertido para sRGB quando disponível. Redimensionamento Lanczos e codificação WebP com qualidade 84; sem envio dos originais em alta resolução na página, sem EXIF nas imagens web.

| Arquivo | Dimensões | Bytes |
| --- | --- | --- |
| carol-hero-480.webp | 480×720 | 20158 |
| carol-hero-960.webp | 960×1440 | 68368 |
| carol-hero-1440.webp | 1440×2160 | 161094 |
| carol-about-400.webp | 400×600 | 14540 |
| carol-about-800.webp | 800×1200 | 37984 |
| carol-about-1200.webp | 1200×1800 | 71510 |

Os originais ficam preservados fora do checkout em `/workspace/carol-materials/photos/`; o projeto e o pacote editável incluem as versões web. `srcset` e `sizes` escolhem o recurso adequado à tela e à densidade de pixels. As imagens são inseridas no HTML pelo Vite usando `site.portraits` e `site.portraitSrcsets`, sem esperar JavaScript no navegador. Hero com prioridade alta, apresentação lazy. Enquadramento por CSS `object-fit: cover` e `object-position`, sem cortar os arquivos originais. Na evolução editorial, ambas as fotos têm recorte de exibição retangular: hero aproximadamente quadrado no desktop e mais vertical no mobile, apresentação vertical sem arco ou bordas decorativas. A hero usa `object-position: 50% 12%` para preservar o rosto e as mãos.

As cinco larguras de referência foram inspecionadas com as fotos. A prévia HTML autônoma incorpora todas as variantes como dados embutidos; o build de publicação serve cada arquivo separadamente para carregamento seletivo.
