# Paraphraser-On-Demand

Uma extensão para [SillyTavern](https://github.com/SillyTavern/SillyTavern) que adiciona um botão ao lado do input do usuário.  
Com um clique, ela reformula a última mensagem escrita, mantendo o mesmo sentido, mas trocando as palavras.

## Instalação
1. No SillyTavern, vá em **Extensions → Install from URL**.
2. Cole este link: https://github.com/ganbuscovick/paraphraser-on-demand
3. Ative a extensão em **Extensions → Manage**.

## Configuração
Por padrão, a extensão chama um endpoint `http://localhost:5000/paraphrase`.  
Você pode trocar esse endpoint no `paraphraser.js` para:
- Uma API local (Oobabooga, LM Studio, etc).
- Um proxy seu que conversa com Gemini/OpenAI.
