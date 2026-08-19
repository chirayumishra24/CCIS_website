"use client";
import React, { useState } from "react";
import { Bus, MapPin, Clock, Shield, Search, Phone, Navigation, CheckCircle2 } from "lucide-react";

interface RouteInfo {
  id: string;
  routeNumber: string;
  locality: string;
  majorStops: string[];
  morningPickup: string;
  eveningDrop: string;
  driverName: string;
  driverPhone: string;
  incharge: string;
  busType: string;
  gpsTracked: boolean;
  cctvEnabled: boolean;
  ladyAttendant: boolean;
}

const routeData: RouteInfo[] = [
  {
    id: "r1",
    routeNumber: "Route 01 (Express)",
    locality: "Mansarovar & Shipra Path",
    majorStops: ["Shipra Sun City", "VT Road Crossing", "Patel Marg", "City Park Gate 2", "CCIS Main Gate"],
    morningPickup: "07:30 AM",
    eveningDrop: "02:30 PM",
    driverName: "Mr. Ramesh Gurjar",
    driverPhone: "+91 98290 12345",
    incharge: "Mrs. Manju Sharma",
    busType: "Tata Starbus AC 40-Seater",
    gpsTracked: true,
    cctvEnabled: true,
    ladyAttendant: true,
  },
  {
    id: "r2",
    routeNumber: "Route 02",
    locality: "Vaishali Nagar & Chitrakoot",
    majorStops: ["Chitrakoot Stadium", "National Handloom", "Akshardham Temple", "Gandhi Path Circle", "Queens Road"],
    morningPickup: "07:15 AM",
    eveningDrop: "02:45 PM",
    driverName: "Mr. Suresh Yadav",
    driverPhone: "+91 98290 54321",
    incharge: "Mrs. Pushpa Devi",
    busType: "Tata Starbus AC 45-Seater",
    gpsTracked: true,
    cctvEnabled: true,
    ladyAttendant: true,
  },
  {
    id: "r3",
    routeNumber: "Route 03",
    locality: "Malviya Nagar & Jagatpura",
    majorStops: ["World Trade Park (WTP)", "Calgiri Marg", "Model Town", "Jagatpura Flyover", "Gaurav Tower (GT)"],
    morningPickup: "07:10 AM",
    eveningDrop: "02:50 PM",
    driverName: "Mr. Balveer Singh",
    driverPhone: "+91 98291 98765",
    incharge: "Mrs. Sunita Verma",
    busType: "Eicher Skyline AC 42-Seater",
    gpsTracked: true,
    cctvEnabled: true,
    ladyAttendant: true,
  },
  {
    id: "r4",
    routeNumber: "Route 04",
    locality: "Shyam Nagar & Nirman Nagar",
    majorStops: ["Shyam Nagar Metro Station", "Kings Road", "DCM Ajmer Road", "Janpath", "Heerapura"],
    morningPickup: "07:25 AM",
    eveningDrop: "02:35 PM",
    driverName: "Mr. Mukesh Kumawat",
    driverPhone: "+91 98292 11223",
    incharge: "Mrs. Anita Rao",
    busType: "Tata Starbus AC 36-Seater",
    gpsTracked: true,
    cctvEnabled: true,
    ladyAttendant: true,
  },
  {
    id: "r5",
    routeNumber: "Route 05",
    locality: "C-Scheme, Civil Lines & Raja Park",
    majorStops: ["Statue Circle", "Civil Lines Gate", "Govind Marg Raja Park", "Birla Temple", "Ajmer Pulia"],
    morningPickup: "07:05 AM",
    eveningDrop: "03:00 PM",
    driverName: "Mr. Dharmendra Saini",
    driverPhone: "+91 98293 44556",
    incharge: "Mrs. Radha Meena",
    busType: "Force Traveller Luxury 24-Seater",
    gpsTracked: true,
    cctvEnabled: true,
    ladyAttendant: true,
  },
  {
    id: "r6",
    routeNumber: "Route 06",
    locality: "Pratap Nagar & Sanganer",
    majorStops: ["Haldi Ghati Marg", "Kumbha Marg", "NRI Colony", "Sanganer Thana Circle", "Muhana Mandi Road"],
    morningPickup: "07:20 AM",
    eveningDrop: "02:40 PM",
    driverName: "Mr. Jagdish Prasad",
    driverPhone: "+91 98294 77889",
    incharge: "Mrs. Kamla Devi",
    busType: "Tata Starbus AC 40-Seater",
    gpsTracked: true,
    cctvEnabled: true,
    ladyAttendant: true,
  },
];

