package com.knowlia.lms_backend.dtos.property;

import com.knowlia.lms_backend.entities.PropertyType;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdatePropertyRequest {

    private String name;
    private PropertyType type;
    private String address;
    private String city;
    private BigDecimal basePricePerNight;
    private Integer maxGuests;
    private Integer totalRooms;
    private String description;
    private List<String> imageUrls;
    private List<String> amenities;
    private Boolean active;
}
