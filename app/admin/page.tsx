"use client";
import { useState, useEffect, useRef } from "react";
import { 
  FaTrash, FaPlus, FaDatabase, FaSpinner, FaUserEdit, FaTags, FaListUl, 
  FaImages, FaSave, FaUpload, FaCaretDown, FaTerminal, 
  FaChevronDown, FaChevronRight, FaBriefcase, FaFileContract
} from "react-icons/fa";
import { Project, ProfileData, ExperienceCard } from "@/types";
import Auth from "@/components/admin/Auth";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";
import Overview from "@/components/admin/Overview";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { FaTasks } from "react-icons/fa";

export default function Admin() {
  // --- REFS ---
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("identity"); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });
  const [modalState, setModalState] = useState({ isOpen: false, message: "", onConfirm: () => {} });

  // DATA STATE
  const [projects, setProjects] = useState<Project[]>([]);
  const [identity, setIdentity] = useState<ProfileData>({
    alias: "Chilly",
    designation: "Software Engineer",
    tagline: "Building digital artifacts.",
    bioLong: "",
    avatar: "",
    aboutImage: "",
    missionBriefing: "",
    experienceLog: [],
    statusMode: "OPEN",
    statusMsg: "SYSTEM ONLINE",
    commotions: {
      title: "System Protocols",
      version: "3.0.0 (Live)",
      sections: []
    },
    pricing: [],
    workQueue: [],
    lastSync: new Date().toISOString()
  });

  // Project Form
  const [formData, setFormData] = useState({
    title: "", category: "Web Dev", image: "/images/bg-space.jpg", 
    desc: "", tech: "", github: "#", demo: "#"
  });

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    if (isAuthenticated) {
      Promise.all([fetchProjects(), fetchProfile()]).finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } catch (err) { console.error(err); }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      if (data.success) {
        const safeData = { ...data.data, experienceLog: data.data.experienceLog || [] };
        setIdentity(safeData);
      }
    } catch (err) { console.error(err); }
  };

  // --- HANDLERS ---
  const showSyncMessage = (message: string, type: "success" | "error") => {
    setSyncMessage({ message, type });
    setTimeout(() => {
      setSyncMessage({ message: "", type: "" });
    }, 3000);
  };

  const handleSaveIdentity = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(identity),
      });
      const data = await res.json();
      if (data.success) {
        setIdentity(data.data);
        showSyncMessage("IDENTITY SYNC COMPLETE", "success");
      } else {
        showSyncMessage("SYNC FAILED", "error");
      }
    } catch (err) { 
      console.error(err);
      showSyncMessage("SYNC FAILED", "error");
    } finally { 
      setSaving(false); 
    }
  };

  const handleUploadClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onUploadComplete: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showSyncMessage("UPLOADING...", "success");

    try {
      // 1. Get a signature for the upload
      const timestamp = Math.round(new Date().getTime() / 1000);
      const paramsToSign = { timestamp };

      const signRes = await fetch("/api/sign-image", {
        method: "POST",
        body: JSON.stringify({ paramsToSign }),
      });
      const signData = await signRes.json();

      if (!signData.success) {
        throw new Error("Failed to get signature.");
      }

      // 2. Prepare FormData for Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "api_key",
        process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!
      );
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signData.signature);

      // 3. Upload directly to Cloudinary
      const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadData.secure_url) {
        // 4. Update state with the new URL via callback
        onUploadComplete(uploadData.secure_url);
        showSyncMessage("UPLOAD COMPLETE", "success");
      } else {
        console.error("Cloudinary upload failed. Response:", uploadData);
        throw new Error(
          `Cloudinary upload failed: ${
            uploadData.error?.message || "Unknown error"
          }`
        );
      }
    } catch (err) {
      console.error("Upload failed:", err);
      showSyncMessage("UPLOAD FAILED", "error");
    }
  };

  // Experience Card Handlers
  const addExperience = () => {
    setIdentity({
      ...identity,
      experienceLog: [...identity.experienceLog, { title: "New Role", type: "Work", desc: "Description..." }]
    });
  };

  const removeExperience = (index: number) => {
    const newLog = [...identity.experienceLog];
    newLog.splice(index, 1);
    setIdentity({ ...identity, experienceLog: newLog });
  };

  const updateExperience = (index: number, field: keyof ExperienceCard, value: string) => {
    const newLog = [...identity.experienceLog];
    newLog[index] = { ...newLog[index], [field]: value };
    setIdentity({ ...identity, experienceLog: newLog });
  };

  // Commotions Card Handlers
  const addCommotionSection = () => {
    setIdentity({
      ...identity,
      commotions: {
        ...identity.commotions,
        sections: [...identity.commotions.sections, { title: "New Section", content: "Section content..." }]
      }
    });
  };

  const removeCommotionSection = (index: number) => {
    const newSections = [...identity.commotions.sections];
    newSections.splice(index, 1);
    setIdentity({ ...identity, commotions: { ...identity.commotions, sections: newSections } });
  };

  const updateCommotionSection = (index: number, field: 'title' | 'content', value: string) => {
    const newSections = [...identity.commotions.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setIdentity({ ...identity, commotions: { ...identity.commotions, sections: newSections } });
  };

  // Pricing Plan Handlers
  const addPricingPlan = () => {
    setIdentity({
      ...identity,
      pricing: [...identity.pricing, { name: "New Plan", price: "$0", level: "Tier", features: ["Feature 1"] }]
    });
  };

  const removePricingPlan = (index: number) => {
    const newPricing = [...identity.pricing];
    newPricing.splice(index, 1);
    setIdentity({ ...identity, pricing: newPricing });
  };

  const updatePricingPlan = (index: number, field: 'name' | 'price' | 'level', value: string) => {
    const newPricing = [...identity.pricing];
    newPricing[index] = { ...newPricing[index], [field]: value };
    setIdentity({ ...identity, pricing: newPricing });
  };

  const updatePricingPlanFeature = (planIndex: number, featureIndex: number, value: string) => {
    const newPricing = [...identity.pricing];
    newPricing[planIndex].features[featureIndex] = value;
    setIdentity({ ...identity, pricing: newPricing });
  };

  const addPricingPlanFeature = (planIndex: number) => {
    const newPricing = [...identity.pricing];
    newPricing[planIndex].features.push("New Feature");
    setIdentity({ ...identity, pricing: newPricing });
  };

  const removePricingPlanFeature = (planIndex: number, featureIndex: number) => {
    const newPricing = [...identity.pricing];
    newPricing[planIndex].features.splice(featureIndex, 1);
    setIdentity({ ...identity, pricing: newPricing });
  };

  // Work Queue Handlers
  const addWorkQueueItem = () => {
    setIdentity({
      ...identity,
      workQueue: [...identity.workQueue, { id: "NEW", project: "New Project", status: "Queued", progress: 0, type: "New Type" }]
    });
  };

  const removeWorkQueueItem = (index: number) => {
    const newWorkQueue = [...identity.workQueue];
    newWorkQueue.splice(index, 1);
    setIdentity({ ...identity, workQueue: newWorkQueue });
  };

  const updateWorkQueueItem = (index: number, field: 'id' | 'project' | 'status' | 'progress' | 'type', value: string | number) => {
    const newWorkQueue = [...identity.workQueue];
    newWorkQueue[index] = { ...newWorkQueue[index], [field]: value };
    setIdentity({ ...identity, workQueue: newWorkQueue });
  };

  // Project Handlers
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = formData.tech.split(",").map(t => t.trim());
    
    const projectData = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      desc: formData.desc,
      tech: techArray,
      links: {
        github: formData.github,
        demo: formData.demo,
      }
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      const data = await res.json();
      if (data.success) {
        setProjects([data.data, ...projects]);
        setFormData({ title: "", category: "Web Dev", image: "/images/bg-space.jpg", desc: "", tech: "", github: "#", demo: "#" });
        showSyncMessage("MISSION DEPLOYED", "success");
      } else {
        showSyncMessage("DEPLOYMENT FAILED", "error");
      }
    } catch (err) { 
      console.error(err);
      showSyncMessage("DEPLOYMENT FAILED", "error");
    }
  };

  const handleDelete = async (id: string) => {
    setModalState({
      isOpen: true,
      message: "This action is irreversible. Confirm permanent deletion of this mission?",
      onConfirm: async () => {
        try {
          await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
          setProjects(projects.filter(p => p._id !== id));
          showSyncMessage("PROJECT DELETED", "success");
        } catch (err) { 
          console.error(err);
          showSyncMessage("DELETE FAILED", "error");
        }
      }
    });
  };

  // --- 🔒 LOGIN SCREEN ---
  if (!isAuthenticated) {
    return <Auth onAuth={() => setIsAuthenticated(true)} />;
  }

  // --- 🖥️ DASHBOARD LAYOUT ---
  return (
    <div className="flex h-screen bg-[#050b14] font-mono text-cyan-400 selection:bg-cyan-500 selection:text-black overflow-hidden">
      
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        alias={identity.alias} 
        setIsAuthenticated={setIsAuthenticated} 
      />

      {/* MAIN CONTENT (SCROLLABLE INDEPENDENTLY) */}
      <main className="flex-1 bg-space-pattern bg-cover bg-fixed h-full overflow-y-auto">
        <div className="p-12 max-w-6xl mx-auto">
          
          {/* HEADER */}
          <Header 
            activeTab={activeTab} 
            saving={saving} 
            handleSaveIdentity={handleSaveIdentity} 
            identity={identity} 
            syncMessage={syncMessage}
          />

          {/* === 📊 VIEW: OVERVIEW === */}
          {activeTab === 'overview' && (
            <Overview identity={identity} setActiveTab={setActiveTab} />
          )}

          {/* === 👤 VIEW: IDENTITY === */}
          {activeTab === 'identity' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
              
              {/* SECTION 1: PROFILE CORE */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Profile Core</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                   <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Public Alias (Home Name)</label>
                      <input value={identity.alias} onChange={(e) => setIdentity({...identity, alias: e.target.value})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">System Designation (Home Title)</label>
                      <input value={identity.designation} onChange={(e) => setIdentity({...identity, designation: e.target.value})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                   </div>
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Master Tagline (Home Desc)</label>
                   <input value={identity.tagline} onChange={(e) => setIdentity({...identity, tagline: e.target.value})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                </div>
                <div className="space-y-4">
                   <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Bio (Home Page)</label>
                   <textarea value={identity.bioLong} onChange={(e) => setIdentity({...identity, bioLong: e.target.value})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none h-40 transition-colors leading-relaxed" />
                </div>
              </section>

              {/* SECTION 2: VISUAL ASSETS */}
              <section>
                 <div className="flex items-center gap-4 mb-8">
                   <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Visual Assets</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   <div className="flex gap-6 items-start">
                      <div className="flex-1 space-y-4">
                         <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Home Page Avatar</label>
                         <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, (url) => setIdentity(prev => ({ ...prev, avatar: url })))} className="hidden" accept="image/*" />
                         <div className="flex gap-3 h-14">
                           <input value={identity.avatar} onChange={(e) => setIdentity({...identity, avatar: e.target.value})} className="flex-1 bg-transparent border border-cyan-500/30 px-5 text-gray-400 text-xs font-mono focus:border-cyan-400 outline-none transition-colors" />
                           <button onClick={() => handleUploadClick(avatarInputRef)} className="border border-cyan-500/30 px-5 hover:bg-cyan-500/10 text-cyan-400 transition-colors h-full flex items-center justify-center"><FaUpload/></button>
                         </div>
                      </div>
                      <div className="w-24 h-24 bg-black/40 border border-cyan-500/20 shrink-0 overflow-hidden relative mt-8">
                        {identity.avatar ? <img src={identity.avatar} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xs text-gray-700">NO IMG</div>}
                      </div>
                   </div>
                   <div className="flex gap-6 items-start">
                      <div className="flex-1 space-y-4">
                         <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">About Page Image</label>
                         <input type="file" ref={aboutImageInputRef} onChange={(e) => handleFileChange(e, (url) => setIdentity(prev => ({ ...prev, aboutImage: url })))} className="hidden" accept="image/*" />
                         <div className="flex gap-3 h-14">
                           <input value={identity.aboutImage} onChange={(e) => setIdentity({...identity, aboutImage: e.target.value})} className="flex-1 bg-transparent border border-cyan-500/30 px-5 text-gray-400 text-xs font-mono focus:border-cyan-400 outline-none transition-colors" />
                           <button onClick={() => handleUploadClick(aboutImageInputRef)} className="border border-cyan-500/30 px-5 hover:bg-cyan-500/10 text-cyan-400 transition-colors h-full flex items-center justify-center"><FaUpload/></button>
                         </div>
                      </div>
                      <div className="w-24 h-24 bg-black/40 border border-cyan-500/20 shrink-0 overflow-hidden relative mt-8">
                        {identity.aboutImage ? <img src={identity.aboutImage} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full text-xs text-gray-700">NO IMG</div>}
                      </div>
                   </div>
                </div>
              </section>

              {/* SECTION 3: NEURAL BIOGRAPHY */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Neural Biography</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                </div>
                
                <div className="space-y-4 mb-12">
                   <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Mission Briefing (About Page Desc)</label>
                   <textarea value={identity.missionBriefing} onChange={(e) => setIdentity({...identity, missionBriefing: e.target.value})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none h-40 transition-colors leading-relaxed" />
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center mb-4">
                     <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Experience Log Cards</label>
                     <button onClick={addExperience} className="text-xs bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus/> Add Card</button>
                   </div>
                   
                   <div className="grid grid-cols-1 gap-4">
                      {identity.experienceLog.map((card, idx) => (
                        <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex gap-4 items-start group hover:border-cyan-500/50 transition-all">
                           <div className="text-2xl text-gray-600 pt-2"><FaBriefcase /></div>
                           <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Title / Name</label>
                                <input value={card.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                              </div>
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Type (Work/Edu)</label>
                                <input value={card.type} onChange={(e) => updateExperience(idx, 'type', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                              </div>
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                                <input value={card.desc} onChange={(e) => updateExperience(idx, 'desc', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                              </div>
                           </div>
                           <button onClick={() => removeExperience(idx)} className="text-red-500/50 hover:text-red-500 pt-2 transition-colors"><FaTrash /></button>
                        </div>
                      ))}
                   </div>
                </div>
              </section>

               {/* SECTION 4: OPERATION STATUS */}
               <section>
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Operation Status</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Current Operational Mode</label>
                      <div className="relative">
                        <select value={identity.statusMode} onChange={(e) => setIdentity({...identity, statusMode: e.target.value})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none appearance-none cursor-pointer">
                          <option value="OPEN">OPEN (OPERATIONAL)</option>
                          <option value="CLOSED">CLOSED (MAINTENANCE)</option>
                        </select>
                        <FaCaretDown className="absolute right-6 top-6 text-cyan-500 pointer-events-none" />
                      </div>
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Terminal Status Output (Read Only)</label>
                      <div className="w-full bg-black/40 border border-cyan-500/10 p-5 text-gray-500 font-mono text-sm border-dashed">
                        {identity.statusMode === 'OPEN' ? "SYSTEM ONLINE // ACCESS GRANTED" : "SYSTEM LOCKED // MAINTENANCE MODE ACTIVE"}
                      </div>
                   </div>
                </div>
              </section>

            </div>
          )}

          {/* === 📜 VIEW: COMMOTIONS === */}
          {activeTab === 'commotions' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
              <section>
                <div className="flex items-center gap-4 mb-8">
                   <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Page Settings</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                   <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Page Title</label>
                      <input value={identity.commotions.title} onChange={(e) => setIdentity({...identity, commotions: {...identity.commotions, title: e.target.value}})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                   </div>
                   <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Version</label>
                      <input value={identity.commotions.version} onChange={(e) => setIdentity({...identity, commotions: {...identity.commotions, version: e.target.value}})} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                   </div>
                </div>
              </section>

              <section>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Content Sections</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                  </div>
                  <button onClick={addCommotionSection} className="text-xs bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus/> Add Section</button>
                </div>
                
                <div className="space-y-4">
                  {identity.commotions.sections.map((section, idx) => (
                    <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex gap-6 items-start group hover:border-cyan-500/50 transition-all">
                      <div className="text-2xl text-gray-600 pt-2"><FaFileContract /></div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Section Title</label>
                          <input value={section.title} onChange={(e) => updateCommotionSection(idx, 'title', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Content</label>
                          <textarea value={section.content} onChange={(e) => updateCommotionSection(idx, 'content', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none h-24 leading-relaxed"/>
                        </div>
                      </div>
                      <button onClick={() => removeCommotionSection(idx)} className="text-red-500/50 hover:text-red-500 pt-2 transition-colors"><FaTrash /></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* === 💰 VIEW: PRICING === */}
          {activeTab === 'pricing' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
              <section>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Pricing Tiers</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                  </div>
                  <button onClick={addPricingPlan} className="text-xs bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus/> Add Plan</button>
                </div>
                
                <div className="space-y-8">
                  {identity.pricing.map((plan, idx) => (
                    <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex gap-6 items-start group hover:border-cyan-500/50 transition-all">
                      <div className="text-2xl text-gray-600 pt-2"><FaTags /></div>
                      <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Plan Name</label>
                            <input value={plan.name} onChange={(e) => updatePricingPlan(idx, 'name', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Price</label>
                            <input value={plan.price} onChange={(e) => updatePricingPlan(idx, 'price', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Level</label>
                            <input value={plan.level} onChange={(e) => updatePricingPlan(idx, 'level', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                          </div>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Features</label>
                          <div className="space-y-2">
                            {plan.features.map((feature, featureIdx) => (
                              <div key={featureIdx} className="flex items-center gap-2">
                                <input value={feature} onChange={(e) => updatePricingPlanFeature(idx, featureIdx, e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                                <button onClick={() => removePricingPlanFeature(idx, featureIdx)} className="text-red-500/50 hover:text-red-500 transition-colors"><FaTrash /></button>
                              </div>
                            ))}
                            <button onClick={() => addPricingPlanFeature(idx)} className="text-xs text-cyan-400 hover:text-white transition-colors">+ Add Feature</button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removePricingPlan(idx)} className="text-red-500/50 hover:text-red-500 pt-2 transition-colors"><FaTrash /></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* === 🛠️ VIEW: WORK QUEUE === */}
          {activeTab === 'workQueue' && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
              <section>
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-6 bg-cyan-500"></div><h3 className="text-white font-bold uppercase tracking-[0.2em] text-lg">Work Queue Items</h3><div className="h-[1px] flex-1 bg-cyan-500/20"></div>
                  </div>
                  <button onClick={addWorkQueueItem} className="text-xs bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus/> Add Item</button>
                </div>
                
                <div className="space-y-4">
                  {identity.workQueue.map((item, idx) => (
                    <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex gap-6 items-start group hover:border-cyan-500/50 transition-all">
                      <div className="text-2xl text-gray-600 pt-2"><FaTasks /></div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">ID</label>
                          <input value={item.id} onChange={(e) => updateWorkQueueItem(idx, 'id', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Project</label>
                          <input value={item.project} onChange={(e) => updateWorkQueueItem(idx, 'project', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                          <input value={item.status} onChange={(e) => updateWorkQueueItem(idx, 'status', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Progress</label>
                          <input type="number" value={item.progress} onChange={(e) => updateWorkQueueItem(idx, 'progress', parseInt(e.target.value))} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Type</label>
                          <input value={item.type} onChange={(e) => updateWorkQueueItem(idx, 'type', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"/>
                        </div>
                      </div>
                      <button onClick={() => removeWorkQueueItem(idx)} className="text-red-500/50 hover:text-red-500 pt-2 transition-colors"><FaTrash /></button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* === 📁 VIEW: PROJECTS === */}
          {activeTab === 'projects' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12">
               <div className="bg-[#0a1128]/80 backdrop-blur border border-cyan-500/30 p-8 rounded-xl h-fit">
                 <h2 className="text-xl font-bold uppercase mb-8 flex items-center gap-3 text-white"><FaPlus className="text-cyan-500"/> Initialize Mission</h2>
                 <form onSubmit={handleAddProject} className="space-y-6">
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Title</label>
                      <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white focus:border-cyan-400 outline-none" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Category</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none">
                          <option>Web Dev</option><option>Mobile</option><option>Design</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Tech Stack</label>
                        <input value={formData.tech} onChange={e => setFormData({...formData, tech: e.target.value})} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" placeholder="React, Next" />
                      </div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Github Link</label>
                        <input value={formData.github} onChange={e => setFormData({...formData, github: e.target.value})} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Demo Link</label>
                        <input value={formData.demo} onChange={e => setFormData({...formData, demo: e.target.value})} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Project Image</label>
                      <input
                        type="file"
                        ref={projectImageInputRef}
                        onChange={(e) => handleFileChange(e, (url) => setFormData(prev => ({ ...prev, image: url })))}
                        className="hidden"
                        accept="image/*"
                      />
                      <div className="flex gap-3 h-14">
                        <input
                          value={formData.image}
                          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                          className="flex-1 bg-black/50 border border-cyan-900 rounded p-3 text-white focus:border-cyan-400 outline-none"
                          placeholder="Image URL"
                        />
                        <button
                          type="button" 
                          onClick={() => handleUploadClick(projectImageInputRef)}
                          className="border border-cyan-900 px-5 hover:bg-cyan-500/10 text-cyan-400 transition-colors h-full flex items-center justify-center rounded"
                        >
                          <FaUpload />
                        </button>
                      </div>
                      {formData.image && formData.image.startsWith('http') && (
                        <div className="w-full h-40 bg-black/40 border border-cyan-900/50 rounded mt-4 overflow-hidden relative">
                          <img src={formData.image} className="w-full h-full object-cover" alt="Project Preview" />
                        </div>
                      )}
                    </div>
                    <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Description</label>
                        <textarea value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none h-24" />
                    </div>
                    <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold py-4 rounded uppercase tracking-widest transition-all">Deploy Mission</button>
                 </form>
               </div>
               <div className="bg-[#0a1128]/80 backdrop-blur border border-cyan-500/30 p-8 rounded-xl h-[600px] overflow-y-auto custom-scrollbar">
                  <h2 className="text-xl font-bold uppercase mb-8 flex items-center gap-3 text-white"><FaDatabase className="text-cyan-500"/> Live Archives</h2>
                  <ul className="space-y-4">
                      {projects.map(p => (
                        <li key={p._id} className="flex justify-between items-center border border-white/5 p-4 rounded bg-black/20 hover:bg-cyan-500/10 transition-colors group">
                          <div><div className="font-bold text-white text-lg">{p.title}</div><div className="text-xs text-cyan-500 mt-1">{p.category}</div></div>
                          <button onClick={() => handleDelete(p._id)} className="text-red-500 opacity-50 group-hover:opacity-100 hover:scale-110 transition-all p-2"><FaTrash/></button>
                        </li>
                      ))}
                  </ul>
               </div>
             </div>
          )}
        </div>
      </main>

      {/* CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={modalState.onConfirm}
        message={modalState.message}
      />

    </div>
  );
}