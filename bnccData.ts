import { GradeLevel, Subject } from './types';

export interface BNCCSkill {
  code: string;
  description: string;
  subject: Subject;
  gradeLevel: GradeLevel[];
}

/**
 * Base de dados da BNCC.
 * Expansão para incluir cobertura completa de habilidades fundamentais.
 */
export const BNCC_SKILLS: BNCCSkill[] = [
  // ==================================================================================
  // GEOGRAFIA - 6º ANO (Lista Completa Solicitada)
  // ==================================================================================
  { code: 'EF06GE01', description: 'Comparar modificações das paisagens nos lugares de vivência e os usos desses lugares em diferentes tempos.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE02', description: 'Analisar modificações de paisagens por diferentes tipos de sociedade, com destaque para os povos originários.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE03', description: 'Descrever os movimentos do planeta e sua relação com a circulação geral da atmosfera, o tempo atmosférico e os padrões climáticos.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE04', description: 'Descrever o ciclo da água, comparando o escoamento superficial no ambiente urbano e rural, reconhecendo os principais componentes da morfologia das bacias e das redes hidrográficas.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE05', description: 'Relacionar padrões climáticos, tipos de solo, relevo e formações vegetais.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE06', description: 'Identificar as características das paisagens transformadas pelo trabalho humano a partir do desenvolvimento da agropecuária e do processo de industrialização.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE07', description: 'Explicar as mudanças na interação humana com a natureza a partir do surgimento das cidades.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE08', description: 'Medir distâncias na superfície pelas escalas gráficas e numéricas dos mapas.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE09', description: 'Elaborar modelos tridimensionais, blocos-diagramas e perfis topográficos e de vegetação, visando à representação de elementos e estruturas da superfície terrestre.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE10', description: 'Explicar as diferentes formas de uso do solo (rotação de terras, terraceamento, aterros etc.) e de apropriação dos recursos hídricos, bem como suas vantagens e desvantagens.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE11', description: 'Analisar distintas interações das sociedades com a natureza, com base na distribuição dos componentes físico-naturais, incluindo as transformações da biodiversidade local e do mundo.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE12', description: 'Identificar o consumo dos recursos hídricos e o uso das principais bacias hidrográficas no Brasil e no mundo, enfatizando as transformações nos ambientes urbanos.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06GE13', description: 'Analisar consequências, vantagens e desvantagens das práticas humanas na dinâmica climática (ilha de calor etc.).', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_6] },

  // ==================================================================================
  // GEOGRAFIA - OUTROS ANOS
  // ==================================================================================
  // 7º Ano
  { code: 'EF07GE01', description: 'Avaliar, por meio de exemplos extraídos dos meios de comunicação, o papel das redes de transporte e comunicação na configuração do território brasileiro.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE02', description: 'Analisar a influência dos fluxos econômicos e populacionais na formação socioeconômica e territorial do Brasil.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE03', description: 'Selecionar argumentos que reconheçam as territorialidades dos povos indígenas originários, das comunidades remanescentes de quilombos, de povos das florestas e do cerrado.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE04', description: 'Avaliar o papel da cafeicultura, da industrialização e do agronegócio na produção do espaço geográfico brasileiro.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE05', description: 'Analisar fatos e situações representativas das alterações ocorridas entre o período mercantilista e o advento do capitalismo.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE06', description: 'Discutir em que medida a produção, a circulação e o consumo de mercadorias provocam impactos ambientais, sociais e culturais no Brasil.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE07', description: 'Analisar a influência e o papel das redes de transporte e comunicação na configuração do território brasileiro.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE08', description: 'Estabelecer relações entre os processos de industrialização e inovação tecnológica com as transformações socioeconômicas do território brasileiro.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE09', description: 'Interpretar e elaborar mapas temáticos e históricos, inclusive utilizando tecnologias digitais, com informações demográficas e econômicas do Brasil.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07GE10', description: 'Elaborar e interpretar gráficos de barras, gráficos de setores e histogramas, com base em dados socioeconômicos das regiões brasileiras.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_7] },
  // 8º Ano
  { code: 'EF08GE01', description: 'Descrever as rotas de dispersão da população humana pelo planeta e os principais fluxos migratórios em diferentes períodos da história.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF08GE02', description: 'Relacionar fatos e situações representativas da história das Américas à divisão do mundo em Ocidente e Oriente.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF08GE03', description: 'Analisar o papel dos organismos internacionais (ONU, OMC, OIT, etc.) no contexto mundial.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF08GE04', description: 'Compreender os fluxos de migração na América Latina (movimentos voluntários e forçados).', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF08GE05', description: 'Aplicar os conceitos de Estado, nação, território, governo e país para o entendimento de conflitos e tensões.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF08GE19', description: 'Interpretar cartogramas, mapas esquemáticos (croquis) e anamorfoses geográficas com informações geográficas acerca da África e América.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_8] },
  // 9º Ano
  { code: 'EF09GE01', description: 'Analisar criticamente de que forma a hegemonia europeia foi exercida em várias regiões do planeta.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09GE02', description: 'Analisar a atuação das corporações internacionais e das organizações econômicas mundiais.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09GE03', description: 'Identificar diferentes manifestações culturais de minorias étnicas como forma de compreensão da multiplicidade cultural.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09GE04', description: 'Relacionar diferenças de paisagens aos modos de viver de diferentes povos na Europa, Ásia e Oceania.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09GE05', description: 'Analisar fatos e situações para compreender a integração mundial (econômica, política e cultural).', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09GE10', description: 'Analisar os impactos do processo de industrialização na produção e circulação de produtos e culturas na Europa, Ásia e Oceania.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09GE14', description: 'Elaborar e interpretar gráficos de barras e de setores, mapas temáticos e esquemáticos (croquis) e anamorfoses.', subject: Subject.GEOGRAPHY, gradeLevel: [GradeLevel.EFII_9] },

  // ==================================================================================
  // HISTÓRIA (EFII)
  // ==================================================================================
  // 6º Ano
  { code: 'EF06HI01', description: 'Identificar diferentes formas de compreensão da noção de tempo e de periodização dos processos históricos.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI02', description: 'Identificar a gênese da produção do saber histórico e analisar o significado das fontes que originaram determinadas formas de registro.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI03', description: 'Identificar as hipóteses científicas sobre o surgimento da espécie humana e sua historicidade.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI04', description: 'Conhecer as teorias sobre a origem do homem americano.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI05', description: 'Descrever modificações da natureza e da paisagem realizadas por diferentes tipos de sociedade.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI06', description: 'Identificar geográfica e historicamente as primeiras cidades, discutindo o papel da agricultura e da escrita.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI07', description: 'Identificar aspectos e formas de registro das sociedades antigas na África, no Oriente Médio e nas Américas.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI08', description: 'Identificar os espaços territoriais ocupados e os aportes culturais dos astecas, maias e incas e dos povos indígenas brasileiros.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06HI09', description: 'Discutir o conceito de Antiguidade Clássica, seu alcance e limite na tradição ocidental.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_6] },
  // 7º Ano
  { code: 'EF07HI01', description: 'Explicar o significado de modernidade e suas lógicas de inclusão e exclusão.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07HI02', description: 'Identificar conexões e interações entre as sociedades do Novo Mundo, da Europa, da África e da Ásia.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07HI03', description: 'Identificar aspectos e processos específicos das sociedades africanas e americanas antes da chegada dos europeus.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07HI17', description: 'Discutir as razões da passagem do mercantilismo para o capitalismo.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_7] },
  // 8º Ano
  { code: 'EF08HI01', description: 'Identificar os principais aspectos conceituais do iluminismo e do liberalismo.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF08HI03', description: 'Analisar os impactos da Revolução Industrial na produção e circulação de povos, produtos e culturas.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF08HI04', description: 'Identificar e analisar os processos da Independência em diferentes países latino-americanos.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_8] },
  // 9º Ano
  { code: 'EF09HI01', description: 'Descrever e contextualizar os principais aspectos sociais, culturais, econômicos e políticos da emergência da República no Brasil.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09HI02', description: 'Caracterizar e compreender os ciclos da história republicana brasileira.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09HI10', description: 'Identificar e relacionar as dinâmicas do capitalismo e suas crises, os grandes conflitos mundiais e os conflitos na Europa.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EFII_9] },

  // ==================================================================================
  // CIÊNCIAS (EFII)
  // ==================================================================================
  // 6º Ano
  { code: 'EF06CI01', description: 'Classificar como homogênea ou heterogênea a mistura de dois ou mais materiais.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI02', description: 'Identificar evidências de transformações químicas a partir do resultado de misturas de materiais.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI03', description: 'Selecionar métodos mais adequados para a separação de diferentes sistemas heterogêneos.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI04', description: 'Associar a produção de medicamentos e outros materiais sintéticos ao desenvolvimento científico e tecnológico.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI05', description: 'Explicar a organização básica das células e seu papel como unidade estrutural e funcional dos seres vivos.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI06', description: 'Concluir que os organismos são um complexo sistema de sistemas (digestório, respiratório, circulatório, etc.).', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI07', description: 'Justificar o papel do sistema nervoso na coordenação das ações motoras e sensoriais.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI08', description: 'Explicar a importância da visão e das lentes corretivas.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI09', description: 'Deduzir que a estrutura, sustentação e movimentação dos animais resultam da interação entre sistemas muscular, ósseo e nervoso.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI10', description: 'Explicar como o funcionamento do sistema nervoso pode ser afetado por substâncias psicoativas.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI11', description: 'Identificar as diferentes camadas que estruturam o planeta Terra (da estrutura interna à atmosfera).', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI12', description: 'Identificar diferentes tipos de rocha, relacionando a formação de fósseis a rochas sedimentares.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI13', description: 'Selecionar argumentos e evidências que demonstrem a esfericidade da Terra.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06CI14', description: 'Inferir que as mudanças na sombra de uma vara (gnômon) ao longo do dia em diferentes períodos do ano são evidências dos movimentos da Terra.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_6] },
  // 7º Ano
  { code: 'EF07CI01', description: 'Discutir a aplicação, pelas máquinas simples, da força mecânica e seu papel na evolução tecnológica.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07CI07', description: 'Caracterizar os principais ecossistemas brasileiros.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_7] },
  // 8º Ano
  { code: 'EF08CI01', description: 'Identificar e classificar diferentes fontes de energia renováveis e não renováveis.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_8] },
  // 9º Ano
  { code: 'EF09CI01', description: 'Investigar as mudanças de estado físico da matéria.', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09CI10', description: 'Comparar as diferentes teorias sobre a origem do Universo (como o Big Bang).', subject: Subject.SCIENCE, gradeLevel: [GradeLevel.EFII_9] },

  // ==================================================================================
  // MATEMÁTICA (EFII)
  // ==================================================================================
  // 6º Ano
  { code: 'EF06MA01', description: 'Comparar, ordenar, ler e escrever números naturais e números racionais.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA02', description: 'Reconhecer o sistema de numeração decimal como fruto de um processo histórico.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA03', description: 'Resolver e elaborar problemas que envolvam cálculos (mentais ou escritos, exatos ou aproximados) com números naturais.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA04', description: 'Construir algoritmo em linguagem natural e representá-lo por fluxograma.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA05', description: 'Classificar números naturais em primos e compostos.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA06', description: 'Resolver e elaborar problemas que envolvam as ideias de múltiplo e de divisor.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA07', description: 'Compreender, comparar e ordenar frações associadas às ideias de partes de inteiros e resultado de divisão.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA08', description: 'Reconhecer que os números racionais positivos podem ser expressos nas formas fracionária e decimal.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA09', description: 'Resolver e elaborar problemas que envolvam o cálculo da fração de uma quantidade.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA10', description: 'Resolver e elaborar problemas que envolvam adição ou subtração com números racionais positivos na representação fracionária.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA11', description: 'Resolver e elaborar problemas com números racionais positivos na representação decimal.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA17', description: 'Identificar e classificar figuras planas (triângulos, quadriláteros, polígonos regulares e não regulares).', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06MA18', description: 'Reconhecer, nomear e comparar polígonos, considerando lados, vértices e ângulos.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_6] },
  // 7º Ano
  { code: 'EF07MA01', description: 'Resolver e elaborar problemas com números inteiros (adição, subtração, multiplicação, divisão).', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF07MA04', description: 'Resolver e elaborar problemas que envolvam operações com números inteiros.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_7] },
  // 8º Ano
  { code: 'EF08MA03', description: 'Resolver e elaborar problemas que envolvam porcentagem e juros simples.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_8] },
  // 9º Ano
  { code: 'EF09MA03', description: 'Efetuar cálculos com números reais, inclusive potências com expoentes fracionários.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09MA06', description: 'Compreender as funções como relações de dependência unívoca.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_9] },
  { code: 'EF09MA13', description: 'Demonstrar relações métricas do triângulo retângulo, entre elas o teorema de Pitágoras.', subject: Subject.MATH, gradeLevel: [GradeLevel.EFII_9] },

  // ==================================================================================
  // LÍNGUA PORTUGUESA (EFI e EFII)
  // ==================================================================================
  // EFI
  { code: 'EF01LP01', description: 'Reconhecer que textos são lidos e escritos da esquerda para a direita.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFI_1] },
  { code: 'EF02LP04', description: 'Ler e escrever corretamente palavras com sílabas CV, V, CVC, CCV.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFI_2] },
  { code: 'EF35LP03', description: 'Identificar a ideia central do texto.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFI_3, GradeLevel.EFI_4, GradeLevel.EFI_5] },
  { code: 'EF05LP03', description: 'Acentuar corretamente palavras oxítonas, paroxítonas e proparoxítonas.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFI_5] },
  // EFII
  { code: 'EF69LP01', description: 'Diferenciar liberdade de expressão de discursos de ódio.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7, GradeLevel.EFII_8, GradeLevel.EFII_9] },
  { code: 'EF69LP02', description: 'Analisar e comparar peças publicitárias variadas.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7, GradeLevel.EFII_8, GradeLevel.EFII_9] },
  { code: 'EF69LP03', description: 'Identificar, em notícias, o fato central e suas circunstâncias.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7, GradeLevel.EFII_8, GradeLevel.EFII_9] },
  { code: 'EF69LP07', description: 'Produzir textos em diferentes gêneros, considerando sua adequação ao contexto.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7, GradeLevel.EFII_8, GradeLevel.EFII_9] },
  { code: 'EF06LP01', description: 'Reconhecer a impossibilidade de uma neutralidade absoluta no relato de fatos e identificar diferentes graus de parcialidade.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06LP02', description: 'Estabelecer relação entre os diferentes gêneros jornalísticos e as situações de produção.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06LP03', description: 'Analisar diferenças de sentido entre palavras de uma mesma série sinonímica.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06LP04', description: 'Analisar a função e as flexões de substantivos e adjetivos e de verbos nos modos Indicativo, Subjuntivo e Imperativo.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF07LP06', description: 'Empregar as regras básicas de concordância nominal e verbal.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF08LP04', description: 'Utilizar conhecimentos linguísticos e gramaticais: ortografia, regência, concordância, pontuação.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF09LP04', description: 'Escrever textos corretamente, de acordo com a norma-padrão, com estruturas sintáticas complexas.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EFII_9] },

  // ==================================================================================
  // INGLÊS (EFII)
  // ==================================================================================
  { code: 'EF06LI01', description: 'Interagir em situações de intercâmbio oral, demonstrando iniciativa para utilizar a língua inglesa.', subject: Subject.ENGLISH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06LI04', description: 'Reconhecer, com o apoio de palavras cognatas, o assunto e informações principais em textos orais.', subject: Subject.ENGLISH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF06LI17', description: 'Construir repertório lexical relativo a temas familiares (escola, família, rotina).', subject: Subject.ENGLISH, gradeLevel: [GradeLevel.EFII_6] },
  { code: 'EF07LI05', description: 'Compor, em língua inglesa, narrativas orais sobre fatos do passado.', subject: Subject.ENGLISH, gradeLevel: [GradeLevel.EFII_7] },
  { code: 'EF08LI12', description: 'Construir repertório lexical relativo a planos e previsões.', subject: Subject.ENGLISH, gradeLevel: [GradeLevel.EFII_8] },
  { code: 'EF09LI01', description: 'Fazer uso da língua inglesa para expor pontos de vista, argumentos e contra-argumentos.', subject: Subject.ENGLISH, gradeLevel: [GradeLevel.EFII_9] },

  // ==================================================================================
  // ARTES e ED. FÍSICA
  // ==================================================================================
  { code: 'EF15AR01', description: 'Identificar e apreciar formas distintas das artes visuais tradicionais e contemporâneas.', subject: Subject.ARTS, gradeLevel: [GradeLevel.EFI_1, GradeLevel.EFI_2, GradeLevel.EFI_3, GradeLevel.EFI_4, GradeLevel.EFI_5] },
  { code: 'EF69AR01', description: 'Pesquisar, apreciar e analisar formas distintas das artes visuais tradicionais e contemporâneas.', subject: Subject.ARTS, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7, GradeLevel.EFII_8, GradeLevel.EFII_9] },
  { code: 'EF69AR04', description: 'Analisar os elementos constitutivos das artes visuais (ponto, linha, forma, cor, etc.).', subject: Subject.ARTS, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7, GradeLevel.EFII_8, GradeLevel.EFII_9] },
  { code: 'EF12EF01', description: 'Experimentar e fruir brincadeiras e jogos da cultura popular.', subject: Subject.PHYSICAL_ED, gradeLevel: [GradeLevel.EFI_1, GradeLevel.EFI_2] },
  { code: 'EF67EF01', description: 'Experimentar e fruir, na escola e fora dela, jogos eletrônicos diversos.', subject: Subject.PHYSICAL_ED, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7] },
  { code: 'EF67EF03', description: 'Experimentar e fruir esportes de marca, precisão, invasão e técnico-combinatórios.', subject: Subject.PHYSICAL_ED, gradeLevel: [GradeLevel.EFII_6, GradeLevel.EFII_7] },

  // ==================================================================================
  // EDUCAÇÃO INFANTIL
  // ==================================================================================
  { code: 'EI02EO01', description: 'Demonstrar atitudes de cuidado e solidariedade na interação com crianças e adultos.', subject: Subject.SOCIOLOGY, gradeLevel: [GradeLevel.EI_CRECHE] },
  { code: 'EI03CG01', description: 'Criar com o corpo formas diversificadas de expressão de sentimentos e emoções.', subject: Subject.ARTS, gradeLevel: [GradeLevel.EI_PRE] },
  { code: 'EI03TS02', description: 'Expressar-se livremente por meio de desenho, pintura, colagem, dobradura e escultura.', subject: Subject.ARTS, gradeLevel: [GradeLevel.EI_PRE] },
  { code: 'EI03EF01', description: 'Expressar ideias, desejos e sentimentos sobre suas vivências, por meio da linguagem oral e escrita.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EI_PRE] },

  // ==================================================================================
  // ENSINO MÉDIO
  // ==================================================================================
  { code: 'EM13LGG101', description: 'Compreender e analisar processos de produção e circulação de discursos, nas diferentes linguagens.', subject: Subject.PORTUGUESE, gradeLevel: [GradeLevel.EM_1, GradeLevel.EM_2, GradeLevel.EM_3] },
  { code: 'EM13MAT101', description: 'Interpretar criticamente situações econômicas, sociais e fatos relativos às ciências da natureza que envolvam a variação de grandezas.', subject: Subject.MATH, gradeLevel: [GradeLevel.EM_1, GradeLevel.EM_2, GradeLevel.EM_3] },
  { code: 'EM13CHS101', description: 'Identificar, analisar e comparar diferentes fontes e narrativas expressas em diversas linguagens.', subject: Subject.HISTORY, gradeLevel: [GradeLevel.EM_1, GradeLevel.EM_2, GradeLevel.EM_3] },
  { code: 'EM13CNT101', description: 'Analisar e representar as transformações e conservações em sistemas que envolvam quantidade de matéria, de energia e de movimento.', subject: Subject.PHYSICS, gradeLevel: [GradeLevel.EM_1, GradeLevel.EM_2, GradeLevel.EM_3] }
];