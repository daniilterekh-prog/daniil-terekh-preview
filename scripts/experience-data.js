(function(root){
 'use strict';
 // Work periods are shown only where confirmed by the owner.
 // Disputed performance figures remain omitted pending verification.
 const projects=[
  {
    "id": "barn-estate",
    "name": "BARN ESTATE",
    "featured": true,
    "role": "Head of Digital Partnerships",
    "period": "2026",
    "location": "Moscow · Russia",
    "sector": "Premium real estate",
    "tags": "STRATEGY / PERFORMANCE / TECHNOLOGY",
    "image": "assets/companies/barnes-home.jpg",
    "url": "https://barn-estate.ru/",
    "headline": "A new chapter. A connected digital foundation.",
    "summary": "ex BARNES Russia. Digital partnerships, acquisition and website infrastructure for the Moscow real estate business.",
    "intro": "BARN Estate — ex BARNES Russia. Digital direction in Moscow, connecting the property offer, acquisition channels and website infrastructure with the enquiry journey.",
    "challenge": "Keep the digital journey coherent across property launches, paid campaigns and a changing website infrastructure.",
    "approach": "Bring campaign planning, landing pages, analytics and CRM connections into one working process. Review traffic quality alongside the quality of the enquiry.",
    "contribution": [
      "Digital strategy and performance marketing",
      "Landing pages, interface reviews and reusable UI kits",
      "Conversion tracking and CRM connections",
      "Website migration and infrastructure coordination",
      "Traffic quality checks and anti-spam workflows"
    ],
    "delivered": [
      "Property launch pages and campaign assets",
      "A connected acquisition and enquiry journey",
      "Reporting and checks for ongoing optimisation"
    ],
    "collaboration": "Worked with the business, sales team and implementation specialists across digital delivery.",
    "logo": "assets/companies/barn-estate-logo.svg",
    "homepageScreen": "assets/companies/barn-estate-spread.png",
    "companyBrief": "ex BARNES Russia. Premium real estate brokerage in Moscow."
  },
  {
    "id": "barnes",
    "name": "BARNES INTERNATIONAL",
    "featured": true,
    "role": "Head of Digital · Moscow team",
    "period": "2025–2026",
    "location": "Moscow · Russia",
    "sector": "Premium real estate",
    "tags": "STRATEGY / PERFORMANCE / TECHNOLOGY",
    "image": "assets/companies/barnes-international-home.jpg",
    "url": "https://www.barnes-international.com/",
    "headline": "International brand. Local market focus.",
    "summary": "Digital marketing for the Moscow team within the international luxury real estate network.",
    "intro": "Digital marketing for the Moscow team of BARNES International Realty, focused on the local property market and client journey.",
    "challenge": "Connect a premium brand experience with relevant property offers and qualified enquiries in the Moscow market.",
    "approach": "Bring local acquisition activity, property landing pages, measurement and sales feedback into a more connected process.",
    "contribution": [
      "Digital marketing strategy for the Moscow team",
      "Property campaign and landing page coordination",
      "Performance marketing and lead quality reviews",
      "Analytics and marketing–sales coordination"
    ],
    "delivered": [
      "Property marketing journeys for the Moscow market",
      "Campaign and landing page workflows",
      "A clearer view of enquiries and channel performance"
    ],
    "collaboration": "Worked with the Moscow business and its specialists. The international company homepage is shown as brand context.",
    "logo": "assets/companies/barnes-international-logo.svg",
    "homepageScreen": "assets/companies/barnes-international-spread.png",
    "companyBrief": "International luxury real estate network. Moscow team.",
    "awards": [
      {
        "title": "Luxury Lifestyle Awards",
        "year": "2020",
        "detail": "Best Luxury Real Estate Brokerage in Portugal.",
        "source": "https://barnes-portugal.com/en/2020/09/17/barnes-international-realty-portugal-luxury-real/",
        "status": "Winner",
        "recipient": "BARNES International Realty Portugal",
        "basis": "Office publication"
      },
      {
        "title": "Best Multi Family Office",
        "year": "2024",
        "detail": "Multi family office category for teams of 5–15 people.",
        "source": "https://www.barnes-international.com/fr/a-propos-de-barnes/actualites/2024/trophee-du-meilleur-family-office-2024-2996.html",
        "status": "Winner",
        "recipient": "Côme Le Family Office, partner in BARNES Family Office by Côme",
        "basis": "BARNES International publication"
      },
      {
        "title": "Luxury Lifestyle Awards — TOP 100 Real Estate Brokers",
        "year": "2025",
        "detail": "Selected among the TOP 100 Real Estate Brokers of the World.",
        "source": "https://luxurylifestyleawards.com/news/top-100-real-estate-brokers-2025",
        "status": "Personal recognition",
        "recipient": "Charles Howard Morgen, BARNES – Private Office, Switzerland",
        "basis": "Organizer source"
      },
      {
        "title": "Luxury Lifestyle Awards — TOP 100 Real Estate Brokers",
        "year": "2025",
        "detail": "Selected among the TOP 100 Real Estate Brokers of the World.",
        "source": "https://luxurylifestyleawards.com/news/top-100-real-estate-brokers-2025",
        "status": "Personal recognition",
        "recipient": "Rachel Bennett, BARNES Miami, USA",
        "basis": "Organizer source"
      }
    ],
    "awardsIntro": "Recognition across the international BARNES network. Each entry names the office, partner or individual recipient.",
    "tabletRecognition": [
      {
        "index": 0,
        "label": "Luxury Lifestyle Awards",
        "scope": "BARNES Portugal"
      },
      {
        "index": 2,
        "label": "TOP 100 Real Estate Brokers",
        "scope": "Charles H. Morgen · Switzerland"
      }
    ]
  },
  {
    "id": "cycle",
    "name": "CYCLE",
    "featured": true,
    "role": "Agency Director",
    "period": "2026",
    "location": "Europe · Worldwide",
    "sector": "Strategy, creative & digital",
    "tags": "STRATEGY / CREATIVE / DELIVERY",
    "image": "assets/case-cycle.svg",
    "imageAlt": "CYCLE — agency direction and team delivery",
    "url": "",
    "headline": "One direction. The right team.",
    "summary": "My agency. Bringing the right specialists together around a shared direction.",
    "intro": "I lead CYCLE. When a project needs more than one specialist, I bring together the right team and stay responsible for direction and delivery.",
    "challenge": "Give larger projects a clear direction across strategy, creative work, digital products and marketing.",
    "approach": "Define the task, assemble the right specialists, and connect their work through a shared brief, priorities and a clear review process.",
    "contribution": [
      "Project and creative direction",
      "Team assembly and specialist coordination",
      "Connecting strategy, design, technology and marketing",
      "Quality reviews and delivery coordination"
    ],
    "delivered": [
      "A shared direction for the team",
      "A coordinated scope across disciplines",
      "A single point of contact for the client"
    ],
    "collaboration": "Agency leadership with a team of specialists and project-based contractors.",
    "logo": "assets/companies/cycle-logo.svg",
    "homepageScreen": "assets/case-cycle.svg",
    "homepageAlt": "CYCLE — strategy, creative direction and team delivery",
    "companyBrief": "My agency. A team for projects that need more than one specialist."
  },
  {
    "id": "mk-elit",
    "name": "MK ELIT",
    "featured": true,
    "role": "Digital Marketing Lead",
    "period": "2022–2023",
    "location": "Saint Petersburg · Russia",
    "sector": "Luxury real estate",
    "tags": "FUNNELS / CRM / PARTNERSHIPS",
    "image": "assets/companies/mk-elit-home.jpg",
    "url": "https://www.mkelite.ru/",
    "headline": "Make every touchpoint work together.",
    "summary": "Property launches, client reactivation and a connected marketing funnel.",
    "intro": "Marketing for a luxury real estate agency, combining new property launches with the potential of an established client base.",
    "challenge": "Connect acquisition, content and sales follow-up so that interest can develop across a longer buying journey.",
    "approach": "Build launch-specific landing pages and campaign funnels, then support the next conversation through segmented email and messenger communications.",
    "contribution": [
      "Marketing strategy and campaign planning",
      "Yandex Direct and Telegram Ads",
      "Landing pages for new property launches",
      "Email, WhatsApp and Telegram communication flows",
      "Marketing–sales coordination and analytics",
      "AI call analysis and lead-handling reports for the sales team",
      "Content partnerships and client club initiatives"
    ],
    "delivered": [
      "Launch funnels connecting ads, pages and follow-up",
      "Reactivation flows for existing contacts",
      "A more structured content and reporting process",
      "Faster call reviews for the head of sales"
    ],
    "results": [
      {
        "value": "−37%",
        "label": "Cost per lead",
        "detail": "1.5× the lead volume at the same advertising budget."
      },
      {
        "value": "+25%",
        "label": "Share of repeat enquiries",
        "detail": "After introducing CRM journeys across email and messengers."
      },
      {
        "value": "15%",
        "label": "Lost leads reactivated",
        "detail": "Recovered through CRM follow-up."
      }
    ],
    "collaboration": "Worked with SMM, design, video production and sales. Contributed to collaborations with developers and design studios.",
    "logo": "assets/companies/mk-elit-logo.svg",
    "homepageScreen": "assets/companies/mk-elit-spread.png",
    "companyBrief": "Luxury real estate agency in Saint Petersburg.",
    "awards": [
      {
        "title": "European Property Awards",
        "year": "2021–2022",
        "detail": "Company laureate at the European stage of the International Property Awards.",
        "source": "https://www.mkelite.ru/articles/104",
        "status": "Laureate",
        "recipient": "MK ELIT",
        "basis": "Company publication"
      },
      {
        "title": "Urban Awards",
        "year": "2018",
        "detail": "Award win listed in the company history; category not specified.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Winner",
        "recipient": "MK ELIT",
        "basis": "Company history"
      },
      {
        "title": "CREDO",
        "year": "2024",
        "detail": "Best luxury real estate brokerage in Saint Petersburg and the Leningrad region.",
        "source": "https://realcongress.ru/images/credo/Credo-2024.pdf",
        "status": "Laureate",
        "recipient": "MK ELIT",
        "basis": "Organizer source"
      },
      {
        "title": "KAISSA",
        "year": "2023",
        "detail": "Recognition for a client-focused real estate service.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Award",
        "recipient": "MK ELIT",
        "basis": "Company history"
      },
      {
        "title": "KAISSA",
        "year": "2023",
        "detail": "Recognition for dynamic business development.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Award",
        "recipient": "MK ELIT",
        "basis": "Company history"
      },
      {
        "title": "Consumer Trust",
        "year": "2023",
        "detail": "Consumer trust in a Saint Petersburg real estate agency.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Winner",
        "recipient": "MK ELIT",
        "basis": "Company history"
      },
      {
        "title": "WebRealtor",
        "year": "2024",
        "detail": "Agency Telegram channel.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Winner",
        "recipient": "MK ELIT",
        "basis": "Company history"
      },
      {
        "title": "KAISSA",
        "year": "2014",
        "detail": "Recognition in luxury real estate; precise category not specified in the history.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Award",
        "recipient": "MK ELIT",
        "basis": "Company history"
      },
      {
        "title": "RBI — Successful Broker",
        "year": "2012",
        "detail": "Developer recognition listed in the company history.",
        "source": "https://www.mkelite.ru/company/",
        "status": "Award",
        "recipient": "MK ELIT",
        "basis": "Company history"
      },
      {
        "title": "Consumer Trust",
        "year": "2025",
        "detail": "Best full-service real estate agency in Saint Petersburg and the Leningrad region.",
        "source": "https://doveriekonkurs.ru/news/finalisty-doverie-potrebitelja-25-mir-kvartir-jelit/",
        "status": "Finalist",
        "recipient": "MK ELIT",
        "basis": "Organizer source"
      },
      {
        "title": "European Property Awards — Five Stars",
        "year": "2021",
        "detail": "Personal recognition in an individual category.",
        "source": "https://www.mkelite.ru/articles/104",
        "status": "Personal award",
        "recipient": "Anton Fedorov, MK ELIT",
        "basis": "Company publication"
      }
    ],
    "tabletRecognition": [
      {
        "index": 0,
        "label": "European Property Awards"
      },
      {
        "index": 1,
        "label": "Urban Awards"
      }
    ]
  },
  {
    "id": "eva",
    "name": "EVA REAL ESTATE",
    "featured": true,
    "role": "Head of PPC · Project work",
    "period": "2025",
    "location": "Dubai · International audiences",
    "sector": "Real estate",
    "tags": "GOOGLE ADS / YOUTUBE / ANALYTICS",
    "image": "assets/companies/eva-home.jpg",
    "url": "https://www.eva.realestate/",
    "headline": "One offer. Multiple markets.",
    "summary": "Google Ads and YouTube acquisition for Dubai real estate across international markets.",
    "intro": "PPC direction for a Dubai real estate agency, working with audiences in the UAE, Europe, North America and Asia.",
    "challenge": "Present property offers to different markets while keeping campaign structure, measurement and lead quality in view.",
    "approach": "Segment campaigns by geography and audience, connect the advertising message with the landing page and use analytics to guide testing.",
    "contribution": [
      "Google Ads campaign planning and management",
      "Search, display, video and Performance Max",
      "Audience and geographic segmentation",
      "Creative and landing page testing",
      "GTM, GA4 and remarketing setup",
      "Budget planning and performance reporting"
    ],
    "delivered": [
      "An international PPC campaign structure",
      "Audience and creative testing workflows",
      "Measurement across acquisition and landing pages"
    ],
    "collaboration": "Project-based PPC responsibility, coordinating with the agency on property offers, lead feedback and campaign priorities.",
    "logo": "assets/companies/eva-logo.svg",
    "homepageScreen": "assets/companies/eva-spread.png",
    "companyBrief": "Dubai real estate agency working with international buyers.",
    "awards": [
      {
        "title": "EMAAR Sales Awards",
        "year": "Quarterly",
        "detail": "Quarterly sales recognition; exact years and tiers not specified.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Company publication"
      },
      {
        "title": "DAMAC Broker Award",
        "year": "",
        "detail": "Broker recognition; year and tier not specified.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Company publication"
      },
      {
        "title": "Sobha Stars",
        "year": "2022",
        "detail": "Developer recognition listed by EVA.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Company publication"
      },
      {
        "title": "Regalia Performance",
        "year": "",
        "detail": "Performance recognition; year not specified.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Company publication"
      },
      {
        "title": "Dubai Holding Agents",
        "year": "",
        "detail": "Agent recognition; year not specified.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Company publication"
      },
      {
        "title": "MAG Top Broker of the Month",
        "year": "2022",
        "detail": "Monthly broker recognition; month not specified.",
        "source": "https://evadxb.com/ru/elvira-sharshenalieva/",
        "status": "Company-listed award",
        "recipient": "EVA Real Estate",
        "basis": "Company publication"
      },
      {
        "title": "Prime Global Achievement Award",
        "year": "2023",
        "detail": "Real Estate Sales — personal award to the founder.",
        "source": "https://www.primeglobalawards.com/post/interview-ms-elvira-sharshenalieva-winner-prime-global-achievement-award-real-estate-sales",
        "status": "Personal award",
        "recipient": "Elvira Sharshenalieva, founder of EVA Real Estate",
        "basis": "Organizer source"
      }
    ],
    "tabletRecognition": [
      {
        "index": 2,
        "label": "Sobha Stars"
      },
      {
        "index": 5,
        "label": "MAG Top Broker"
      }
    ]
  },
  {
    "id": "setevie",
    "name": "SETEVIE",
    "featured": true,
    "role": "Head of Projects",
    "period": "2023–2025",
    "location": "Saint Petersburg · Multi-project agency",
    "sector": "Marketing agency",
    "tags": "TEAM / STRATEGY / OPERATIONS",
    "image": "assets/companies/setevie-hero-v74.jpg",
    "imageAlt": "Setevie — company website hero with architectural photography",
    "url": "https://setevie.com/",
    "headline": "Bring the team around the outcome.",
    "summary": "Team leadership, media planning and performance oversight across agency projects.",
    "intro": "Digital marketing leadership at Setevie / Interestate, aligning specialists, project priorities and client reporting.",
    "challenge": "Give several projects a clear working rhythm, shared priorities and visibility into media plan delivery.",
    "approach": "Translate business goals into channel plans, assign responsibilities and use BI reporting and regular reviews to guide the team.",
    "contribution": [
      "Leadership across PPC, SEO, paid media and analytics",
      "Project strategies and media planning",
      "Channel briefs and implementation priorities",
      "KPI monitoring and client reporting",
      "CRM and funnel improvement",
      "Coordination across multiple client projects"
    ],
    "delivered": [
      "A shared process for media plan reviews",
      "Clearer responsibilities across channels",
      "Reporting connecting specialists and stakeholders"
    ],
    "results": [
      {
        "value": ">50%",
        "label": "Reduction in cost per lead",
        "detail": "CPL more than halved through campaign optimisation."
      },
      {
        "value": "Up to 500%",
        "label": "Return on marketing investment",
        "detail": "ROMI achieved through campaign optimisation."
      }
    ],
    "collaboration": "Led a multidisciplinary digital team and coordinated delivery with clients and project stakeholders.",
    "logo": "assets/companies/setevie-logo.svg",
    "homepageScreen": "assets/companies/setevie-architecture-v74.jpg",
    "homepageAlt": "Setevie — architectural detail from the company website",
    "companyBrief": "Marketing agency specialising in property and development.",
    "awards": [
      {
        "title": "Perspectum Awards",
        "year": "2024",
        "detail": "Bronze, Best B2B Event — launch of the Well apart-hotel in Saint Petersburg.",
        "source": "https://perspectum.ru/winners/",
        "status": "Bronze",
        "recipient": "SETEVIE Agency",
        "basis": "Organizer source"
      },
      {
        "title": "Silver Mercury",
        "year": "2025",
        "detail": "K09 Best Private Event — launch of Well.",
        "source": "https://silvermercury.ru/winners/torzhestvennoe-otkrytie-pervogo-v-rossii-apart-otelya-v-kontseptsii-well-being-well-v-sankt-peterburge-2025-6292",
        "status": "Shortlist",
        "recipient": "SETEVIE Agency",
        "basis": "Organizer source"
      },
      {
        "title": "Runet Rating — Digital / Real Estate",
        "year": "2026",
        "detail": "1st place in the real estate industry category.",
        "source": "https://ratingruneta.ru/digital-agencies/real-estate/",
        "status": "Ranking · #1",
        "recipient": "SETEVIE Agency",
        "basis": "Organizer source"
      },
      {
        "title": "Runet Rating — Digital / Russia",
        "year": "2026",
        "detail": "17th place among digital agencies in Russia.",
        "source": "https://ratingruneta.ru/digital-agencies/russia/",
        "status": "Ranking · #17",
        "recipient": "SETEVIE Agency",
        "basis": "Organizer source"
      },
      {
        "title": "Runet Rating — PR / Real Estate",
        "year": "2026",
        "detail": "3rd place in the real estate PR category.",
        "source": "https://ratingruneta.ru/pr/real-estate/",
        "status": "Ranking · #3",
        "recipient": "SETEVIE Agency",
        "basis": "Organizer source"
      },
      {
        "title": "Runet Rating — Digital / Saint Petersburg",
        "year": "2026",
        "detail": "3rd place in the Saint Petersburg category.",
        "source": "https://ratingruneta.ru/digital-agencies/st-petersburg/",
        "status": "Ranking · #3",
        "recipient": "SETEVIE Agency",
        "basis": "Organizer source"
      },
      {
        "title": "MRA — Best Marketing Agency",
        "year": "2025",
        "detail": "Finalist recognition listed on the agency website.",
        "source": "https://setevie.com/",
        "status": "Finalist",
        "recipient": "SETEVIE Agency",
        "basis": "Company publication"
      }
    ],
    "tabletRecognition": [
      {
        "index": 0,
        "label": "Perspectum Awards",
        "status": "Bronze · Best B2B Event"
      },
      {
        "index": 1,
        "label": "Silver Mercury",
        "status": "Shortlist · Best Private Event"
      }
    ]
  },
  {
    "id": "alexander",
    "name": "ALEXANDER REAL ESTATE",
    "featured": false,
    "role": "Marketer → Marketing Team Lead",
    "location": "Saint Petersburg · Russia",
    "sector": "Real estate",
    "tags": "SEO / ACQUISITION / TEAM",
    "image": "",
    "url": "https://anspb.ru/",
    "headline": "Build a system around existing potential.",
    "summary": "SEO for a large property website and a more centralised marketing operation.",
    "intro": "A broad marketing role spanning organic search, paid acquisition, reporting and the development of an internal team.",
    "challenge": "Improve a large website and decentralised acquisition activity with limited development resources.",
    "approach": "Prioritise technical SEO and semantic structure while consolidating channel management, reporting and team responsibilities.",
    "contribution": [
      "SEO audits, semantic clustering and metadata",
      "Internal linking and website improvement briefs",
      "Yandex Direct and creative development",
      "Call tracking and reporting",
      "SMM coordination and team development"
    ],
    "delivered": [
      "An SEO improvement programme",
      "A more centralised acquisition process",
      "Internal marketing workflows and reporting"
    ],
    "collaboration": "Worked with developers, sales leaders and marketing specialists."
  },
  {
    "id": "unitec-legal",
    "name": "UNITEC LEGAL",
    "featured": false,
    "role": "SEO Specialist",
    "location": "Saint Petersburg · Russia",
    "sector": "Legal services",
    "tags": "SEO / CONTENT / LOCAL SEARCH",
    "image": "",
    "url": "",
    "headline": "Turn expertise into findable services.",
    "summary": "Technical SEO, service-page structure and local search for a legal practice.",
    "intro": "Search optimisation for a legal services website on MODX, from the semantic structure to implementation briefs.",
    "challenge": "Make individual legal services easier to find in a competitive local search environment.",
    "approach": "Build around service intent, resolve technical issues and improve the content and commercial information on key pages.",
    "contribution": [
      "Technical and content audits",
      "Semantic research and service-page structure",
      "Metadata, structured data and internal links",
      "Local search presence",
      "Analytics and development coordination"
    ],
    "delivered": [
      "A service-led SEO structure",
      "Technical and content improvement briefs",
      "A search visibility and reporting workflow"
    ],
    "collaboration": "Worked with the legal business and website developers."
  },
  {
    "id": "tivat-gardens",
    "name": "TIVAT GARDENS",
    "featured": false,
    "role": "Marketing · Project work",
    "location": "Montenegro",
    "sector": "Property development",
    "tags": "CATALOGUES / OUTDOOR / DIGITAL",
    "image": "",
    "url": "",
    "headline": "Give a development a clear presentation.",
    "summary": "Property presentation materials and digital advertising support.",
    "intro": "Project-based marketing work for property development in Montenegro.",
    "challenge": "Translate a property development into clear sales materials and campaign touchpoints.",
    "approach": "Bring project information and visual materials together for printed and digital communication.",
    "contribution": [
      "Property catalogues",
      "Outdoor advertising materials",
      "Digital advertising support"
    ],
    "delivered": [
      "Property presentation assets",
      "Materials for marketing and sales"
    ],
    "collaboration": "Project-based collaboration with the development business."
  },
  {
    "id": "unitec-marine",
    "name": "UNITEC MARINE",
    "featured": false,
    "role": "Website Content Editor",
    "location": "Russia · Maritime services",
    "sector": "Maritime services",
    "tags": "WORDPRESS / CONTENT / UX",
    "image": "",
    "url": "",
    "headline": "Make the website easier to use.",
    "summary": "Content, website audits and mobile usability improvements.",
    "intro": "Website content and usability work for a maritime agency using WordPress.",
    "challenge": "Keep service information accessible and the website usable across devices.",
    "approach": "Review content and mobile usability, identify technical issues and coordinate practical website corrections.",
    "contribution": [
      "Website content editing",
      "Technical website audits",
      "Mobile usability reviews",
      "WordPress updates"
    ],
    "delivered": [
      "Updated website content",
      "A prioritised set of website improvements"
    ],
    "collaboration": "Worked with the business on content and practical site maintenance."
  },
  {
    "id": "euro-ag",
    "name": "EURO-AG",
    "featured": false,
    "role": "Director’s Assistant · Part-time",
    "location": "Russia · Logistics",
    "sector": "Logistics",
    "tags": "OPERATIONS / DATA / MARKETING",
    "image": "",
    "url": "",
    "headline": "An operational foundation.",
    "summary": "Business support, data work and early marketing responsibilities.",
    "intro": "An operational role in logistics, combining business support with data handling and selected marketing tasks.",
    "challenge": "Support day-to-day business coordination and work with substantial volumes of operational information.",
    "approach": "Organise data and team tasks while contributing to advertising and communication activity.",
    "contribution": [
      "Excel and operational data handling",
      "Team task coordination",
      "Contextual and targeted advertising",
      "Email marketing activity"
    ],
    "delivered": [
      "Business and reporting support",
      "Hands-on experience connecting operations and marketing"
    ],
    "collaboration": "Part-time operational work supporting the director and team."
  },
  {
    "id": "independent",
    "name": "INDEPENDENT PROJECTS",
    "featured": false,
    "role": "Digital Marketing Consultant",
    "location": "Project-based collaborations",
    "sector": "Beauty · HR · Other services",
    "tags": "AUDITS / SEO / ACQUISITION",
    "image": "",
    "url": "",
    "headline": "A method that travels across sectors.",
    "summary": "Selected SEO, website and acquisition work beyond property.",
    "intro": "Independent projects and consulting across service businesses, including beauty and recruitment.",
    "challenge": "Adapt digital marketing work to different business models and resource levels.",
    "approach": "Start with the task, review the existing journey and prioritise changes that the business can implement.",
    "contribution": [
      "SEO and website reviews",
      "Acquisition and content recommendations",
      "Marketing consultation"
    ],
    "delivered": [
      "Prioritised improvement plans",
      "Ongoing specialist support"
    ],
    "collaboration": "Direct collaboration with business owners and specialist contractors."
  }
];
 const data={projects,featured:projects.filter(p=>p.featured)};
 if(typeof module==='object'&&module.exports)module.exports=data;else root.DTExperience=data;
})(typeof window==='undefined'?globalThis:window);
