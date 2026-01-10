"use client";
import { useState, useEffect, useRef } from "react";
import {
  FaTrash, FaPlus, FaDatabase, FaSpinner, FaUserEdit, FaTags, FaListUl,
  FaImages, FaSave, FaUpload, FaCaretDown, FaTerminal,
  FaChevronDown, FaChevronRight, FaBriefcase, FaFileContract
} from "react-icons/fa";
import { Project, ProfileData, ExperienceCard } from "@/types";
import Auth from "@/components/dashboard/Auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Overview from "@/components/dashboard/Overview";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import { FaTasks } from "react-icons/fa";
import SocialLinksPage from "@/app/dashboard/social-links/page";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function () {
  // --- REFS ---
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---

  // --- STATE ---

  const [activeTab, setActiveTab] = useState("identity");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ message: string; type: "success" | "error" | "" }>({ message: "", type: "" });
  const [modalState, setModalState] = useState({ isOpen: false, message: "", onConfirm: () => { } });

  // EDIT MODE STATE
  const [editProjectId, setEditProjectId] = useState<string | null>(null);

  // DATA STATE
  const [projects, setProjects] = useState<Project[]>([]);
  // ... (rest of state vars omitted for brevity if unchanged, but need to be careful with replace_file_content context match)
  // To avoid context errors, I will match exactly what was there.

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
    protocols: {
      title: "System Protocols",
      version: "3.0.0 (Live)",
      sections: []
    },
    pricing: [],
    workQueue: [],
    skillStats: [],
    lastSync: new Date().toISOString()
  });

  const [formData, setFormData] = useState({
    title: "",
    category: "Web Dev",
    images: [] as string[],
    desc: "",
    tech: "",
    github: "#",
    demo: "#",
    clientName: "",
    timeline: "",
    roleStack: "",
    coreChallenge: "",
    technicalSolution: ""
  });

  const { data: session, status } = useSession();
  const router = useRouter();

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    if (status === "authenticated") {
      Promise.all([fetchProjects(), fetchProfile()]).finally(() => setLoading(false));
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

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
        const safeData = {
          ...data.data,
          experienceLog: data.data.experienceLog || [],
          skillStats: data.data.skillStats || []
        };
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

  // ... (keeping other handlers same until we reach project handler)

  const handleEditProject = (project: Project) => {
    setEditProjectId(project._id);
    setFormData({
      title: project.title,
      category: project.category,
      images: project.images || [],
      desc: project.desc || "",
      tech: project.tech ? project.tech.join(", ") : "",
      github: project.links?.github || "",
      demo: project.links?.demo || "",
      clientName: project.clientName || "",
      timeline: project.timeline || "",
      roleStack: project.roleStack || "",
      coreChallenge: project.coreChallenge || "",
      technicalSolution: project.technicalSolution || ""
    });
    const formElement = document.getElementById("project-form");
    if (formElement) formElement.scrollIntoView({ behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditProjectId(null);
    setFormData({
      title: "", category: "Web Dev", images: [], desc: "", tech: "", github: "#", demo: "#",
      clientName: "", timeline: "", roleStack: "", coreChallenge: "", technicalSolution: ""
    });
  };

  // ... (rest of simple handlers omitted for now, will target specifically handleAddProject next)

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

  const handleUploadClick = (ref: React.RefObject<HTMLInputElement | null>) => {
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
          `Cloudinary upload failed: ${uploadData.error?.message || "Unknown error"
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

  // Protocol Section Handlers
  const addProtocolSection = () => {
    setIdentity({
      ...identity,
      protocols: {
        ...identity.protocols,
        sections: [...identity.protocols.sections, { title: "New Section", content: "Section content..." }]
      }
    });
  };

  const removeProtocolSection = (index: number) => {
    const newSections = [...identity.protocols.sections];
    newSections.splice(index, 1);
    setIdentity({ ...identity, protocols: { ...identity.protocols, sections: newSections } });
  };

  const updateProtocolSection = (index: number, field: 'title' | 'content', value: string) => {
    const newSections = [...identity.protocols.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setIdentity({ ...identity, protocols: { ...identity.protocols, sections: newSections } });
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
      workQueue: [...identity.workQueue, { id: `W-0${identity.workQueue.length + 1}`, project: "New Project", status: "Queued", progress: 0, type: "New Type" }]
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

  // Skill Stat Handlers
  const addSkillStat = () => {
    setIdentity({
      ...identity,
      skillStats: [...(identity.skillStats || []), { label: "NEW PARAMETER", value: "50%", color: "bg-cyan-400" }]
    });
  };

  const removeSkillStat = (index: number) => {
    const newStats = [...(identity.skillStats || [])];
    newStats.splice(index, 1);
    setIdentity({ ...identity, skillStats: newStats });
  };

  const updateSkillStat = (index: number, field: 'label' | 'value' | 'color', value: string) => {
    const newStats = [...(identity.skillStats || [])];
    newStats[index] = { ...newStats[index], [field]: value };
    setIdentity({ ...identity, skillStats: newStats });
  };

  // Project Handlers
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const techArray = formData.tech.split(",").map(t => t.trim());

    const projectData = {
      title: formData.title,
      category: formData.category,
      images: formData.images,
      desc: formData.desc,
      tech: techArray,
      clientName: formData.clientName,
      timeline: formData.timeline,
      roleStack: formData.roleStack,
      coreChallenge: formData.coreChallenge,
      technicalSolution: formData.technicalSolution,
      links: {
        github: formData.github,
        demo: formData.demo,
      }
    };

    try {
      const isEdit = !!editProjectId;
      const url = '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';
      const body = isEdit ? { ...projectData, _id: editProjectId } : projectData;

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        if (isEdit) {
          setProjects(projects.map(p => p._id === editProjectId ? data.data : p));
          showSyncMessage("MISSION UPDATE COMPLETE", "success");
          handleCancelEdit(); // Reset form
        } else {
          setProjects([data.data, ...projects]);
          setFormData({
            title: "", category: "Web Dev", images: [], desc: "", tech: "", github: "#", demo: "#",
            clientName: "", timeline: "", roleStack: "", coreChallenge: "", technicalSolution: ""
          });
          showSyncMessage("MISSION DEPLOYED", "success");
        }
      } else {
        showSyncMessage(isEdit ? "UPDATE FAILED" : "DEPLOYMENT FAILED", "error");
      }
    } catch (err) {
      console.error(err);
      showSyncMessage("OPERATION FAILED", "error");
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

  // --- Conditional Rendering for Auth ---
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050b14] font-mono text-cyan-400" suppressHydrationWarning={true}>
        <FaSpinner className="animate-spin text-5xl text-cyan-500" />
        <p className="ml-4 text-white uppercase tracking-widest">LOADING SYSTEM DATA...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Auth />;
  }

  // --- 🖥️ DASHBOARD LAYOUT ---
  return (
    <div className="flex h-screen bg-[#050b14] font-mono text-cyan-400 selection:bg-cyan-500 selection:text-black overflow-hidden relative" suppressHydrationWarning={true}>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alias={session?.user?.name || identity.alias}
        setIsAuthenticated={signOut}
      />

      {/* MAIN CONTENT (SCROLLABLE INDEPENDENTLY) */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-black relative">
        <Header
          activeTab={activeTab}
          saving={saving}
          handleSaveIdentity={handleSaveIdentity}
          identity={identity}
          syncMessage={syncMessage}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 lg:p-12">
          <div className="max-w-6xl mx-auto pb-24">

            {/* === 📊 VIEW: OVERVIEW === */}
            {activeTab === 'overview' && (
              <Overview identity={identity} setActiveTab={setActiveTab} />
            )}

            {/* === 👤 VIEW: IDENTITY === */}
            {activeTab === 'identity' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16">
                {/* MISSION OPERATOR IDENTITY (About Page) */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Mission Operator Identity</h3>
                    <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Name & Title */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Operator Name (Alias)</label>
                        <input value={identity.alias} onChange={(e) => setIdentity({ ...identity, alias: e.target.value })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" placeholder="e.g. LUCY" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Mission Title (Designation)</label>
                        <input value={identity.designation} onChange={(e) => setIdentity({ ...identity, designation: e.target.value })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" placeholder="e.g. FULL-STACK OPERATIVE" />
                      </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Identity Photo (About Page)</label>
                        <input type="file" ref={aboutImageInputRef} onChange={(e) => handleFileChange(e, (url) => setIdentity(prev => ({ ...prev, aboutImage: url })))} className="hidden" accept="image/*" />
                        <div className="flex gap-3 h-14">
                          <input value={identity.aboutImage} onChange={(e) => setIdentity({ ...identity, aboutImage: e.target.value })} className="flex-1 bg-transparent border border-cyan-500/30 px-5 text-gray-400 text-xs font-mono focus:border-cyan-400 outline-none transition-colors min-w-0" />
                          <button onClick={() => handleUploadClick(aboutImageInputRef)} className="border border-cyan-500/30 px-5 hover:bg-cyan-500/10 text-cyan-400 transition-colors h-full flex items-center justify-center shrink-0"><FaUpload /></button>
                        </div>
                      </div>
                      <div className="w-24 h-24 bg-black/40 border border-cyan-500/20 shrink-0 overflow-hidden relative sm:mt-8 mx-auto sm:mx-0 rounded-lg">
                        {identity.aboutImage ? <img src={identity.aboutImage} className="w-full h-full object-cover" alt="About" /> : <div className="flex items-center justify-center h-full text-xs text-gray-700 font-bold">NO IMG</div>}
                      </div>
                    </div>
                  </div>

                  {/* Skills Bars */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Skill Parameters (About Bars)</label>
                      <button onClick={addSkillStat} className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus /> Add Parameter</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(identity.skillStats || []).map((stat, idx) => (
                        <div key={idx} className="bg-black/30 border border-cyan-500/20 p-4 rounded flex gap-4 items-center group hover:border-cyan-500/50 transition-all">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Skill Name</label>
                              <input value={stat.label} onChange={(e) => updateSkillStat(idx, 'label', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" placeholder="Frontend" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Percent (%)</label>
                              <input value={stat.value} onChange={(e) => updateSkillStat(idx, 'value', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" placeholder="95%" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Color (Select)</label>
                              <div className="relative">
                                <select value={stat.color} onChange={(e) => updateSkillStat(idx, 'color', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none appearance-none cursor-pointer">
                                  <optgroup label="Monochrome">
                                    <option value="bg-gray-500">Gray 500</option>
                                    <option value="bg-slate-500">Slate 500</option>
                                    <option value="bg-zinc-500">Zinc 500</option>
                                  </optgroup>
                                  <optgroup label="Warm Colors">
                                    <option value="bg-red-500">Red 500</option>
                                    <option value="bg-orange-500">Orange 500</option>
                                    <option value="bg-amber-500">Amber 500</option>
                                    <option value="bg-yellow-400">Yellow 400</option>
                                    <option value="bg-yellow-500">Yellow 500</option>
                                  </optgroup>
                                  <optgroup label="Nature Colors">
                                    <option value="bg-lime-500">Lime 500</option>
                                    <option value="bg-green-500">Green 500</option>
                                    <option value="bg-emerald-500">Emerald 500</option>
                                    <option value="bg-teal-500">Teal 500</option>
                                  </optgroup>
                                  <optgroup label="Cool Colors">
                                    <option value="bg-cyan-400">Cyan 400 (Default)</option>
                                    <option value="bg-cyan-500">Cyan 500</option>
                                    <option value="bg-sky-500">Sky 500</option>
                                    <option value="bg-blue-500">Blue 500</option>
                                    <option value="bg-blue-600">Blue 600</option>
                                    <option value="bg-blue-700">Blue 700</option>
                                    <option value="bg-indigo-500">Indigo 500</option>
                                  </optgroup>
                                  <optgroup label="Mystic Colors">
                                    <option value="bg-violet-500">Violet 500</option>
                                    <option value="bg-purple-500">Purple 500</option>
                                    <option value="bg-fuchsia-500">Fuchsia 500</option>
                                    <option value="bg-pink-500">Pink 500</option>
                                    <option value="bg-rose-500">Rose 500</option>
                                  </optgroup>
                                </select>
                                <FaCaretDown className="absolute right-2 top-3 text-gray-500 pointer-events-none text-xs" />
                              </div>
                            </div>
                          </div>
                          <button onClick={() => removeSkillStat(idx)} className="text-red-500/50 hover:text-red-500 transition-colors shrink-0"><FaTrash /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* PUBLIC UPLINK CONFIGURATION (Home Page) */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Public Uplink Configuration</h3>
                    <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-4 w-full">
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Home Page Avatar</label>
                        <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, (url) => setIdentity(prev => ({ ...prev, avatar: url })))} className="hidden" accept="image/*" />
                        <div className="flex gap-3 h-14">
                          <input value={identity.avatar} onChange={(e) => setIdentity({ ...identity, avatar: e.target.value })} className="flex-1 bg-transparent border border-cyan-500/30 px-5 text-gray-400 text-xs font-mono focus:border-cyan-400 outline-none transition-colors min-w-0" />
                          <button onClick={() => handleUploadClick(avatarInputRef)} className="border border-cyan-500/30 px-5 hover:bg-cyan-500/10 text-cyan-400 transition-colors h-full flex items-center justify-center shrink-0"><FaUpload /></button>
                        </div>
                      </div>
                      <div className="w-24 h-24 bg-black/40 border border-cyan-500/20 shrink-0 overflow-hidden relative sm:mt-8 mx-auto sm:mx-0 rounded-lg">
                        {identity.avatar ? <img src={identity.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <div className="flex items-center justify-center h-full text-xs text-gray-700 font-bold">NO IMG</div>}
                      </div>
                    </div>

                    {/* Tagline & Bio */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Landing Tagline</label>
                        <input value={identity.tagline} onChange={(e) => setIdentity({ ...identity, tagline: e.target.value })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Home Page Bio</label>
                        <textarea value={identity.bioLong} onChange={(e) => setIdentity({ ...identity, bioLong: e.target.value })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none h-32 transition-colors leading-relaxed" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* NEURAL BIOGRAPHY */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Neural Biography</h3>
                    <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                  </div>

                  <div className="space-y-4 mb-12">
                    <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Mission Briefing (About Page Desc)</label>
                    <textarea value={identity.missionBriefing} onChange={(e) => setIdentity({ ...identity, missionBriefing: e.target.value })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none h-40 transition-colors leading-relaxed" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Experience Log Cards</label>
                      <button onClick={addExperience} className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus /> Add Card</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {identity.experienceLog.map((card, idx) => (
                        <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex flex-col sm:flex-row gap-4 items-start group hover:border-cyan-500/50 transition-all">
                          <div className="text-2xl text-gray-600 pt-1 shrink-0"><FaBriefcase /></div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Title / Name</label>
                              <input value={card.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Type (Work/Edu)</label>
                              <input value={card.type} onChange={(e) => updateExperience(idx, 'type', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Description</label>
                              <input value={card.desc} onChange={(e) => updateExperience(idx, 'desc', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                            </div>
                          </div>
                          <button onClick={() => removeExperience(idx)} className="text-red-500/50 hover:text-red-500 pt-1 transition-colors self-end sm:self-start"><FaTrash /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* SECTION 4: OPERATION STATUS */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Operation Status</h3>
                    <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Current Operational Mode</label>
                      <div className="relative">
                        <select value={identity.statusMode} onChange={(e) => setIdentity({ ...identity, statusMode: e.target.value })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none appearance-none cursor-pointer">
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

            {/* === 🔗 VIEW: SOCIAL LINKS === */}
            {activeTab === 'social-links' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <SocialLinksPage />
              </div>
            )}

            {/* === 📜 VIEW: PROTOCOLS === */}
            {activeTab === 'protocols' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Page Settings</h3>
                    <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Page Title</label>
                      <input value={identity.protocols.title} onChange={(e) => setIdentity({ ...identity, protocols: { ...identity.protocols, title: e.target.value } })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] text-cyan-600 font-bold uppercase tracking-[0.25em] ml-1">Version</label>
                      <input value={identity.protocols.version} onChange={(e) => setIdentity({ ...identity, protocols: { ...identity.protocols, version: e.target.value } })} className="w-full bg-transparent border border-cyan-500/30 p-5 text-cyan-400 font-mono text-sm focus:border-cyan-400 outline-none transition-colors" />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                      <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm shrink-0">Content Sections</h3>
                      <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                    </div>
                    <button onClick={addProtocolSection} className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center shrink-0"><FaPlus /> Add Section</button>
                  </div>

                  <div className="space-y-4">
                    {identity.protocols.sections.map((section, idx) => (
                      <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex flex-col sm:flex-row gap-6 items-start group hover:border-cyan-500/50 transition-all">
                        <div className="text-2xl text-gray-600 pt-1 shrink-0"><FaFileContract /></div>
                        <div className="flex-1 space-y-4 w-full">
                          <div>
                            <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Section Title</label>
                            <input value={section.title} onChange={(e) => updateProtocolSection(idx, 'title', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                          </div>
                          <div>
                            <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Content</label>
                            <textarea value={section.content} onChange={(e) => updateProtocolSection(idx, 'content', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none h-24 leading-relaxed" />
                          </div>
                        </div>
                        <button onClick={() => removeProtocolSection(idx)} className="text-red-500/50 hover:text-red-500 pt-1 transition-colors self-end sm:self-start"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* === 💰 VIEW: PRICING === */}
            {
              activeTab === 'pricing' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
                  <section>
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                        <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Pricing Tiers</h3>
                        <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                      </div>
                      <button onClick={addPricingPlan} className="text-xs bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus /> Add Plan</button>
                    </div>

                    <div className="space-y-8">
                      {identity.pricing.map((plan, idx) => (
                        <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex gap-6 items-start group hover:border-cyan-500/50 transition-all">
                          <div className="text-2xl text-gray-600 pt-2"><FaTags /></div>
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Plan Name</label>
                                <input value={plan.name} onChange={(e) => updatePricingPlan(idx, 'name', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                              </div>
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Price</label>
                                <input value={plan.price} onChange={(e) => updatePricingPlan(idx, 'price', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                              </div>
                              <div>
                                <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Level</label>
                                <input value={plan.level} onChange={(e) => updatePricingPlan(idx, 'level', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                              </div>
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Features</label>
                              <div className="space-y-2">
                                {plan.features.map((feature, featureIdx) => (
                                  <div key={featureIdx} className="flex items-center gap-2">
                                    <input value={feature} onChange={(e) => updatePricingPlanFeature(idx, featureIdx, e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
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
              )
            }

            {/* === 🛠️ VIEW: WORK QUEUE === */}
            {
              activeTab === 'workQueue' && (
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
                  <section>
                    <div className="flex justify-between items-center mb-8">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                        <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm">Work Queue Items</h3>
                        <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                      </div>
                      <button onClick={addWorkQueueItem} className="text-xs bg-cyan-500/20 hover:bg-cyan-500 text-cyan-400 hover:text-black px-4 py-2 rounded uppercase tracking-widest transition-all font-bold flex gap-2 items-center"><FaPlus /> Add Item</button>
                    </div>

                    <div className="space-y-4">
                      {identity.workQueue.map((item, idx) => (
                        <div key={idx} className="bg-black/30 border border-cyan-500/20 p-6 rounded flex gap-6 items-start group hover:border-cyan-500/50 transition-all">
                          <div className="text-2xl text-gray-600 pt-2"><FaTasks /></div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">ID</label>
                              <input value={item.id} onChange={(e) => updateWorkQueueItem(idx, 'id', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Project</label>
                              <input value={item.project} onChange={(e) => updateWorkQueueItem(idx, 'project', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Status</label>
                              <input value={item.status} onChange={(e) => updateWorkQueueItem(idx, 'status', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Progress</label>
                              <input
                                type="number"
                                value={isNaN(item.progress) ? 0 : item.progress}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  updateWorkQueueItem(idx, 'progress', isNaN(val) ? 0 : val);
                                }}
                                className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Type</label>
                              <input value={item.type} onChange={(e) => updateWorkQueueItem(idx, 'type', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-white text-xs rounded focus:border-cyan-500 outline-none" />
                            </div>
                          </div>
                          <button onClick={() => removeWorkQueueItem(idx)} className="text-red-500/50 hover:text-red-500 pt-2 transition-colors"><FaTrash /></button>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              )
            }


            {/* === 📁 VIEW: PROJECTS === */}
            {activeTab === 'projects' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-[#0a1128]/80 backdrop-blur border border-cyan-500/30 p-6 sm:p-8 rounded-xl h-fit" id="project-form">
                  <div className="flex items-center gap-4 mb-8 text-white">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h2 className="text-white font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3">
                      {editProjectId ? <><FaUserEdit className="text-yellow-500" /> Update Mission Specs</> : <><FaPlus className="text-cyan-500" /> Initialize Mission</>}
                    </h2>
                    <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                  </div>

                  {editProjectId && (
                    <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded text-yellow-200 text-xs flex justify-between items-center">
                      <span>EDITING ACTIVE: {formData.title}</span>
                      <button onClick={handleCancelEdit} className="text-white hover:text-yellow-500 underline uppercase tracking-widest font-bold">Cancel</button>
                    </div>
                  )}

                  <form onSubmit={handleAddProject} className="space-y-6">
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Title</label>
                      <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white focus:border-cyan-400 outline-none" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Category</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none">
                          <option>Web Dev</option><option>Mobile</option><option>Design</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Tech Stack</label>
                        <input value={formData.tech} onChange={e => setFormData({ ...formData, tech: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" placeholder="React, Next" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Client</label>
                        <input value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" placeholder="Client Co." />
                      </div>
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Timeline</label>
                        <input value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" placeholder="Jan - Mar 2024" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Role / Stack Description</label>
                      <input value={formData.roleStack} onChange={e => setFormData({ ...formData, roleStack: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" placeholder="Lead Developer - Full Stack" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Github Link</label>
                        <input value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Demo Link</label>
                        <input value={formData.demo} onChange={e => setFormData({ ...formData, demo: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Project Images</label>
                      <input
                        type="file"
                        ref={projectImageInputRef}
                        onChange={(e) => handleFileChange(e, (url) => setFormData(prev => ({ ...prev, images: [...prev.images, url] })))}
                        className="hidden"
                        accept="image/*"
                      />
                      <button
                        type="button"
                        onClick={() => handleUploadClick(projectImageInputRef)}
                        className="w-full border border-cyan-900 border-dashed py-4 hover:bg-cyan-500/10 text-cyan-400 transition-colors flex items-center justify-center gap-2 rounded mb-4"
                      >
                        <FaUpload /> Upload Asset
                      </button>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-video group border border-cyan-900 rounded overflow-hidden">
                              <img src={img} className="w-full h-full object-cover" alt="Asset" />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTrash size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Description</label>
                      <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none h-20" />
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Core Challenge</label>
                      <textarea value={formData.coreChallenge} onChange={e => setFormData({ ...formData, coreChallenge: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none h-20" />
                    </div>
                    <div>
                      <label className="text-[10px] text-cyan-500 uppercase tracking-widest mb-2 block">Technical Solution</label>
                      <textarea value={formData.technicalSolution} onChange={e => setFormData({ ...formData, technicalSolution: e.target.value })} className="w-full bg-black/50 border border-cyan-900 rounded p-3 text-white outline-none h-20" />
                    </div>
                    <button type="submit" className={`w-full font-bold py-4 rounded uppercase tracking-widest transition-all ${editProjectId ? "bg-yellow-600 hover:bg-yellow-500 text-black" : "bg-cyan-600 hover:bg-cyan-500 text-black"}`}>
                      {editProjectId ? "Establish Update" : "Deploy Mission"}
                    </button>
                  </form>
                </div>

                <div className="bg-[#0a1128]/80 backdrop-blur border border-cyan-500/30 p-6 sm:p-8 rounded-xl h-[600px] overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cyan-500 rounded-full"></div>
                    <h2 className="text-white font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3">
                      <FaDatabase className="text-cyan-500" /> Live Archives
                    </h2>
                    <div className="h-[1px] flex-1 bg-cyan-500/10"></div>
                  </div>
                  <ul className="space-y-4">
                    {projects.map(p => (
                      <li key={p._id} className="flex justify-between items-center border border-white/5 p-4 rounded bg-black/20 hover:bg-cyan-500/10 transition-colors group">
                        <div className="min-w-0">
                          <div className="font-bold text-white text-base sm:text-lg truncate">{p.title}</div>
                          <div className="text-[10px] sm:text-xs text-cyan-500 mt-1 uppercase tracking-widest">{p.category}</div>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleEditProject(p)} className="text-yellow-500 opacity-50 group-hover:opacity-100 hover:scale-110 transition-all p-2"><FaUserEdit /></button>
                          <button onClick={() => handleDelete(p._id)} className="text-red-500 opacity-50 group-hover:opacity-100 hover:scale-110 transition-all p-2"><FaTrash /></button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

          </div>
        </div >
      </main >

      {/* CONFIRMATION MODAL */}
      < ConfirmModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        onConfirm={modalState.onConfirm}
        message={modalState.message}
      />

    </div >
  );
}