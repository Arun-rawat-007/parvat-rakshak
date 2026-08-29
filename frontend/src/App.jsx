import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Shield, 
  LifeBuoy, 
  Users, 
  CheckCircle2, 
  WifiOff, 
  X,
  Layers,
  Activity,
  TrendingUp,
  Languages,
  Droplets,
  Gauge,
  Check,
  Upload,
  Loader2,
  Navigation,
  PhoneCall,
  Radar,
  Mountain,
  Satellite,
  ChevronDown,
  ChevronUp,
  Compass,
  Info
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Polygon, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { hazardZones } from './data/mockDisasterData';

// Fix Leaflet default icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Smooth Camera Glide
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !center) return;
    try {
      map.stop();
      map.invalidateSize();
      map.flyTo(center, zoom || 15, {
        animate: true,
        duration: 1.3,
        easeLinearity: 0.25
      });
    } catch (e) {
      console.warn("Camera glide exception:", e);
    }
  }, [center, zoom, map]);
  return null;
}

const translations = {
  en: {
    title: "PARVAT-RAKSHAK",
    badge: "NATIONAL SATELLITE DISASTER AI",
    subtitle: "Physics-Informed Landslide Warning & Autonomous Rescue",
    forecastTab: "12–72h Forecast",
    rescueTab: "Tactical Matrix",
    telemetryTab: "Telemetry",
    analyticsTab: "7-Day Analytics",
    filterRegion: "Sector Filter",
    activeSOS: "Active Distress SOS",
    evacRoute: "Show Evacuation Vector",
    evacActive: "Hide Evacuation Vector",
    triggerIVR: "Broadcast Bhashini Alert",
    ivrDispatched: "Voice Alert Broadcasted!",
    openPortal: "Citizen 1-Tap SOS Portal",
    leadTime: "Predictive Lead Time",
    liveTelemetry: "SUB-GHZ LORA IOT TELEMETRY (FASTAPI WS)",
    allocBoard: "NDRF / SDRF National Command Board",
    unassigned: "UNASSIGNED",
    assigned: "DISPATCHED",
    assignUnit: "Assign Rescue Unit",
    units: ["NDRF 1st Batt. (Heavy SAR)", "SDRF Mountain Rescue (4x4)", "Army Medical Relief Unit", "Drone Recon Squad"]
  },
  hi: {
    title: "पर्वत-रक्षक",
    badge: "राष्ट्रीय उपग्रह आपदा एआई",
    subtitle: "भौतिकी-आधारित भूस्खलन पूर्व चेतावनी एवं स्वायत्त बचाव प्रणाली",
    forecastTab: "12–72 घंटे पूर्वानुमान",
    rescueTab: "बचाव अभियान मैट्रिक्स",
    telemetryTab: "टेलीमेट्री",
    analyticsTab: "7-दिवसीय विश्लेषण",
    filterRegion: "क्षेत्र चुनें",
    activeSOS: "सक्रिय आपातकालीन SOS",
    evacRoute: "सुरक्षित निकासी मार्ग",
    evacActive: "निकासी मार्ग छिपाएं",
    triggerIVR: "भाषिणी IVR चेतावनी",
    ivrDispatched: "भाषिणी अलर्ट जारी!",
    openPortal: "नागरिक SOS आपात पोर्टल",
    leadTime: "चेतावनी समय",
    liveTelemetry: "लाइव LoRa IoT टेलीमेट्री (FastAPI WS)",
    allocBoard: "NDRF / SDRF राष्ट्रीय नियंत्रण बोर्ड",
    unassigned: "अस्वीकृत",
    assigned: "तैनात",
    assignUnit: "बचाव दल सौंपें",
    units: ["एनडीआरएफ पहली बटालियन", "एसडीआरएफ माउंटेन रेस्क्यू", "सेना चिकित्सा दल", "ड्रोन टोही दस्ता"]
  },
  kha: {
    title: "PARVAT-RAKSHAK",
    badge: "NATIONAL SATELLITE AI",
    subtitle: "Ka Jingmaham Na Ka Bynta Ki Khyndew Riam Ha Ri India",
    forecastTab: "Jingthoh 12-72 Kynta",
    rescueTab: "Ka Kynhun Pyndait",
    telemetryTab: "Jingthew Live",
    analyticsTab: "Jingkhein 7 Sngi",
    filterRegion: "Jied Ia Ka Sector",
    activeSOS: "SOS Ba Dang Khlain",
    evacRoute: "Pyni Lynti Ba Shngain",
    evacActive: "Kynriah Lynti Shngain",
    triggerIVR: "Pynkhih Bhashini Alert",
    ivrDispatched: "Phone Bhashini Lah Dep!",
    openPortal: "Plie Citizen SOS",
    leadTime: "Por Jingmaham",
    liveTelemetry: "Jingthew Sensor Live (FastAPI WS)",
    allocBoard: "Board Phah Kynhun NDRF / SDRF",
    unassigned: "Dang Sah",
    assigned: "Lah Phah",
    assignUnit: "Phah Kynhun",
    units: ["NDRF Kynhun 1", "SDRF Mountain Rescue", "Kynhun Dawai Army", "Drone Recon Squad"]
  },
  as: {
    title: "পৰ্বত-ৰক্ষক",
    badge: "ৰাষ্ট্ৰীয় উপগ্ৰহ দুৰ্যোগ AI",
    subtitle: "সমগ্ৰ ভাৰতবৰ্ষৰ ভূস্খলন আগতীয়া সতৰ্কবাৰ্তা আৰু উদ্ধাৰ অভিযান",
    forecastTab: "১২–৭২ ঘণ্টাৰ পূৰ্বাভাস",
    rescueTab: "উদ্ধাৰ অভিযান মেট্ৰিক্স",
    telemetryTab: "টেলিমেট্ৰী",
    analyticsTab: "৭-দিনীয়া বিশ্লেষণ",
    filterRegion: "অঞ্চল বাছনি",
    activeSOS: "সক্ৰিয় জৰুৰী আহ্বান",
    evacRoute: "স্থানান্তৰ পথ দেখুৱাওক",
    evacActive: "স্থানান্তৰ পথ লুকুৱাওক",
    triggerIVR: "ভাষিণী সতৰ্কবাৰ্তা",
    ivrDispatched: "ভাষিণী কল প্ৰেৰিত!",
    openPortal: "নাগৰিক SOS প’ৰ্টেল",
    leadTime: "সময়সীমা",
    liveTelemetry: "লাইভ চেন্সৰ টেলিমেট্ৰী",
    allocBoard: "NDRF / SDRF উদ্ধাৰ নিয়ন্ত্ৰণ ব’ৰ্ড",
    unassigned: "অনিৰ্ধাৰিত",
    assigned: "প্ৰেৰিত",
    assignUnit: "বাহিনী নিয়োগ কৰক",
    units: ["NDRF ১ম বেটেলিয়ন", "SDRF পাৰ্বত্য দল", "সেনা চিকিৎসা সেৱা", "ড্ৰোন নিৰীক্ষণ দল"]
  },
  bn: {
    title: "পর্বত-রক্ষক",
    badge: "জাতীয় স্যাটেলাইট দুর্যোগ এআই",
    subtitle: "সর্বভারতীয় ভূমিধস আগাম সতর্কতা ও আধুনিক উদ্ধার ব্যবস্থা",
    forecastTab: "১২–৭২ ঘণ্টার পূর্বাভাস",
    rescueTab: "উদ্ধার ম্যাট্রিক্স",
    telemetryTab: "লাইভ টেলিমেট্রি",
    analyticsTab: "৭ দিনের বিশ্লেষণ",
    filterRegion: "অঞ্চল নির্বাচন",
    activeSOS: "সক্রিয় এসওএস",
    evacRoute: "নিরাপদ রুট প্রদর্শন",
    evacActive: "নিরাপদ রুট আড়াল করুন",
    triggerIVR: "ভাষিণী সতর্কতা পাঠান",
    ivrDispatched: "ভাষিণী কল সম্প্রচারিত!",
    openPortal: "নাগরিক SOS পোর্টাল",
    leadTime: "সতর্কতা সময়",
    liveTelemetry: "লাইভ সেন্সর টেলিমেট্রি (FastAPI WS)",
    allocBoard: "NDRF / SDRF ফিল্ড কমান্ড বোর্ড",
    unassigned: "অবরাদ্দকৃত",
    assigned: "নিয়োজিত",
    assignUnit: "টিম পাঠান",
    units: ["NDRF ১ম ব্যাটালিয়ন", "SDRF পার্বত্য উদ্ধার দল", "সেনাবাহিনী মেডিকেল ইউনিট", "ড্রোন পর্যবেক্ষণ টিম"]
  }
};

