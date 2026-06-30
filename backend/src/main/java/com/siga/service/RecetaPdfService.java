package com.siga.service;

import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.*;
import com.siga.entity.Consulta;
import com.siga.entity.ConsultaMedicamento;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.ConsultaMedicamentoRepository;
import com.siga.repository.ConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RecetaPdfService {

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private ConsultaMedicamentoRepository consultaMedicamentoRepository;

    public byte[] generateRecetaPdf(Long consultaId) {
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta not found: " + consultaId));

        List<ConsultaMedicamento> medicamentos = consultaMedicamentoRepository.findByConsultaId(consultaId);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);

        try {
            PdfWriter.getInstance(document, baos);
            document.open();

            // Fuentes
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new Color(13, 148, 136)); // Teal
            Font subHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
            Font regularBold = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 9, Color.BLACK);
            Font regularText = FontFactory.getFont(FontFactory.HELVETICA, 9, Color.BLACK);
            Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 8, Color.GRAY);

            // Cabecera Principal
            Paragraph title = new Paragraph("SIGA - SISTEMA DE GESTIÓN VETERINARIA", headerFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(5);
            document.add(title);

            Paragraph subtitle = new Paragraph("Hospital Veterinario Universitario - Receta Médica Oficial", subHeaderFont);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            subtitle.setSpacingAfter(20);
            document.add(subtitle);

            // Separador Teal
            PdfPTable separator = new PdfPTable(1);
            separator.setWidthPercentage(100);
            PdfPCell sepCell = new PdfPCell();
            sepCell.setBorder(Rectangle.NO_BORDER);
            sepCell.setBackgroundColor(new Color(13, 148, 136));
            sepCell.setFixedHeight(3f);
            separator.addCell(sepCell);
            separator.setSpacingAfter(15);
            document.add(separator);

            // Tabla 1: Información de Consulta y Profesionales (2 columnas)
            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setWidths(new float[]{1f, 1f});
            infoTable.setSpacingAfter(15);

            // Celda 1: Datos Médicos
            PdfPCell cellMedicos = new PdfPCell();
            cellMedicos.setBorder(Rectangle.NO_BORDER);
            cellMedicos.setPadding(5);
            
            String veterinario = (consulta.getDoctor() != null) 
                    ? consulta.getDoctor().getNombre() + " " + consulta.getDoctor().getApellido() 
                    : "No asignado";
            String matricula = (consulta.getDoctor() != null && consulta.getDoctor().getMatricula() != null)
                    ? consulta.getDoctor().getMatricula()
                    : "N/A";
            String alumno = (consulta.getAlumno() != null)
                    ? consulta.getAlumno().getNombre() + " " + consulta.getAlumno().getApellido()
                    : "Sin ayudante";

            Paragraph pMedicos = new Paragraph();
            pMedicos.add(new Chunk("Médico Veterinario: ", regularBold));
            pMedicos.add(new Chunk(veterinario + "\n", regularText));
            pMedicos.add(new Chunk("Matrícula: ", regularBold));
            pMedicos.add(new Chunk(matricula + "\n", regularText));
            pMedicos.add(new Chunk("Alumno Asistente: ", regularBold));
            pMedicos.add(new Chunk(alumno, regularText));
            cellMedicos.addElement(pMedicos);
            infoTable.addCell(cellMedicos);

            // Celda 2: Datos de Fecha e ID de Consulta
            PdfPCell cellFecha = new PdfPCell();
            cellFecha.setBorder(Rectangle.NO_BORDER);
            cellFecha.setPadding(5);

            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
            String fechaStr = consulta.getFecha() != null ? consulta.getFecha().format(formatter) : "N/A";
            String casoId = consulta.getCasoClinico() != null ? consulta.getCasoClinico() : "Caso #" + consulta.getId();

            Paragraph pFecha = new Paragraph();
            pFecha.add(new Chunk("Caso Clínico: ", regularBold));
            pFecha.add(new Chunk(casoId + "\n", regularText));
            pFecha.add(new Chunk("Fecha y Hora: ", regularBold));
            pFecha.add(new Chunk(fechaStr, regularText));
            cellFecha.addElement(pFecha);
            infoTable.addCell(cellFecha);

            document.add(infoTable);

            // Tabla 2: Ficha del Paciente y Propietario
            Paragraph secPatient = new Paragraph("DATOS DEL PACIENTE", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(13, 148, 136)));
            secPatient.setSpacingAfter(5);
            document.add(secPatient);

            PdfPTable patientTable = new PdfPTable(4);
            patientTable.setWidthPercentage(100);
            patientTable.setWidths(new float[]{1.2f, 1.8f, 1.2f, 1.8f});
            patientTable.setSpacingAfter(20);

            // Fila 1: Paciente y Especie
            patientTable.addCell(createCell("Paciente (Mascota):", regularBold, true));
            patientTable.addCell(createCell(consulta.getAnimal() != null ? consulta.getAnimal().getNombre() : "N/A", regularText, false));
            patientTable.addCell(createCell("Especie:", regularBold, true));
            patientTable.addCell(createCell(consulta.getAnimal() != null && consulta.getAnimal().getEspecie() != null ? consulta.getAnimal().getEspecie().getEspecie() : "N/A", regularText, false));

            // Fila 2: Raza y Sexo
            patientTable.addCell(createCell("Raza:", regularBold, true));
            patientTable.addCell(createCell(consulta.getAnimal() != null && consulta.getAnimal().getRaza() != null ? consulta.getAnimal().getRaza().getRaza() : "N/A", regularText, false));
            patientTable.addCell(createCell("Sexo / Peso:", regularBold, true));
            String sexo = consulta.getAnimal() != null ? consulta.getAnimal().getSexo() : "N/A";
            Double peso = consulta.getAnimal() != null ? consulta.getAnimal().getPeso() : null;
            String pesoStr = peso != null ? peso + " kg" : "N/A";
            patientTable.addCell(createCell(sexo + " / " + pesoStr, regularText, false));

            // Fila 3: Propietario y DNI
            String propietario = (consulta.getAnimal() != null && consulta.getAnimal().getDuenio() != null)
                    ? consulta.getAnimal().getDuenio().getNombre() + " " + consulta.getAnimal().getDuenio().getApellido()
                    : "N/A";
            String dni = (consulta.getAnimal() != null && consulta.getAnimal().getDuenio() != null)
                    ? consulta.getAnimal().getDuenio().getDni()
                    : "N/A";
            patientTable.addCell(createCell("Propietario:", regularBold, true));
            patientTable.addCell(createCell(propietario, regularText, false));
            patientTable.addCell(createCell("DNI Dueño:", regularBold, true));
            patientTable.addCell(createCell(dni, regularText, false));

            document.add(patientTable);

            // Tabla 3: Medicamentos Prescritos
            Paragraph secMeds = new Paragraph("MEDICAMENTOS PRESCRITOS", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(13, 148, 136)));
            secMeds.setSpacingAfter(5);
            document.add(secMeds);

            PdfPTable medsTable = new PdfPTable(3);
            medsTable.setWidthPercentage(100);
            medsTable.setWidths(new float[]{2.5f, 1f, 3.5f});
            medsTable.setSpacingAfter(15);

            // Encabezados
            medsTable.addCell(createHeaderCell("Medicamento", regularBold));
            medsTable.addCell(createHeaderCell("Cantidad", regularBold));
            medsTable.addCell(createHeaderCell("Dosificación e Indicaciones", regularBold));

            if (medicamentos.isEmpty()) {
                PdfPCell emptyCell = new PdfPCell(new Paragraph("No se prescribieron medicamentos farmacéuticos en esta consulta.", regularText));
                emptyCell.setColspan(3);
                emptyCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                emptyCell.setPadding(10);
                medsTable.addCell(emptyCell);
            } else {
                for (ConsultaMedicamento cm : medicamentos) {
                    medsTable.addCell(createCell(cm.getMedicamento().getNombre(), regularText, false));
                    medsTable.addCell(createCell(cm.getCantidad() + " " + cm.getMedicamento().getUnidadMedida(), regularText, false));
                    medsTable.addCell(createCell(cm.getDosificacion() != null ? cm.getDosificacion() : "Según indicación general", regularText, false));
                }
            }

            document.add(medsTable);

            // Indicaciones Adicionales
            if (consulta.getIndicaciones() != null && !consulta.getIndicaciones().trim().isEmpty()) {
                Paragraph secIndic = new Paragraph("INDICACIONES ADICIONALES", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, new Color(13, 148, 136)));
                secIndic.setSpacingAfter(5);
                document.add(secIndic);

                Paragraph pIndic = new Paragraph(consulta.getIndicaciones(), regularText);
                pIndic.setSpacingAfter(40);
                document.add(pIndic);
            } else {
                // Espaciado antes de la firma
                Paragraph spacer = new Paragraph("\n\n");
                document.add(spacer);
            }

            // Sección de Firma (al final a la derecha)
            PdfPTable signatureTable = new PdfPTable(2);
            signatureTable.setWidthPercentage(100);
            signatureTable.setWidths(new float[]{1.5f, 1f});

            PdfPCell cellEmpty = new PdfPCell();
            cellEmpty.setBorder(Rectangle.NO_BORDER);
            signatureTable.addCell(cellEmpty);

            PdfPCell cellSign = new PdfPCell();
            cellSign.setBorder(Rectangle.NO_BORDER);
            cellSign.setHorizontalAlignment(Element.ALIGN_CENTER);
            Paragraph line = new Paragraph("_________________________", regularBold);
            line.setAlignment(Element.ALIGN_CENTER);
            cellSign.addElement(line);
            
            Paragraph signLabel = new Paragraph("Firma y Sello del Profesional\nMatrícula: " + matricula, regularBold);
            signLabel.setAlignment(Element.ALIGN_CENTER);
            cellSign.addElement(signLabel);
            signatureTable.addCell(cellSign);

            document.add(signatureTable);

            // Pie de página de validez académica
            Paragraph foot = new Paragraph("\n\n* Documento emitido y validado digitalmente por el Sistema SIGA Modern para uso clínico académico universitario.", footerFont);
            foot.setAlignment(Element.ALIGN_CENTER);
            document.add(foot);

            document.close();

        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return baos.toByteArray();
    }

    private PdfPCell createCell(String text, Font font, boolean isHeader) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(6);
        if (isHeader) {
            cell.setBackgroundColor(new Color(243, 244, 246)); // Gray 100
        }
        cell.setBorderColor(new Color(229, 231, 235)); // Gray 200
        return cell;
    }

    private PdfPCell createHeaderCell(String text, Font font) {
        PdfPCell cell = new PdfPCell(new Paragraph(text, font));
        cell.setPadding(8);
        cell.setBackgroundColor(new Color(224, 242, 254)); // Light blue 100
        cell.setBorderColor(new Color(186, 230, 253)); // Light blue 200
        return cell;
    }
}
