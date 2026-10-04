import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize server-side Google GenAI client
  let ai: GoogleGenAI | null = null;
  const getAI = () => {
    if (!ai && process.env.GEMINI_API_KEY) {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return ai;
  };

  // API Route for MagoBot Conversational Chat with Products
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [], catalog = [] } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'El mensaje es requerido.' });
      }

      const client = getAI();
      if (!client) {
        return res.json({
          reply: null,
          status: 'no_api_key',
        });
      }

      // Format catalog to ground the AI with exact product IDs and specs
      let catalogText = '';
      if (Array.isArray(catalog) && catalog.length > 0) {
        catalogText = catalog
          .map(
            (p: any) =>
              `[ID: "${p.id}"] ${p.name} | Cat: ${p.categoryName || p.categoryId} | Precio: $${p.price} | Marca: ${p.brand || 'El Mago'} | Mat: ${p.material || ''}`
          )
          .join('\n');
      } else {
        catalogText = `[ID: "pantalon-cargo-gabardina-pesada"] Pantalón Cargo de Gabardina Pesada | Cat: pantalones | Precio: $34500 | Marca: Ombú | Mat: Gabardina 8 oz
[ID: "botin-seguridad-krypton-acero"] Botín de Seguridad Ombú Krypton con Puntera de Acero | Cat: calzado-seguridad | Precio: $68900 | Marca: Ombú | Mat: Cuero vacuno flor / Norma IRAM 3610
[ID: "camisa-trabajo-grafa-reforzada"] Camisa de Trabajo Grafa 70 Reforzada | Cat: camisas | Precio: $28900 | Marca: Grafa 70 | Mat: 100% Algodón sarga pesada
[ID: "campera-trabajo-termica-trucker"] Campera de Trabajo Térmica Trucker Impermeable | Cat: camperas-buzos | Precio: $74200 | Marca: El Mago Pro | Mat: Trucker resinado matelaseado
[ID: "chaleco-seguridad-alta-visibilidad"] Chaleco de Seguridad Alta Visibilidad IRAM | Cat: alta-visibilidad | Precio: $16500 | Marca: 3M Scotchlite | Mat: Poliéster fluorescente
[ID: "mameluco-industrial-grafa-70"] Mameluco Industrial Mecánico Grafa 70 | Cat: ropa-trabajo | Precio: $52000 | Marca: Grafa 70 | Mat: Grafa 70 triple costura
[ID: "chomba-laboral-pique-reforzado"] Chomba Laboral Piqué Reforzado | Cat: remeras-chombas | Precio: $22400 | Marca: El Mago | Mat: Piqué peinado
[ID: "zapato-seguridad-explorer-dielectrico"] Zapato de Seguridad Explorer Dieléctrico | Cat: calzado-seguridad | Precio: $71500 | Marca: Funcional | Mat: Puntera composite dieléctrica`;
      }

      const systemInstruction = `Sos MagoBot, el asesor comercial y técnico virtual de "Tienda El Mago" (Argentina, especialistas en indumentaria laboral, ropa de trabajo reforzada y calzado de seguridad profesional con normas IRAM 3610).
Tu objetivo es tener una pequeña conversación fluida, cálida, experta y personalizada con el cliente (estilo argentino: che, te comento, fijate, dale, etc.).

REGLAS DE CONVERSACIÓN Y PRODUCTOS:
1. Respondé de forma conversacional y cercana (2 a 4 oraciones bien redactadas).
2. EN CADA RESPUESTA, SIEMPRE OFRECÉ y recomendá entre 1 y 3 productos puntuales del catálogo que mejor se adapten a lo que busca o consulta el usuario.
3. Explicá brevemente por qué los recomendás (resistencia, tela Grafa 70, puntera de acero IRAM, comodidad, suela antideslizante, etc.).
4. Cerrá siempre con una pequeña pregunta amable o sugerencia para continuar la pequeña charla (por ejemplo: ¿qué tipo de tareas realizan?, ¿trabajan en interior o a la intemperie?, ¿qué talle solés calzar?, ¿precisan cotización para varios operarios?).
5. En "recommendedProductIds", colocá ÚNICAMENTE los "ID" exactos de los productos que recomendás de la lista del catálogo abajo (por ejemplo: ["pantalon-cargo-gabardina-pesada", "botin-seguridad-krypton-acero"]).
6. En "suggestedReplies", colocá 2 o 3 opciones cortas (de 2 a 5 palabras cada una) que el usuario pueda presionar para continuar la conversación con agilidad (ejemplo: ["¿Tienen talle 44?", "Ver botines dieléctricos", "Consultar por mayor"]).

CATÁLOGO REAL DE PRODUCTOS DISPONIBLES EN TIENDA EL MAGO:
${catalogText}
`;

      // Build contents array compatible with @google/genai
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if (item && item.text) {
            const role = item.role === 'model' || item.role === 'bot' ? 'model' : 'user';
            // Multi-turn conversations must begin with a user turn
            if (contents.length === 0 && role === 'model') continue;

            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts[0].text += `\n${item.text}`;
            } else {
              contents.push({
                role,
                parts: [{ text: String(item.text) }],
              });
            }
          }
        }
      }

      if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
        contents[contents.length - 1].parts[0].text += `\n${message}`;
      } else {
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });
      }

      const generateWithModel = async (modelName: string) => {
        return await client.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                reply: {
                  type: Type.STRING,
                  description: 'Respuesta conversacional de MagoBot con asesoramiento y recomendación.',
                },
                recommendedProductIds: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'IDs exactos de los productos recomendados del catálogo.',
                },
                suggestedReplies: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2 o 3 opciones rápidas para que el usuario responda en un clic.',
                },
              },
              required: ['reply', 'recommendedProductIds', 'suggestedReplies'],
            },
          },
        });
      };

      let response;
      try {
        response = await generateWithModel('gemini-3.8-flash');
      } catch (firstErr: any) {
        console.warn('Primary model error, attempting fallback:', firstErr.message);
        try {
          response = await generateWithModel('gemini-flash-latest');
        } catch (secondErr: any) {
          console.warn('Secondary model error, attempting flash-lite:', secondErr.message);
          response = await generateWithModel('gemini-3.1-flash-lite');
        }
      }

      const rawText = response.text || '';
      let parsedData: { reply?: string; recommendedProductIds?: string[]; suggestedReplies?: string[] } = {};
      try {
        parsedData = JSON.parse(rawText);
      } catch {
        parsedData = {
          reply: rawText,
          recommendedProductIds: [],
          suggestedReplies: ['Ver catálogo completo', 'Consultar talles', 'Hablar por WhatsApp'],
        };
      }

      return res.json({
        reply: parsedData.reply || rawText,
        recommendedProductIds: parsedData.recommendedProductIds || [],
        suggestedReplies: parsedData.suggestedReplies || [],
        status: 'success',
      });
    } catch (err: any) {
      console.error('Gemini chat error:', err);
      return res.json({
        reply: null,
        status: 'error',
        error: err.message,
      });
    }
  });

  // Mount Vite middleware in development or serve built files in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        // The hosted preview proxies HTTP but does not support Vite's HMR
        // WebSocket reliably, so prevent the Vite client from connecting.
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
