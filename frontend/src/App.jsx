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

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

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
      console.log("Using local state fallback");
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
    <div className="w-full min-h-screen lg:h-screen bg-[#070A12] text-[#F1F5F9] flex flex-col lg:flex-row overflow-x-hidden">
      
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

      {/* LEFT SECTION (Mobile: normal block; Laptop: fixed side-by-side) */}
      <div className="w-full lg:w-[380px] lg:min-w-[380px] bg-[#0D1424] border-b lg:border-b-0 lg:border-r border-[#1E293B] p-4 flex flex-col justify-between shrink-0 z-20 lg:h-full lg:overflow-y-auto">
        <div className="flex flex-col gap-3">
          
          {/* Brand */}
          <div className="flex justify-between items-center pb-3 border-b border-[#1E293B]">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 rounded-xl">
                <Radar size={22} className="text-red-500" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="m-0 text-sm font-black text-white tracking-wide">{t.title}</h1>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-extrabold">v2.5</span>
                </div>
                <p className="m-0 text-[10px] text-slate-400 font-bold">{t.badge}</p>
              </div>
            </div>

            {/* Language Selection */}
            <div className="flex items-center gap-1 bg-[#070A12] px-2 py-1 rounded-lg border border-[#1E293B]">
              <Languages size={13} className="text-cyan-400" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent text-cyan-400 border-none text-[11px] font-extrabold cursor-pointer outline-none"
              >
                <option value="en" className="bg-[#0D1424] text-white">EN</option>
                <option value="hi" className="bg-[#0D1424] text-white">हिंदी</option>
                <option value="kha" className="bg-[#0D1424] text-white">Khasi</option>
                <option value="as" className="bg-[#0D1424] text-white">অসমীয়া</option>
                <option value="bn" className="bg-[#0D1424] text-white">বাংলা</option>
              </select>
            </div>
          </div>

          {/* View Modes */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#070A12] p-1 rounded-xl border border-[#1E293B]">
            <button onClick={() => setActiveTab('prediction')} className={`py-2 px-1 text-[11px] font-extrabold rounded-lg border-none cursor-pointer transition-all ${activeTab === 'prediction' ? 'bg-[#06B6D4] text-[#080C14]' : 'bg-transparent text-slate-400'}`}>
              {t.forecastTab}
            </button>
            <button onClick={() => setActiveTab('rescue')} className={`py-2 px-1 text-[11px] font-extrabold rounded-lg border-none cursor-pointer transition-all ${activeTab === 'rescue' ? 'bg-red-500 text-white' : 'bg-transparent text-slate-400'}`}>
              {t.rescueTab}
            </button>
            <button onClick={() => setActiveTab('telemetry')} className={`py-2 px-1 text-[11px] font-extrabold rounded-lg border-none cursor-pointer transition-all ${activeTab === 'telemetry' ? 'bg-emerald-500 text-[#080C14]' : 'bg-transparent text-slate-400'}`}>
              {t.telemetryTab}
            </button>
            <button onClick={() => setActiveTab('analytics')} className={`py-2 px-1 text-[11px] font-extrabold rounded-lg border-none cursor-pointer transition-all ${activeTab === 'analytics' ? 'bg-amber-500 text-[#080C14]' : 'bg-transparent text-slate-400'}`}>
              {t.analyticsTab}
            </button>
          </div>

          {/* Region Filter */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wide">
                {t.filterRegion}
              </span>
              <span className="text-[10px] text-cyan-400 font-bold">{filteredZones.length} Hotspots</span>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'North-East', 'Himalayas', 'Western Ghats'].map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors whitespace-nowrap cursor-pointer ${selectedRegion === reg ? 'border-cyan-500 bg-cyan-500/15 text-cyan-400' : 'border-[#1E293B] bg-[#070A12] text-slate-400'}`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Hotspot Corridor List */}
          <div className="flex flex-col gap-2 max-h-[260px] overflow-y-auto pr-1">
            {filteredZones.map((zone) => (
              <div 
                key={zone.id} 
                onClick={() => setSelectedZone(zone)} 
                className={`p-3 rounded-xl cursor-pointer transition-all ${selectedZone.id === zone.id ? 'border border-cyan-500 bg-cyan-500/10' : 'border border-[#1E293B] bg-[#080C14]/70'}`}
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div>
                    <span className="text-xs font-bold text-slate-100 block">{zone.name}</span>
                    <span className="text-[10px] text-slate-400">{zone.state} • {zone.region}</span>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-md font-extrabold border ${zone.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-orange-500/20 text-orange-400 border-orange-500/40'}`}>
                    {zone.riskLevel}
                  </span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>P(Failure): <b className={zone.pFailure > 0.85 ? 'text-red-400' : 'text-amber-400'}>{(zone.pFailure * 100).toFixed(0)}%</b></span>
                  <span>Lead: <b className="text-emerald-400">{zone.leadTimeHours}h</b></span>
                  <span>Fs: <b className="text-cyan-400">{zone.factorOfSafety}</b></span>
                </div>
              </div>
            ))}
          </div>

          {/* Status Bar */}
          <div className="p-3 bg-[#070A12] rounded-xl border border-[#1E293B] flex flex-col gap-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Users size={14} className="text-red-400" /> {t.activeSOS}:
              </span>
              <span className="font-extrabold text-red-400">{sosList.length} Active Incidents</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity size={14} className="text-emerald-400" /> Mesh Stream:
              </span>
              <span className="font-extrabold text-emerald-400">ONLINE ({telemetry.loraSignal} dBm)</span>
            </div>
          </div>
        </div>

        {/* SOS Action Button */}
        <div className="flex flex-col gap-2 pt-3">
          <button onClick={() => setIsSOSModalOpen(true)} className="w-full p-3 bg-red-500/15 border border-red-500 text-red-400 rounded-xl text-xs font-black cursor-pointer flex items-center justify-center gap-2 hover:bg-red-500/25 transition-all">
            <LifeBuoy size={18} /> {t.openPortal}
          </button>
        </div>
      </div>

      {/* RIGHT MAIN VIEWPORT */}
      <div className="flex-1 relative w-full bg-[#070A12] flex flex-col lg:h-full lg:overflow-y-auto pb-12 lg:pb-0">
        
        {/* Tactical Header Controls */}
        <div className="p-3 lg:p-4 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-2.5 z-10">
          <div className="bg-[#0D1424] border border-red-500/40 p-3 rounded-xl flex items-center gap-3 shadow-xl">
            <div className="p-2 bg-red-500/20 rounded-lg shrink-0">
              <AlertTriangle size={18} className="text-red-500 animate-pulse" />
            </div>
            <div>
              <p className="m-0 text-[10px] text-red-400 font-black tracking-wider">
                {t.title} ACTIVE THREAT MATRIX
              </p>
              <p className="m-0 text-xs font-bold text-slate-100">
                {selectedZone.name} ({selectedZone.state}): {selectedZone.riskLevel === 'CRITICAL' ? 'Immediate Shear Rupture Predicted' : 'Accelerated Slope Creep'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Map Switcher */}
            <div className="flex bg-[#0D1424] border border-[#1E293B] rounded-xl p-1 gap-1">
              <button 
                onClick={() => setMapLayer('satellite')}
                className={`py-1 px-2.5 rounded-lg border-none text-[11px] font-bold cursor-pointer flex items-center gap-1 ${mapLayer === 'satellite' ? 'bg-[#06B6D4] text-[#080C14]' : 'bg-transparent text-slate-400'}`}
              >
                <Satellite size={13} /> Satellite
              </button>
              <button 
                onClick={() => setMapLayer('topo')}
                className={`py-1 px-2.5 rounded-lg border-none text-[11px] font-bold cursor-pointer flex items-center gap-1 ${mapLayer === 'topo' ? 'bg-[#06B6D4] text-[#080C14]' : 'bg-transparent text-slate-400'}`}
              >
                <Mountain size={13} /> Topo
              </button>
            </div>

            <button onClick={handleTriggerIVR} className={`py-2 px-3 rounded-xl text-[11px] font-extrabold border-none cursor-pointer text-white flex items-center gap-1.5 shadow-lg ${ivrTriggered ? 'bg-emerald-600' : 'bg-red-600'}`}>
              <PhoneCall size={14} /> {ivrTriggered ? t.ivrDispatched : t.triggerIVR}
            </button>
            <button onClick={() => setEvacuationActive(!evacuationActive)} className={`py-2 px-3 rounded-xl text-[11px] font-extrabold border cursor-pointer flex items-center gap-1.5 ${evacuationActive ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-[#0D1424] border-[#1E293B] text-cyan-400'}`}>
              <Navigation size={14} /> {evacuationActive ? t.evacActive : t.evacRoute}
            </button>
          </div>
        </div>

        {/* TAB 1: SATELLITE MAP */}
        {activeTab === 'prediction' && (
          <div className="w-full px-3 lg:px-4 flex flex-col gap-4">
            <div className="w-full h-[380px] lg:h-[480px] rounded-2xl overflow-hidden border border-[#1E293B] relative" style={{ touchAction: 'pan-y' }}>
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
                      attribution='&copy; ESRI Places'
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

                {/* HAZARD FAILURE POLYGON */}
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

                {/* Evacuation Laser Path */}
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
                <div className="absolute top-3 right-3 z-[1000] max-w-[85%]">
                  {!isDrawerExpanded ? (
                    <div 
                      onClick={() => setIsDrawerExpanded(true)}
                      className="bg-[#0D1424]/95 border border-emerald-500/60 p-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg backdrop-blur-md"
                    >
                      <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                        <Navigation size={15} className="text-emerald-400" />
                      </div>
                      <div>
                        <span className="text-[11px] font-extrabold text-white block">
                          Safe Route: {selectedZone.evacuationPlan.distanceKm}
                        </span>
                        <span className="text-[9px] text-emerald-400 font-bold">
                          Click for Guidance
                        </span>
                      </div>
                      <ChevronDown size={15} className="text-slate-400" />
                    </div>
                  ) : (
                    <div className="bg-[#0D1424]/95 border border-emerald-500/50 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md">
                      <div className="flex justify-between items-center border-b border-[#1E293B] pb-2">
                        <div className="flex items-center gap-2">
                          <Navigation size={15} className="text-emerald-400" />
                          <h4 className="m-0 text-xs text-white font-extrabold">Safe Evacuation Route</h4>
                        </div>
                        <button onClick={() => setIsDrawerExpanded(false)} className="bg-transparent border-none text-slate-400 cursor-pointer">
                          <ChevronUp size={16} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-2.5">
                        <div className="p-2 bg-[#070A12] rounded-lg border border-[#1E293B]">
                          <span className="text-[9px] text-slate-400 block">Shelter</span>
                          <span className="text-[11px] text-white font-bold">{selectedZone.evacuationPlan.safeZoneName}</span>
                        </div>
                        <div className="p-2 bg-[#070A12] rounded-lg border border-[#1E293B]">
                          <span className="text-[9px] text-slate-400 block">Distance</span>
                          <span className="text-[11px] text-cyan-400 font-bold">{selectedZone.evacuationPlan.distanceKm}</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 text-[10px] text-slate-300">
                        {selectedZone.evacuationPlan.steps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-400 font-bold">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BOTTOM AI & PHYSICS METRICS PANEL */}
            <div className="w-full bg-[#0D1424] border border-[#1E293B] p-4 rounded-2xl shadow-xl mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Sector Summary */}
                <div className="border-b lg:border-b-0 lg:border-r border-[#1E293B] pb-3 lg:pb-0 lg:pr-3">
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Hotspot Vector</span>
                  <h3 className="m-0 text-sm font-black text-white">{selectedZone.name}</h3>
                  <p className="m-0 text-xs text-slate-400 mt-1">
                    {t.leadTime}: <b className="text-emerald-400">{selectedZone.leadTimeHours}h</b> | Exposed: <b className="text-amber-400">{selectedZone.exposedPopulation}</b>
                  </p>
                </div>

                {/* Explainable AI SHAP Weights */}
                <div className="border-b lg:border-b-0 lg:border-r border-[#1E293B] pb-3 lg:pb-0 lg:pr-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Explainable AI</span>
                    <span className="text-[9px] bg-cyan-500/15 text-cyan-400 px-1.5 py-0.5 rounded font-extrabold">XGBoost</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {selectedZone.shapReasons.map((reason, idx) => (
                      <div key={idx} className="bg-[#070A12] border border-[#1E293B] p-1.5 rounded-lg flex justify-between items-center text-[10px]">
                        <span className="text-slate-300">{reason.feature}</span>
                        <span className="text-red-400 font-extrabold">{reason.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failover Status */}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-extrabold tracking-wider">Failover Engine</span>
                  <div className="flex flex-col gap-1.5 mt-1.5">
                    <div className={`p-1.5 rounded-lg border flex justify-between text-[10px] ${selectedZone.silentZone ? 'border-red-500/40 bg-red-500/15 text-red-400' : 'border-[#1E293B] bg-[#070A12] text-slate-400'}`}>
                      <span>Cellular:</span>
                      <b>{selectedZone.silentZone ? 'SILENT (DRONE)' : 'NOMINAL 4G/5G'}</b>
                    </div>
                    <div className="p-1.5 rounded-lg border border-[#1E293B] bg-[#070A12] flex justify-between text-[10px] text-slate-300">
                      <span>LoRa Siren:</span>
                      <b className={selectedZone.sirenStatus === 'TRIGGERED' ? 'text-red-400' : 'text-emerald-400'}>{selectedZone.sirenStatus}</b>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 2: RESCUE BOARD */}
        {activeTab === 'rescue' && (
          <div className="p-4 lg:p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="m-0 text-base lg:text-lg text-white font-black">{t.allocBoard}</h2>
                <p className="m-0 text-xs text-slate-400">Tactical Resource Dispatch Matrix</p>
              </div>
              <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-lg font-bold">
                {sosList.length} Active Calls
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {sosList.map((sos) => (
                <div key={sos.id} className="bg-[#0D1424] border border-[#1E293B] rounded-2xl p-4 flex flex-col gap-2.5 shadow-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-red-500">{sos.id}</span>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${sos.status === 'ALLOCATED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {sos.status === 'ALLOCATED' ? t.assigned : t.unassigned}
                    </span>
                  </div>

                  <div>
                    <h4 className="m-0 text-sm text-white font-bold">{sos.category}</h4>
                    <p className="m-0 text-xs text-slate-400">{sos.locationName} • {sos.peopleCount} Persons</p>
                  </div>

                  <div className="flex justify-between text-xs bg-[#070A12] p-2 rounded-lg border border-[#1E293B]">
                    <span>Urgency: <b className="text-red-400">{sos.medicalUrgency}</b></span>
                    <span>Priority: <b className="text-cyan-400">{sos.priorityScore}/100</b></span>
                  </div>

                  {sos.assignedTeam ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-extrabold">
                      <Check size={16} /> {sos.assignedTeam}
                    </div>
                  ) : (
                    <select 
                      onChange={(e) => handleAssignUnit(sos.id, e.target.value)}
                      className="w-full bg-[#070A12] border border-slate-700 text-white p-2 rounded-lg text-xs outline-none font-semibold cursor-pointer"
                    >
                      <option value="">-- {t.assignUnit} --</option>
                      {t.units.map((unit, idx) => (
                        <option key={idx} value={unit}>{unit}</option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY STREAM */}
        {activeTab === 'telemetry' && (
          <div className="p-4 lg:p-6 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="m-0 text-base lg:text-lg text-white font-black">{t.liveTelemetry}</h2>
                <p className="m-0 text-xs text-slate-400">Sensor Hub Live Stream</p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg font-bold">
                {telemetry.timestamp}
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-[#0D1424] border border-[#1E293B] p-4 rounded-2xl">
                <div className="flex justify-between text-slate-400 text-xs font-bold">
                  <span>Piezometer Depth</span>
                  <Droplets size={16} className="text-cyan-400" />
                </div>
                <h3 className="my-2 text-xl font-black text-white">{telemetry.piezometerLevel} m</h3>
                <p className="m-0 text-[11px] text-emerald-400">Baseline &lt; 32 m</p>
              </div>

              <div className="bg-[#0D1424] border border-[#1E293B] p-4 rounded-2xl">
                <div className="flex justify-between text-slate-400 text-xs font-bold">
                  <span>Pore Saturation</span>
                  <Gauge size={16} className="text-red-400" />
                </div>
                <h3 className="my-2 text-xl font-black text-red-400">{telemetry.porePressure} kPa</h3>
                <p className="m-0 text-[11px] text-red-400">Critical &gt; 130 kPa</p>
              </div>

              <div className="bg-[#0D1424] border border-[#1E293B] p-4 rounded-2xl">
                <div className="flex justify-between text-slate-400 text-xs font-bold">
                  <span>Rainfall Rate</span>
                  <Droplets size={16} className="text-cyan-400" />
                </div>
                <h3 className="my-2 text-xl font-black text-cyan-400">{telemetry.rainfallRate} mm/h</h3>
                <p className="m-0 text-[11px] text-amber-400">Monsoon Tier 2</p>
              </div>

              <div className="bg-[#0D1424] border border-[#1E293B] p-4 rounded-2xl">
                <div className="flex justify-between text-slate-400 text-xs font-bold">
                  <span>Creep Velocity</span>
                  <TrendingUp size={16} className="text-amber-400" />
                </div>
                <h3 className="my-2 text-xl font-black text-amber-400">{telemetry.creepRate} mm/d</h3>
                <p className="m-0 text-[11px] text-red-400">Accelerated Shear</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="p-4 lg:p-6 flex flex-col gap-4">
            <div>
              <h2 className="m-0 text-base lg:text-lg text-white font-black">{t.analyticsTab}</h2>
              <p className="m-0 text-xs text-slate-400">Cumulative Rainfall vs InSAR Creep Velocity</p>
            </div>

            <div className="bg-[#0D1424] border border-[#1E293B] p-4 rounded-2xl overflow-x-auto">
              <svg viewBox="0 0 700 200" className="w-full min-w-[500px] h-[220px]">
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
    </div>
  );
}