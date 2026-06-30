/* ─────────────────────────────────────────────────
   SVH 2026 — Official Problem Statements
   ───────────────────────────────────────────────── */

export const STATEMENTS = [

  /* ══ HARDWARE ══════════════════════════════════ */
  {
    id: 'SVH26001',
    category: 'Hardware',
    theme: 'Clean & Green Technology',
    title: 'Smart Waste Segregation and Recycling System',
    org: 'Government of Odisha',
    dept: 'Electronics & IT Department',
    desc: 'Design an IoT-enabled waste segregation system using sensors and ML to automatically classify household waste (organic, recyclable, hazardous) at the source, integrating with municipal waste management for efficient collection and recycling.',
    sections: [
      {
        heading: 'Description',
        body: 'Design an IoT-enabled waste segregation system using sensors and machine learning to automatically classify household waste (organic, recyclable, hazardous) at the source. The system should integrate with municipal waste management for efficient collection and recycling.',
      },
      {
        heading: 'Expected Outcome',
        body: 'A prototype device with 90% accuracy in waste classification, coupled with a mobile app for households to monitor waste disposal and earn incentives for recycling.',
      },
      {
        heading: 'Technical Feasibility',
        body: 'Uses affordable sensors (e.g., cameras, weight sensors) and ML models (e.g., convolutional neural networks) for waste identification, deployable in urban and semi-urban areas.',
      },
    ],
  },

  {
    id: 'SVH26002',
    category: 'Hardware',
    theme: 'Smart Automation',
    title: 'Student Innovation: Swadeshi for Atmanirbhar Bharat — Smart Automation',
    org: 'AICTE',
    dept: 'AICTE, MIC-Student Innovation',
    desc: 'Ideas focused on the intelligent use of resources for transforming and advancing technology by combining artificial intelligence to explore various sources and gain valuable insights.',
    sections: [
      {
        heading: 'Description',
        body: 'Ideas focused on the intelligent use of resources for transforming and advancements of technology with combining the artificial intelligence to explore more various sources and get valuable insights.',
      },
    ],
  },

  /* ══ SOFTWARE ══════════════════════════════════ */
  {
    id: 'SVH26003',
    category: 'Software',
    theme: 'Transportation & Logistics',
    title: 'Real-Time Public Transport Tracking for Small Cities',
    org: 'Government of Punjab',
    dept: 'Department of Higher Education',
    desc: 'A GPS-integrated platform to provide real-time bus tracking and estimated arrival times in small cities and tier-2 towns, reducing commuter inconvenience caused by unpredictable schedules.',
    sections: [
      {
        heading: 'Problem Description',
        body: 'In small cities and tier-2 towns, public transport systems lack real-time tracking, causing inconvenience to commuters who face unpredictable bus schedules. This leads to overcrowding, wasted time, and reduced reliance on public transport. The problem is acute in cities with growing populations but limited digital infrastructure for transport management.',
      },
      {
        heading: 'Impact / Why This Problem Needs to be Solved',
        body: 'Over 60% of commuters in small cities face delays due to lack of real-time information, reducing public transport usage and increasing private vehicle dependency, which worsens traffic and pollution. A solution would enhance commuter experience and promote sustainable transport.',
      },
      {
        heading: 'Expected Outcomes',
        items: [
          'A mobile app or web platform integrating GPS-based real-time tracking of buses.',
          'Display estimated arrival times and route information.',
          'Optimized for low-bandwidth environments to ensure accessibility in smaller towns.',
        ],
      },
      {
        heading: 'Relevant Stakeholders / Beneficiaries',
        items: ['Commuters', 'Local transport authorities', 'Municipal corporations'],
      },
      {
        heading: 'Supporting Data',
        body: 'Urban Mobility India Report 2024, emphasizing transport inefficiencies in tier-2 cities.',
      },
    ],
  },

  {
    id: 'SVH26004',
    category: 'Software',
    theme: 'Clean & Green Technology',
    title: 'Hybrid Renewable Energy Generation Solution',
    org: 'Government of Rajasthan',
    dept: 'Directorate of Technical Education (DTE)',
    desc: 'A vendor-neutral software orchestration layer that integrates solar, wind, battery storage, and grid data in real-time to maximize renewable energy utilization across public-sector campuses.',
    sections: [
      {
        heading: 'Background',
        body: 'Many public-sector campuses across Rajasthan consume substantial grid electricity even though solar irradiance and wind potential are favourable throughout most of the year. Separate pilot installations — rooftop photovoltaic panels on one block, a small wind turbine near another — have demonstrated value in isolation, yet they operate independently, lack coordinated scheduling, and cannot guarantee stable power when weather fluctuates. As tariff subsidies taper and carbon-reduction mandates tighten, institutes must find practical ways to maximise on-site renewable generation while preserving supply reliability for critical labs and hostels.',
      },
      {
        heading: 'Description',
        body: 'The crux of the challenge is orchestration, not hardware procurement. When the sun is at its peak, excess photovoltaic output sometimes exceeds immediate demand, while during cloudy afternoons or still evenings the turbine may produce little, forcing the campus to revert entirely to grid draw. Batteries, if present at all, are under-utilised because charge-discharge cycles are triggered by fixed rules rather than data-driven forecasts. Without a holistic view, administrators cannot determine when to schedule energy-intensive workshops, how to stagger HVAC loads, or whether to export surplus to the utility. A modern, software-centric coordination layer is therefore needed to treat solar, wind, battery storage, and grid import as a single virtual power plant. Such a platform would ingest real-time sensor streams, fuse them with short-term weather forecasts, predict generation and demand curves, and recommend charge, discharge, or curtailment actions that minimise cost and emissions.',
      },
      {
        heading: 'Expected Solution',
        body: 'Participants should outline a comprehensive, vendor-neutral software framework that continuously integrates live generation and consumption data, applies predictive analytics to forecast both supply and demand, and issues real-time operational recommendations — such as optimal battery charging windows or load-shifting opportunities — to maximise self-consumption of solar-wind energy, reduce grid dependence, and facilitate transparent reporting of carbon savings, while remaining simple enough for facilities staff to adopt without specialised training or additional hardware expenditure.',
      },
    ],
  },

  {
    id: 'SVH26005',
    category: 'Software',
    theme: 'Clean & Green Technology',
    title: 'Crowdsourced Civic Issue Reporting and Resolution System',
    org: 'Government of Jharkhand',
    dept: 'Department of Higher and Technical Education',
    desc: 'A mobile-first platform enabling citizens to submit geo-tagged reports of civic issues (potholes, streetlights, trash bins) that municipalities can systematically track, prioritize, and resolve.',
    sections: [
      {
        heading: 'Background',
        body: 'Local governments often face challenges in promptly identifying, prioritizing, and resolving everyday civic issues like potholes, malfunctioning streetlights, or overflowing trash bins. While citizens may encounter these issues daily, a lack of effective reporting and tracking mechanisms limits municipal responsiveness. A streamlined, mobile-first solution can bridge this gap by empowering community members to submit real-world reports that municipalities can systematically address.',
      },
      {
        heading: 'Detailed Description',
        body: "The system revolves around an easy-to-use mobile interface that allows users to submit reports in real-time. Each report can contain a photo, automatic location tagging, and a short text or voice explanation, providing sufficient context. These submissions populate a centralized dashboard featuring a live, interactive map of the city's reported issues. The system highlights priority areas based on volume of submissions, urgency inferred from user inputs, or other configurable criteria. On the administrative side, staff access a powerful dashboard where they can view, filter, and categorize incoming reports. Automated routing directs each report to the relevant department — such as sanitation or public works — based on the issue type and location.",
      },
      {
        heading: 'Expected Solution',
        body: 'The final deliverable should include a mobile platform that supports cross-device functionality and seamless user experience. Citizens must be able to capture issues effortlessly, track the progress of their reports, and receive notifications through each stage — confirmation, acknowledgment, and resolution. A scalable, resilient backend must manage high volumes of multimedia content, support concurrent users, and provide APIs for future integrations. The solution should deliver analytics and reporting features that offer insights into reporting trends, departmental response times, and overall system effectiveness — ultimately driving better civic engagement and government accountability.',
      },
    ],
  },

  {
    id: 'SVH26006',
    category: 'Software',
    theme: 'MedTech / BioTech / HealthTech',
    title: 'AI-Driven Public Health Chatbot for Disease Awareness',
    org: 'Government of Odisha',
    dept: 'Electronics & IT Department',
    desc: 'Create a multilingual AI chatbot to educate rural and semi-urban populations about preventive healthcare, disease symptoms, and vaccination schedules, with real-time outbreak alerts via WhatsApp or SMS.',
    sections: [
      {
        heading: 'Description',
        body: 'Create a multilingual AI chatbot to educate rural and semi-urban populations about preventive healthcare, disease symptoms, and vaccination schedules. The chatbot should integrate with government health databases and provide real-time alerts for outbreaks.',
      },
      {
        heading: 'Expected Outcome',
        body: 'A chatbot accessible via WhatsApp or SMS, reaching 80% accuracy in answering health queries and increasing awareness by 20% in target communities.',
      },
      {
        heading: 'Technical Feasibility',
        body: 'Built using NLP frameworks (e.g., Rasa, Dialogflow) with APIs for health data integration, deployable on cloud platforms for scalability.',
      },
    ],
  },

  {
    id: 'SVH26007',
    category: 'Software',
    theme: 'Agriculture, FoodTech & Rural Development',
    title: 'AI Based Real-Time Crop Image Analytics for Crop Insurance — PMFBY',
    org: 'Ministry of Agriculture & Farmers Welfare (MoA&FW)',
    dept: 'Department of Agriculture & Farmers Welfare (DoA&FW) — PMFBY',
    desc: 'An end-to-end digital solution leveraging mobile photography and AI/ML for real-time, geo-tagged crop condition assessment to automate growth tracking and objective loss assessment under PMFBY.',
    sections: [
      {
        heading: 'Background',
        body: 'Ministry of Agriculture and Farmers Welfare, under PMFBY, is launching CROPIC (Collection of Real-Time Observations & Photo of Crops) as a digital initiative to revolutionize crop monitoring and insurance claim settlement in India. CROPIC leverages mobile photography and artificial intelligence for timely, accurate crop condition assessment, aiming for nation-wide rollout after 2025 pilots.',
      },
      {
        heading: 'Description',
        body: 'Crop insurance and monitoring systems face challenges of delay, manual bias, and inadequate transparency in loss assessment. Existing processes rely heavily on physical field visits, resulting in time-consuming and inconsistent data collection. The CROPIC initiative aims to overcome these challenges by leveraging real-time, geo-tagged crop images captured directly. AI/ML models deployed in the PMFBY portal rapidly track crop health and identify stress/damage. This digital approach is expected to enhance farmer trust in the insurance process, while building a scalable foundation for future, tech-driven agricultural monitoring platforms.',
      },
      {
        heading: 'Key Requirements',
        items: [
          'Mobile app with a simple interface for farmers and field officials to capture and upload geotagged crop images at multiple key growth stages.',
          'Built-in guidance to ensure correct image capture (e.g., visual cues, crop stage selection).',
          'AI/ML cloud platform for automated image quality validation and health/damage assessment using deep learning models.',
          'Identification of crop, growth stages, and type of crop damage (lodging, flood inundation, water stress, pest/disease etc.).',
          'Integration with satellite and weather data (optional).',
          'Web dashboard with real-time, map-based visualization for authorities to monitor crop status and damage alerts.',
        ],
      },
      {
        heading: 'Expected Impact',
        items: [
          'Evidence-based crop loss assessment.',
          'Reduced manual bias and greater transparency.',
          'Support for yield estimation system based on Technology (YESTECH).',
        ],
      },
      {
        heading: 'Evaluation Criteria',
        items: [
          'Accuracy and robustness of AI/ML models on diverse crop/condition images.',
          'Ease of use and inclusivity of the mobile app.',
          'Scalability and interoperability of the entire system.',
          'Security, privacy, and efficiency of data handling and analytics.',
        ],
      },
    ],
  },

  {
    id: 'SVH26008',
    category: 'Software',
    theme: 'Heritage & Culture',
    title: 'Temple & Pilgrimage Crowd Management (Somnath, Dwarka, Ambaji, Pavagadh)',
    org: 'Government of Gujarat',
    dept: 'Gujarat Council on Science & Technology (GUJCOST), Dept of Science & Technology',
    desc: 'Scalable, AI-powered technology solutions to manage crowd surges, enhance safety, and improve the pilgrim experience at major Gujarat pilgrimage sites during festivals and auspicious occasions.',
    sections: [
      {
        heading: 'Background',
        body: "Gujarat is home to some of the most important pilgrimage destinations such as Somnath, Dwarka, Ambaji, and Pavagadh, which witness massive footfalls, especially during festivals, auspicious days, and long weekends. While these pilgrim centers strengthen cultural tourism, they also face significant challenges in managing crowd surges, ensuring safety, providing timely information, and enhancing the overall devotee experience. Incidents of overcrowding, long queues, health emergencies, and inefficient resource allocation highlight the urgent need for technology-driven crowd management solutions.",
      },
      {
        heading: 'Key Challenges',
        items: [
          'Overcrowding & Queue Management — Long waiting times, lack of real-time queue visibility, and bottlenecks during entry/exit.',
          'Safety & Emergency Response — Risk of stampedes, medical emergencies, and insufficient early warning mechanisms.',
          'Traffic & Mobility Challenges — Congested approach roads, parking shortages, and inefficient flow of vehicles.',
          'Pilgrim Guidance & Communication — Limited digital tools for real-time updates on waiting times, darshan slots, or emergency alerts.',
          'Resource Optimization — Lack of AI-driven tools for predicting peak crowds and deploying security/medical staff.',
          'Inclusivity & Accessibility — Inadequate solutions for elderly, women, children, and differently-abled devotees.',
        ],
      },
      {
        heading: 'Expected Solutions',
        items: [
          'AI/ML-based Crowd Prediction Models — Forecasting visitor surges based on historical data, weather, holidays, and festival calendars.',
          'Smart Queue & Ticketing Systems — Virtual queue management, digital darshan passes, and real-time updates via mobile apps and kiosks.',
          'IoT & Surveillance Systems — Sensors, CCTV with AI analytics, and drones for crowd density monitoring and automated alerts.',
          'Emergency & Safety Solutions — Real-time panic detection, smart barricade systems, and AI-enabled first responder alerts.',
          'Traffic & Mobility Management — Intelligent parking guidance, shuttle/bus coordination, and dynamic traffic flow systems.',
          'Pilgrim Engagement Platforms — Multilingual apps providing wait times, temple timings, routes, and emergency contacts.',
          'Accessibility Features — Navigation assistance and priority services for elderly and differently-abled pilgrims.',
        ],
      },
    ],
  },

  {
    id: 'SVH26009',
    category: 'Software',
    theme: 'Miscellaneous',
    title: 'Mobile App for Secure Water Level Data Collection Using Image Processing',
    org: 'Ministry of Jal Shakti (MoJS)',
    dept: 'Central Water Commission (CWC), Department of Water Resources, RD & GR',
    desc: 'A GPS-aware mobile application for field personnel to capture geo-tagged, timestamped photos of river gauge posts, enabling secure and tamper-resistant water level data collection for flood forecasting.',
    sections: [
      {
        heading: 'Background',
        body: 'Water level monitoring plays a vital role in flood forecasting, water resource management, and disaster preparedness. In India, many of these readings are still taken manually by field personnel at designated monitoring sites under the Central Water Commission (CWC). These readings are then entered into registers or mobile apps for onward reporting.',
      },
      {
        heading: 'Description',
        body: 'The proposed mobile application leverages recent advancements in image processing, mobile computing, and geolocation to modernize river water level monitoring. Image processing enables automated data extraction, while geofencing and metadata (timestamp and location) ensure secure, authenticated entries. This solution is cost-effective, scalable, and ideal for remote areas.',
      },
      {
        heading: 'Expected Solution Features',
        items: [
          'Geofencing and Location Validation — Display warning if outside the allowed zone.',
          'Mandate real-time photo capture using the mobile camera at the time of reading.',
          'Store metadata (timestamp, GPS coordinates, and photo) along with the reading for audit and traceability.',
          'Interface to manually enter or scan the water level from a gauge post.',
          'Real-time or offline sync to a central server/database when internet is available.',
          'Store entries securely and enable access for analysis or dashboard display.',
          'Public may also upload images of gauge posts.',
          'Role-based access for field personnel, supervisors, and central analysts.',
          'Integration with cloud dashboard for supervisors to track real-time data across multiple sites.',
          'Support for QR code scanning at the site to validate location.',
          'Tamper detection or alerts for skipped readings or unauthorized entries.',
        ],
      },
    ],
  },

  {
    id: 'SVH26010',
    category: 'Software',
    theme: 'Smart Education',
    title: 'Smart Classroom & Timetable Scheduler',
    org: 'Government of Jharkhand',
    dept: 'Department of Higher and Technical Education',
    desc: 'A web-based AI-driven timetable scheduling platform for higher education institutions that eliminates scheduling conflicts and maximizes utilization of classrooms, faculty, and laboratories under NEP 2020.',
    sections: [
      {
        heading: 'Background',
        body: 'Higher education institutions often face challenges in efficient class scheduling due to limited infrastructure, faculty constraints, elective courses, and overlapping departmental requirements. Manual timetable preparation leads to frequent clashes in classes, underutilized classrooms, uneven workload distribution, and dissatisfied students and faculty members. With the increasing adoption of multidisciplinary curricula and flexible learning under NEP 2020, the class scheduling process has become more complex and dynamic.',
      },
      {
        heading: 'Description',
        body: 'The current scheduling mechanism in most higher education institutes/colleges relies on manual input via spreadsheets or basic tools. These fail to account for real-time availability of faculty, room capacity, teaching load norms, subject combinations, and student preferences. A solution is required that accommodates various parameters and returns an optimized timetable ensuring maximized utilization of classrooms and laboratories, minimized workload on faculty and students, and achievement of required learning outcomes.',
      },
      {
        heading: 'Key Parameters',
        items: [
          'Number of classrooms available',
          'Number of batches of students',
          'Number of subjects to be taught in a particular semester',
          'Maximum number of classes per day',
          'Number of classes to be conducted for a subject per week / per day',
          'Number of faculties available for different subjects',
          'Average number of leaves a faculty member takes in a month',
          'Special classes that have fixed slots in the timetable',
        ],
      },
      {
        heading: 'Expected Solution',
        items: [
          'Login facility for authorized personnel to create and manage timetables.',
          'Multiple options of optimized timetables to choose from.',
          'Review and approval workflow for competent authorities.',
          'Suggestions for suitable rearrangements when optimal solutions are not available.',
          'Support for multi-department and multi-shift scheduling.',
          'Web-based platform linkable to the college website.',
        ],
      },
    ],
  },
];
