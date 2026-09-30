package com.knowlia.lms_backend.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.knowlia.lms_backend.exceptions.BadRequestException;
import com.knowlia.lms_backend.services.MediaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryMediaServiceImpl implements MediaService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadMedia(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty");
        }

        try {
            String uploadFolder = (folder != null && !folder.trim().isEmpty()) ? folder : "arnavee_hospitality";
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", uploadFolder,
                            "resource_type", "auto"
                    )
            );
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            log.error("Failed to upload file to Cloudinary", e);
            throw new RuntimeException("Cloudinary upload failed: " + e.getMessage());
        }
    }
}