export default function BusRouteFinder() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState<RouteInfo>(routeData[0]);

  const filteredRoutes = routeData.filter(
    (r) =>
      r.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.majorStops.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
      r.routeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white border border-cream-line rounded-2xl shadow-card overflow-hidden">
      {/* Header Banner */}
      <div className="bg-navy text-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs font-mono uppercase tracking-widest font-bold">
            <Bus className="w-4 h-4" /> Transport &amp; Commute Network
          </div>
          <h3 className="text-2xl md:text-3xl font-serif font-bold mt-1 text-white">
            School Bus Route &amp; Transit Finder
          </h3>
          <p className="text-white/60 text-xs md:text-sm mt-1 max-w-xl">
            Locate your nearest air-conditioned bus stop, estimated boarding time, and view GPS &amp; safety specifications across Jaipur.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-400/30 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Live GPS Active on All Buses
        </div>
      </div>

      {/* Body */}
      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Route Search & List (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by locality, area, or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cream/10 border border-cream-line rounded-xl text-xs font-sans text-navy placeholder:text-ink-muted focus:border-gold outline-none"
            />
          </div>

          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {filteredRoutes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoute(r)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1.5 ${
                  selectedRoute.id === r.id
                    ? "bg-navy text-white border-navy shadow-sm"
                    : "bg-white border-cream-line hover:border-gold hover:bg-cream/15 text-navy"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-[11px] font-mono font-bold ${selectedRoute.id === r.id ? "text-gold" : "text-gold-dark"}`}>
                    {r.routeNumber}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${selectedRoute.id === r.id ? "bg-white/10 text-white" : "bg-cream text-navy"}`}>
                    {r.morningPickup}
                  </span>
                </div>
                <span className="font-serif font-bold text-sm leading-snug">{r.locality}</span>
                <span className={`text-[11px] truncate ${selectedRoute.id === r.id ? "text-white/70" : "text-ink-muted"}`}>
                  Via: {r.majorStops.slice(0, 3).join(", ")}...
                </span>
              </button>
            ))}

            {filteredRoutes.length === 0 && (
              <div className="text-center py-8 text-ink-muted text-xs bg-cream/10 rounded-xl border border-dashed border-cream-line">
                No routes found for &ldquo;{searchTerm}&rdquo;. Please contact the transport office for custom route requests.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Selected Route Detailed Overview (7 cols) */}
        <div className="lg:col-span-7 bg-cream/15 border border-cream-line rounded-xl p-6 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cream-line gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-gold-dark uppercase tracking-wider block">
                  {selectedRoute.routeNumber}
                </span>
                <h4 className="text-xl font-serif font-bold text-navy mt-0.5">
                  {selectedRoute.locality}
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-navy font-semibold bg-white px-3 py-1.5 rounded-lg border border-cream-line">
                  <Clock className="w-3.5 h-3.5 text-gold-dark" /> Pickup: {selectedRoute.morningPickup}
                </span>
                <span className="flex items-center gap-1 text-navy font-semibold bg-white px-3 py-1.5 rounded-lg border border-cream-line">
                  <Clock className="w-3.5 h-3.5 text-gold-dark" /> Drop: {selectedRoute.eveningDrop}
                </span>
              </div>
            </div>

            {/* Stops Timeline */}
            <div className="mt-5">
              <label className="text-xs font-bold text-navy uppercase tracking-wider block mb-3">
                Key Stops &amp; Boarding Points
              </label>
              <div className="relative pl-6 flex flex-col gap-3 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gold/40">
                {selectedRoute.majorStops.map((stop, idx) => (
                  <div key={idx} className="relative flex items-center gap-3 text-xs">
                    <span className={`absolute -left-6 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold ${idx === selectedRoute.majorStops.length - 1 ? "bg-emerald-600 text-white" : "bg-gold text-navy"}`}>
                      {idx + 1}
                    </span>
                    <span className={`font-medium ${idx === selectedRoute.majorStops.length - 1 ? "font-bold text-navy" : "text-navy/80"}`}>
                      {stop}
                    </span>
                    {idx === selectedRoute.majorStops.length - 1 && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        Destination
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Vehicle & Safety Specs */}
            <div className="mt-6 pt-5 border-t border-cream-line grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-cream-line flex items-center gap-2.5">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block font-semibold">Safety</span>
                  <span className="text-xs font-bold text-navy">CCTV &amp; First Aid</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-cream-line flex items-center gap-2.5">
                <Navigation className="w-4 h-4 text-sky-600 shrink-0" />
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block font-semibold">Tracking</span>
                  <span className="text-xs font-bold text-navy">Live Parent App</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-lg border border-cream-line flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-gold-dark shrink-0" />
                <div>
                  <span className="text-[10px] text-ink-muted uppercase block font-semibold">Supervision</span>
                  <span className="text-xs font-bold text-navy">Lady Attendant</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact driver bar */}
          <div className="bg-white p-4 rounded-xl border border-cream-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="text-xs">
              <span className="text-ink-muted block text-[11px]">Bus In-Charge &amp; Coordinator:</span>
              <strong className="text-navy">{selectedRoute.incharge}</strong> • Vehicle: {selectedRoute.busType}
            </div>
            <a
              href="tel:+919660551977"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-navy text-white text-xs font-bold rounded-lg hover:bg-navy-light transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-gold" /> Transport Helpline
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