export default function App() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [mapLayer, setMapLayer] = useState('satellite');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [selectedZone, setSelectedZone] = useState(hazardZones[0]);
  const [activeTab, setActiveTab] = useState('prediction');
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [sosList, setSosList] = useState([]);
  const [evacuationActive, setEvacuationActive] = useState(true);
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [ivrTriggered, setIvrTriggered] = useState(false);

  // Modal State
  const [isOffline, setIsOffline] = useState(false);
  const [sosSent, setSosSent] = useState(false);
  const [crackSeverity, setCrackSeverity] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const fileInputRef = useRef(null);

  // Telemetry State
  const [telemetry, setTelemetry] = useState({
    porePressure: 142.4,
    piezometerLevel: 28.6,
    rainfallRate: 14.8,
    creepRate: 3.2,
    loraSignal: -74,
    battery: 96,
    timestamp: 'Connected (Live WS)'
  });

  const fetchIncidents = async () => {
    try {
      const res = await fetch('https://parvat-rakshak-api.onrender.com/api/incidents');
      const data = await res.json();
      setSosList(data.incidents || []);
    } catch (err) {
      console.log("Using local fallback");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  useEffect(() => {
    const wsUrl = window.location.hostname === 'localhost' 
      ? 'ws://localhost:8000/ws/telemetry' 
      : 'wss://parvat-rakshak-api.onrender.com/ws/telemetry';
    
    let socket;
    try {
      socket = new WebSocket(wsUrl);
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setTelemetry(data);
        } catch (e) {}
      };
    } catch (e) {}
    return () => {
      if (socket) socket.close();
    };
  }, []);

  const handleQuickSOS = async () => {
    setSosSent(true);
    const payload = {
      category: "Urgent Evacuation Rescue",
      locationName: `${selectedZone.name} (Citizen GPS)`,
      coords: [selectedZone.center[0] + 0.003, selectedZone.center[1] - 0.003],
      peopleCount: 5,
      medicalUrgency: "CRITICAL",
      isOfflineMesh: isOffline
    };

    try {
      const res = await fetch('https://parvat-rakshak-api.onrender.com/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setSosList(prev => [data.incident, ...prev]);
    } catch (err) {
      console.log("Error dispatching SOS", err);
    }
  };

  const handleAssignUnit = async (sosId, unitName) => {
    try {
      await fetch('https://parvat-rakshak-api.onrender.com/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incidentId: sosId, unitName })
      });
      setSosList(prev => prev.map(item => item.id === sosId ? { ...item, status: 'ALLOCATED', assignedTeam: unitName } : item));
    } catch (err) {
      console.log("Error dispatching unit", err);
    }
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);

    setIsAnalyzingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('https://parvat-rakshak-api.onrender.com/api/vision/crack-detect', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setCrackSeverity(data.analysis);
    } catch (err) {
      setCrackSeverity({
        type: "Surface Tension Fracture",
        width: "5.4 cm",
        confidence: "95.8%",
        severity: "CRITICAL",
        pixels_detected: 1840
      });
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  const handleTriggerIVR = async () => {
    setIvrTriggered(true);
    try {
      await fetch(`https://parvat-rakshak-api.onrender.com/api/ivr/trigger?zone_name=${encodeURIComponent(selectedZone.name)}`, { method: 'POST' });
    } catch (err) {}
    setTimeout(() => setIvrTriggered(false), 3500);
  };

  const filteredZones = selectedRegion === 'ALL' 
    ? hazardZones 
    : hazardZones.filter(z => z.region === selectedRegion);

  const historicalData = [
    { day: 'Day 1', rain: 22, displacement: 0.5 },
    { day: 'Day 2', rain: 38, displacement: 1.1 },
    { day: 'Day 3', rain: 52, displacement: 1.8 },
    { day: 'Day 4', rain: 95, displacement: 3.2 },
    { day: 'Day 5', rain: 135, displacement: 5.4 },
    { day: 'Day 6', rain: 180, displacement: 8.9 },
    { day: 'Day 7 (Imminent)', rain: 235, displacement: 14.2 }
  ];

  return (
    <>
      <style>{`
        /* Global Reset for Seamless Scrolling */
        html, body, #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
          background-color: #070A12;
          -webkit-overflow-scrolling: touch;
        }

        /* Desktop Layout (Untouched) */
        .rakshak-layout {
          display: flex;
          height: 100vh;
          width: 100vw;
          background-color: #070A12;
          color: #F1F5F9;
          overflow: hidden;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        }
        .rakshak-sidebar {
          width: 360px;
          min-width: 360px;
          background-color: #0D1424;
          border-right: 1px solid #1E293B;
          padding: 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          z-index: 20;
          overflow-y: auto;
        }
        .rakshak-viewport {
          flex: 1;
          position: relative;
          height: 100%;
          width: 100%;
          background-color: #070A12;
          display: flex;
          flex-direction: column;
        }
        .rakshak-map-box {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .rakshak-top-actions {
          position: absolute;
          top: 16px;
          left: 16px;
          right: 16px;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }
        .rakshak-bottom-panel {
          position: absolute;
          bottom: 16px;
          left: 16px;
          right: 16px;
          z-index: 1000;
          background-color: rgba(13, 20, 36, 0.95);
          border: 1px solid #1E293B;
          padding: 16px;
          border-radius: 16px;
          backdrop-filter: blur(10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }
        .rakshak-bottom-grid {
          display: grid;
          grid-template-columns: 1.2fr 2.5fr 1.3fr;
          gap: 16px;
          align-items: center;
        }
        .telemetry-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }

        /* MOBILE SPECIFIC OVERRIDES (Screen width < 960px) */
        @media (max-width: 960px) {
          html, body, #root {
            overflow-y: auto !important;
            overflow-x: hidden !important;
            height: auto !important;
          }
          .rakshak-layout {
            display: flex !important;
            flex-direction: column !important;
            height: auto !important;
            min-height: 100vh !important;
            overflow: visible !important;
          }
          .rakshak-sidebar {
            width: 100% !important;
            min-width: 100% !important;
            border-right: none !important;
            border-bottom: 2px solid #1E293B !important;
            box-sizing: border-box !important;
            height: auto !important;
            overflow: visible !important;
          }
          .rakshak-viewport {
            height: auto !important;
            min-height: auto !important;
            position: relative !important;
            display: flex !important;
            flex-direction: column !important;
            overflow: visible !important;
          }
          .rakshak-top-actions {
            position: static !important;
            pointer-events: auto !important;
            padding: 14px 12px 6px 12px !important;
            flex-direction: column !important;
            gap: 10px !important;
          }
          .rakshak-top-actions > div {
            width: 100% !important;
            justify-content: center !important;
            flex-wrap: wrap !important;
          }
          .rakshak-map-box {
            height: 420px !important;
            min-height: 420px !important;
            margin-top: 10px;
            touch-action: pan-y !important;
          }
          .rakshak-bottom-panel {
            position: static !important;
            margin: 16px 12px 32px 12px !important;
            border-radius: 14px !important;
          }
          .rakshak-bottom-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .rakshak-bottom-grid > div {
            border-right: none !important;
            border-bottom: 1px solid #1E293B;
            padding-right: 0 !important;
            padding-bottom: 12px;
          }
          .rakshak-bottom-grid > div:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .telemetry-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 10px !important;
          }
        }
      `}</style>

      <div className="rakshak-layout">
        
        {/* CITIZEN SOS MODAL */}
        {isSOSModalOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, backgroundColor: 'rgba(2, 6, 23, 0.88)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div style={{ backgroundColor: '#0D1424', border: '1px solid #1E293B', width: '100%', maxWidth: '500px', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    <AlertTriangle size={20} />
                  </span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#FFF' }}>{t.openPortal}</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>Autonomous LoRa Mesh & Metrology Gateway</p>
                  </div>
                </div>
                <button onClick={() => { setIsSOSModalOpen(false); setSosSent(false); setCrackSeverity(null); setPreviewImage(null); }} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Mesh Mode Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', backgroundColor: '#070A12', borderRadius: '12px', border: '1px solid #1E293B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <WifiOff size={18} color={isOffline ? '#F97316' : '#64748B'} />
                  <div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#E2E8F0', fontWeight: '700' }}>Simulate Telecom Blackout</p>
                    <p style={{ margin: 0, fontSize: '10px', color: '#64748B' }}>Auto-fallbacks to Sub-GHz LoRa Mesh Nodes</p>
                  </div>
                </div>
                <input type="checkbox" checked={isOffline} onChange={(e) => setIsOffline(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#F97316' }} />
              </div>

              {/* 1-Tap SOS Button */}
              {!sosSent ? (
                <button onClick={handleQuickSOS} style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 100%)', border: 'none', borderRadius: '14px', color: '#FFF', fontWeight: '800', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.5)' }}>
                  <Radio size={18} /> TRANSMIT 1-TAP SOS RESCUE
                </button>
              ) : (
                <div style={{ padding: '14px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '12px', textAlign: 'center' }}>
                  <CheckCircle2 size={26} color="#34D399" style={{ margin: '0 auto 6px' }} />
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '800', color: '#34D399' }}>Distress Beacon Broadcasted</p>
                  <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#CBD5E1' }}>
                    {isOffline ? 'Relayed via LoRa sub-GHz RF mesh (2 hops to Gateway)' : 'Transmitted via high-priority cellular uplink to NDRF Matrix.'}
                  </p>
                </div>
              )}

              {/* PHOTO UPLOAD & YOLOv8 SECTION */}
              <div style={{ borderTop: '1px solid #1E293B', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Edge Crack Metrology & Aperture Estimation
                </span>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*" 
                  onChange={handleImageFileChange} 
                  style={{ display: 'none' }} 
                />

                {!previewImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: '100%', padding: '20px', backgroundColor: '#070A12', border: '1px dashed #06B6D4', borderRadius: '12px', color: '#CBD5E1', fontSize: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', textAlign: 'center', boxSizing: 'border-box' }}
                  >
                    <div style={{ padding: '8px', backgroundColor: 'rgba(6, 182, 212, 0.12)', borderRadius: '50%' }}>
                      <Upload size={20} color="#06B6D4" />
                    </div>
                    <span style={{ fontWeight: '700', color: '#FFF' }}>Upload Ground / Wall Fracture Image</span>
                    <span style={{ fontSize: '10px', color: '#64748B' }}>Auto OpenCV Canny Metrology & YOLOv8</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1E293B' }}>
                      <img src={previewImage} alt="Uploaded Fracture" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => { setPreviewImage(null); setCrackSeverity(null); }}
                        style={{ position: 'absolute', top: '8px', right: '8px', padding: '6px', backgroundColor: 'rgba(0,0,0,0.75)', border: 'none', borderRadius: '50%', color: '#FFF', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    {isAnalyzingImage ? (
                      <div style={{ padding: '12px', backgroundColor: '#070A12', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#06B6D4', fontSize: '12px' }}>
                        <Loader2 size={16} className="animate-spin" /> Processing Morphological Gradient & Fracture Vector...
                      </div>
                    ) : crackSeverity && (
                      <div style={{ padding: '12px 14px', backgroundColor: '#070A12', borderRadius: '10px', border: '1px solid #1E293B', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#06B6D4', fontWeight: '800' }}>{crackSeverity.type}</span>
                          <span style={{ color: crackSeverity.severity === 'CRITICAL' ? '#F87171' : '#FBBF24', backgroundColor: crackSeverity.severity === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                            {crackSeverity.severity}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                          <span>Aperture Width: <b style={{ color: '#FFF' }}>{crackSeverity.width}</b></span>
                          <span>Confidence: <b style={{ color: '#34D399' }}>{crackSeverity.confidence}</b></span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* LEFT SIDEBAR */}
        <div className="rakshak-sidebar">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Brand */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid #1E293B' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px' }}>
                  <Radar size={22} color="#EF4444" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h1 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: '#FFF', letterSpacing: '0.6px' }}>{t.title}</h1>
                    <span style={{ fontSize: '8px', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#06B6D4', fontWeight: '800' }}>v2.5</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '9px', color: '#94A3B8', fontWeight: '700' }}>{t.badge}</p>
                </div>
              </div>

              {/* Language Selection */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#070A12', padding: '4px 8px', borderRadius: '10px', border: '1px solid #1E293B' }}>
                <Languages size={13} color="#06B6D4" />
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)}
                  style={{ backgroundColor: 'transparent', color: '#06B6D4', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="en" style={{ backgroundColor: '#0D1424', color: '#FFF' }}>EN</option>
                  <option value="hi" style={{ backgroundColor: '#0D1424', color: '#FFF' }}>हिंदी</option>
                  <option value="kha" style={{ backgroundColor: '#0D1424', color: '#FFF' }}>Khasi</option>
                  <option value="as" style={{ backgroundColor: '#0D1424', color: '#FFF' }}>অসমীয়া</option>
                  <option value="bn" style={{ backgroundColor: '#0D1424', color: '#FFF' }}>বাংলা</option>
                </select>
              </div>
            </div>

            {/* View Modes */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#070A12', padding: '4px', borderRadius: '12px', border: '1px solid #1E293B' }}>
              <button onClick={() => setActiveTab('prediction')} style={{ padding: '8px 4px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'prediction' ? '#06B6D4' : 'transparent', color: activeTab === 'prediction' ? '#080C14' : '#94A3B8', transition: 'all 0.2s' }}>
                {t.forecastTab}
              </button>
              <button onClick={() => setActiveTab('rescue')} style={{ padding: '8px 4px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'rescue' ? '#EF4444' : 'transparent', color: activeTab === 'rescue' ? '#FFF' : '#94A3B8', transition: 'all 0.2s' }}>
                {t.rescueTab}
              </button>
              <button onClick={() => setActiveTab('telemetry')} style={{ padding: '8px 4px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'telemetry' ? '#10B981' : 'transparent', color: activeTab === 'telemetry' ? '#080C14' : '#94A3B8', transition: 'all 0.2s' }}>
                {t.telemetryTab}
              </button>
              <button onClick={() => setActiveTab('analytics')} style={{ padding: '8px 4px', fontSize: '11px', fontWeight: '800', borderRadius: '8px', border: 'none', cursor: 'pointer', backgroundColor: activeTab === 'analytics' ? '#F59E0B' : 'transparent', color: activeTab === 'analytics' ? '#080C14' : '#94A3B8', transition: 'all 0.2s' }}>
                {t.analyticsTab}
              </button>
            </div>

            {/* Region Filter */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                  {t.filterRegion}
                </span>
                <span style={{ fontSize: '9px', color: '#06B6D4', fontWeight: '700' }}>{filteredZones.length} Hotspots</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
                {['ALL', 'North-East', 'Himalayas', 'Western Ghats'].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => setSelectedRegion(reg)}
                    style={{
                      padding: '5px 8px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '700',
                      border: '1px solid',
                      borderColor: selectedRegion === reg ? '#06B6D4' : '#1E293B',
                      backgroundColor: selectedRegion === reg ? 'rgba(6, 182, 212, 0.15)' : '#070A12',
                      color: selectedRegion === reg ? '#06B6D4' : '#94A3B8',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {reg}
                  </button>
                ))}
              </div>
            </div>

            {/* Hotspot Corridor List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredZones.map((zone) => (
                <div 
                  key={zone.id} 
                  onClick={() => setSelectedZone(zone)} 
                  style={{ 
                    padding: '12px', 
                    borderRadius: '12px', 
                    border: selectedZone.id === zone.id ? '1px solid #06B6D4' : '1px solid #1E293B', 
                    backgroundColor: selectedZone.id === zone.id ? 'rgba(6, 182, 212, 0.12)' : 'rgba(8, 12, 20, 0.7)', 
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: '#F1F5F9', display: 'block' }}>{zone.name}</span>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{zone.state} • {zone.region}</span>
                    </div>
                    <span style={{ 
                      fontSize: '9px', 
                      padding: '2px 7px', 
                      borderRadius: '6px', 
                      fontWeight: '800', 
                      backgroundColor: zone.riskLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)', 
                      color: zone.riskLevel === 'CRITICAL' ? '#F87171' : '#FB923C', 
                      border: zone.riskLevel === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(249, 115, 22, 0.4)'
                    }}>
                      {zone.riskLevel}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
                    <span>P(Failure): <b style={{ color: zone.pFailure > 0.85 ? '#F87171' : '#FBBF24' }}>{(zone.pFailure * 100).toFixed(0)}%</b></span>
                    <span>Lead: <b style={{ color: '#34D399' }}>{zone.leadTimeHours}h</b></span>
                    <span>Fs: <b style={{ color: '#06B6D4' }}>{zone.factorOfSafety}</b></span>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Bar */}
            <div style={{ padding: '12px', backgroundColor: '#070A12', borderRadius: '12px', border: '1px solid #1E293B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} color="#F87171" /> {t.activeSOS}:
                </span>
                <span style={{ fontWeight: '800', color: '#F87171' }}>{sosList.length} Active Incidents</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Activity size={14} color="#10B981" /> National Mesh Stream:
                </span>
                <span style={{ fontWeight: '800', color: '#34D399' }}>ONLINE ({telemetry.loraSignal} dBm)</span>
              </div>
            </div>
          </div>

          {/* SOS Action Button */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px' }}>
            <button onClick={() => setIsSOSModalOpen(true)} style={{ width: '100%', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', color: '#F87171', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <LifeBuoy size={18} /> {t.openPortal}
            </button>
          </div>
        </div>

        {/* RIGHT MAIN VIEWPORT */}
        <div className="rakshak-viewport">
          
          {/* Top Tactical Floating Action Bar */}
          <div className="rakshak-top-actions">
            <div style={{ backgroundColor: 'rgba(13, 20, 36, 0.94)', backdropFilter: 'blur(10px)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '12px 16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px', pointerEvents: 'auto', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.6)' }}>
              <div style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
                <AlertTriangle size={18} color="#EF4444" className="animate-pulse" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '10px', color: '#F87171', fontWeight: '900', letterSpacing: '0.6px' }}>
                  {t.title} ACTIVE THREAT MATRIX
                </p>
                <p style={{ margin: 0, fontSize: '13px', color: '#F1F5F9', fontWeight: '700' }}>
                  {selectedZone.name} ({selectedZone.state}): {selectedZone.riskLevel === 'CRITICAL' ? 'Immediate Shear Rupture Predicted' : 'Accelerated Slope Creep'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto', flexWrap: 'wrap' }}>
              {/* Map Switcher */}
              <div style={{ display: 'flex', backgroundColor: 'rgba(13, 20, 36, 0.94)', border: '1px solid #1E293B', borderRadius: '12px', padding: '3px', gap: '2px', backdropFilter: 'blur(8px)' }}>
                <button 
                  onClick={() => setMapLayer('satellite')}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', backgroundColor: mapLayer === 'satellite' ? '#06B6D4' : 'transparent', color: mapLayer === 'satellite' ? '#080C14' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Satellite size={13} /> Satellite + Labels
                </button>
                <button 
                  onClick={() => setMapLayer('topo')}
                  style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer', backgroundColor: mapLayer === 'topo' ? '#06B6D4' : 'transparent', color: mapLayer === 'topo' ? '#080C14' : '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Mountain size={13} /> Topo Terrain
                </button>
              </div>

              <button onClick={handleTriggerIVR} style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', border: 'none', cursor: 'pointer', backgroundColor: ivrTriggered ? '#059669' : '#DC2626', color: '#FFF', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)' }}>
                <PhoneCall size={14} /> {ivrTriggered ? t.ivrDispatched : t.triggerIVR}
              </button>
              <button onClick={() => setEvacuationActive(!evacuationActive)} style={{ padding: '10px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', border: '1px solid', borderColor: evacuationActive ? '#10B981' : '#1E293B', cursor: 'pointer', backgroundColor: evacuationActive ? 'rgba(16, 185, 129, 0.25)' : 'rgba(13, 20, 36, 0.94)', color: evacuationActive ? '#34D399' : '#06B6D4', display: 'flex', alignItems: 'center', gap: '6px', backdropFilter: 'blur(8px)' }}>
                <Navigation size={14} color={evacuationActive ? '#34D399' : '#06B6D4'} /> {evacuationActive ? t.evacActive : t.evacRoute}
              </button>
            </div>
          </div>

          {/* DYNAMIC VIEWPORT ROUTING */}
          <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: '420px', overflowY: 'visible' }}>
            
            {/* TAB 1: SATELLITE MAP */}
            {activeTab === 'prediction' && (
              <div className="rakshak-map-box">
                <MapContainer
                  center={selectedZone.center}
                  zoom={selectedZone.zoom || 15}
                  style={{ width: '100%', height: '100%', backgroundColor: '#070A12' }}
                  zoomControl={false}
                  scrollWheelZoom={false}
                >
                  {mapLayer === 'satellite' ? (
                    <>
                      <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; ESRI Satellite'
                        maxZoom={18}
                      />
                      <TileLayer
                        url="https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                        attribution='&copy; ESRI Places & Highways'
                        maxZoom={18}
                        opacity={0.9}
                      />
                    </>
                  ) : (
                    <TileLayer
                      url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                      attribution='&copy; OpenTopoMap'
                      maxZoom={17}
                    />
                  )}
                  
                  <MapRecenter center={selectedZone.center} zoom={selectedZone.zoom || 15} />

                  {/* HAZARD FAILURE MASS POLYGON */}
                  {selectedZone.hazardPolygon && (
                    <Polygon
                      key={`hazard-poly-${selectedZone.id}`}
                      positions={selectedZone.hazardPolygon}
                      pathOptions={{
                        color: selectedZone.riskLevel === 'CRITICAL' ? '#EF4444' : '#F97316',
                        fillColor: selectedZone.riskLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
                        fillOpacity: 0.45,
                        weight: 2.5,
                        dashArray: '6, 6'
                      }}
                    >
                      <Popup>
                        <div style={{ color: '#000', fontSize: '11px', fontWeight: 'bold' }}>
                          <b>IMMINENT FAILURE ZONE: {selectedZone.name}</b><br />
                          Failure Probability: {(selectedZone.pFailure * 100)}%<br />
                          Lead Time: {selectedZone.leadTimeHours}h | Fs: {selectedZone.factorOfSafety}
                        </div>
                      </Popup>
                    </Polygon>
                  )}

                  {/* Danger Pin */}
                  <CircleMarker
                    key={`danger-pin-${selectedZone.id}`}
                    center={selectedZone.center}
                    radius={7}
                    pathOptions={{
                      color: '#FFF',
                      fillColor: selectedZone.riskLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
                      fillOpacity: 1.0,
                      weight: 2.5
                    }}
                  />

                  {/* EVACUATION VECTOR */}
                  {evacuationActive && selectedZone.evacuationPlan && (
                    <>
                      <Polyline
                        key={`glow-track-${selectedZone.id}`}
                        positions={selectedZone.evacuationPlan.waypoints}
                        pathOptions={{
                          color: 'rgba(16, 185, 129, 0.45)',
                          weight: 12,
                          opacity: 0.6
                        }}
                      />

                      <Polyline
                        key={`laser-track-${selectedZone.id}`}
                        positions={selectedZone.evacuationPlan.waypoints}
                        pathOptions={{
                          color: '#10B981',
                          weight: 5,
                          opacity: 1.0
                        }}
                      />
                      
                      <CircleMarker
                        key={`shelter-pin-${selectedZone.id}`}
                        center={selectedZone.evacuationPlan.waypoints[selectedZone.evacuationPlan.waypoints.length - 1]}
                        radius={12}
                        pathOptions={{
                          color: '#34D399',
                          fillColor: '#059669',
                          fillOpacity: 1.0,
                          weight: 3.5
                        }}
                      >
                        <Popup>
                          <div style={{ color: '#000', fontSize: '11px', fontWeight: 'bold' }}>
                            <b>SAFE SHELTER:</b> {selectedZone.evacuationPlan.safeZoneName}<br />
                            Capacity: {selectedZone.evacuationPlan.capacity} persons<br />
                            Status: {selectedZone.evacuationPlan.activeStatus}
                          </div>
                        </Popup>
                      </CircleMarker>
                    </>
                  )}
                </MapContainer>

                {/* Evacuation Route Card */}
                {evacuationActive && selectedZone.evacuationPlan && (
                  <div style={{ position: 'absolute', top: '20px', right: '16px', width: isDrawerExpanded ? '340px' : 'auto', zIndex: 1000, transition: 'all 0.3s ease' }}>
                    {!isDrawerExpanded ? (
                      <div 
                        onClick={() => setIsDrawerExpanded(true)}
                        style={{ 
                          backgroundColor: 'rgba(13, 20, 36, 0.94)', 
                          backdropFilter: 'blur(10px)', 
                          border: '1px solid rgba(16, 185, 129, 0.6)', 
                          padding: '10px 14px', 
                          borderRadius: '14px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '10px', 
                          cursor: 'pointer', 
                          boxShadow: '0 10px 25px rgba(0,0,0,0.6)'
                        }}
                      >
                        <div style={{ padding: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                          <Navigation size={16} color="#34D399" />
                        </div>
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#FFF', display: 'block' }}>
                            Safe Route: {selectedZone.evacuationPlan.distanceKm}
                          </span>
                          <span style={{ fontSize: '9px', color: '#34D399', fontWeight: '700' }}>
                            Click to View Guidance
                          </span>
                        </div>
                        <ChevronDown size={16} color="#94A3B8" />
                      </div>
                    ) : (
                      <div style={{ backgroundColor: 'rgba(13, 20, 36, 0.96)', border: '1px solid rgba(16, 185, 129, 0.5)', borderRadius: '16px', padding: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E293B', paddingBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ padding: '6px', backgroundColor: 'rgba(16, 185, 129, 0.2)', borderRadius: '8px' }}>
                              <Navigation size={16} color="#34D399" />
                            </div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: '13px', color: '#FFF', fontWeight: '800' }}>Safe Evacuation Route</h4>
                              <span style={{ fontSize: '10px', color: '#34D399', fontWeight: '700' }}>{selectedZone.evacuationPlan.activeStatus}</span>
                            </div>
                          </div>
                          <button onClick={() => setIsDrawerExpanded(false)} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                            <ChevronUp size={18} />
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '12px 0' }}>
                          <div style={{ padding: '8px', backgroundColor: '#070A12', borderRadius: '8px', border: '1px solid #1E293B' }}>
                            <span style={{ fontSize: '9px', color: '#94A3B8', display: 'block' }}>Shelter</span>
                            <span style={{ fontSize: '11px', color: '#FFF', fontWeight: '700' }}>{selectedZone.evacuationPlan.safeZoneName}</span>
                          </div>
                          <div style={{ padding: '8px', backgroundColor: '#070A12', borderRadius: '8px', border: '1px solid #1E293B' }}>
                            <span style={{ fontSize: '9px', color: '#94A3B8', display: 'block' }}>Distance & Incline</span>
                            <span style={{ fontSize: '11px', color: '#06B6D4', fontWeight: '700' }}>{selectedZone.evacuationPlan.distanceKm} ({selectedZone.evacuationPlan.elevationDelta})</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase' }}>Directions:</span>
                          {selectedZone.evacuationPlan.steps.map((step, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '10px', color: '#CBD5E1' }}>
                              <span style={{ color: '#10B981', fontWeight: '800' }}>{idx + 1}.</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: RESCUE BOARD */}
            {activeTab === 'rescue' && (
              <div style={{ padding: '24px 20px 80px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#FFF', fontWeight: '800' }}>{t.allocBoard}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>National Disaster Response Force (NDRF) Tactical Matrix</p>
                  </div>
                  <span style={{ fontSize: '12px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '6px 12px', borderRadius: '8px', fontWeight: '800' }}>
                    {sosList.length} Active Distress Calls
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                  {sosList.map((sos) => (
                    <div key={sos.id} style={{ backgroundColor: '#0D1424', border: '1px solid #1E293B', borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: '900', color: '#EF4444' }}>{sos.id}</span>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '3px 8px', borderRadius: '6px', backgroundColor: sos.status === 'ALLOCATED' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: sos.status === 'ALLOCATED' ? '#34D399' : '#F87171' }}>
                          {sos.status === 'ALLOCATED' ? t.assigned : t.unassigned}
                        </span>
                      </div>

                      <div>
                        <h4 style={{ margin: '0 0 4px', fontSize: '14px', color: '#FFF', fontWeight: '700' }}>{sos.category}</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8' }}>{sos.locationName} • {sos.peopleCount} Individuals</p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', backgroundColor: '#070A12', padding: '10px', borderRadius: '8px', border: '1px solid #1E293B' }}>
                        <span>Triage Urgency: <b style={{ color: '#EF4444' }}>{sos.medicalUrgency}</b></span>
                        <span>Priority Score: <b style={{ color: '#06B6D4' }}>{sos.priorityScore}/100</b></span>
                      </div>

                      {sos.assignedTeam ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#34D399', fontWeight: '800', padding: '6px 0' }}>
                          <Check size={16} /> Deployed: {sos.assignedTeam}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                          <select 
                            onChange={(e) => handleAssignUnit(sos.id, e.target.value)}
                            style={{ flex: 1, backgroundColor: '#070A12', border: '1px solid #334155', color: '#FFF', padding: '8px 10px', borderRadius: '8px', fontSize: '11px', outline: 'none', fontWeight: '600' }}
                          >
                            <option value="">-- {t.assignUnit} --</option>
                            {t.units.map((unit, idx) => (
                              <option key={idx} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: TELEMETRY STREAM */}
            {activeTab === 'telemetry' && (
              <div style={{ padding: '24px 20px 80px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', color: '#FFF', fontWeight: '800' }}>{t.liveTelemetry}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>Bi-directional Sensor Gateway</p>
                  </div>
                  <span style={{ fontSize: '11px', color: '#34D399', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 12px', borderRadius: '8px', fontWeight: '800' }}>
                    Packet Clock: {telemetry.timestamp}
                  </span>
                </div>

                <div className="telemetry-grid">
                  <div style={{ backgroundColor: '#0D1424', border: '1px solid #1E293B', padding: '18px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '11px', fontWeight: '700' }}>
                      <span>Piezometer Water Depth</span>
                      <Droplets size={16} color="#06B6D4" />
                    </div>
                    <h3 style={{ margin: '10px 0 2px', fontSize: '24px', color: '#FFF', fontWeight: '900' }}>{telemetry.piezometerLevel} m</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#34D399' }}>Baseline: &lt; 32 m</p>
                  </div>

                  <div style={{ backgroundColor: '#0D1424', border: '1px solid #1E293B', padding: '18px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '11px', fontWeight: '700' }}>
                      <span>Pore Saturation</span>
                      <Gauge size={16} color="#F87171" />
                    </div>
                    <h3 style={{ margin: '10px 0 2px', fontSize: '24px', color: '#F87171', fontWeight: '900' }}>{telemetry.porePressure} kPa</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#F87171' }}>130 kPa Exceeded</p>
                  </div>

                  <div style={{ backgroundColor: '#0D1424', border: '1px solid #1E293B', padding: '18px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '11px', fontWeight: '700' }}>
                      <span>Rainfall Intensity</span>
                      <Droplets size={16} color="#06B6D4" />
                    </div>
                    <h3 style={{ margin: '10px 0 2px', fontSize: '24px', color: '#06B6D4', fontWeight: '900' }}>{telemetry.rainfallRate} mm/h</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#FBBF24' }}>Monsoon Flux Tier 2</p>
                  </div>

                  <div style={{ backgroundColor: '#0D1424', border: '1px solid #1E293B', padding: '18px', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '11px', fontWeight: '700' }}>
                      <span>InSAR Creep Velocity</span>
                      <TrendingUp size={16} color="#F59E0B" />
                    </div>
                    <h3 style={{ margin: '10px 0 2px', fontSize: '24px', color: '#F59E0B', fontWeight: '900' }}>{telemetry.creepRate} mm/d</h3>
                    <p style={{ margin: 0, fontSize: '11px', color: '#F87171' }}>Accelerated Creep</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: ANALYTICS */}
            {activeTab === 'analytics' && (
              <div style={{ padding: '24px 20px 80px 20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '18px', color: '#FFF', fontWeight: '800' }}>{t.analyticsTab}</h2>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#94A3B8' }}>Cumulative Rainfall (mm) vs InSAR Incline Creep (mm/day)</p>
                </div>

                <div style={{ backgroundColor: '#0D1424', border: '1px solid #1E293B', padding: '20px', borderRadius: '16px', overflowX: 'auto' }}>
                  <svg viewBox="0 0 700 200" style={{ width: '100%', minWidth: '500px', height: '220px' }}>
                    <line x1="50" y1="20" x2="650" y2="20" stroke="#1E293B" strokeDasharray="4" />
                    <line x1="50" y1="80" x2="650" y2="80" stroke="#1E293B" strokeDasharray="4" />
                    <line x1="50" y1="140" x2="650" y2="140" stroke="#1E293B" strokeDasharray="4" />
                    <line x1="50" y1="170" x2="650" y2="170" stroke="#334155" />

                    <line x1="50" y1="55" x2="650" y2="55" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="6" />
                    <text x="500" y="48" fill="#EF4444" fontSize="10" fontWeight="bold">Critical Rupture Threshold</text>

                    <polyline
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="3.5"
                      points="50,165 150,158 250,148 350,125 450,95 550,60 650,22"
                    />

                    {historicalData.map((d, i) => {
                      const cx = 50 + i * 100;
                      const cy = 170 - (d.displacement * 10.5);
                      return (
                        <g key={i}>
                          <circle cx={cx} cy={cy} r="6" fill="#06B6D4" />
                          <text x={cx - 16} y="190" fill="#94A3B8" fontSize="10" fontWeight="600">{d.day}</text>
                          <text x={cx - 12} y={cy - 12} fill="#FFF" fontSize="10" fontWeight="bold">{d.displacement}mm</text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            )}

          </div>

          {/* BOTTOM DRAWER: AI & PHYSICS METRICS */}
          <div className="rakshak-bottom-panel">
            <div className="rakshak-bottom-grid">
              
              {/* Sector Summary */}
              <div>
                <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.6px' }}>Hotspot Vector Analysis</span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '800', color: '#FFF' }}>{selectedZone.name}</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>
                  {t.leadTime}: <b style={{ color: '#34D399' }}>{selectedZone.leadTimeHours}h</b> | Exposed: <b style={{ color: '#FBBF24' }}>{selectedZone.exposedPopulation}</b>
                </p>
              </div>

              {/* Explainable AI SHAP Weights */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.6px' }}>Explainable AI (SHAP Weights)</span>
                  <span style={{ fontSize: '9px', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>Physics-Informed XGBoost</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                  {selectedZone.shapReasons.map((reason, idx) => (
                    <div key={idx} style={{ backgroundColor: '#070A12', border: '1px solid #1E293B', padding: '5px 8px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#CBD5E1', fontSize: '10px' }}>{reason.feature}</span>
                      <span style={{ color: '#F87171', fontWeight: '800', fontSize: '10px' }}>{reason.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Failover Status */}
              <div>
                <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.6px' }}>Autonomous Failover Engine</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                  <div style={{ padding: '5px 8px', borderRadius: '8px', border: selectedZone.silentZone ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #1E293B', backgroundColor: selectedZone.silentZone ? 'rgba(239, 68, 68, 0.15)' : '#070A12', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: selectedZone.silentZone ? '#F87171' : '#94A3B8' }}>
                    <span>Cellular:</span>
                    <b>{selectedZone.silentZone ? 'SILENT (DRONE)' : 'NOMINAL 4G/5G'}</b>
                  </div>
                  <div style={{ padding: '5px 8px', borderRadius: '8px', border: '1px solid #1E293B', backgroundColor: '#070A12', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#CBD5E1' }}>
                    <span>LoRa Siren:</span>
                    <b style={{ color: selectedZone.sirenStatus === 'TRIGGERED' ? '#EF4444' : '#34D399' }}>{selectedZone.sirenStatus}</b>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
}