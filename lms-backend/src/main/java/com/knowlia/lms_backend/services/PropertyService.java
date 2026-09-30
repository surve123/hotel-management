package com.knowlia.lms_backend.services;

import com.knowlia.lms_backend.dtos.property.CreatePropertyRequest;
import com.knowlia.lms_backend.dtos.property.PropertyDto;
import com.knowlia.lms_backend.dtos.property.UpdatePropertyRequest;

import java.util.List;

public interface PropertyService {

    List<PropertyDto> getAllProperties(boolean onlyActive);

    PropertyDto getPropertyById(Long id);

    PropertyDto createProperty(CreatePropertyRequest request);

    PropertyDto updateProperty(Long id, UpdatePropertyRequest request);

    void deleteProperty(Long id);
}
