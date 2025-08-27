"use client";

import { useState } from "react";
import { Phone, MapPin, Clock, Instagram, Facebook, MessageCircle } from "lucide-react";
import { unidadesData } from "@/data/unidades/data-unidades";

const Contact = () => {
  const unidades = Array.isArray(unidadesData) ? unidadesData : [unidadesData];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const unidade = unidades[selectedIndex];

  // ✅ Corrige o número do WhatsApp (adiciona código do Brasil +55 se não tiver)
  const formatWhatsAppNumber = (num: string) => {
    const clean = num.replace(/\D/g, ""); // remove caracteres não numéricos
    return clean.startsWith("55") ? clean : `55${clean}`;
  };

  const handleWhatsAppClick = () => {
    const phone = formatWhatsAppNumber(unidade.contatos.whatsapp);
    window.open(
      `https://wa.me/${phone}?text=Olá! Gostaria de agendar uma consulta.`,
      "_blank"
    );
  };

  // ✅ Gera link do Google Maps dinamicamente
  const handleMapsClick = () => {
    const unidadeNome = `${unidade.nome}`;
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        unidadeNome
      )}`,
      "_blank"
    );
  };

  return (
    <section id="contact" className="section-padding bg-gradient-to-br from-gray-900/80 to-black/40">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Entre em</span>{" "}
            <span className="text-brand-pink">Contato</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Estamos prontos para atendê-la e tirar todas as suas dúvidas sobre nossos tratamentos
          </p>
        </div>

        {/* Dropdown unidades */}
        <div className="mb-8 flex justify-center">
          <select
            className="bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-brand-pink"
            value={selectedIndex}
            onChange={(e) => setSelectedIndex(Number(e.target.value))}
          >
            {unidades.map((u, idx) => (
              <option key={u.unidade} value={idx}>
                {u.unidade}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Telefone */}
              <div className="card-dark text-center animate-on-scroll">
                <div className="text-brand-pink mb-4 flex justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Telefone</h3>
                <p className="text-brand-pink font-medium mb-1">
                  {unidade.contatos.whatsapp.replace(/^(\d{2})(\d{2})(\d{5})(\d{4})$/, "($2) $3-$4")}
                </p>
                <p className="text-gray-400 text-sm">WhatsApp</p>
              </div>

              {/* Endereço */}
              <div className="card-dark text-center animate-on-scroll">
                <div className="text-brand-pink mb-4 flex justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Endereço</h3>
                <p className="text-brand-pink font-medium mb-1">
                  {unidade.endereço.rua}, {unidade.endereço.numero}
                  <br />
                  {unidade.endereço.bairro}
                  <br />
                  {unidade.endereço.cidade}
                </p>
              </div>

              {/* Horário */}
              <div className="card-dark text-center animate-on-scroll">
                <div className="text-brand-pink mb-4 flex justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Horário de Funcionamento</h3>
                <p className="text-brand-pink font-medium mb-1">
                  Segunda a Sexta: {unidade.atendimento.segunda_sexta[0]}h às {unidade.atendimento.segunda_sexta[1]}h
                  <br />
                  Sábado: {unidade.atendimento.sabado[0]}h às {unidade.atendimento.sabado[1]}h
                  <br />
                  Domingo:{" "}
                  {unidade.atendimento.domingo.length === 0
                    ? "Fechado"
                    : `${unidade.atendimento.domingo[0]}h às ${unidade.atendimento.domingo[1]}h`}
                </p>
              </div>
            </div>

            {/* Localização */}
            <div className="card-dark animate-on-scroll">
              <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-brand-pink mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Nossa Localização</h3>
                  <p className="text-gray-400">
                    {unidade.endereço.rua}, {unidade.endereço.numero}, {unidade.endereço.bairro},{" "}
                    {unidade.endereço.cidade}
                  </p>
                  <button
                    className="mt-4 text-brand-pink hover:text-brand-pink/80 transition-colors text-sm font-medium"
                    onClick={handleMapsClick}
                  >
                    Ver no Google Maps →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA + Social */}
          <div className="space-y-6">
            {/* WhatsApp */}
            <div className="card-dark text-center animate-on-scroll">
              <div className="text-brand-pink mb-4 flex justify-center">
                <MessageCircle className="w-12 h-12" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Agende sua Avaliação Gratuita</h3>
              <p className="text-gray-300 mb-6 text-sm">
                Converse com nossa equipe pelo WhatsApp e tire todas as suas dúvidas sobre nossos tratamentos.
              </p>
              <button onClick={handleWhatsAppClick} className="w-full btn-primary mb-4">
                Chamar no WhatsApp
              </button>
              <p className="text-gray-500 text-xs">Resposta em até 5 minutos no horário comercial</p>
            </div>

            {/* Social */}
            <div className="card-dark animate-on-scroll">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                Nos siga nas redes sociais
              </h3>
              <div className="space-y-3">
                <a
                  href={`https://instagram.com/${unidade.contatos.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-brand-pink/10 hover:border-brand-pink/30 border border-gray-700 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-brand-pink group-hover:scale-110 transition-transform">
                      <Instagram className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Instagram</div>
                      <div className="text-gray-400 text-sm">
                        {unidade.contatos.followersInstagram} seguidores
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-brand-pink transition-colors">→</div>
                </a>
                <a
                  href={`https://facebook.com/${unidade.contatos.facebook.replace(/ /g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-brand-pink/10 hover:border-brand-pink/30 border border-gray-700 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-brand-pink group-hover:scale-110 transition-transform">
                      <Facebook className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-white font-medium">Facebook</div>
                      <div className="text-gray-400 text-sm">
                        {unidade.contatos.followersFacebook} seguidores 
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400 group-hover:text-brand-pink transition-colors">→</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
