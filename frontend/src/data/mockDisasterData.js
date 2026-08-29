export const hazardZones = [
  // --- NORTH-EAST REGION ---
  {
    id: "zone-gangtok",
    region: "North-East",
    state: "Sikkim",
    name: "NH-10 Corridor (Singtam - Rangpo)",
    center: [27.2364, 88.4984],
    zoom: 15,
    riskLevel: "CRITICAL",
    pFailure: 0.84,
    leadTimeHours: 18,
    factorOfSafety: 0.79,
    exposedPopulation: 2100,
    rainfall48h: 185,
    slopeAngle: 44.0,
    silentZone: false,
    sirenStatus: "ARMED_LORA",
    hazardPolygon: [
      [27.2395, 88.4930],
      [27.2420, 88.5020],
      [27.2330, 88.5050],
      [27.2305, 88.4960]
    ],
    shapReasons: [
      { feature: "Teesta River Toe Erosion", weight: "+42%" },
      { feature: "Flash Precipitation Index", weight: "+32%" },
      { feature: "Fractured Gneiss Rock", weight: "+16%" },
      { feature: "Heavy Transport Vibration", weight: "+10%" }
    ],
    evacuationPlan: {
      safeZoneName: "Singtam High Plateau Relief Hub",
      distanceKm: "4.6 km",
      elevationDelta: "+110m High Ground",
      capacity: 3500,
      activeStatus: "ACTIVE (SDRF On-site)",
      // Road-snapped mountain curves
      waypoints: [
        [27.2364, 88.4984],
        [27.2378, 88.4998],
        [27.2390, 88.5022],
        [27.2415, 88.5040],
        [27.2440, 88.5030],
        [27.2475, 88.5055],
        [27.2510, 88.5090],
        [27.2540, 88.5140],
        [27.2580, 88.5180]
      ],
      steps: [
        "Halt all civilian traffic at Singtam Bridge access point due to active basal toe erosion.",
        "Divert light vehicles and foot evacuation onto the Upper Hill Bypass Road.",
        "Assemble displaced residents inside Singtam High Plateau Sports Complex."
      ]
    }
  },
  {
    id: "zone-sohra",
    region: "North-East",
    state: "Meghalaya",
    name: "Sohra Ridge (East Khasi Hills)",
    center: [25.2744, 91.7323],
    zoom: 15,
    riskLevel: "CRITICAL",
    pFailure: 0.88,
    leadTimeHours: 36,
    factorOfSafety: 0.76,
    exposedPopulation: 1450,
    rainfall48h: 210,
    slopeAngle: 42.5,
    silentZone: true,
    sirenStatus: "TRIGGERED",
    hazardPolygon: [
      [25.2785, 91.7260],
      [25.2820, 91.7380],
      [25.2730, 91.7410],
      [25.2670, 91.7300]
    ],
    shapReasons: [
      { feature: "48h Extreme Rainfall", weight: "+44%" },
      { feature: "Steep Sandstone Cliff", weight: "+28%" },
      { feature: "Pore Water Uplift", weight: "+18%" },
      { feature: "InSAR Creep Velocity", weight: "+10%" }
    ],
    evacuationPlan: {
      safeZoneName: "Cherrapunji Higher Secondary Ground",
      distanceKm: "4.8 km",
      elevationDelta: "+75m High Ridge",
      capacity: 2500,
      activeStatus: "CLEAR & PATROLLED",
      waypoints: [
        [25.2744, 91.7323],
        [25.2765, 91.7342],
        [25.2790, 91.7370],
        [25.2825, 91.7360],
        [25.2865, 91.7385],
        [25.2910, 91.7430],
        [25.2950, 91.7490],
        [25.2995, 91.7540]
      ],
      steps: [
        "Immediate mandatory evacuation of Sector 4 cliff settlements via East Ridge Track.",
        "Strictly avoid Valley Culvert 14 (high risk of flash debris inundation).",
        "Converge at Cherrapunji Relief Compound via Upper Bypass."
      ]
    }
  },
  {
    id: "zone-sonapur",
    region: "North-East",
    state: "Meghalaya / Assam",
    name: "NH-6 Corridor (Sonapur Tunnel)",
    center: [25.1050, 92.3680],
    zoom: 15,
    riskLevel: "HIGH",
    pFailure: 0.74,
    leadTimeHours: 24,
    factorOfSafety: 0.89,
    exposedPopulation: 520,
    rainfall48h: 155,
    slopeAngle: 38.0,
    silentZone: true,
    sirenStatus: "TRIGGERED",
    hazardPolygon: [
      [25.1090, 92.3620],
      [25.1130, 92.3735],
      [25.1015, 92.3770],
      [25.0975, 92.3650]
    ],
    shapReasons: [
      { feature: "InSAR Ground Creep", weight: "+45%" },
      { feature: "Hill Cutting Instability", weight: "+30%" },
      { feature: "Antecedent Moisture", weight: "+15%" },
      { feature: "Seismic Micro-tremors", weight: "+10%" }
    ],
    evacuationPlan: {
      safeZoneName: "Sonapur High Ground Relief Hub",
      distanceKm: "3.6 km",
      elevationDelta: "+45m Elevation",
      capacity: 1200,
      activeStatus: "ACTIVE (SDRF Staged)",
      waypoints: [
        [25.1050, 92.3680],
        [25.1075, 92.3700],
        [25.1105, 92.3730],
        [25.1150, 92.3755],
        [25.1195, 92.3795],
        [25.1235, 92.3850],
        [25.1285, 92.3910]
      ],
      steps: [
        "Halt heavy commercial traffic entering Sonapur Tunnel portal.",
        "Divert light vehicles via Upper Umkiang Ridge Link Road.",
        "Assemble displaced workers inside Sonapur Relief Hub."
      ]
    }
  },

  // --- HIMALAYAS ---
  {
    id: "zone-joshimath",
    region: "Himalayas",
    state: "Uttarakhand",
    name: "Joshimath - Helang Slope (Chamoli)",
    center: [30.5564, 79.5666],
    zoom: 15,
    riskLevel: "CRITICAL",
    pFailure: 0.91,
    leadTimeHours: 14,
    factorOfSafety: 0.68,
    exposedPopulation: 3400,
    rainfall48h: 140,
    slopeAngle: 46.0,
    silentZone: true,
    sirenStatus: "TRIGGERED",
    hazardPolygon: [
      [30.5630, 79.5590],
      [30.5665, 79.5740],
      [30.5510, 79.5775],
      [30.5470, 79.5610]
    ],
    shapReasons: [
      { feature: "Subsurface Subsidence InSAR", weight: "+50%" },
      { feature: "Glacial Moraine Substrata", weight: "+25%" },
      { feature: "Drainage Inundation", weight: "+15%" },
      { feature: "Steep Topographic Shear", weight: "+10%" }
    ],
    evacuationPlan: {
      safeZoneName: "Auli High Plateau Helipad Base",
      distanceKm: "6.8 km",
      elevationDelta: "+480m Stable Bedrock",
      capacity: 4000,
      activeStatus: "ACTIVE (ITBP Staged)",
      waypoints: [
        [30.5564, 79.5666],
        [30.5540, 79.5640],
        [30.5505, 79.5605],
        [30.5460, 79.5550],
        [30.5410, 79.5500],
        [30.5360, 79.5445]
      ],
      steps: [
        "Immediate mandatory evacuation of lower Sunil and Manohar Bagh wards.",
        "Transit via Upper Ropeway bypass access track directly toward Auli Ridge.",
        "Prohibit civilian crossing over Alaknanda Bridge 2."
      ]
    }
  },
  {
    id: "zone-ramban",
    region: "Himalayas",
    state: "Jammu & Kashmir",
    name: "NH-44 Corridor (Ramban - Banihal)",
    center: [33.2420, 75.1950],
    zoom: 15,
    riskLevel: "CRITICAL",
    pFailure: 0.86,
    leadTimeHours: 20,
    factorOfSafety: 0.73,
    exposedPopulation: 2900,
    rainfall48h: 175,
    slopeAngle: 45.0,
    silentZone: true,
    sirenStatus: "TRIGGERED",
    hazardPolygon: [
      [33.2480, 75.1865],
      [33.2525, 75.2020],
      [33.2370, 75.2065],
      [33.2325, 75.1910]
    ],
    shapReasons: [
      { feature: "Shooting Stone Fragility", weight: "+46%" },
      { feature: "Tectonic Lineament Shear", weight: "+28%" },
      { feature: "Continuous Excavation", weight: "+16%" },
      { feature: "Pore Pressure Spike", weight: "+10%" }
    ],
    evacuationPlan: {
      safeZoneName: "Ramban District Sports Complex",
      distanceKm: "5.2 km",
      elevationDelta: "+95m Safe Buffer",
      capacity: 3200,
      activeStatus: "ACTIVE (Army Staged)",
      waypoints: [
        [33.2420, 75.1950],
        [33.2450, 75.1985],
        [33.2490, 75.2040],
        [33.2540, 75.2110],
        [33.2600, 75.2185],
        [33.2655, 75.2250]
      ],
      steps: [
        "Halt all south-bound convoy traffic at Chanderkote checkpoint.",
        "Divert passenger vehicles into Ramban Relief Complex.",
        "Deploy thermal drones over Panthyal rock-fall sector."
      ]
    }
  },

  // --- WESTERN GHATS ---
  {
    id: "zone-wayanad",
    region: "Western Ghats",
    state: "Kerala",
    name: "Meppadi - Chooralmala (Wayanad)",
    center: [11.5312, 76.1345],
    zoom: 15,
    riskLevel: "CRITICAL",
    pFailure: 0.94,
    leadTimeHours: 12,
    factorOfSafety: 0.62,
    exposedPopulation: 4200,
    rainfall48h: 310,
    slopeAngle: 43.0,
    silentZone: true,
    sirenStatus: "TRIGGERED",
    hazardPolygon: [
      [11.5390, 76.1265],
      [11.5435, 76.1420],
      [11.5245, 76.1465],
      [11.5200, 76.1300]
    ],
    shapReasons: [
      { feature: "Extreme Orographic Rain (300mm+)", weight: "+52%" },
      { feature: "Pore Water Saturation", weight: "+26%" },
      { feature: "Granite Sheet Joint Slip", weight: "+14%" },
      { feature: "Debris Choke in Streams", weight: "+8%" }
    ],
    evacuationPlan: {
      safeZoneName: "Meppadi St. Joseph Relief Ground",
      distanceKm: "5.6 km",
      elevationDelta: "+120m High Ridge",
      capacity: 5000,
      activeStatus: "URGENT EVACUATION ACTIVE",
      waypoints: [
        [11.5312, 76.1345],
        [11.5340, 76.1315],
        [11.5380, 76.1265],
        [11.5430, 76.1205],
        [11.5485, 76.1145],
        [11.5540, 76.1085]
      ],
      steps: [
        "MANDATORY: Evacuate all Chooralmala & Mundakkai riverbank hamlets immediately.",
        "Take the elevated tea estate northern ridge bypass directly toward Meppadi Center.",
        "Strictly avoid Bailey bridge crossing due to secondary flash debris surge."
      ]
    }
  },
  {
    id: "zone-raigad",
    region: "Western Ghats",
    state: "Maharashtra",
    name: "Mahad - Irshalwadi Escarpment",
    center: [18.1820, 73.4410],
    zoom: 15,
    riskLevel: "HIGH",
    pFailure: 0.78,
    leadTimeHours: 32,
    factorOfSafety: 0.86,
    exposedPopulation: 1100,
    rainfall48h: 195,
    slopeAngle: 39.5,
    silentZone: false,
    sirenStatus: "ARMED_LORA",
    hazardPolygon: [
      [18.1880, 73.4330],
      [18.1925, 73.4485],
      [18.1765, 73.4515],
      [18.1720, 73.4360]
    ],
    shapReasons: [
      { feature: "Basalt Laterite Interface Slump", weight: "+42%" },
      { feature: "Konkan Monsoon Inundation", weight: "+34%" },
      { feature: "Absence of Deep Root Cover", weight: "+14%" },
      { feature: "Overland Flow Shear", weight: "+10%" }
    ],
    evacuationPlan: {
      safeZoneName: "Mahad Municipal High School Complex",
      distanceKm: "4.4 km",
      elevationDelta: "+40m Flood-safe",
      capacity: 2200,
      activeStatus: "CLEAR",
      waypoints: [
        [18.1820, 73.4410],
        [18.1855, 73.4450],
        [18.1905, 73.4505],
        [18.1965, 73.4570],
        [18.2025, 73.4645]
      ],
      steps: [
        "Sound roadside LoRa sirens across cliff-foot hamlets.",
        "Escort residents along northern metalled access track to Mahad.",
        "Stage NDRF 5th Battalion boats on standby at Savitri River basin."
      ]
    }
  }
];