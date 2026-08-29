import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { 
  AlertTriangle, 
  Radio, 
  Shield, 
  Activity, 
  Navigation, 
  PhoneCall, 
  LifeBuoy, 
  Users, 
  Satellite,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { hazardZones, mockSOSIncidents } from '../data/mockDisasterData';
import CitizenSOSModal from './CitizenSOSModal';

// Helper component to smoothly re-center the map when selecting different zones
function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function CommandDashboard() {
  const [selectedZone, setSelectedZone] = useState(hazardZones[0]);
  const [activeTab, setActiveTab] = useState('prediction');
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [sosList, setSosList] = useState(mockSOSIncidents);
  const [evacuationActive, setEvacuationActive] = useState(false);
  const [ivrTriggered, setIvrTriggered] = useState(false);

  // Safe evacuation route coordinates dynamically avoiding the hazard red polygon
  const safeEvacRoute = [
    [25.2650, 91.7200], // Start: Affected Nongthymmai cluster
    [25.2710, 91.7050], // Bypass around the steep slope
    [25.2850, 91.6980], // Secondary road vector
    [25.3050, 91.7120]  // End: Safe District Evacuation Shelter
  ];

  const handleNewSOS = (newSOS) => {
    const createdIncident = {
      id: `SOS-${Date.now().toString().slice(-3)}`,
      locationName: 'Reported GPS Location',
      coords: [selectedZone.center[0] + 0.006, selectedZone.center[1] - 0.004],
      category: newSOS.category || 'Urgent Distress SOS',
      peopleCount: 4,
      medicalUrgency: 'CRITICAL',
      priorityScore: 96.5,
      isMeshRelayed: newSOS.isOfflineMesh,
      status: 'UNALLOCATED'
    };
    setSosList([createdIncident, ...sosList]);
  };

  const handleTriggerIVR = () => {
    setIvrTriggered(true);
    setTimeout(() => setIvrTriggered(false), 4000);
  };

  return (
    <div 
      style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0B0F19', color: '#F3F4F6', overflow: 'hidden' }}
      className="flex h-screen w-screen bg-[#0B0F19] text-gray-100 overflow-hidden font-sans select-none"
    >
      {/* Citizen SOS & Offline Mesh Modal */}
      <CitizenSOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onSOSSubmit={handleNewSOS}
      />

      {/* LEFT SIDEBAR: Navigation & Monitoring Controls */}
      <div 
        style={{ width: '320px', minWidth: '320px', backgroundColor: '#111827', borderRight: '1px solid #1F2937', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 20 }}
        className="w-80 bg-[#111827] border-r border-[#1F2937] flex flex-col justify-between p-4 z-20 shadow-2xl"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #1F2937' }}>
            <div style={{ padding: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px' }}>
              <Shield className="h-6 w-6 text-red-500 animate-pulse" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '800', letterSpacing: '0.05em', color: '#FFFFFF' }}>PARVAT-RAKSHAK</h1>
              <p style={{ margin: 0, fontSize: '11px', color: '#9CA3AF' }}>MDoNER Landslide Risk & Rescue</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#0B0F19', padding: '4px', borderRadius: '10px', border: '1px solid #1F2937' }}>
            <button
              onClick={() => setActiveTab('prediction')}
              style={{
                padding: '8px',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'prediction' ? '#38BDF8' : 'transparent',
                color: activeTab === 'prediction' ? '#0B0F19' : '#9CA3AF'
              }}
            >
              12–72h Forecast
            </button>
            <button
              onClick={() => setActiveTab('rescue')}
              style={{
                padding: '8px',
                fontSize: '12px',
                fontWeight: '700',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'rescue' ? '#EF4444' : 'transparent',
                color: activeTab === 'rescue' ? '#FFFFFF' : '#9CA3AF'
              }}
            >
              Rescue & SOS
            </button>
          </div>

          {/* Monitored Corridors List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em', color: '#9CA3AF', textTransform: 'uppercase' }}>
                Monitored NER Corridors
              </span>
              <span style={{ fontSize: '10px', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                {hazardZones.length} Active
              </span>
            </div>

            {hazardZones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: selectedZone.id === zone.id ? '1px solid #38BDF8' : '1px solid #1F2937',
                  backgroundColor: selectedZone.id === zone.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(11, 15, 25, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#F3F4F6' }}>{zone.name}</span>
                  <span
                    style={{
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      backgroundColor: zone.riskLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)',
                      color: zone.riskLevel === 'CRITICAL' ? '#F87171' : '#FB923C',
                      border: zone.riskLevel === 'CRITICAL' ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(249, 115, 22, 0.3)'
                    }}
                  >
                    {zone.riskLevel}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9CA3AF' }}>
                  <span>P(Failure): <b style={{ color: '#FFF' }}>{(zone.pFailure * 100).toFixed(0)}%</b></span>
                  <span>Exposed: <b style={{ color: '#FBBF24' }}>{zone.exposedPopulation}</b></span>
                </div>
              </div>
            ))}
          </div>

          {/* Active Incidents Counter */}
          <div style={{ padding: '12px', backgroundColor: 'rgba(11, 15, 25, 0.8)', borderRadius: '12px', border: '1px solid #1F2937' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
              <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users className="h-3.5 w-3.5 text-red-400" /> Active SOS Reports:
              </span>
              <span style={{ fontWeight: '700', color: '#F87171' }}>{sosList.length} Units</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass className="h-3.5 w-3.5 text-sky-400" /> Safe Evac Vector:
              </span>
              <span style={{ fontWeight: '700', color: evacuationActive ? '#34D399' : '#9CA3AF' }}>
                {evacuationActive ? 'COMPUTED (A*)' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons & Telemetry Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingTop: '12px', borderTop: '1px solid #1F2937' }}>
          <button
            onClick={() => setIsSOSModalOpen(true)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #EF4444',
              color: '#F87171',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <LifeBuoy className="h-4 w-4" /> Open Citizen SOS Portal
          </button>

          <div style={{ padding: '10px', backgroundColor: '#0B0F19', borderRadius: '10px', border: '1px solid #1F2937', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio className="h-3 w-3 text-emerald-400" /> LoRa Mesh:
              </span>
              <span style={{ color: '#34D399', fontWeight: '600' }}>4 Nodes Online</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D1D5DB' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Satellite className="h-3 w-3 text-[#38BDF8]" /> Sentinel-1 SAR:
              </span>
              <span style={{ color: '#38BDF8', fontWeight: '600' }}>Interferometry OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN STAGE: Interactive Map & Live HUD */}
      <div style={{ flex: 1, position: 'relative', height: '100%', width: '100%' }}>
        {/* TOP FLOATING BANNER */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)', pointerEvents: 'auto' }}>
            <AlertTriangle className="h-5 w-5 text-red-500 animate-bounce" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <p style={{ margin: 0, fontSize: '10px', color: '#F87171', fontWeight: '800', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  EARLY WARNING SYSTEM ACTIVE (12–72H)
                </p>
                <span style={{ fontSize: '9px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '1px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                  Lead: {selectedZone.leadTimeHours}h
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: '#E5E7EB' }}>
                {selectedZone.name}: Structural shear stress threshold exceeded. High evacuation urgency.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button
              onClick={handleTriggerIVR}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: ivrTriggered ? '#059669' : '#DC2626',
                color: '#FFF'
              }}
            >
              <PhoneCall className="h-4 w-4" />
              {ivrTriggered ? 'Bhashini Calls Dispatched!' : 'Trigger Bhashini IVR'}
            </button>
            <button
              onClick={() => setEvacuationActive(!evacuationActive)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                border: evacuationActive ? '1px solid #10B981' : '1px solid #1F2937',
                cursor: 'pointer',
                backgroundColor: evacuationActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(17, 24, 39, 0.95)',
                color: evacuationActive ? '#34D399' : '#38BDF8'
              }}
            >
              <Navigation className="h-4 w-4" />
              {evacuationActive ? 'Evacuation Routes Active' : 'Safe Evacuation Routes'}
            </button>
          </div>
        </div>

        {/* LEAFLET MAP */}
        <MapContainer
          center={selectedZone.center}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <ChangeMapView center={selectedZone.center} zoom={12} />

          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {/* Hazard Risk Polygons */}
          {hazardZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.polygon}
              pathOptions={{
                color: zone.riskLevel === 'CRITICAL' ? '#EF4444' : '#F97316',
                fillColor: zone.riskLevel === 'CRITICAL' ? '#EF4444' : '#F97316',
                fillOpacity: selectedZone.id === zone.id ? 0.45 : 0.25,
                weight: selectedZone.id === zone.id ? 3 : 1.5,
              }}
            />
          ))}

          {/* Dynamic Safe Evacuation Route (A* Pathfinding around red polygon) */}
          {evacuationActive && (
            <Polyline
              positions={safeEvacRoute}
              pathOptions={{
                color: '#10B981',
                weight: 5,
                dashArray: '10, 8',
                opacity: 0.9
              }}
            />
          )}

          {/* SOS Incident Markers */}
          {sosList.map((sos) => (
            <Marker key={sos.id} position={sos.coords}>
              <Popup>
                <div style={{ padding: '4px', color: '#F3F4F6' }}>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: '#EF4444' }}>{sos.category}</p>
                  <p style={{ margin: '2px 0', fontSize: '11px', color: '#9CA3AF' }}>{sos.locationName} • {sos.peopleCount} People</p>
                  <p style={{ margin: '2px 0', fontSize: '11px', fontWeight: '600', color: '#38BDF8' }}>Priority: {sos.priorityScore}/100</p>
                  {sos.isMeshRelayed && (
                    <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '9px', backgroundColor: 'rgba(249, 115, 22, 0.2)', color: '#FB923C', padding: '1px 6px', borderRadius: '4px', fontWeight: '700' }}>
                      LoRa Mesh Relayed
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* BOTTOM FLOATING DRAWER: Explainable AI (SHAP) & Silent Zone */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 1000, backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid #1F2937', padding: '16px', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 1.3fr', gap: '16px', alignItems: 'center' }}>
            {/* Corridor Info */}
            <div style={{ borderRight: '1px solid #1F2937', paddingRight: '12px' }}>
              <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                Corridor Risk Analysis
              </span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: '700', color: '#FFF' }}>{selectedZone.name}</h3>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: '#9CA3AF' }}>
                <span>Lead: <b style={{ color: '#34D399' }}>{selectedZone.leadTimeHours}h</b></span>
                <span>Exposed: <b style={{ color: '#FBBF24' }}>{selectedZone.exposedPopulation}</b></span>
              </div>
            </div>

            {/* SHAP Weights */}
            <div style={{ borderRight: '1px solid #1F2937', paddingRight: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                  Explainable AI (SHAP Weights)
                </span>
                <span style={{ fontSize: '9px', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>
                  Physics + ML Hybrid
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {selectedZone.shapReasons.map((reason, idx) => (
                  <div
                    key={idx}
                    style={{ backgroundColor: 'rgba(11, 15, 25, 0.8)', border: '1px solid #1F2937', padding: '6px 10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
                    <div>
                      <p style={{ margin: 0, color: '#D1D5DB', fontSize: '11px', fontWeight: '500' }}>{reason.feature}</p>
                      <p style={{ margin: 0, color: '#6B7280', fontSize: '9px' }}>{reason.value}</p>
                    </div>
                    <span style={{ color: '#F87171', fontFamily: 'monospace', fontWeight: '700', fontSize: '11px' }}>{reason.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Failover / Silent Zone */}
            <div>
              <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
                Autonomous Failover Logic
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                <div
                  style={{
                    padding: '6px 10px',
                    borderRadius: '8px',
                    border: selectedZone.silentZone ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #1F2937',
                    backgroundColor: selectedZone.silentZone ? 'rgba(239, 68, 68, 0.1)' : '#0B0F19',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '11px',
                    color: selectedZone.silentZone ? '#F87171' : '#9CA3AF'
                  }}
                >
                  <span>Silent Zone:</span>
                  <span style={{ fontWeight: '700', fontSize: '10px' }}>
                    {selectedZone.silentZone ? 'DRONE RECON DISPATCH' : 'NOMINAL'}
                  </span>
                </div>
                <div style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #1F2937', backgroundColor: '#0B0F19', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#D1D5DB' }}>
                  <span>LoRa Siren:</span>
                  <span style={{ color: '#34D399', fontWeight: '700', fontSize: '10px' }}>
                    {selectedZone.sirenStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}