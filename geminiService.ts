
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorFormData, ContentType, TeacherProfile, CrosswordWord } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (process.env as any).GEMINI_API_KEY || "";
if (!apiKey) console.warn("ALERTA: VITE_GEMINI_API_KEY não configurada!");

const ai = new GoogleGenAI({ apiKey });
const DEFAULT_MODEL = 'gemini-2.5-flash';


export interface BNCCSuggestion {
  code: string;
  description: string;
}

// Helper function to generate an image from a prompt
export async function generateImageFromPrompt(prompt: string): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,

      contents: prompt,
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.warn(`Failed to generate image for prompt: ${prompt}`, error);
    return null;
  }
}

export const getBNCCSuggestions = async (subject: string, gradeLevel: string, topic: string): Promise<BNCCSuggestion[]> => {
  const prompt = `
    Atue como um especialista em BNCC (Base Nacional Comum Curricular).
    Liste 3 a 5 habilidades da BNCC que sejam mais relevantes para:
    - Disciplina: ${subject}
    - Ano/Nível: ${gradeLevel}
    - Tópico: ${topic}
    
    Retorne APENAS um JSON array com objetos contendo 'code' (código da habilidade) e 'description' (descrição).
  `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,

      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING },
              description: { type: Type.STRING }
            },
            required: ['code', 'description']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as BNCCSuggestion[];
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar sugestões BNCC:", error);
    return [];
  }
};

export const getCrosswordSuggestions = async (subject: string, gradeLevel: string, topic: string, count: number): Promise<CrosswordWord[]> => {
  const prompt = `
      Crie uma lista de palavras e dicas para uma cruzadinha educacional.
      - Disciplina: ${subject}
      - Nível: ${gradeLevel}
      - Tema: ${topic}
      - Quantidade: Exatamente ${count} pares de palavras.
  
      Regras:
      1. As palavras devem ser respostas diretas (substantivos, conceitos).
      2. As dicas devem ser claras e adequadas ao nível escolar.
      3. Palavras simples, sem acentos se possível, ou compatíveis com cruzadinhas.
      
      Retorne APENAS um JSON array.
    `;

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,

      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "A palavra da cruzadinha" },
              clue: { type: Type.STRING, description: "A dica para descobrir a palavra" }
            },
            required: ['word', 'clue']
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as CrosswordWord[];
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar sugestões de cruzadinha:", error);
    return [];
  }
};

