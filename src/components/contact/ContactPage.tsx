import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Building2,
  CheckCircle2,
  Send,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, getGeneralWhatsAppUrl } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Consulta general de indumentaria');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    const text = `*CONSULTA DESDE LA WEB - TIENDA EL MAGO*\n*Nombre:* ${name}\n*Email:* ${email}\n*Tel:* ${phone}\n*Asunto:* ${subject}\n\n*Mensaje:*\n${message}`;
    const url = getGeneralWhatsAppUrl(text);
    setTimeout(() => {
      window.open(url, '_blank');
      setSent(false);
      setMessage('');
    }, 1000);
  };

  return (
    <div className="bg-[#1C1C1E] min-h-screen py-16 text-[#E5E5E3]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#252528] border border-[#343438] text-xs font-mono uppercase text-[#E5E5E3]">
            <BrandStar size={12} color="#6C2BD9" />
            <span>Atención Personalizada y Asesoramiento Técnico</span>
            <BrandStar size={12} color="#6C2BD9" />
          </div>
          <h1 className="font-condensed text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
            CONTACTATE CON <span className="font-mago text-[#6C2BD9] normal-case text-4xl sm:text-6xl">Tienda El Mago</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-300">
            Estamos para asesorarte sobre indumentaria técnica, curvas de talles, normas de seguridad y pedidos mayoristas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-5 shadow-xl">
              <h3 className="font-condensed text-2xl font-bold uppercase text-white flex items-center gap-2">
                <Building2 size={20} className="text-[#6C2BD9]" />
                Punto de Venta y Despacho
              </h3>

              <div className="space-y-4 text-sm text-stone-300">
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#6C2BD9] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Ubicación:</strong>
                    <span className="text-xs text-stone-400">{settings.address}, {settings.city}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} className="text-[#6C2BD9] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Línea Telefónica Directa:</strong>
                    <span className="text-xs text-stone-400">{settings.storePhone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-[#6C2BD9] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Email Comercial:</strong>
                    <span className="text-xs text-stone-400">{settings.storeEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock size={18} className="text-[#6C2BD9] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Horario de Atención:</strong>
                    <span className="text-xs text-stone-400">{settings.openingHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#343438]">
                <a
                  href={getGeneralWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25d366]/20 hover:bg-[#25d366]/30 text-[#25d366] border border-[#25d366]/40 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  <span>Chatear ahora al {settings.whatsappPhone}</span>
                </a>
              </div>
            </div>

            {/* Warehouse Map Graphic Simulation Card */}
            <div className="p-6 rounded-2xl bg-[#252528] border border-[#343438] space-y-3 shadow-xl">
              <span className="text-xs font-mono text-[#6C2BD9] uppercase block font-bold">
                Logística y Entregas
              </span>
              <p className="text-xs text-stone-300 leading-relaxed">
                Contamos con muelle de carga para camiones, transportes y despachos inmediatos a todo el territorio nacional mediante Vía Cargo, OCA, Andreani y transportes expresos seleccionados por el cliente.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-2xl bg-[#252528] border border-[#343438] shadow-xl">
              <h3 className="font-condensed text-2xl font-bold uppercase text-white mb-2">
                Envianos tu Mensaje
              </h3>
              <p className="text-xs text-stone-400 mb-6">
                Completá el formulario para recibir respuesta técnica inmediata o coordinar visitas comerciales.
              </p>

              {sent ? (
                <div className="py-12 text-center space-y-3">
                  <CheckCircle2 size={44} className="mx-auto text-emerald-400" />
                  <h4 className="font-condensed text-xl font-bold uppercase text-white">
                    ¡Mensaje Listo para Enviar!
                  </h4>
                  <p className="text-xs text-stone-300">
                    Te estamos redirigiendo a nuestro canal de WhatsApp oficial.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tu nombre"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+54 9 11 ..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                      Motivo de Contacto
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                    >
                      <option value="Consulta general de indumentaria">Consulta general de indumentaria</option>
                      <option value="Cotización para cuadrilla o empresa">Cotización para cuadrilla o empresa</option>
                      <option value="Consulta sobre calzado y punteras IRAM">Consulta sobre calzado y punteras IRAM</option>
                      <option value="Estado de un pedido enviado">Estado de un pedido enviado</option>
                      <option value="Cambio de talle">Cambio de talle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[#E5E5E3] uppercase mb-1 font-semibold">
                      Tu Mensaje *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Escribí aquí tu consulta, prendas requeridas, o dudas..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1C1E] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-base font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Send size={16} />
                    <span>ENVIAR CONSULTA POR WHATSAPP</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
