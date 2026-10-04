import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  ExternalLink,
  RotateCcw,
  Minimize2,
  Maximize2,
  ShoppingBag,
} from 'lucide-react';
import { Product } from '../../types';

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  time: string;
  recommendedProducts?: Product[];
  suggestedReplies?: string[];
}

export const ChatBot: React.FC = () => {
  const { products, settings, setSelectedProduct, getGeneralWhatsAppUrl } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initial welcome message with featured products and conversation starters
  const initialBotMessage: ChatMessage = {
    id: 'welcome',
    role: 'bot',
    text: `¡Hola! 👋 Soy **MagoBot**, el asesor comercial y técnico de **Tienda El Mago**.\n\nTe asesoro para encontrar la indumentaria de trabajo más resistente y el calzado con certificación IRAM ideal para tu rubro.\n\n¿Para qué trabajo o tarea estás buscando equipamiento hoy?`,
    time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    recommendedProducts: products.filter((p) => p.isFeatured && p.isActive).slice(0, 2),
    suggestedReplies: [
      'Ropa para taller mecánico',
      'Botines con puntera de acero',
      'Pantalón cargo reforzado',
      'Presupuesto para empresas (B2B)',
    ],
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialBotMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, isMinimized, messages]);

  // Fallback intelligent responder based on store knowledge
  const generateFallbackResponse = (query: string): { text: string; recommendedProducts?: Product[]; suggestedReplies?: string[] } => {
    const q = query.toLowerCase();

    // Workwear / trades recommendations
    if (q.includes('botin') || q.includes('calzado') || q.includes('zapato') || q.includes('puntera')) {
      const boots = products.filter((p) => p.categoryId === 'calzado-seguridad');
      return {
        text: `Para calzado de seguridad te recomiendo el **Botín Ombú Krypton** con puntera de acero IRAM 3610 y el **Zapato Explorer Dieléctrico** con puntera de composite. Ambos tienen suela de poliuretano inyectado resistente a aceites e hidrocarburos.\n\n¿Precisás para vos o estás armando pedido para una cuadrilla?`,
        recommendedProducts: boots.slice(0, 2),
        suggestedReplies: ['¿Qué talles tienen?', '¿Tienen puntera plástica?', 'Cotizar por cantidad'],
      };
    }

    if (q.includes('talle') || q.includes('medida') || q.includes('tabla')) {
      return {
        text: `📏 **Guía rápida de talles:**\n• **Pantalones:** Del 38 al 60. Si usás talle 42 de jean convencional, en pantalón laboral te aconsejamos el 42 o 44 para trabajar cómodo con herramientas.\n• **Calzado:** Del 38 al 46 argentino.\n\n¿Qué prenda querés consultar específicamente?`,
        suggestedReplies: ['Ver pantalones de trabajo', 'Ver calzado de seguridad', 'Consultar por WhatsApp'],
      };
    }

    if (q.includes('grafa') || q.includes('tela') || q.includes('material')) {
      const grafaProducts = products.filter((p) => p.material.toLowerCase().includes('grafa'));
      return {
        text: `🧵 **Tela Grafa 70 Homologada:**\nEs 100% algodón sarga pesada (260 g/m²). Resiste chispas de amoladora, roces constantes y múltiples lavados industriales sin perder consistencia.\n\n¿Te gustaría ver camisas o mamelucos en Grafa 70?`,
        recommendedProducts: grafaProducts.slice(0, 2),
        suggestedReplies: ['Ver camisas Grafa 70', 'Ver mamelucos', 'Precios por mayor'],
      };
    }

    if (q.includes('empresa') || q.includes('mayorista') || q.includes('cuit') || q.includes('factura a') || q.includes('b2b') || q.includes('cantidad')) {
      return {
        text: `🏢 **División Corporativa & Venta Mayorista:**\nEquipamos a empresas de todo el país con:\n1. **Factura A y B** inmediata con CUIT.\n2. **Bordado y estampado** de tu logo.\n3. Descuentos por curva y volumen.\n\n¿Cuántos operarios integran tu equipo actualmente?`,
        suggestedReplies: ['Equipo de 5 a 20 operarios', 'Más de 20 operarios', 'Contactar por WhatsApp'],
      };
    }

    if (q.includes('taller') || q.includes('mecanico') || q.includes('herramienta')) {
      const workshopProducts = products.filter(
        (p) => p.slug.includes('mameluco') || p.categoryId === 'calzado-seguridad' || p.slug.includes('pantalon')
      );
      return {
        text: `🔧 **Equipamiento para Taller Mecánico:**\nLo más solicitado y durable es el **Mameluco Industrial Grafa 70** (aisla grasa y suciedad con triple costura) y los **Botines Ombú con puntera de acero** para proteger los pies de caídas de piezas pesadas.\n\n¿Preferís mameluco enterizo o conjunto de pantalón cargo y camisa?`,
        recommendedProducts: workshopProducts.slice(0, 2),
        suggestedReplies: ['Prefiero mameluco enterizo', 'Prefiero pantalón y camisa', 'Ver botines para taller'],
      };
    }

    // Default matching products if name mentioned
    const matched = products.filter(
      (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q))
    );

    if (matched.length > 0) {
      return {
        text: `¡Excelente elección! Te recomiendo estos artículos de alta resistencia que se ajustan perfecto a lo que estás buscando:`,
        recommendedProducts: matched.slice(0, 2),
        suggestedReplies: ['¿Hacen envíos al interior?', '¿Qué medios de pago aceptan?', 'Ver más opciones'],
      };
    }

    return {
      text: `Contamos con stock permanente en indumentaria de grafa, pantalones cargo reforzados, calzado certificado IRAM y abrigo térmico impermeable.\n\n¿Para qué oficio o sector precisás equipamiento? Contame un poco y te asesoro con los mejores modelos.`,
      recommendedProducts: products.slice(0, 2),
      suggestedReplies: ['Ropa para construcción', 'Ropa para taller mecánico', 'Calzado de seguridad'],
    };
  };

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputMessage).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: message,
      time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Build lightweight catalog payload so Gemini has real IDs, names, and prices
      const catalogPayload = products.map((p) => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        price: p.price,
        brand: p.brand,
        material: p.material,
      }));

      // History for multi-turn dialogue
      const historyPayload = messages.map((m) => ({
        role: m.role === 'bot' ? 'model' : 'user',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          history: historyPayload,
          catalog: catalogPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          // Resolve recommended products from IDs or keywords
          const matchedProducts: Product[] = [];
          if (Array.isArray(data.recommendedProductIds)) {
            for (const recId of data.recommendedProductIds) {
              const pFound = products.find(
                (p) =>
                  p.id === recId ||
                  p.slug === recId ||
                  p.name.toLowerCase().includes(String(recId).toLowerCase())
              );
              if (pFound && !matchedProducts.some((x) => x.id === pFound.id)) {
                matchedProducts.push(pFound);
              }
            }
          }

          // Fallback fuzzy match if the model returned names or generic IDs
          if (matchedProducts.length === 0) {
            for (const p of products) {
              const lowerReply = data.reply.toLowerCase();
              if (
                lowerReply.includes(p.name.toLowerCase()) ||
                (lowerReply.includes('botín') && p.categoryId === 'calzado-seguridad') ||
                (lowerReply.includes('mameluco') && p.slug.includes('mameluco')) ||
                (lowerReply.includes('pantalón') && p.categoryId === 'pantalones') ||
                (lowerReply.includes('camisa') && p.categoryId === 'camisas')
              ) {
                if (!matchedProducts.some((x) => x.id === p.id)) {
                  matchedProducts.push(p);
                }
              }
              if (matchedProducts.length >= 2) break;
            }
          }

          const botMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'bot',
            text: data.reply,
            time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
            recommendedProducts: matchedProducts.length > 0 ? matchedProducts : undefined,
            suggestedReplies:
              Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0
                ? data.suggestedReplies
                : ['¿Qué talles tienen?', 'Ver opciones de calzado', 'Consultar por mayor'],
          };
          setMessages((prev) => [...prev, botMsg]);
          setIsLoading(false);
          return;
        }
      }

      // If server returned fallback or error, use local expert engine
      const fallback = generateFallbackResponse(message);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: fallback.text,
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: fallback.recommendedProducts,
        suggestedReplies: fallback.suggestedReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.warn('Using local assistant engine:', err);
      const fallback = generateFallbackResponse(message);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: fallback.text,
        time: new Date().toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
        recommendedProducts: fallback.recommendedProducts,
        suggestedReplies: fallback.suggestedReplies,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([initialBotMessage]);
  };

  return (
    <>
      {/* Floating Chatbot Launcher Button - Stacked above WhatsApp */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <div className="mb-2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1b1233]/95 border border-[#52378c] text-xs font-semibold text-purple-200 shadow-xl backdrop-blur-md animate-bounce duration-1000">
            <BrandStar size={12} color="#fbbf24" />
            <span>¿Buscás indumentaria o calzado?</span>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className={`group relative p-3.5 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
            isOpen
              ? 'bg-[#1C1C1E] text-white border-2 border-[#6C2BD9]'
              : 'bg-[#6C2BD9] hover:bg-[#7C3AED] text-white border-2 border-white/20 shadow-xl hover:scale-105'
          }`}
          title="Asistente Virtual MagoBot"
          aria-label="Abrir Asistente Virtual"
        >
          {isOpen ? (
            <X size={24} />
          ) : (
            <>
              <Bot size={26} className="text-white drop-shadow" />
              {/* Online pulse dot */}
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-[#1C1C1E] animate-pulse" />
              {/* Floating brand star */}
              <span className="absolute -top-1 -left-1 opacity-90">
                <BrandStar size={14} color="#6C2BD9" />
              </span>
            </>
          )}
        </button>
      </div>

      {/* Chat Window Dialog */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-4 sm:right-6 z-50 w-[395px] max-w-[calc(100vw-2rem)] bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            isMinimized ? 'h-16' : 'h-[570px] max-h-[82vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#141416] border-b border-[#343438] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative p-2 rounded-xl bg-[#6C2BD9] text-white shadow-md">
                <Bot size={20} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#141416]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-mago text-[#6C2BD9] text-base tracking-normal">MagoBot</span>
                  <BrandStar size={11} color="#6C2BD9" />
                </div>
                <span className="text-[10px] font-mono text-[#E5E5E3] uppercase tracking-wider block mt-0.5">
                  Asesor Comercial & Técnico
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#252528] transition-colors"
                title="Reiniciar conversación"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#252528] transition-colors"
                title={isMinimized ? 'Expandir' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#252528] transition-colors"
                title="Cerrar chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs">
                {messages.map((msg, index) => {
                  const isLastMessage = index === messages.length - 1;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-[#6C2BD9] text-white rounded-br-none shadow-md'
                            : 'bg-[#252528] text-[#E5E5E3] border border-[#343438] rounded-bl-none shadow-md'
                        }`}
                      >
                        {msg.text}

                        {/* Product Recommendations inside Chatbot response */}
                        {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#343438] space-y-2">
                            <span className="text-[10px] font-mono text-[#6C2BD9] uppercase font-bold flex items-center gap-1.5">
                              <Sparkles size={12} className="text-[#6C2BD9]" />
                              <span>Productos recomendados:</span>
                            </span>
                            <div className="grid grid-cols-1 gap-2">
                              {msg.recommendedProducts.map((prod) => (
                                <div
                                  key={prod.id}
                                  className="flex items-center gap-2.5 p-2 rounded-xl bg-[#1C1C1E] border border-[#343438] hover:border-[#6C2BD9] transition-all shadow-sm group"
                                >
                                  <img
                                    src={
                                      (prod.images && prod.images[0] && prod.images[0].trim()) ||
                                      '/src/assets/images/category_ropa_trabajo_1790892078708.jpg'
                                    }
                                    alt={prod.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-white shrink-0 p-0.5"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      if (target.src !== '/src/assets/images/category_ropa_trabajo_1790892078708.jpg') {
                                        target.src = '/src/assets/images/category_ropa_trabajo_1790892078708.jpg';
                                      }
                                    }}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1">
                                      <span className="text-[9px] font-mono text-[#6C2BD9] uppercase font-bold truncate">
                                        {prod.brand}
                                      </span>
                                      <span className="text-xs font-mono font-bold text-white">
                                        ${prod.price.toLocaleString('es-AR')}
                                      </span>
                                    </div>
                                    <h5 className="font-condensed text-xs font-bold uppercase text-[#E5E5E3] truncate group-hover:text-[#6C2BD9]">
                                      {prod.name}
                                    </h5>
                                    <div className="flex items-center gap-3 mt-1">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedProduct(prod);
                                          setIsOpen(false);
                                        }}
                                        className="text-[10px] font-semibold text-[#6C2BD9] hover:text-[#7C3AED] underline underline-offset-2 flex items-center gap-1"
                                      >
                                        <span>Ver detalle</span>
                                        <ExternalLink size={10} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Interactive Conversation Chips */}
                        {msg.suggestedReplies && msg.suggestedReplies.length > 0 && isLastMessage && !isLoading && (
                          <div className="mt-3 pt-2.5 border-t border-[#343438]/70 space-y-1.5">
                            <span className="text-[9.5px] font-mono text-stone-400 uppercase tracking-wider block">
                              Continuar conversación:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {msg.suggestedReplies.map((replyText, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleSendMessage(replyText)}
                                  className="px-2.5 py-1 rounded-full bg-[#1C1C1E] hover:bg-[#6C2BD9] border border-[#343438] hover:border-[#6C2BD9] text-[10.5px] text-[#E5E5E3] hover:text-white transition-all duration-150 flex items-center gap-1 shadow-sm text-left active:scale-95 cursor-pointer"
                                >
                                  <span>{replyText}</span>
                                  <span className="text-stone-400 hover:text-white text-[10px]">💬</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-500 font-mono mt-1 px-1">{msg.time}</span>
                    </div>
                  );
                })}

                {isLoading && (
                  <div className="flex items-start gap-2">
                    <div className="p-3 rounded-2xl rounded-bl-none bg-[#252528] border border-[#343438] text-[#6C2BD9] flex items-center gap-1.5 shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6C2BD9] animate-ping" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6C2BD9]" />
                      <span className="text-[11px] font-mono ml-1 text-[#E5E5E3]">MagoBot pensando recomendaciones...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-[#141416] border-t border-[#343438] flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribile a MagoBot sobre lo que buscás..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[#252528] border border-[#343438] text-white placeholder-stone-500 text-xs focus:border-[#6C2BD9] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md cursor-pointer"
                  title="Enviar mensaje"
                >
                  <Send size={15} />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
