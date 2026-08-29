import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Radio, 
  Shield, 
  Navigation, 
  PhoneCall, 
  LifeBuoy, 
  Users, 
  Satellite,
  Compass,
  MapPin
} from 'lucide-react';
import { hazardZones, mockSOSIncidents } from '../data/mockDisasterData';
import CitizenSOSModal from './CitizenSOSModal';

export default function CommandDashboard() {
  const [selectedZone, setSelectedZone] = useState(hazardZones[0]);
  const [activeTab, setActiveTab] = useState('prediction');
  const [isSOSModalOpen, setIsSOSModalOpen] = useState(false);
  const [sosList, setSosList] = useState(mockSOSIncidents);
  const [evacuationActive, setEvacuationActive] = useState(false);
  const [ivrTriggered, setIvrTriggered] = useState(false);

  const handleNewSOS = (newSOS) => {
    const createdIncident = {
      id: `SOS-${Date.now().toString().slice(-3)}`,
      locationName: 'Reported GPS Location',
      coords: [selectedZone.center[0] + 0.005, selectedZone.center[1] - 0.005],
      category: newSOS.category || 'Urgent Distress SOS',
      peopleCount: 4,
      medicalUrgency: 'CRITICAL',
      priorityScore: 96.5,
      isMeshRelayed: newSOS.isOfflineMesh,
      status: 'UNALLOCATED'
    };
    setSosList(prev => [createdIncident, ...prev]);
  };

  const handleTriggerIVR = () => {
    setIvrTriggered(true);
    setTimeout(() => setIvrTriggered(false), 3500);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#0B0F19', color: '#F3F4F6', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Citizen SOS Modal */}
      <CitizenSOSModal
        isOpen={isSOSModalOpen}
        onClose={() => setIsSOSModalOpen(false)}
        onSOSSubmit={handleNewSOS}
      />

      {/* LEFT SIDEBAR */}
      <div style={{ width: '320px', minWidth: '320px', backgroundColor: '#111827', borderRight: '1px solid #1F2937', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Header Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid #1F2937' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px' }}>
              <Shield className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#FFF' }}>PARVAT-RAKSHAK</h1>
              <p style={{ margin: 0, fontSize: '11px', color: '#9CA3AF' }}>MDoNER Landslide Risk & Rescue</p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', backgroundColor: '#0B0F19', padding: '4px', borderRadius: '8px', border: '1px solid #1F2937' }}>
            <button
              onClick={() => setActiveTab('prediction')}
              style={{
                padding: '6px',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '6px',
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
                padding: '6px',
                fontSize: '11px',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === 'rescue' ? '#EF4444' : 'transparent',
                color: activeTab === 'rescue' ? '#FFF' : '#9CA3AF'
              }}
            >
              Rescue & SOS
            </button>
          </div>

          {/* Monitored Zones */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#9CA3AF', textTransform: 'uppercase' }}>
              Monitored NER Corridors
            </span>
            {hazardZones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  border: selectedZone.id === zone.id ? '1px solid #38BDF8' : '1px solid #1F2937',
                  backgroundColor: selectedZone.id === zone.id ? 'rgba(56, 189, 248, 0.1)' : 'rgba(11, 15, 25, 0.6)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: '#F3F4F6' }}>{zone.name}</span>
                  <span style={{ fontSize: '9px', padding: '2px 6px', borderRadius: '4px', fontWeight: '700', backgroundColor: zone.riskLevel === 'CRITICAL' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(249, 115, 22, 0.2)', color: zone.riskLevel === 'CRITICAL' ? '#F87171' : '#FB923C' }}>
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

          {/* Status Counter */}
          <div style={{ padding: '10px', backgroundColor: '#0B0F19', borderRadius: '10px', border: '1px solid #1F2937', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users className="h-3.5 w-3.5 text-red-400" /> SOS Incidents:
              </span>
              <span style={{ fontWeight: '700', color: '#F87171' }}>{sosList.length} Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span style={{ color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Compass className="h-3.5 w-3.5 text-sky-400" /> Safe Evac Vector:
              </span>
              <span style={{ fontWeight: '700', color: evacuationActive ? '#34D399' : '#9CA3AF' }}>
                {evacuationActive ? 'ONLINE' : 'STANDBY'}
              </span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => setIsSOSModalOpen(true)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #EF4444',
              color: '#F87171',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <LifeBuoy className="h-4 w-4" /> Open Citizen SOS Portal
          </button>
          <div style={{ padding: '8px', backgroundColor: '#0B0F19', borderRadius: '8px', border: '1px solid #1F2937', fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>LoRa Mesh:</span>
              <span style={{ color: '#34D399', fontWeight: '600' }}>4 Nodes Active</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#9CA3AF' }}>Sentinel-1 SAR:</span>
              <span style={{ color: '#38BDF8', fontWeight: '600' }}>Interferometry OK</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT STAGE: Tactical Map Grid */}
      <div style={{ flex: 1, position: 'relative', height: '100%', width: '100%', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Alert Banner */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
          <div style={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '10px 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', pointerEvents: 'auto' }}>
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <div>
              <p style={{ margin: 0, fontSize: '10px', color: '#F87171', fontWeight: '800' }}>EARLY WARNING ACTIVE (12–72H)</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#E5E7EB', fontWeight: '600' }}>
                {selectedZone.name}: Structural shear failure predicted.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
            <button
              onClick={handleTriggerIVR}
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: 'none', cursor: 'pointer', backgroundColor: ivrTriggered ? '#059669' : '#DC2626', color: '#FFF' }}
            >
              {ivrTriggered ? 'Bhashini Triggered!' : 'Trigger Bhashini IVR'}
            </button>
            <button
              onClick={() => setEvacuationActive(!evacuationActive)}
              style={{ padding: '8px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: '1px solid #1F2937', cursor: 'pointer', backgroundColor: 'rgba(17, 24, 39, 0.95)', color: evacuationActive ? '#34D399' : '#38BDF8' }}
            >
              {evacuationActive ? 'Clear Safe Routes' : 'Safe Evacuation Routes'}
            </button>
          </div>
        </div>

        {/* Tactical Spatial Visualizer */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '32px', backgroundColor: '#111827', border: '1px solid #1F2937', borderRadius: '16px', textAlign: 'center', maxWidth: '460px' }}>
            <div style={{ padding: '14px', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '50%', width: 'fit-content', margin: '0 auto 12px' }}>
              <MapPin className="h-8 w-8 text-[#38BDF8]" />
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#FFF' }}>{selectedZone.name}</h2>
            <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#9CA3AF' }}>
              Coordinates: [{selectedZone.center[0]}, {selectedZone.center[1]}] | High Risk Zone
            </p>
            <div style={{ padding: '8px 14px', backgroundColor: '#0B0F19', borderRadius: '8px', display: 'inline-block', border: '1px solid #1F2937', fontSize: '12px', color: '#34D399' }}>
              Evacuation Corridor: {evacuationActive ? 'Active (Via Bypass-4)' : 'Standby'}
            </div>
          </div>
        </div>

        {/* Bottom Drawer: SHAP Weights */}
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px', zIndex: 1000, backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid #1F2937', padding: '14px', borderRadius: '12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2.5fr 1.3fr', gap: '14px', alignItems: 'center' }}>
            <div style={{ borderRight: '1px solid #1F2937', paddingRight: '10px' }}>
              <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '700' }}>Corridor Analysis</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '13px', fontWeight: '700', color: '#FFF' }}>{selectedZone.name}</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#9CA3AF' }}>Lead: <b style={{ color: '#34D399' }}>{selectedZone.leadTimeHours}h</b> | Exposed: <b style={{ color: '#FBBF24' }}>{selectedZone.exposedPopulation}</b></p>
            </div>

            <div style={{ borderRight: '1px solid #1F2937', paddingRight: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '700' }}>Explainable AI (SHAP Weights)</span>
                <span style={{ fontSize: '9px', backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '1px 4px', borderRadius: '4px', fontWeight: '700' }}>Physics + ML</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {selectedZone.shapReasons.map((reason, idx) => (
                  <div key={idx} style={{ backgroundColor: 'rgba(11, 15, 25, 0.8)', border: '1px solid #1F2937', padding: '4px 8px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#D1D5DB', fontSize: '10px' }}>{reason.feature}</span>
                    <span style={{ color: '#F87171', fontWeight: '700', fontSize: '10px' }}>{reason.weight}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '10px', color: '#9CA3AF', textTransform: 'uppercase', fontWeight: '700' }}>Autonomous Failover</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                <div style={{ padding: '4px 8px', borderRadius: '6px', border: selectedZone.silentZone ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid #1F2937', backgroundColor: selectedZone.silentZone ? 'rgba(239, 68, 68, 0.1)' : '#0B0F19', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: selectedZone.silentZone ? '#F87171' : '#9CA3AF' }}>
                  <span>Silent Zone:</span>
                  <b>{selectedZone.silentZone ? 'DRONE RECON' : 'NOMINAL'}</b>
                </div>
                <div style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #1F2937', backgroundColor: '#0B0F19', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#D1D5DB' }}>
                  <span>LoRa Siren:</span>
                  <b style={{ color: '#34D399' }}>{selectedZone.sirenStatus}</b>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}