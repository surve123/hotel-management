package com.knowlia.lms_backend.dtos.property;

import com.knowlia.lms_backend.entities.PropertyType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreatePropertyRequest {

    @NotBlank(message = "Property name is required")
    private String name;

    @NotNull(message = "Property type is required")
    private PropertyType type;

    private String address;
    private String city;
    private BigDecimal basePricePerNight;
    private Integer maxGuests;
    private Integer totalRooms;
    private String description;
    private List<String> imageUrls;
    private List<String> amenities;
}
