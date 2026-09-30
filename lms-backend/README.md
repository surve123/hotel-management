# ⚙️ Aranavee Hospitality — LMS Backend

> **Project:** Lead Management System (LMS) — Backend  
> **Client:** Aranavee Hospitality  
> **Built by:** Knowlia  
> **Framework:** Spring Boot 3.4.x (Java 17)  
> **Database:** PostgreSQL (Railway Managed)  
> **Security:** Spring Security + Stateless JWT + RBAC  
> **ORM:** Spring Data JPA + Hibernate + Lombok  
> **Media:** Cloudinary Java SDK  
> **Reports & Email:** Apache POI + OpenCSV + JavaMailSender (Gmail SMTP)  
> **Status:** 🔨 In Active Development  

---

## 📑 Table of Contents

1. [📌 Project Overview & Scope](#-project-overview--scope)
2. [🗺️ Complete 8-Part UI-to-Backend Architecture Mapping](#️-complete-8-part-ui-to-backend-architecture-mapping)
3. [📧 Automated Email Backup & Reporting Engine](#-automated-email-backup--reporting-engine)
4. [👥 User Roles & Access Control (RBAC)](#-user-roles--access-control-rbac)
5. [🏛️ Database Schema & ER Architecture](#️-database-schema--er-architecture)
6. [🧩 Entity Data Models (Lombok Annotated)](#-entity-data-models-lombok-annotated)
7. [📡 Complete REST API Specifications](#-complete-rest-api-specifications)
8. [📁 Directory & Package Architecture](#-directory--package-architecture)
9. [⚙️ Environment Variables & Configuration](#️-environment-variables--configuration)
10. [🚀 Local Setup & Quickstart Guide](#-local-setup--quickstart-guide)

---

## 📌 Project Overview & Scope

The **Aranavee Hospitality Lead Management System (LMS) Backend** is an enterprise-grade RESTful API built on **Spring Boot 3** and **Java 17**. It serves as the core business logic, persistence, and reporting hub for managing sales funnels, telecaller allocations, customer follow-ups, reservation payments, and automated offline management email backups across multiple luxury properties (*Celebrino Garden Villa*, *Pulse Resort*, etc.).

---

## 🗺️ Complete 8-Part UI-to-Backend Architecture Mapping

The backend is built 1-to-1 against the 8 UI/UX modules and 32 screens:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           ARNAVEE HOSPITALITY LMS — 8 SYSTEM MODULES                            │
├──────────────────────────────┬──────────────────────────────────┬───────────────────────────────┤
│ 1. Auth & Admin Dashboard    │ 2. Lead Management CRM           │ 3. Follow-up Operations       │
│    • Login & Session Auth    │    • Advanced Filter Data Table  │    • Follow-up Dashboard      │
│    • Multi-Property Analytics│    • Add Lead & Timeline         │    • FullCalendar Schedule    │
│    • Quick Actions & Alerts  │    • Lead Assignment & Workload  │    • Call Logs & CRM History  │
├──────────────────────────────┼──────────────────────────────────┼───────────────────────────────┤
│ 4. Telecaller Workspace      │ 5. Property Management           │ 6. Bookings & 360° Customer   │
│    • Scoped My Dashboard     │    • Multi-Property Showcase     │    • Booking Pipeline         │
│    • Quick Call / WhatsApp   │    • Property CRUD & Amenities   │    • Payment Ledger (INR)     │
│    • Simplified CRM Details  │    • Property-Level Analytics    │    • 360° Customer Profile    │
├──────────────────────────────┼──────────────────────────────────┼───────────────────────────────┤
│ 7. Reports & Analytics       │ 8. Administration & Settings     │                               │
│    • Source & Conversion Funnel • User Roster & RBAC            │                               │
│    • Telecaller Performance  │    • Dynamic Config (Status/Src) │                               │
│    • Automated Cron Mailers  │    • Audit Logs & Settings       │                               │
└──────────────────────────────┴──────────────────────────────────┴───────────────────────────────┘
```

---

## 📧 Automated Email Backup & Reporting Engine

To prevent data loss and ensure permanent management records, the system executes automated background cron jobs:

### 1. ⏰ Daily Midnight Report (`0 0 0 * * *`)
- **Trigger**: Every midnight at 12:00 AM
- **Email Subject**: `[Aranavee Hospitality] Daily LMS Report & Payments - DD/MM/YYYY`
- **Body**: Rich HTML executive summary (New leads, calls logged, bookings closed, payments collected in INR, pending follow-ups).
- **Attachment**: `Daily_Transactions_YYYY-MM-DD.csv` for raw offline record archiving.

### 2. 📅 Monthly Executive Excel Report (`0 0 0 L * *`)
- **Trigger**: Last day of every month at midnight
- **Attachment**: Multi-Tab Excel Workbook (`.xlsx`) generated using **Apache POI**:
  - **Tab 1 — Executive Summary**: Gross revenue, conversion rates, booking counts.
  - **Tab 2 — Payments Ledger**: Complete record of all advances and balances received.
  - **Tab 3 — Property Performance**: Celebrino Garden Villa vs Pulse Resort vs 3rd Property comparison.
  - **Tab 4 — Telecaller Rankings**: Performance leaderboard (calls made, leads converted, total sales).
  - **Tab 5 — Leads Raw Dump**: 100% full dataset backup.

---

## 👥 User Roles & Access Control (RBAC)

| Role | Access Scope |
| :--- | :--- |
| **`ROLE_SUPER_ADMIN`** | Full platform access — all properties, leads, financials, team management, system settings, and audit logs. |
| **`ROLE_ADMIN`** | Property-level lead management, telecaller assignment, follow-up monitoring, and property reports. |
| **`ROLE_TELECALLER`** | Restricted to own assigned leads, calling logs, scheduled follow-ups, and personal performance dashboard. |

---

## 🏛️ Database Schema & ER Architecture

```
┌────────────────────────┐         ┌────────────────────────┐
│         USERS          │ 1     * │         LEADS          │
│────────────────────────│─────────│────────────────────────│
│ id (BIGSERIAL PK)      │         │ id (BIGSERIAL PK)      │
│ username (VARCHAR UK)  │         │ customer_name (VARCHAR)│
│ email (VARCHAR UK)     │         │ mobile_number (VARCHAR)│
│ password (VARCHAR)     │         │ email (VARCHAR)        │
│ full_name (VARCHAR)    │         │ number_of_guests (INT) │
│ role (ENUM)            │         │ check_in_date (DATE)   │
│ phone (VARCHAR)        │         │ check_out_date (DATE)  │
│ is_active (BOOLEAN)    │         │ source (ENUM)          │
│ created_at (TIMESTAMP) │         │ status (ENUM)          │
│ updated_at (TIMESTAMP) │         │ priority (ENUM)        │
└────────────────────────┘         │ budget (DECIMAL)       │
            │                      │ property_id (FK) ──────┼───┐
            │ 1                    │ assigned_to_id (FK) ───┤   │
            │                      │ created_by_id (FK)     │   │
            │                      │ created_at (TIMESTAMP) │   │
            │                      │ updated_at (TIMESTAMP) │   │
            │                      └────────────────────────┘   │
            │                                  │ 1              │
            │                                  │                │
            │ *                                │ *              │
┌────────────────────────┐         ┌────────────────────────┐   │
│       CALL_LOGS        │ *     1 │    LEAD_ACTIVITIES     │   │
│────────────────────────│─────────│────────────────────────│   │
│ id (BIGSERIAL PK)      │         │ id (BIGSERIAL PK)      │   │
│ lead_id (FK)           │         │ lead_id (FK)           │   │
│ user_id (FK)           │         │ user_id (FK)           │   │
│ call_date (TIMESTAMP)  │         │ activity_type (ENUM)   │   │
│ duration_minutes (INT) │         │ description (TEXT)     │   │
│ outcome (ENUM)         │         │ created_at (TIMESTAMP) │   │
│ remarks (TEXT)         │         └────────────────────────┘   │
│ next_followup_date(TS) │                                      │
└────────────────────────┘                                      │
            │                                                   │
            │ 1                                                 │
            │                                                   │
            │ *                                                 │
┌────────────────────────┐                                      │
│        BOOKINGS        │ *                                  1 │
│────────────────────────│──────────────────────────────────────┴──┐
│ id (BIGSERIAL PK)      │                                         │
│ booking_number (UK)    │         ┌───────────────────────────┐   │
│ lead_id (FK)           │         │        PROPERTIES         │   │
│ property_id (FK) ──────┼─────────│───────────────────────────│───┘
│ created_by_id (FK)     │         │ id (BIGSERIAL PK)         │
│ total_amount (DECIMAL) │         │ name (VARCHAR)            │
│ advance_paid (DECIMAL) │         │ type (ENUM: VILLA,RESORT) │
│ balance_due (DECIMAL)  │         │ address (VARCHAR)         │
│ payment_status (ENUM)  │         │ base_price (DECIMAL)      │
│ payment_mode (VARCHAR) │         │ max_guests (INT)          │
│ check_in (DATE)        │         │ is_active (BOOLEAN)       │
│ check_out (DATE)       │         │ image_urls (TEXT[])       │
│ booking_status (ENUM)  │         │ created_at (TIMESTAMP)    │
│ created_at (TIMESTAMP) │         └───────────────────────────┘
└────────────────────────┘
```

---

## 🧩 Entity Data Models (Lombok Annotated)

```java
// BaseAuditEntity.java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter @Setter
public abstract class BaseAuditEntity {
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    @Column(updatable = false)
    private String createdBy;

    @LastModifiedBy
    private String lastModifiedBy;
}

// User.java
@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class User extends BaseAuditEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;
    private String fullName;
    private String phone;
    @Enumerated(EnumType.STRING)
    private Role role; // ROLE_SUPER_ADMIN, ROLE_ADMIN, ROLE_TELECALLER
    @Builder.Default
    private boolean active = true;
}

// Property.java
@Entity
@Table(name = "properties")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Property extends BaseAuditEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name; // Celebrino Garden Villa, Pulse Resort, etc.
    @Enumerated(EnumType.STRING)
    private PropertyType type; // VILLA, RESORT, BANQUET
    private String address;
    private String city;
    private BigDecimal basePricePerNight;
    private Integer maxGuests;
    @ElementCollection
    private List<String> imageUrls;
    @Builder.Default
    private boolean active = true;
}

// Lead.java
@Entity
@Table(name = "leads")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Lead extends BaseAuditEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String customerName;
    @Column(nullable = false)
    private String mobileNumber;
    private String email;
    private Integer numberOfGuests;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    @Enumerated(EnumType.STRING)
    private LeadSource source; // INSTAGRAM, WHATSAPP, WEBSITE, DIRECT_CALL, REFERRAL, OTHER
    @Enumerated(EnumType.STRING)
    private LeadStatus status; // NEW, FOLLOW_UP, HOT, BOOKED, CANCELLED
    @Enumerated(EnumType.STRING)
    private LeadPriority priority; // LOW, MEDIUM, HIGH, URGENT
    private BigDecimal budget;
    private String remarks;
    private LocalDateTime nextFollowupDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "property_id")
    private Property property;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;
}
```

---

## 📡 Complete REST API Specifications

### 🔐 1. Authentication & Profile (`/api/auth`)
- `POST /api/auth/login` — Login with username/password → returns JWT token, roles, user info.
- `GET /api/auth/me` — Current authenticated user profile.
- `POST /api/auth/change-password` — Change password.

### 📊 2. Dashboard Analytics (`/api/dashboard`)
- `GET /api/dashboard/admin/metrics` — All KPI cards (Total/New/Hot/Follow-up Leads, Revenue, Bookings).
- `GET /api/dashboard/admin/trends` — 30-day leads vs bookings trend data.
- `GET /api/dashboard/admin/source-distribution` — Lead source donut dataset.
- `GET /api/dashboard/admin/property-performance` — Property comparison matrix.
- `GET /api/dashboard/telecaller` — Personal scoped KPI metrics for logged-in telecaller.

### 📋 3. Lead Management (`/api/leads`)
- `GET /api/leads` — Multi-filtered paginated leads list.
- `POST /api/leads` — Create lead + auto/manual assign.
- `GET /api/leads/{id}` — Full profile + chronological activity timeline.
- `PUT /api/leads/{id}` — Update lead details.
- `PATCH /api/leads/{id}/status` — Status transition (`NEW`, `FOLLOW_UP`, `HOT`, `BOOKED`, `CANCELLED`).
- `POST /api/leads/{id}/assign` — Assign/reassign to telecaller.
- `POST /api/leads/{id}/call-logs` — Log call outcome & update next follow-up.
- `POST /api/leads/{id}/notes` — Add internal remark.

### 📞 4. Follow-up Operations (`/api/followups`)
- `GET /api/followups/dashboard` — Summary counts (today, overdue, upcoming, missed).
- `GET /api/followups/today` — Follow-ups due today.
- `GET /api/followups/calendar` — FullCalendar range dataset.

### 🏨 5. Property Management (`/api/properties`)
- `GET /api/properties` — List active properties.
- `GET /api/properties/{id}` — Property profile and analytics.
- `POST /api/properties` *(Admin)* — Add property.
- `PUT /api/properties/{id}` *(Admin)* — Update property.

### 💳 6. Bookings & Payments (`/api/bookings`)
- `GET /api/bookings` — Paginated bookings list.
- `POST /api/bookings` — Convert lead to booking (generates `BK-YYYYMM-XXXX`).
- `PATCH /api/bookings/{id}/payment` — Record advance/balance payment transaction.

### 📈 7. Reports & Exports (`/api/reports`)
- `GET /api/reports/sources` — Lead source ROI report.
- `GET /api/reports/telecallers` — Telecaller leaderboard.
- `GET /api/reports/export/leads` — Export leads dataset as Excel (`.xlsx`).
- `POST /api/reports/trigger-daily-email` — Manual trigger for daily midnight report email.

---

## 📁 Directory & Package Architecture

```
lms-backend/
├── src/main/java/com/knowlia/lms_backend/
│   ├── config/
│   │   ├── ApplicationConfig.java      # PasswordEncoder, UserDetailsService
│   │   ├── CloudinaryConfig.java       # Cloudinary bean
│   │   ├── CorsConfig.java             # Web CORS configuration
│   │   ├── JpaAuditConfig.java         # @EnableJpaAuditing
│   │   └── SecurityConfig.java         # Security filter chain & RBAC
│   ├── constants/
│   │   ├── AppConstants.java
│   │   └── SecurityConstants.java
│   ├── controllers/
│   │   ├── AuthController.java
│   │   ├── BookingController.java
│   │   ├── DashboardController.java
│   │   ├── FollowupController.java
│   │   ├── LeadController.java
│   │   ├── MediaController.java
│   │   ├── PropertyController.java
│   │   ├── ReportController.java
│   │   └── UserController.java
│   ├── dtos/
│   │   ├── common/                     # ApiResponse, PageResponse
│   │   ├── auth/                       # LoginRequest, AuthResponse, UserProfileDto
│   │   ├── dashboard/                  # DashboardStatsDto, SourceDistributionDto
│   │   ├── lead/                       # CreateLeadRequest, LeadResponseDto, LogCallRequest
│   │   ├── booking/                    # CreateBookingRequest, BookingResponseDto
│   │   └── property/                   # PropertyDto, CreatePropertyRequest
│   ├── entities/                       # BaseAuditEntity, User, Property, Lead, CallLog, Booking
│   ├── exceptions/                     # GlobalExceptionHandler, ResourceNotFoundException
│   ├── repositories/                   # JpaRepositories + JpaSpecificationExecutor
│   ├── scheduler/                      # DailyReportScheduler, MonthlyReportScheduler
│   ├── security/                       # JwtTokenProvider, JwtAuthenticationFilter
│   └── services/                       # AuthService, LeadService, BookingService, ExcelReportService
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

---

## ⚙️ Environment Variables & Configuration

```properties
# Server
server.port=8080

# Database (PostgreSQL)
spring.datasource.url=jdbc:postgresql://localhost:5432/arnavee_lms
spring.datasource.username=postgres
spring.datasource.password=postgres

# JWT
app.jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
app.jwt.expiration-milliseconds=86400000

# Gmail SMTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=titurkarbhushan2001@gmail.com
spring.mail.password=your_gmail_app_password
app.mail.admin-recipient=titurkarbhushan2001@gmail.com

# Cloudinary
cloudinary.cloud-name=arnavee-hospitality
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
```

---

## 🚀 Local Setup & Quickstart Guide

### Prerequisites
- Java 17+
- Maven 3.9+
- PostgreSQL running locally or on Railway

### Build and Run
```bash
# Compile and test
mvn clean test

# Run application
mvn spring-boot:run
```

API will be accessible at: `http://localhost:8080`

---

*Client: **Aranavee Hospitality** | Built by **Knowlia** | 2026*
