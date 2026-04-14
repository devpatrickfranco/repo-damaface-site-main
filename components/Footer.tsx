'use client';

import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import Modal  from './Modal'

import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { useState } from 'react'
import { newsletter } from '@/lib/utils'


const Footer = () => {

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    if (!email.trim()) {
      toast.error('Por favor, digite seu email');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Por favor, digite um email válido');
      return;
    }

    setIsLoading(true);
    
    try {
      await newsletter(email);
      
      // Sucesso
      toast.success('Newsletter cadastrada com sucesso! 🎉');
      setEmail(''); // Limpa o campo
      
    } catch (error) {
      // Erro
      toast.error('Ops! Algo deu errado. Tente novamente.');
      console.error('Erro ao cadastrar newsletter:', error);
      
    } finally {
      setIsLoading(false);
    }
  };

  // Função para envio com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubscribe();
    }
  };

  const quickLinks = [
    // Facial
    { name: 'Harmonização Facial', href: '/procedimentos/harmonizacao-facial' },
    { name: 'Toxina Botulínica', href: '/procedimentos/toxina-botulinica' },
    { name: 'Bioestimulador de Colágeno', href: '/procedimentos/bioestimulador-de-colageno' },
    { name: 'Preenchimento Facial', href: '/procedimentos/preenchimento-facial' },
    { name: 'Fios de Sustentação', href: '/procedimentos/fios-de-sustentacao' },
    { name: 'Lipo de Papada', href: '/procedimentos/lipo-de-papada' },
    { name: 'Skinbooster', href: '/procedimentos/skinbooster' },
    { name: 'Peeling Químico', href: '/procedimentos/peeling-quimico' },
    // Corporal
    { name: 'Bioestimulador Corporal', href: '/procedimentos/bioestimulador-corporal' },
    { name: 'PEIM', href: '/procedimentos/peim' },
    { name: 'Preenchimento de Glúteo', href: '/procedimentos/preenchimento-de-gluteo' },
    { name: 'Enzimas para Gordura Localizada', href: '/procedimentos/enzimas-para-gordura-localizada' },
    { name: 'Massagem Relaxante', href: '/procedimentos/massagem-relaxante' },
    { name: 'Massagem Modeladora', href: '/procedimentos/massagem-modeladora' },
    // Não Invasivos
    { name: 'Ultraformer', href: '/procedimentos/ultraformer' },
    { name: 'Lavieen', href: '/procedimentos/lavieen' },
    { name: 'Criolipólise', href: '/procedimentos/criolipolise' },
    { name: 'Laser CO2', href: '/procedimentos/laser-co2' },
    { name: 'Depilação a Laser', href: '/procedimentos/depilacao-a-laser' },
    { name: 'Limpeza de Pele', href: '/procedimentos/limpeza-de-pele' },
    { name: 'Microagulhamento', href: '/procedimentos/microagulhamento' }
  ];


  const services = [
    { name: 'Tratamentos Faciais', href: '/facial' },
    { name: 'Tratamentos Corporais', href: '/corporal' },
    { name: 'Procedimentos Não Invasivos', href: '/nao-invasivos' },
    { name: 'Seja um Franqueado', href: 'https://franquia.damaface.com.br/' }
  ];

  const company = [
    { name: 'Blog', href: '/blog' },
    { name: 'Sobre Nós', href: '/#about' },
    // { name: 'Contato', href: '/contato' },
  ];

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-16">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="http://damaface.com.br/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png"
                alt="DamaFace"
                width={200}
                height={60}
                className="h-12 w-auto"
              />
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Especialistas em estética facial e corporal, oferecendo tratamentos 
              personalizados com resultados naturais e duradouros. Tecnologia de 
              ponta e profissionais certificados para sua segurança e satisfação.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4 text-brand-pink" />
                <span>(19) 98217-7463</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4 text-brand-pink" />
                <span>contato@damaface.com.br</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-400">
                <MapPin className="w-4 h-4 text-brand-pink mt-0.5" />
                <span>R. Gustavo Ambrust, 36 <br />Nova Campinas - Campinas/SP<br />CEP: 13092-106</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              <a
                href="https://instagram.com/damafacefranquias"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/profile.php?id=61555121465049"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 rounded-lg text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Procedimentos</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-6">Serviços</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-6">Empresa</h3>
            <ul className="space-y-3 mb-6">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-brand-pink transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Business Hours */}
            <div>
              <h4 className="text-white font-medium mb-3 text-sm">Horários</h4>
              <div className="text-gray-400 text-xs space-y-1">
                <p>Seg - Sex: 9h às 18h</p>
                <p>Sábado: 9h às 14h</p>
                <p className="text-brand-pink">Domingo: Fechado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 py-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-3">Receba nossas novidades</h3>
            <p className="text-gray-400 text-sm mb-4">
              Dicas exclusivas de beleza e promoções especiais direto no seu e-mail
            </p>
            <div className="flex gap-3">
              <input
                 type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Seu melhor e-mail"
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-brand-pink transition-colors"
              />
              <button 
                onClick={handleSubscribe} 
                disabled={isLoading}
                className="bg-brand-pink hover:bg-brand-pink/90 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors">
                {isLoading ? 'Cadastrando...' : 'Assinar Newsletter'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
            <p>
              © 2025 DamaFace Clínica de Estética. Todos os direitos reservados.
            </p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 md:mt-0 items-center">
              <Modal 
                title="Termos de Uso"
                anchor="termsofservice"
                content={`
              Termos de Uso do Site DamaFace

              Estes Termos de Uso regem o uso do site DamaFace (damaface.com). Ao acessar ou usar o site, você concorda com estes termos e condições.

              Uso do Site:

              Você concorda em usar o site DamaFace apenas para fins legais e de acordo com estes Termos de Uso.

              Você é responsável por garantir que todas as informações fornecidas durante o uso do site sejam precisas, completas e atualizadas.

              Você concorda em não usar o site de forma que possa danificar, desativar, sobrecarregar ou prejudicar o funcionamento do site ou interferir no uso e gozo de qualquer outra parte.

              Propriedade Intelectual:

              O site DamaFace e todo o seu conteúdo, incluindo textos, gráficos, logotipos, imagens, vídeos, áudios e software, são de propriedade exclusiva ou licenciados para nós e estão protegidos por leis de direitos autorais e outras leis de propriedade intelectual.

              Você concorda em não reproduzir, distribuir, modificar, criar trabalhos derivados, exibir publicamente, realizar publicamente, republicar, baixar, armazenar ou transmitir qualquer parte do conteúdo do site sem a nossa autorização prévia por escrito.

              Links para Outros Sites:

              O site DamaFace pode conter links para sites de terceiros que não são controlados ou operados por nós. Não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas de qualquer site de terceiros.

              O uso de sites de terceiros está sujeito aos termos e condições e políticas de privacidade desses sites.

              Limitação de Responsabilidade:

              O site DamaFace é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas.

              Não garantimos que o site seja livre de erros ou que seu acesso será ininterrupto.

              Em nenhuma circunstância seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequentes ou punitivos decorrentes do uso ou incapacidade de usar o site.

              Alterações nos Termos de Uso:

              Reservamo-nos o direito de modificar ou substituir estes Termos de Uso a qualquer momento, e tais alterações entrarão em vigor imediatamente após serem publicadas no site.

              Ao continuar a acessar ou usar o site após quaisquer alterações nos Termos de Uso, você concorda em ficar vinculado aos Termos de Uso revisados.

              Se tiver alguma dúvida ou preocupação sobre estes Termos de Uso, entre em contato conosco através do e-mail contato@damaface.com.br
              `}
              />

              <Modal 
                title="Política de Privacidade"
                anchor="privacypolicy"
                content={`
              Política de Privacidade do Site DamaFace

              A privacidade dos nossos visitantes é extremamente importante para nós. Esta política de privacidade descreve os tipos de informações pessoais que são recebidas e coletadas pelo site DamaFace (damaface.com) e como essas informações são utilizadas.

              Informações que Coletamos:

              Informações Pessoais Voluntárias: Podemos coletar informações pessoais que você nos fornece voluntariamente ao preencher formulários no site, como nome, endereço de e-mail, número de telefone e outras informações relevantes para a interação com o site.

              Informações de Navegação: O nosso servidor registra automaticamente informações como o seu endereço IP, tipo de navegador, páginas de referência/saída e URLs, horários de acesso e cliques para analisar tendências, administrar o site, rastrear o movimento do usuário e reunir informações demográficas.

              Uso das Informações:

              Melhoria do Site: Utilizamos as informações coletadas para entender como os usuários utilizam o site e para melhorar a sua experiência de navegação.

              Comunicação: Podemos utilizar o seu endereço de e-mail para responder às suas dúvidas, fornecer informações solicitadas ou enviar atualizações sobre o site e seus serviços, desde que tenhamos obtido o seu consentimento para fazê-lo.

              Marketing: Podemos utilizar informações de contato para enviar comunicações de marketing sobre produtos, serviços, promoções ou eventos especiais, sempre que tenhamos obtido o seu consentimento para fazê-lo.

              Proteção das Informações:

              Tomamos precauções razoáveis para proteger as informações pessoais dos nossos usuários contra acesso não autorizado, alteração, divulgação ou destruição.

              Cookies e Tecnologias Semelhantes:

              O site DamaFace utiliza cookies e outras tecnologias de rastreamento para personalizar a sua experiência de navegação e para coletar informações sobre como você interage com o site.

              Você pode controlar o uso de cookies nas configurações do seu navegador. No entanto, desativar os cookies pode afetar a sua capacidade de utilizar algumas partes do site.

              Compartilhamento de Informações:

              Não vendemos, comercializamos ou alugamos informações pessoais dos nossos usuários a terceiros.

              Podemos compartilhar informações pessoais com terceiros que nos prestam serviços de suporte, desde que essas partes concordem em manter a confidencialidade das informações.

              Alterações na Política de Privacidade:

              Reservamo-nos o direito de fazer alterações nesta política de privacidade a qualquer momento, e tais alterações entrarão em vigor imediatamente após serem publicadas no site.

              Ao utilizar o site DamaFace, você concorda com esta política de privacidade. Se tiver alguma dúvida ou preocupação sobre esta política, entre em contato conosco através do e-mail contato@damaface.com.br
              `}
              />

              <Modal
                title="Exclusão de Dados"
                anchor="datadeletion"
                content={`
              Política de Exclusão de Dados — DamaFace

              A DamaFace respeita o seu direito à privacidade e ao controle sobre seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).

              Newsletter e Cancelamento de Inscrição:

              Ao se inscrever em nossa newsletter, você fornece voluntariamente o seu endereço de e-mail para receber dicas de beleza, novidades e promoções da DamaFace.

              Para cancelar sua inscrição a qualquer momento, basta clicar no link "Cancelar inscrição" (Unsubscribe) presente no rodapé de qualquer e-mail que você receber de nós. O cancelamento é imediato e você não receberá novas comunicações após a confirmação.

              Exclusão dos Dados de Inscrição:

              Ao solicitar o cancelamento da inscrição ou da conta, seus dados pessoais (como endereço de e-mail) são removidos permanentemente de nossa base de dados.

              A DamaFace não retém nem armazena seus dados após a exclusão solicitada pelo usuário. Não realizamos backup ou cópias de segurança de informações após a remoção.

              Após a exclusão, não é possível recuperar os dados, e nenhuma comunicação de marketing será enviada ao e-mail removido.

              Dados de Terceiros:

              Não compartilhamos seus dados com terceiros para fins de marketing. Parceiros de suporte técnico que eventualmente tenham acesso à infraestrutura são contratualmente obrigados a manter a confidencialidade e a não utilizar os dados para fins próprios.

              Como Solicitar a Exclusão:

              Além do link de cancelamento nos e-mails, você pode solicitar a exclusão completa dos seus dados entrando em contato pelo e-mail: contato@damaface.com.br

              Responderemos à sua solicitação em até 15 dias úteis, conforme previsto pela LGPD.

              Dúvidas:

              Se tiver dúvidas sobre o tratamento dos seus dados, entre em contato: contato@damaface.com.br
              `}
              />

              <span>CNPJ: 31.336.419/0001-42</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
