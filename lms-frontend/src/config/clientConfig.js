/**
 * Central Static Client Configuration (Rule 10)
 * 
 * Modifying this single file propagates brand identity, client name,
 * light theme accents, and support information across the application.
 */

export const CLIENT_CONFIG = {
  clientName: "Arnavee Hospitality",
  clientShortName: "Arnavee",
  tagline: "Turn Leads into Memorable Stays",
  subTagline: "Powering hospitality growth with smart lead management.",
  
  supportEmail: "admin@arnavee.com",
  supportPhone: "+91 98765 43210",
  contactAdminText: "Contact Administrator",

  branding: {
    logoTitle: "ARNAVEE",
    logoSubtitle: "HOSPITALITY",
    // Light-tone logo accent color (avoiding dark muddy gold)
    logoLightColor: "#FDE68A", // Soft light champagne amber
    logoLightGlow: "rgba(253, 230, 138, 0.2)",
    primaryBlue: "#1E56F0",    // Royal Blue from LMS PART 1 login button
    primaryBlueHover: "#1645D0",
  },

  heroFeatures: [
    { id: "leads", label: "More Leads", icon: "target" },
    { id: "followups", label: "Better Follow-ups", icon: "location" },
    { id: "bookings", label: "Higher Bookings", icon: "calendar" },
    { id: "revenue", label: "Greater Revenue", icon: "trending" }
  ]
};
