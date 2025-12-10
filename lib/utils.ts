import axios from "axios";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf";
import type { Aluno } from "@/types/academy";

// api base
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// new newsletter
export const newsletter = (email: string) => {
  return api.post("newsletter", { email }); 
};


// CN
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte uma imagem para base64
 */
async function imageToBase64(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Falha ao converter imagem para base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Erro ao carregar imagem:', error);
    throw error;
  }
}

/**
 * Gera um PDF com relatório do aluno
 * @param aluno - Dados do aluno para o relatório
 */
export async function gerarPDFRelatorio(aluno: Aluno): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Header com fundo preto e logo centralizada
  doc.setFillColor(0, 0, 0); // Preto
  doc.rect(0, 0, pageWidth, 60, 'F'); // Retângulo preto no topo

  try {
    // Carregar e adicionar logo
    const logoPath = '/LOGO-DAMAFACE-HORIZONTAL-BRANCO.png';
    const logoBase64 = await imageToBase64(logoPath);
    
    // Calcular dimensões da logo (ajustar conforme necessário)
    const logoWidth = 80;
    const logoHeight = (logoWidth * 0.3); // Proporção aproximada
    const logoX = (pageWidth - logoWidth) / 2; // Centralizado
    const logoY = 10;
    
    doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);
  } catch (error) {
    console.error('Erro ao carregar logo, continuando sem ela:', error);
  }

  // Espaço após o header
  yPosition = 80;

  // Título do relatório
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Relatório de Desempenho do Aluno', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Informações do aluno
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Informações do Aluno', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${aluno.usuario.nome}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Email: ${aluno.usuario.email}`, margin, yPosition);
  yPosition += 7;
  if (aluno.telefone) {
    doc.text(`Telefone: ${aluno.telefone}`, margin, yPosition);
    yPosition += 7;
  }
  doc.text(`Status: ${aluno.status}`, margin, yPosition);
  yPosition += 7;
  if (aluno.dataMatricula) {
    doc.text(`Data de Matrícula: ${new Date(aluno.dataMatricula).toLocaleDateString('pt-BR')}`, margin, yPosition);
    yPosition += 7;
  }
  if (aluno.usuario.franquia_nome) {
    doc.text(`Franquia: ${aluno.usuario.franquia_nome}`, margin, yPosition);
    yPosition += 7;
  }
  yPosition += 5;

  // Estatísticas gerais
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Estatísticas Gerais', margin, yPosition);
  yPosition += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total de Cursos: ${aluno.estatisticas.totalCursos}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Cursos Completos: ${aluno.estatisticas.cursosCompletos}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Cursos em Andamento: ${aluno.estatisticas.cursosEmAndamento}`, margin, yPosition);
  yPosition += 7;
  doc.text(`Total de Horas Estudadas: ${aluno.estatisticas.totalHorasEstudadas}h`, margin, yPosition);
  yPosition += 7;
  doc.text(`Média Geral: ${aluno.estatisticas.mediaNotas.toFixed(1)}%`, margin, yPosition);
  yPosition += 7;
  doc.text(`Streak de Dias: ${aluno.estatisticas.streakDias} dias`, margin, yPosition);
  yPosition += 7;
  doc.text(`Tempo Médio por Sessão: ${aluno.estatisticas.tempoMedioSessao}min`, margin, yPosition);
  yPosition += 7;
  doc.text(`Dias Ativos: ${aluno.estatisticas.diasAtivo} dias`, margin, yPosition);
  yPosition += 7;
  if (aluno.estatisticas.ultimoAcesso) {
    doc.text(`Último Acesso: ${new Date(aluno.estatisticas.ultimoAcesso).toLocaleDateString('pt-BR')}`, margin, yPosition);
    yPosition += 7;
  }
  yPosition += 5;

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  // Progresso dos cursos
  if (aluno.cursosProgresso.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Progresso dos Cursos', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    aluno.cursosProgresso.forEach((curso, index) => {
      // Verificar se precisa de nova página
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${curso.titulo}`, margin, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`   Status: ${curso.status}`, margin + 5, yPosition);
      yPosition += 6;
      doc.text(`   Progresso: ${curso.progresso}%`, margin + 5, yPosition);
      yPosition += 6;
      doc.text(`   Data de Início: ${new Date(curso.dataInicio).toLocaleDateString('pt-BR')}`, margin + 5, yPosition);
      yPosition += 6;
      
      if (curso.dataUltimoacesso) {
        doc.text(`   Último Acesso: ${new Date(curso.dataUltimoacesso).toLocaleDateString('pt-BR')}`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      if (curso.dataTermino) {
        doc.text(`   Data de Conclusão: ${new Date(curso.dataTermino).toLocaleDateString('pt-BR')}`, margin + 5, yPosition);
        yPosition += 6;
      }

      if (curso.quiz) {
        doc.text(`   Quiz - Melhor Nota: ${curso.quiz.melhorNota}%`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`   Quiz - Aprovado: ${curso.quiz.aprovado ? 'Sim' : 'Não'}`, margin + 5, yPosition);
        yPosition += 6;
        doc.text(`   Tentativas: ${curso.quiz.tentativas.length}`, margin + 5, yPosition);
        yPosition += 6;
      }
      
      yPosition += 5;
    });
  }

  // Verificar se precisa de nova página
  if (yPosition > pageHeight - 60) {
    doc.addPage();
    yPosition = margin;
  }

  // Certificados
  if (aluno.certificados.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificados Obtidos', margin, yPosition);
    yPosition += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    aluno.certificados.forEach((certificado, index) => {
      // Verificar se precisa de nova página
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${certificado.cursoTitulo}`, margin, yPosition);
      yPosition += 6;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`   Nota Final: ${certificado.notaFinal}%`, margin + 5, yPosition);
      yPosition += 6;
      doc.text(`   Carga Horária: ${certificado.cargaHoraria}`, margin + 5, yPosition);
      yPosition += 6;
      doc.text(`   Código: ${certificado.codigo}`, margin + 5, yPosition);
      yPosition += 6;
      doc.text(`   Data de Emissão: ${new Date(certificado.dataEmissao).toLocaleDateString('pt-BR')}`, margin + 5, yPosition);
      yPosition += 8;
    });
  }

  // Rodapé
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      `Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  }

  // Salvar o PDF
  const fileName = `relatorio-${aluno.usuario.nome.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