export const generateEducationalContent = async (formData: GeneratorFormData, teacherProfile?: TeacherProfile): Promise<string> => {
  const { contentType, gradeLevel, subject, topic, duration, bnccFocus, additionalDetails, includeAnswerKey, exerciseTypes, slideTheme, imageStyle, slideCount, classCount, crosswordWords } = formData;

  // Handle Image Generation Separately
  if (contentType === ContentType.IMAGE) {
    const imagePrompt = `Crie uma imagem educacional estilo ${imageStyle || 'realista'} sobre ${topic} para uma aula de ${subject} do nível ${gradeLevel}. ${additionalDetails ? `Detalhes adicionais: ${additionalDetails}` : ''}`;

    try {
      // Using gemini-2.5-flash-image as per guidelines for image generation
      const response = await ai.models.generateContent({
        model: DEFAULT_MODEL,


        contents: imagePrompt,
        config: {
          // Note: responseMimeType is not supported for nano banana models
        }
      });

      // Iterate through parts to find the image
      let imageUrl = '';
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64EncodeString = part.inlineData.data;
            imageUrl = `data:image/png;base64,${base64EncodeString}`;
            break;
          }
        }
      }

      if (imageUrl) {
        return `
## Imagem Gerada: ${topic}

**Estilo:** ${imageStyle}
**Disciplina:** ${subject}

![Imagem Gerada por IA](${imageUrl})

> **Nota:** Esta imagem foi gerada artificialmente para fins ilustrativos.
        `;
      } else {
        return "Não foi possível gerar a imagem. A resposta do modelo não continha dados de imagem válidos.";
      }

    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      throw new Error("Falha na geração da imagem. Tente novamente mais tarde.");
    }
  }

  // Logic to determine exercise instructions (DISABLED FOR SLIDES)
  let exerciseTypesInstructions = '';
  if (contentType !== ContentType.SLIDES && contentType !== ContentType.PDF_QUESTIONS && contentType !== ContentType.CROSSWORD) {
    exerciseTypesInstructions = exerciseTypes && exerciseTypes.length > 0
      ? `\n    - **Tipos de Questões Obrigatórios:** O material DEVE conter EXCLUSIVAMENTE ou MAJORITARIAMENTE os seguintes formatos: ${exerciseTypes.join(', ')}. Certifique-se de incluir seções claras para cada tipo.`
      : '\n    - **Tipos de Questões:** Crie uma variedade didática e equilibrada de questões.';
  } else if (contentType === ContentType.SLIDES) {
    exerciseTypesInstructions = '\n    - **IMPORTANTE:** NÃO inclua exercícios, perguntas, quizzes ou gabaritos. O foco é puramente expositivo e explicativo.';
  }

  const slideThemeInstructions = slideTheme && contentType === ContentType.SLIDES
    ? `\n    - **Tema Visual dos Slides:** O usuário escolheu o tema "${slideTheme}". 
       Adapte a linguagem e a estrutura para este estilo. 
       **IMPORTANTE - IMAGENS:** Para CADA slide de conteúdo (exceto capa e referências), você DEVE incluir uma sugestão de imagem.
       NÃO gere links de imagens (como ![alt](url)).
       Em vez disso, use APENAS este marcador especial onde a imagem deve aparecer:
       [IMAGE_PROMPT: Descrição visual detalhada da imagem, estilo ${imageStyle || 'ilustração digital moderna'}]`
    : '';

  const slideCountInstructions = slideCount && contentType === ContentType.SLIDES
    ? `\n    - **Quantidade de Slides:** Crie EXATAMENTE ${slideCount} slides. Separe cada slide utilizando "---" (três traços) em uma linha isolada.`
    : '';

  // Header Construction based on Teacher Profile
  let headerInstructions = '';
  if (teacherProfile && contentType !== ContentType.SLIDES) {
    headerInstructions = `
    - **CABEÇALHO PERSONALIZADO:** Inicie o documento OBRIGATORIAMENTE com este cabeçalho preenchido:
    
    # ${teacherProfile.school || 'Nome da Escola'}
    **Professor(a):** ${teacherProfile.name || 'Nome do Professor'}
    **Cidade:** ${teacherProfile.city || ''}
    **Disciplina:** ${subject || (contentType === ContentType.PDF_QUESTIONS ? 'A definir' : '')} | **Turma:** ${gradeLevel}
    **Tema:** ${topic || (contentType === ContentType.PDF_QUESTIONS ? 'Análise de Documento' : '')} | **Data:** _____/_____/_____
    
    ---
    `;
  } else if (contentType !== ContentType.SLIDES) {
    headerInstructions = `- Use um cabeçalho escolar padrão no início com espaços em branco (_______) para preencher.`;
  } else if (contentType === ContentType.SLIDES && teacherProfile) {
    headerInstructions = `- No slide de Capa (Identificação), preencha o nome da escola como "${teacherProfile.school}" e o nome do professor como "${teacherProfile.name}".`;
  }

  let prompt = '';
  let contentsPayload: any = '';

  if (contentType === ContentType.PDF_QUESTIONS) {
    // ... Existing PDF Logic ...
    const pdfPrompt = `
      Atue como um especialista em educação brasileira e avaliação.
      
      Tarefa: Analisar o documento PDF fornecido e gerar uma lista de questões avaliativas.
      
      Configurações:
      - Nível de Ensino: ${gradeLevel}
      - Quantidade de Questões: ${formData.pdfQuestionCount || 5}
      - Tipos de Questões: ${formData.pdfQuestionTypes?.join(', ') || 'Variados'}
      ${formData.pdfFocus ? `- Foco Temático/Habilidade Específica: ${formData.pdfFocus}` : ''}
      ${bnccFocus ? `- Foco BNCC: ${bnccFocus}` : ''}
      
      Diretrizes:
      1. ${headerInstructions}
      2. As questões devem ser extraídas DIRETAMENTE do conteúdo do PDF.
      3. Se for "Objetiva", forneça 4 ou 5 alternativas (A, B, C, D, E).
      4. Se for "Discursiva", deixe linhas ou espaço para resposta.
      5. Ao final, inclua OBRIGATORIAMENTE o Gabarito Comentado.
      6. Formate usando Markdown rico.
    `;
    const base64Data = formData.pdfBase64?.split(',')[1];
    if (!base64Data) throw new Error("PDF data not found.");
    contentsPayload = { parts: [{ inlineData: { mimeType: 'application/pdf', data: base64Data } }, { text: pdfPrompt }] };

  } else if (contentType === ContentType.CROSSWORD) {
    // ... New Crossword Logic ...
    const wordsList = crosswordWords?.map((w, i) => `Palavra: ${w.word.toUpperCase()} | Dica: ${w.clue}`).join('\n');

    prompt = `
    Atue como um especialista em passatempos educativos e lógica.
    
    Tarefa: Criar o LAYOUT lógico de uma cruzadinha com as palavras fornecidas.
    
    Palavras de Entrada:
    ${wordsList}
    
    OBJETIVO PRINCIPAL:
    Organize essas palavras em um grid de forma que elas se cruzem corretamente.
    
    FORMATO DE SAÍDA:
    1. Primeiro, forneça um bloco de código JSON (\`\`\`json ... \`\`\`) contendo EXATAMENTE esta estrutura:
       {
         "width": number (largura total do grid),
         "height": number (altura total do grid),
         "words": [
           {
             "number": 1,
             "word": "EXEMPLO",
             "clue": "Texto da dica",
             "x": number (coluna inicial, começando em 0),
             "y": number (linha inicial, começando em 0),
             "direction": "horizontal" | "vertical"
           }
         ]
       }
    
    2. Após o bloco JSON, forneça o conteúdo em Markdown para o professor:
       ${headerInstructions}
       ## Instruções
       [Escreva instruções para o aluno]
       
       ## Dicas
       **Horizontais**
       [Liste as dicas horizontais]
       
       **Verticais**
       [Liste as dicas verticais]
       
       ## Gabarito
       [Liste as palavras]
    `;
    contentsPayload = prompt;

  } else {
    // Standard Prompt
    prompt = `
    Atue como um especialista em educação brasileira, designer instrucional e consultor pedagógico com profundo conhecimento na Base Nacional Comum Curricular (BNCC).
    
    Sua tarefa é criar um(a) **${contentType}** completo(a).
    
    Detalhes da solicitação:
    - **Nível de Ensino:** ${gradeLevel}
    - **Disciplina:** ${subject}
    - **Tópico/Tema:** ${topic}
    - **Duração Estimada:** ${duration}
    ${bnccFocus ? `- **Foco BNCC (Habilidades/Códigos):** ${bnccFocus}` : ''}
    ${additionalDetails ? `- **Detalhes Adicionais/Contexto:** ${additionalDetails}` : ''}
    ${(includeAnswerKey && contentType !== ContentType.SLIDES) ? '- **Incluir Gabarito/Respostas:** Sim, ao final.' : ''}
    ${exerciseTypesInstructions}
    ${slideThemeInstructions}
    ${slideCountInstructions}
    
    Diretrizes de Conteúdo:
    
    1. **Estrutura Geral:**
       ${headerInstructions}
       - Cite explicitamente as habilidades da BNCC trabalhadas. Se o usuário forneceu códigos, use-os. Se não, infira os mais adequados para o ano e tema.
    
    2. **Especificidades por Tipo:**
       - **${ContentType.ACTIVITY}:** Crie exercícios variados ou uma dinâmica de sala de aula. Se houver tipos de questões selecionados, priorize-os.
         - Se "Caça-Palavras" foi selecionado: Gere uma lista de palavras e desenhe um grid de letras simples em texto monoespaçado ou tabela Markdown representando o caça-palavras.
         - Se "Cruzadinha" foi selecionada (como tipo genérico): Crie as dicas e as respostas.
         - Se "Relacionar Colunas": Crie duas colunas claras para associação.
       
       - **${ContentType.EXAM}:** Crie uma prova formal com pontuação sugerida e instruções claras. Respeite os tipos de questões solicitados.
       
       - **${ContentType.SEQUENCE}:** Estruture como um Plano de Aula ou Sequência Didática detalhada.
         - **Quantidade de Aulas:** O planejamento deve cobrir EXATAMENTE ${classCount || 3} aulas.
         - Para cada aula, defina: Objetivos Específicos, Recursos, Desenvolvimento (passo a passo cronometrado) e Avaliação.
         - Inclua uma sugestão de Tarefa de Casa ao final.
       
       - **${ContentType.SLIDES}:** Crie o roteiro para a apresentação.
         - **ESTRUTURA OBRIGATÓRIA DOS SLIDES (nesta ordem):**
           1. **Identificação:** Título do Tema, Disciplina, Ano, e espaço para nome do Professor/Autores.
           2. **Introdução:** Apresentação do tópico, definição do problema ou contexto, e objetivos da aula.
           3. **Desenvolvimento:** O conteúdo principal. Divida isso em vários slides conforme a quantidade solicitada. Use dados, explicações claras, tópicos (bullet points) e imagens.
           4. **Conclusão:** Considerações finais, resumo do que foi aprendido e fechamento.
           5. **Referências:** Fontes consultadas e sugestões de leitura (baseadas na BNCC/MEC).
         - **Formatação:** Use "---" para separar cada slide. Cada slide deve ter um Título (##), Conteúdo em tópicos e o marcador [IMAGE_PROMPT: ...] se for um slide de conteúdo.
       
       - **${ContentType.INTERACTIVE}:** 
         - Se tipos de exercícios específicos foram selecionados (ex: Múltipla Escolha), crie o conteúdo focado neles, formatado para ser usado em fichas ou plataformas digitais.
         - Caso contrário, crie um roteiro para atividade digital (Kahoot/Quizizz) com: Enunciado, Opções, Resposta Correta e Feedback.

    3. **Formatação:**
       - Utilize **Markdown** rico. Use títulos (##), listas, negrito e tabelas se necessário.
       - O tom deve ser encorajador e profissional.

    Gere o conteúdo agora:
  `;
    contentsPayload = prompt;
  }

  try {
    const response = await ai.models.generateContent({
      model: DEFAULT_MODEL,

      contents: contentsPayload,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    let generatedText = response.text || "Não foi possível gerar o conteúdo. Tente novamente.";

    // Post-processing: Replace IMAGE_PROMPT markers
    if (contentType === ContentType.SLIDES && generatedText.includes('[IMAGE_PROMPT:')) {
      const regex = /\[IMAGE_PROMPT:\s*([^\]]+)\]/g;
      const matches = Array.from(generatedText.matchAll(regex));
      const uniquePrompts = [...new Set(matches.map(m => m[1].trim()))];
      const imageMap = new Map<string, string>();

      await Promise.all(uniquePrompts.map(async (promptText) => {
        const imageUrl = await generateImageFromPrompt(promptText);
        if (imageUrl) {
          imageMap.set(promptText, `![${promptText}](${imageUrl})`);
        } else {
          imageMap.set(promptText, `> *[Imagem não disponível: ${promptText}]*`);
        }
      }));

      generatedText = generatedText.replace(regex, (match, promptText) => {
        return imageMap.get(promptText.trim()) || match;
      });
    }

    return generatedText;

  } catch (error: any) {
    console.error("ERRO DETALHADO NA IA:", error);
    // If it's a "model not found" error, maybe log it clearly
    if (error.message?.includes('not found')) {
      console.error(`O modelo ${DEFAULT_MODEL} pode não estar disponível para esta chave.`);
    }
    throw new Error(`Falha na IA (${error.message || 'Erro desconhecido'})`);
  }
};
