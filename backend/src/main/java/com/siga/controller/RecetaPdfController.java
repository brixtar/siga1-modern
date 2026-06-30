package com.siga.controller;

import com.siga.service.RecetaPdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/consultas")
public class RecetaPdfController {

    @Autowired
    private RecetaPdfService recetaPdfService;

    @GetMapping("/{id}/receta-pdf")
    public ResponseEntity<byte[]> downloadRecetaPdf(@PathVariable Long id) {
        byte[] pdfBytes = recetaPdfService.generateRecetaPdf(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("receta-consulta-" + id + ".pdf")
                .build());

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}
