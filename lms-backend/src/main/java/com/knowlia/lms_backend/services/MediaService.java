package com.knowlia.lms_backend.services;

import org.springframework.web.multipart.MultipartFile;

public interface MediaService {

    String uploadMedia(MultipartFile file, String folder);
}
