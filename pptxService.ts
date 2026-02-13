
import PptxGenJS from 'pptxgenjs';
import { SLIDE_THEMES } from './constants';

// Helper to strip markdown syntax for clean text
const stripMarkdown = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
    .replace(/\*(.*?)\*/g, '$1')     // Italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    .replace(/^#+\s/, '')            // Headers
    .replace(/^-\s/, '')             // List items
    .trim();
};

export const exportToPPTX = async (content: string, themeLabel: string | undefined, filename: string = 'Apresentacao') => {
  const pptx = new PptxGenJS();

  // 1. Configure Layout based on Theme
  const theme = SLIDE_THEMES.find(t => t.label === themeLabel) || SLIDE_THEMES[0];

  // Define colors based on theme classes (Mapping simplified for PPTX)
  let bgColor = 'FFFFFF';
  let textColor = '000000';
  let accentColor = '3B82F6'; // Blue-500 default

  // Simple mapping of tailwind classes to hex for PPTX
  if (theme.id === 'modo-escuro') { bgColor = '0F172A'; textColor = 'FFFFFF'; accentColor = '334155'; }
  if (theme.id === 'aprendizado-noturno') { bgColor = '312E81'; textColor = 'FFFFFF'; accentColor = '6366F1'; }
  if (theme.id === 'conhecimento-profundo') { bgColor = '2563EB'; textColor = 'FFFFFF'; accentColor = '60A5FA'; }
  if (theme.id === 'ideias-crescentes') { bgColor = '0D9488'; textColor = 'FFFFFF'; accentColor = '2DD4BF'; }
  if (theme.id === 'natureza-gentil') { bgColor = 'D1FAE5'; textColor = '064E3B'; accentColor = '6EE7B7'; }

  pptx.layout = 'LAYOUT_16x9';

  // Define a master slide for background
  pptx.defineSlideMaster({
    title: 'MASTER_SLIDE',
    background: { color: bgColor },
    objects: [
      { rect: { x: 0, y: 0, w: '100%', h: 0.15, fill: { color: accentColor } } } // Top Bar
    ]
  });

  // 2. Parse Content
  const slideSeparator = /\n\s*---\s*\n/;
  const slidesContent = content.split(slideSeparator).map(s => s.trim()).filter(s => s.length > 0);

  // 3. Generate Slides
  slidesContent.forEach((slideText) => {
    const slide = pptx.addSlide({ masterName: 'MASTER_SLIDE' });

    const lines = slideText.split('\n');
    let yPos = 1.0; // Start position for body text
    let bulletPoints: string[] = [];

    // Simple parser loop
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Title (##)
      if (line.startsWith('#')) {
        const titleText = stripMarkdown(line);
        slide.addText(titleText, {
          x: 0.5, y: 0.4, w: '90%', h: 0.8,
          fontSize: 32,
          bold: true,
          color: textColor,
          fontFace: 'Arial'
        });
        continue;
      }

      // Image ( ![alt](url) )
      const imgMatch = line.match(/!\[.*?\]\((.*?)\)/);
      if (imgMatch && imgMatch[1]) {
        // If we have bullet points pending, add them before the image
        if (bulletPoints.length > 0) {
          slide.addText(bulletPoints.map(t => ({ text: t, options: { breakLine: true } })), {
            x: 0.5, y: yPos, w: '55%', h: 0.5,
            fontSize: 18,
            color: textColor,
            bullet: true,
            fontFace: 'Arial'
          });
          bulletPoints = []; // Clear
        }

        // Add Image
        // Check if it's base64 data uri
        if (imgMatch[1].startsWith('data:image')) {
          slide.addImage({
            data: imgMatch[1],
            x: 6.5, y: 1.5, w: 3.0, h: 3.0,
            sizing: { type: 'contain', w: 3.0, h: 3.0 }
          });
        }
        continue;
      }

      // Bullet Points (- or *)
      if (line.startsWith('- ') || line.startsWith('* ')) {
        bulletPoints.push(stripMarkdown(line));
        continue;
      }

      // Normal Paragraph
      if (!line.startsWith('#') && !line.startsWith('!')) {
        // Treat as paragraph or part of bullet if directly following bullets? 
        // For simplicity, add as separate text box if bullets exist
        if (bulletPoints.length > 0) {
          slide.addText(bulletPoints.map(t => ({ text: t, options: { breakLine: true } })), {
            x: 0.5, y: yPos, w: '90%', h: 0.5,
            fontSize: 18,
            color: textColor,
            bullet: true,
            fontFace: 'Arial'
          });
          yPos += (bulletPoints.length * 0.5) + 0.2;
          bulletPoints = [];
        }

        slide.addText(stripMarkdown(line), {
          x: 0.5, y: yPos, w: '90%', h: 0.5,
          fontSize: 16,
          color: textColor,
          fontFace: 'Arial'
        });
        yPos += 0.6;
      }
    }

    // Flush remaining bullets
    if (bulletPoints.length > 0) {
      slide.addText(bulletPoints.map(t => ({ text: t, options: { breakLine: true } })), {
        x: 0.5, y: yPos, w: '90%', h: 0.5,
        fontSize: 18,
        color: textColor,
        bullet: true,
        fontFace: 'Arial'
      });
    }

    // Add Footer
    slide.addText('ProfeIA', {
      x: 0.5, y: '90%', w: '20%', h: 0.3,
      fontSize: 10,
      color: textColor
    });
  });

  // 4. Save
  await pptx.writeFile({ fileName: `${filename}.pptx` });
};
