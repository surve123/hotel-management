package com.knowlia.lms_backend.controllers;

import com.knowlia.lms_backend.dtos.common.ApiResponse;
import com.knowlia.lms_backend.services.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
public class MediaController {

    private final MediaService mediaService;

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadMedia(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "arnavee_hospitality") String folder
    ) {
        String url = mediaService.uploadMedia(file, folder);
        Map<String, String> data = Map.of(
                "url", url,
                "folder", folder,
                "filename", file.getOriginalFilename() != null ? file.getOriginalFilename() : "media"
        );
        return ResponseEntity.ok(ApiResponse.success(data, "File uploaded successfully"));
    }
}
