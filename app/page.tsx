import type { Metadata } from "next";
import LandingNav from "@/components/landing/LandingNav";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ScreenshotsSection from "@/components/landing/ScreenshotsSection";
import FAQSection from "@/components/landing/FAQSection";
import PricingSection from "@/components/landing/PricingSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import CtaAndFooter from "@/components/landing/CtaAndFooter";

export const metadata: Metadata = {
  title: "StayQuote by ShapeBytes | Hospitality Quotation & Reservation Software",
  description:
    "StayQuote by ShapeBytes helps hotels, resorts, villas, banquets and hospitality teams create quotations, track follow-ups, check availability and convert enquiries into reservations. Start at ₹999/month.",
  keywords: [
    "hospitality quotation software",
    "hotel quotation software",
    "resort reservation software",
    "hotel follow up software",
    "booking quotation tool",
    "hotel enquiry management software",
    "banquet quotation software",
    "villa booking software",
    "hospitality CRM",
    "reservation management software"
  ],
  authors: [{ name: "ShapeBytes" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://stayquote.shapebytes.com/",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "ShapeBytes",
    title: "StayQuote by ShapeBytes | Hospitality Quotation & Reservation Software",
    description:
      "Create professional quotations, track follow-ups, check availability and convert hospitality enquiries into confirmed reservations. Start at ₹999/month.",
    url: "https://stayquote.shapebytes.com/",
    locale: "en_IN",
    images: [
      {
        url: "https://res.cloudinary.com/dnjouplkz/image/upload/v1779103997/file_000000003b7472078c00db7c1f98fe7d_j0smmg.png",
        width: 1200,
        height: 630,
        alt: "StayQuote hospitality quotation and reservation dashboard by ShapeBytes",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StayQuote by ShapeBytes | Hospitality Quotation & Reservation Software",
    description:
      "Manage quotations, follow-ups, availability and reservations for hotels, resorts, villas and banquets. Start at ₹999/month.",
    images: ["https://res.cloudinary.com/dnjouplkz/image/upload/v1779103997/file_000000003b7472078c00db7c1f98fe7d_j0smmg.png"],
    site: "@ShapeBytes",
    creator: "@ShapeBytes",
  },
  icons: {
    icon: [
      { url: "/favicon/favicon.ico" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/favicon/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  other: {
    "theme-color": "#f1611b",
    "msapplication-TileColor": "#f1611b",
    "content-language": "en-IN",
    "geo.region": "IN",
    "geo.placename": "India",
    "fb:app_id": "YOUR_FACEBOOK_APP_ID",
  },
};

const schemas = {
  graph: {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://shapebytes.com/#organization",
        "name": "ShapeBytes",
        "url": "https://shapebytes.com/",
        "logo": {
          "@type": "ImageObject",
          "url": "https://stayquote.shapebytes.com/onlyshapebyte_logo.png",
          "width": 512,
          "height": 512
        },
        "description": "ShapeBytes creates software solutions that help businesses manage operations, sales and digital workflows more efficiently.",
        "brand": {
          "@type": "Brand",
          "name": "ShapeBytes"
        },
        "sameAs": [
          "https://www.facebook.com/YOUR_PAGE",
          "https://www.instagram.com/YOUR_HANDLE",
          "https://www.linkedin.com/company/YOUR_COMPANY",
          "https://x.com/YOUR_HANDLE"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "email": "growth@shapebytes.com",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          },
          {
            "@type": "ContactPoint",
            "contactType": "sales",
            "email": "growth@shapebytes.com",
            "areaServed": "IN",
            "availableLanguage": ["English", "Hindi"]
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://stayquote.shapebytes.com/#website",
        "url": "https://stayquote.shapebytes.com/",
        "name": "StayQuote by ShapeBytes",
        "alternateName": "StayQuote",
        "publisher": {
          "@id": "https://shapebytes.com/#organization"
        },
        "inLanguage": "en-IN",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://stayquote.shapebytes.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebPage",
        "@id": "https://stayquote.shapebytes.com/#webpage",
        "url": "https://stayquote.shapebytes.com/",
        "name": "StayQuote by ShapeBytes | Hospitality Quotation & Reservation Software",
        "description": "StayQuote by ShapeBytes helps hotels, resorts, villas, banquets and hospitality teams create quotations, track follow-ups, check availability and convert enquiries into reservations.",
        "isPartOf": {
          "@id": "https://stayquote.shapebytes.com/#website"
        },
        "about": {
          "@id": "https://stayquote.shapebytes.com/#software"
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": "https://stayquote.shapebytes.com/assets/images/stayquote-og-image.jpg",
          "width": 1200,
          "height": 630
        },
        "publisher": {
          "@id": "https://shapebytes.com/#organization"
        },
        "inLanguage": "en-IN"
      },
      {
        "@type": ["SoftwareApplication", "Product"],
        "@id": "https://stayquote.shapebytes.com/#software",
        "name": "StayQuote by ShapeBytes",
        "alternateName": "StayQuote",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "Hospitality Quotation and Reservation Management Software",
        "operatingSystem": "Web-based",
        "url": "https://stayquote.shapebytes.com/",
        "image": "https://stayquote.shapebytes.com/assets/images/stayquote-og-image.jpg",
        "description": "StayQuote is a hospitality quotation and reservation management software that helps hotels, resorts, villas, banquets and hospitality teams create quotations, manage follow-ups, check availability and convert enquiries into confirmed reservations.",
        "softwareVersion": "1.0",
        "releaseNotes": "Hospitality quotation, follow-up, availability and reservation management for hotels, resorts, villas, banquets and hospitality sales teams.",
        "creator": {
          "@id": "https://shapebytes.com/#organization"
        },
        "publisher": {
          "@id": "https://shapebytes.com/#organization"
        },
        "brand": {
          "@type": "Brand",
          "name": "ShapeBytes"
        },
        "audience": {
          "@type": "BusinessAudience",
          "audienceType": "Hotels, resorts, villas, banquet halls, homestays, camps, travel teams and hospitality businesses"
        },
        "featureList": [
          "Hospitality quotation builder",
          "Guest enquiry management",
          "Follow-up tracking",
          "Availability checking",
          "Reservation conversion from quotation",
          "Booking pipeline dashboard",
          "Team collaboration",
          "Reports and conversion insights"
        ],
        "offers": {
          "@type": "Offer",
          "@id": "https://stayquote.shapebytes.com/#offer-monthly",
          "url": "https://stayquote.shapebytes.com/pricing",
          "price": "999",
          "priceCurrency": "INR",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "category": "SaaS Subscription",
          "eligibleRegion": {
            "@type": "Country",
            "name": "India"
          },
          "seller": {
            "@id": "https://shapebytes.com/#organization"
          },
          "description": "StayQuote monthly subscription plan at ₹999 per month for hospitality quotation, follow-up, availability and reservation management."
        }
      },
      {
        "@type": "Service",
        "@id": "https://stayquote.shapebytes.com/#service",
        "name": "Hospitality Quotation and Reservation Management Service",
        "serviceType": "Hospitality SaaS",
        "provider": {
          "@id": "https://shapebytes.com/#organization"
        },
        "areaServed": {
          "@type": "Country",
          "name": "India"
        },
        "audience": {
          "@type": "BusinessAudience",
          "audienceType": "Hospitality businesses"
        },
        "description": "A software service for managing hospitality enquiries, quotations, follow-ups, availability checks and reservations.",
        "offers": {
          "@id": "https://stayquote.shapebytes.com/#offer-monthly"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "StayQuote Features",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Quotation Management",
                "description": "Create and manage professional quotations for rooms, packages, banquets, events and group bookings."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Follow-up Management",
                "description": "Track pending enquiries and follow up with guests to improve booking conversion."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Availability Tracking",
                "description": "Check room, venue and date availability before confirming reservations."
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": "Reservation Conversion",
                "description": "Convert approved quotations into confirmed reservations without duplicate work."
              }
            }
          ]
        }
      },
      {
        "@type": "ItemList",
        "@id": "https://stayquote.shapebytes.com/#use-cases",
        "name": "StayQuote Use Cases",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Hotels",
            "url": "https://stayquote.shapebytes.com/#hotels"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Resorts",
            "url": "https://stayquote.shapebytes.com/#resorts"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Banquet Halls",
            "url": "https://stayquote.shapebytes.com/#banquet-halls"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": "Villas",
            "url": "https://stayquote.shapebytes.com/#villas"
          },
          {
            "@type": "ListItem",
            "position": 5,
            "name": "Homestays",
            "url": "https://stayquote.shapebytes.com/#homestays"
          },
          {
            "@type": "ListItem",
            "position": 6,
            "name": "Destination Wedding Venues",
            "url": "https://stayquote.shapebytes.com/#wedding-venues"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://stayquote.shapebytes.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "ShapeBytes",
            "item": "https://shapebytes.com/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "StayQuote",
            "item": "https://stayquote.shapebytes.com/"
          }
        ]
      }
    ]
  },
  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": "https://stayquote.shapebytes.com/#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is StayQuote by ShapeBytes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StayQuote by ShapeBytes is a hospitality quotation and reservation management software that helps hotels, resorts, villas, banquets and hospitality teams create quotations, track follow-ups, check availability and convert enquiries into confirmed reservations."
        }
      },
      {
        "@type": "Question",
        "name": "Who can use StayQuote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StayQuote is built for hotels, resorts, villas, homestays, banquet halls, destination wedding venues, camps and hospitality sales or reservation teams."
        }
      },
      {
        "@type": "Question",
        "name": "Can StayQuote create quotations for rooms and packages?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. StayQuote can be used to create professional quotations for rooms, packages, events, banquets, group bookings and customized guest requirements."
        }
      },
      {
        "@type": "Question",
        "name": "Does StayQuote help with guest follow-ups?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. StayQuote helps teams track pending enquiries, manage follow-up status and reduce missed booking opportunities."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert a quotation into a reservation?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Once a guest approves a quotation, StayQuote helps convert the quotation into a confirmed reservation."
        }
      },
      {
        "@type": "Question",
        "name": "Does StayQuote check availability?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. StayQuote helps hospitality teams check room, venue or date availability before sending quotations or confirming reservations."
        }
      },
      {
        "@type": "Question",
        "name": "What is the price of StayQuote?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "StayQuote is available at a simple price of ₹999 per month."
        }
      },
      {
        "@type": "Question",
        "name": "Is StayQuote suitable for small hotels and resorts?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. StayQuote is designed to be simple and affordable for small and mid-size hotels, resorts, villas, homestays and hospitality businesses."
        }
      }
    ]
  },
  speakable: {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://stayquote.shapebytes.com/#speakable-webpage",
    "url": "https://stayquote.shapebytes.com/",
    "name": "StayQuote by ShapeBytes",
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [
        ".hero-title",
        ".hero-description",
        ".pricing-summary"
      ]
    }
  },
  price: {
    "@context": "https://schema.org",
    "@type": "PriceSpecification",
    "@id": "https://stayquote.shapebytes.com/#price-specification",
    "price": "999",
    "priceCurrency": "INR",
    "valueAddedTaxIncluded": false,
    "billingIncrement": 1,
    "unitText": "MONTH",
    "description": "StayQuote monthly subscription for hospitality quotation, follow-up, availability and reservation management."
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen font-sans antialiased">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.graph) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.faq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.speakable) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas.price) }}
      />
      
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <HowItWorksSection />
      <FeaturesSection />
      <ScreenshotsSection />
      
      <PricingSection />
      <SocialProofSection />
      <FAQSection />
      <CtaAndFooter />
    </div>
  );
}
