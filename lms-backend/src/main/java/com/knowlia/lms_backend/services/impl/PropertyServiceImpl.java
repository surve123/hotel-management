package com.knowlia.lms_backend.services.impl;

import com.knowlia.lms_backend.dtos.property.CreatePropertyRequest;
import com.knowlia.lms_backend.dtos.property.PropertyDto;
import com.knowlia.lms_backend.dtos.property.UpdatePropertyRequest;
import com.knowlia.lms_backend.entities.Property;
import com.knowlia.lms_backend.exceptions.BadRequestException;
import com.knowlia.lms_backend.exceptions.ResourceNotFoundException;
import com.knowlia.lms_backend.repositories.PropertyRepository;
import com.knowlia.lms_backend.services.PropertyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<PropertyDto> getAllProperties(boolean onlyActive) {
        List<Property> properties = onlyActive ? propertyRepository.findByActiveTrue() : propertyRepository.findAll();
        return properties.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public PropertyDto getPropertyById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        return mapToDto(property);
    }

    @Override
    @Transactional
    public PropertyDto createProperty(CreatePropertyRequest request) {
        if (propertyRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BadRequestException("Property with name '" + request.getName() + "' already exists");
        }

        Property property = Property.builder()
                .name(request.getName())
                .type(request.getType())
                .address(request.getAddress())
                .city(request.getCity())
                .basePricePerNight(request.getBasePricePerNight())
                .maxGuests(request.getMaxGuests())
                .totalRooms(request.getTotalRooms())
                .description(request.getDescription())
                .imageUrls(request.getImageUrls() != null ? request.getImageUrls() : new ArrayList<>())
                .amenities(request.getAmenities() != null ? request.getAmenities() : new ArrayList<>())
                .active(true)
                .build();

        return mapToDto(propertyRepository.save(property));
    }

    @Override
    @Transactional
    public PropertyDto updateProperty(Long id, UpdatePropertyRequest request) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));

        if (request.getName() != null && !request.getName().equalsIgnoreCase(property.getName())) {
            if (propertyRepository.existsByNameIgnoreCase(request.getName())) {
                throw new BadRequestException("Property with name '" + request.getName() + "' already exists");
            }
            property.setName(request.getName());
        }

        if (request.getType() != null) property.setType(request.getType());
        if (request.getAddress() != null) property.setAddress(request.getAddress());
        if (request.getCity() != null) property.setCity(request.getCity());
        if (request.getBasePricePerNight() != null) property.setBasePricePerNight(request.getBasePricePerNight());
        if (request.getMaxGuests() != null) property.setMaxGuests(request.getMaxGuests());
        if (request.getTotalRooms() != null) property.setTotalRooms(request.getTotalRooms());
        if (request.getDescription() != null) property.setDescription(request.getDescription());
        if (request.getImageUrls() != null) property.setImageUrls(request.getImageUrls());
        if (request.getAmenities() != null) property.setAmenities(request.getAmenities());
        if (request.getActive() != null) property.setActive(request.getActive());

        return mapToDto(propertyRepository.save(property));
    }

    @Override
    @Transactional
    public void deleteProperty(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Property not found with id: " + id));
        property.setActive(false);
        propertyRepository.save(property);
    }

    private PropertyDto mapToDto(Property property) {
        return PropertyDto.builder()
                .id(property.getId())
                .name(property.getName())
                .type(property.getType())
                .address(property.getAddress())
                .city(property.getCity())
                .basePricePerNight(property.getBasePricePerNight())
                .maxGuests(property.getMaxGuests())
                .totalRooms(property.getTotalRooms())
                .description(property.getDescription())
                .imageUrls(property.getImageUrls())
                .amenities(property.getAmenities())
                .active(property.isActive())
                .createdAt(property.getCreatedAt())
                .updatedAt(property.getUpdatedAt())
                .build();
    }
}
