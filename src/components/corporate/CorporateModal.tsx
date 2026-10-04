import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandStar } from '../common/BrandStar';
import { X, Building2, CheckCircle2, MessageCircle } from 'lucide-react';
import { B2BQuoteRequest } from '../../types';

export const CorporateModal: React.FC = () => {
  const { isB2BModalOpen, setIsB2BModalOpen, getWhatsAppB2BUrl } = useStore();

  const [formData, setFormData] = useState<B2BQuoteRequest>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    cuit: '',
    workersCount: '10 a 25 operarios',
    requirements: '',
    needsEmbroidery: true,
    selectedCategories: ['Pantalones de trabajo', 'Camisas de grafa', 'Calzado de seguridad'],
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isB2BModalOpen) return null;

  const categoriesOptions = [
    'Pantalones de trabajo',
    'Camisas de grafa',
    'Calzado de seguridad',
    'Camperas térmicas',
    'Alta visibilidad (norma IRAM)',
    'Chombas y remeras',
    'Mamelucos mecánicos',
    'Accesorios y protección',
  ];

  const handleCategoryToggle = (cat: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(cat)
        ? prev.selectedCategories.filter((c) => c !== cat)
        : [...prev.selectedCategories, cat],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const url = getWhatsAppB2BUrl(formData);
    setTimeout(() => {
      window.open(url, '_blank');
      setIsB2BModalOpen(false);
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#1C1C1E] border border-[#343438] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[#141416] border-b border-[#343438] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-[#252528] text-[#6C2BD9] border border-[#343438]">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[#6C2BD9] text-[11px] font-mono uppercase tracking-wider font-semibold">
                <BrandStar size={10} color="#6C2BD9" />
                <span>Atención Corporativa & Mayorista</span>
              </div>
              <h3 className="font-condensed text-xl font-bold uppercase text-white">
                Cotización para Empresas
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsB2BModalOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-[#252528] transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 size={48} className="mx-auto text-emerald-400 animate-bounce" />
              <h4 className="font-condensed text-2xl font-bold text-white uppercase">
                ¡Solicitud Generada con Éxito!
              </h4>
              <p className="text-[#E5E5E3] text-sm max-w-md mx-auto">
                Te estamos redirigiendo a WhatsApp con tu cotización pre-armada para que nuestro equipo corporativo te atienda al instante.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1">
                    Razón Social / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Industrias Metalúrgicas S.A."
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1">
                    CUIT (Factura A)
                  </label>
                  <input
                    type="text"
                    placeholder="30-XXXXXXXX-X"
                    value={formData.cuit}
                    onChange={(e) => setFormData({ ...formData, cuit: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1">
                    Nombre del Contacto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre y cargo"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1">
                    Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+54 9 11 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1">
                  Email Corporativo *
                </label>
                <input
                  type="email"
                  required
                  placeholder="compras@tuempresa.com.ar"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1">
                  Cantidad de Trabajadores / Prendas Estimadas
                </label>
                <select
                  value={formData.workersCount}
                  onChange={(e) => setFormData({ ...formData, workersCount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                >
                  <option value="5 a 10 operarios">5 a 10 operarios</option>
                  <option value="10 a 25 operarios">10 a 25 operarios</option>
                  <option value="25 a 50 operarios">25 a 50 operarios</option>
                  <option value="50 a 100 operarios">50 a 100 operarios</option>
                  <option value="Más de 100 operarios (Gran Empresa)">Más de 100 operarios (Gran Empresa)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-2">
                  Rubros que necesitan cotizar:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categoriesOptions.map((cat) => {
                    const selected = formData.selectedCategories.includes(cat);
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => handleCategoryToggle(cat)}
                        className={`text-left px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-between ${
                          selected
                            ? 'bg-[#6C2BD9]/20 border-[#6C2BD9] text-white font-bold'
                            : 'bg-[#1C1C1E] border-[#343438] text-stone-300 hover:border-[#6C2BD9]'
                        }`}
                      >
                        <span>{cat}</span>
                        {selected && <CheckCircle2 size={14} className="text-[#6C2BD9]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-[#252528] border border-[#343438] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    ¿Requieren estampado o bordado con el logo de la empresa?
                  </span>
                  <span className="text-[11px] text-[#E5E5E3] block">
                    Personalizamos uniformes con hilado resistente al lavado industrial.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.needsEmbroidery}
                  onChange={(e) => setFormData({ ...formData, needsEmbroidery: e.target.checked })}
                  className="w-5 h-5 rounded text-[#6C2BD9] focus:ring-0 bg-[#1C1C1E] border-[#343438]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#E5E5E3] uppercase mb-1">
                  Detalles o especificaciones adicionales:
                </label>
                <textarea
                  rows={3}
                  placeholder="Detallá talles, modelos específicos, o lugar de entrega..."
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#252528] border border-[#343438] text-white focus:border-[#6C2BD9] focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-lg bg-[#6C2BD9] hover:bg-[#7C3AED] text-white font-condensed text-lg font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle size={20} />
                  <span>ENVIAR SOLICITUD A WHATSAPP CORPORATIVO</span>
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
