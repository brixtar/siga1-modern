package com.siga.controller;

import com.siga.entity.Consulta;
import com.siga.entity.EstudioMedico;
import com.siga.exception.ResourceNotFoundException;
import com.siga.repository.ConsultaRepository;
import com.siga.repository.EstudioMedicoRepository;
import com.siga.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/estudios")
public class EstudioMedicoController {

    @Autowired
    private EstudioMedicoRepository estudioMedicoRepository;

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private StorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<EstudioMedico> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("consultaId") Long consultaId) {
        
        Consulta consulta = consultaRepository.findById(consultaId)
                .orElseThrow(() -> new ResourceNotFoundException("Consulta no encontrada con id: " + consultaId));
        
        String savedFilename = storageService.store(file);
        
        EstudioMedico estudio = EstudioMedico.builder()
                .nombreArchivo(file.getOriginalFilename())
                .tipoArchivo(file.getContentType())
                .rutaArchivo(savedFilename)
                .fechaSubida(LocalDateTime.now())
                .consulta(consulta)
                .build();
        
        EstudioMedico saved = estudioMedicoRepository.save(estudio);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/consulta/{consultaId}")
    public List<EstudioMedico> getEstudiosByConsulta(@PathVariable Long consultaId) {
        return estudioMedicoRepository.findByConsultaId(consultaId);
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        EstudioMedico estudio = estudioMedicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudio no encontrado con id: " + id));
        
        Path file = storageService.load(estudio.getRutaArchivo());
        try {
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                String contentType = estudio.getTipoArchivo();
                if (contentType == null || contentType.isEmpty()) {
                    contentType = "application/octet-stream";
                }
                
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + estudio.getNombreArchivo() + "\"")
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                throw new RuntimeException("Could not read file: " + estudio.getNombreArchivo());
            }
        } catch (Exception e) {
            throw new RuntimeException("Error downloading file", e);
        }
    }
}
