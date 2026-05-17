"use client";
import { useState, useEffect, useRef } from "react";
import {
  FaTrash, FaPlus, FaDatabase, FaSpinner, FaUserEdit, FaTags, FaListUl,
  FaImages, FaSave, FaUpload, FaCaretDown, FaTerminal,
  FaChevronDown, FaChevronRight, FaBriefcase, FaFileContract, FaShieldAlt, FaCogs
} from "react-icons/fa";
import { Project, ProfileData, ExperienceCard } from "@/types";
import Auth from "@/components/dashboard/Auth";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import Overview from "@/components/dashboard/Overview";
import ConfirmModal from "@/components/dashboard/ConfirmModal";
import SkillsManager from "@/components/dashboard/SkillsManager";
import { FaTasks } from "react-icons/fa";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function () {
  // --- REFS ---
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);

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
    socialLinks: [],
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
          skillStats: data.data.skillStats || [],
          socialLinks: data.data.socialLinks || []
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

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signData.signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (uploadData.secure_url) {
        onUploadComplete(uploadData.secure_url);
        showSyncMessage("UPLOAD COMPLETE", "success");
      } else {
        console.error("Cloudinary upload failed. Response:", uploadData);
        throw new Error(
          `Cloudinary upload failed: ${uploadData.error?.message || "Unknown error"}`
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
      skillStats: [...(identity.skillStats || []), { label: "NEW PARAMETER", value: "50%", color: "bg-violet-500" }]
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

  // Social Link Handlers
  const addSocialLink = () => {
    setIdentity({
      ...identity,
      socialLinks: [...(identity.socialLinks || []), { platform: "New Platform", url: "https://" }]
    });
  };

  const removeSocialLink = (index: number) => {
    const newLinks = [...(identity.socialLinks || [])];
    newLinks.splice(index, 1);
    setIdentity({ ...identity, socialLinks: newLinks });
  };

  const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
    const newLinks = [...(identity.socialLinks || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setIdentity({ ...identity, socialLinks: newLinks });
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
          handleCancelEdit();
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
      <div className="flex items-center justify-center min-h-screen bg-deep-bg font-sans text-pearl" suppressHydrationWarning={true}>
        <FaSpinner className="animate-spin text-5xl text-cerulean" />
        <p className="ml-4 text-pearl tracking-wide">Loading system data...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Auth />;
  }

  // --- DASHBOARD LAYOUT ---
  return (
    <div className="flex h-screen bg-deep-bg font-sans text-pearl overflow-hidden" suppressHydrationWarning={true}>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alias={session?.user?.name || identity.alias}
        setIsAuthenticated={signOut}
      />

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <Header
          activeTab={activeTab}
          saving={saving}
          handleSaveIdentity={handleSaveIdentity}
          identity={identity}
          syncMessage={syncMessage}
        />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-5xl mx-auto pb-24">


            {/* === VIEW: OVERVIEW === */}
            {activeTab === 'overview' && (
              <Overview identity={identity} setActiveTab={setActiveTab} />
            )}

            {/* === VIEW: IDENTITY === */}
            {activeTab === 'identity' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16">
                {/* MISSION OPERATOR IDENTITY (About Page) */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                    <h3 className="text-pearl font-semibold text-sm tracking-wide">Profile Identity</h3>
                    <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    {/* Name & Title */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs text-pearl/40 font-medium ml-1">Name / Alias</label>
                        <input value={identity.alias} onChange={(e) => setIdentity({ ...identity, alias: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" placeholder="e.g. Chilly" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs text-pearl/40 font-medium ml-1">Designation / Title</label>
                        <input value={identity.designation} onChange={(e) => setIdentity({ ...identity, designation: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" placeholder="e.g. Full-Stack Developer" />
                      </div>
                    </div>

                    {/* Photo Upload */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-3 w-full">
                        <label className="text-xs text-pearl/40 font-medium ml-1">About Page Photo</label>
                        <input type="file" ref={aboutImageInputRef} onChange={(e) => handleFileChange(e, (url) => setIdentity(prev => ({ ...prev, aboutImage: url })))} className="hidden" accept="image/*" />
                        <div className="flex gap-3">
                          <input value={identity.aboutImage} onChange={(e) => setIdentity({ ...identity, aboutImage: e.target.value })} className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors min-w-0" />
                          <button onClick={() => handleUploadClick(aboutImageInputRef)} className="bg-white/[0.03] border border-white/[0.08] px-4 rounded-lg hover:bg-cerulean/20 text-cerulean transition-colors flex items-center justify-center shrink-0"><FaUpload /></button>
                        </div>
                      </div>
                      <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.06] shrink-0 overflow-hidden relative sm:mt-7 mx-auto sm:mx-0 rounded-xl">
                        {identity.aboutImage ? <img src={identity.aboutImage} className="w-full h-full object-cover" alt="About" /> : <div className="flex items-center justify-center h-full text-xs text-slate-700 font-medium">No img</div>}
                      </div>
                    </div>
                  </div>
                </section>

                {/* PUBLIC UPLINK CONFIGURATION (Home Page) */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                    <h3 className="text-pearl font-semibold text-sm tracking-wide">Home Page Configuration</h3>
                    <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Avatar Upload */}
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex-1 space-y-3 w-full">
                        <label className="text-xs text-pearl/40 font-medium ml-1">Home Avatar</label>
                        <input type="file" ref={avatarInputRef} onChange={(e) => handleFileChange(e, (url) => setIdentity(prev => ({ ...prev, avatar: url })))} className="hidden" accept="image/*" />
                        <div className="flex gap-3">
                          <input value={identity.avatar} onChange={(e) => setIdentity({ ...identity, avatar: e.target.value })} className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors min-w-0" />
                          <button onClick={() => handleUploadClick(avatarInputRef)} className="bg-white/[0.03] border border-white/[0.08] px-4 rounded-lg hover:bg-cerulean/20 text-cerulean transition-colors flex items-center justify-center shrink-0"><FaUpload /></button>
                        </div>
                      </div>
                      <div className="w-20 h-20 bg-white/[0.02] border border-white/[0.06] shrink-0 overflow-hidden relative sm:mt-7 mx-auto sm:mx-0 rounded-xl">
                        {identity.avatar ? <img src={identity.avatar} className="w-full h-full object-cover" alt="Avatar" /> : <div className="flex items-center justify-center h-full text-xs text-slate-700 font-medium">No img</div>}
                      </div>
                    </div>

                    {/* Tagline & Bio */}
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-xs text-pearl/40 font-medium ml-1">Landing Tagline</label>
                        <input value={identity.tagline} onChange={(e) => setIdentity({ ...identity, tagline: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs text-pearl/40 font-medium ml-1">Home Page Bio</label>
                        <textarea value={identity.bioLong} onChange={(e) => setIdentity({ ...identity, bioLong: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors h-32 leading-relaxed" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* BIOGRAPHY */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                    <h3 className="text-pearl font-semibold text-sm tracking-wide">Biography & Experience</h3>
                    <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                  </div>

                  <div className="space-y-3 mb-12">
                    <label className="text-xs text-pearl/40 font-medium ml-1">About Page Description</label>
                    <textarea value={identity.missionBriefing} onChange={(e) => setIdentity({ ...identity, missionBriefing: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors h-40 leading-relaxed" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <label className="text-xs text-pearl/40 font-medium ml-1">Experience Cards</label>
                      <button onClick={addExperience} className="text-xs bg-cerulean hover:bg-cerulean/90 text-deep-bg px-4 py-2 rounded-lg font-medium flex gap-2 items-center transition-all"><FaPlus /> Add Card</button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {identity.experienceLog.map((card, idx) => (
                        <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-cerulean/20 transition-all flex flex-col sm:flex-row gap-4 items-start group">
                          <div className="text-2xl text-slate-600 pt-1 shrink-0"><FaBriefcase /></div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div>
                              <label className="text-[10px] text-pearl/30 block mb-1">Title / Name</label>
                              <input value={card.title} onChange={(e) => updateExperience(idx, 'title', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] text-pearl/30 block mb-1">Type (Work/Edu)</label>
                              <input value={card.type} onChange={(e) => updateExperience(idx, 'type', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] text-pearl/30 block mb-1">Description</label>
                              <input value={card.desc} onChange={(e) => updateExperience(idx, 'desc', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                            </div>
                          </div>
                          <button onClick={() => removeExperience(idx)} className="text-red-500/50 hover:text-red-400 pt-1 transition-colors self-end sm:self-start"><FaTrash /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                {/* OPERATION STATUS */}
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                    <h3 className="text-pearl font-semibold text-sm tracking-wide">Availability Status</h3>
                    <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs text-pearl/40 font-medium ml-1">Current Status</label>
                      <div className="relative">
                        <select value={identity.statusMode} onChange={(e) => setIdentity({ ...identity, statusMode: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl focus:border-cerulean/50 focus:outline-none transition-colors appearance-none cursor-pointer">
                          <option value="OPEN">OPEN (Available)</option>
                          <option value="CLOSED">CLOSED (Unavailable)</option>
                        </select>
                        <FaCaretDown className="absolute right-4 top-4 text-pearl/30 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs text-pearl/40 font-medium ml-1">Status Display</label>
                      <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-3 text-sm text-pearl/30 border-dashed">
                        {identity.statusMode === 'OPEN' ? "Available for work" : "Currently unavailable"}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}


            {/* === VIEW: SOCIAL LINKS === */}
            {activeTab === 'social-links' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                      <h3 className="text-pearl font-semibold text-sm tracking-wide shrink-0">Social Links</h3>
                      <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                    </div>
                    <button 
                      onClick={addSocialLink} 
                      className="text-xs bg-cerulean hover:bg-cerulean/90 text-deep-bg px-4 py-2 rounded-lg font-medium flex gap-2 items-center transition-all"
                    >
                      <FaPlus /> Add Link
                    </button>
                  </div>

                  <div className="space-y-4">
                    {(identity.socialLinks || []).map((link, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-cerulean/20 transition-all flex flex-col md:flex-row gap-6 items-start group">
                        <div className="text-2xl text-slate-600 pt-1 shrink-0"><FaShieldAlt /></div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Platform Name</label>
                            <input 
                              value={link.platform} 
                              onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)} 
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" 
                              placeholder="e.g. Twitter"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">URL</label>
                            <input 
                              value={link.url} 
                              onChange={(e) => updateSocialLink(idx, 'url', e.target.value)} 
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" 
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                        <button onClick={() => removeSocialLink(idx)} className="text-red-500/50 hover:text-red-400 pt-1 transition-colors self-end md:self-start"><FaTrash /></button>
                      </div>
                    ))}

                    {(identity.socialLinks || []).length === 0 && (
                      <div className="text-center py-20 border border-dashed border-white/[0.06] rounded-xl opacity-40">
                        <p className="text-sm text-pearl/30">No social links added yet</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}

            {/* === VIEW: SKILLS === */}
            {activeTab === 'skills' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <SkillsManager />
              </div>
            )}


            {/* === VIEW: PROTOCOLS === */}
            {activeTab === 'protocols' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                    <h3 className="text-pearl font-semibold text-sm tracking-wide">Page Settings</h3>
                    <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-3">
                      <label className="text-xs text-pearl/40 font-medium ml-1">Page Title</label>
                      <input value={identity.protocols.title} onChange={(e) => setIdentity({ ...identity, protocols: { ...identity.protocols, title: e.target.value } })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs text-pearl/40 font-medium ml-1">Version</label>
                      <input value={identity.protocols.version} onChange={(e) => setIdentity({ ...identity, protocols: { ...identity.protocols, version: e.target.value } })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                    </div>
                  </div>
                </section>

                <section>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                      <h3 className="text-pearl font-semibold text-sm tracking-wide shrink-0">Content Sections</h3>
                      <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                    </div>
                    <button onClick={addProtocolSection} className="text-xs bg-cerulean hover:bg-cerulean/90 text-deep-bg px-4 py-2 rounded-lg font-medium flex gap-2 items-center transition-all"><FaPlus /> Add Section</button>
                  </div>

                  <div className="space-y-4">
                    {identity.protocols.sections.map((section, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-cerulean/20 transition-all flex flex-col sm:flex-row gap-6 items-start group">
                        <div className="text-2xl text-slate-600 pt-1 shrink-0"><FaFileContract /></div>
                        <div className="flex-1 space-y-4 w-full">
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Section Title</label>
                            <input value={section.title} onChange={(e) => updateProtocolSection(idx, 'title', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Content</label>
                            <textarea value={section.content} onChange={(e) => updateProtocolSection(idx, 'content', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors h-24 leading-relaxed" />
                          </div>
                        </div>
                        <button onClick={() => removeProtocolSection(idx)} className="text-red-500/50 hover:text-red-400 pt-1 transition-colors self-end sm:self-start"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* === VIEW: PRICING === */}
            {activeTab === 'pricing' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
                <section>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                      <h3 className="text-pearl font-semibold text-sm tracking-wide">Pricing Tiers</h3>
                      <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                    </div>
                    <button onClick={addPricingPlan} className="text-xs bg-cerulean hover:bg-cerulean/90 text-deep-bg px-4 py-2 rounded-lg font-medium flex gap-2 items-center transition-all"><FaPlus /> Add Plan</button>
                  </div>

                  <div className="space-y-8">
                    {identity.pricing.map((plan, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-cerulean/20 transition-all flex gap-6 items-start group">
                        <div className="text-2xl text-slate-600 pt-2"><FaTags /></div>
                        <div className="flex-1 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-[10px] text-pearl/30 block mb-1">Plan Name</label>
                              <input value={plan.name} onChange={(e) => updatePricingPlan(idx, 'name', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] text-pearl/30 block mb-1">Price</label>
                              <input value={plan.price} onChange={(e) => updatePricingPlan(idx, 'price', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                            </div>
                            <div>
                              <label className="text-[10px] text-pearl/30 block mb-1">Level</label>
                              <input value={plan.level} onChange={(e) => updatePricingPlan(idx, 'level', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                            </div>
                          </div>
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Features</label>
                            <div className="space-y-2">
                              {plan.features.map((feature, featureIdx) => (
                                <div key={featureIdx} className="flex items-center gap-2">
                                  <input value={feature} onChange={(e) => updatePricingPlanFeature(idx, featureIdx, e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                                  <button onClick={() => removePricingPlanFeature(idx, featureIdx)} className="text-red-500/50 hover:text-red-400 transition-colors"><FaTrash /></button>
                                </div>
                              ))}
                              <button onClick={() => addPricingPlanFeature(idx)} className="text-xs text-cerulean hover:text-pearl transition-colors">+ Add Feature</button>
                            </div>
                          </div>
                        </div>
                        <button onClick={() => removePricingPlan(idx)} className="text-red-500/50 hover:text-red-400 pt-2 transition-colors"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}


            {/* === VIEW: WORK QUEUE === */}
            {activeTab === 'workQueue' && (
              <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-16 pb-24">
                <section>
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                      <h3 className="text-pearl font-semibold text-sm tracking-wide">Work Queue Items</h3>
                      <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                    </div>
                    <button onClick={addWorkQueueItem} className="text-xs bg-cerulean hover:bg-cerulean/90 text-deep-bg px-4 py-2 rounded-lg font-medium flex gap-2 items-center transition-all"><FaPlus /> Add Item</button>
                  </div>

                  <div className="space-y-4">
                    {identity.workQueue.map((item, idx) => (
                      <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-5 rounded-xl hover:border-cerulean/20 transition-all flex gap-6 items-start group">
                        <div className="text-2xl text-slate-600 pt-2"><FaTasks /></div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">ID</label>
                            <input value={item.id} onChange={(e) => updateWorkQueueItem(idx, 'id', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Project</label>
                            <input value={item.project} onChange={(e) => updateWorkQueueItem(idx, 'project', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Status</label>
                            <input value={item.status} onChange={(e) => updateWorkQueueItem(idx, 'status', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                          </div>
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Progress</label>
                            <input
                              type="number"
                              value={isNaN(item.progress) ? 0 : item.progress}
                              onChange={(e) => {
                                const val = parseInt(e.target.value);
                                updateWorkQueueItem(idx, 'progress', isNaN(val) ? 0 : val);
                              }}
                              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-pearl/30 block mb-1">Type</label>
                            <input value={item.type} onChange={(e) => updateWorkQueueItem(idx, 'type', e.target.value)} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                          </div>
                        </div>
                        <button onClick={() => removeWorkQueueItem(idx)} className="text-red-500/50 hover:text-red-400 pt-2 transition-colors"><FaTrash /></button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}


            {/* === VIEW: PROJECTS === */}
            {activeTab === 'projects' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 rounded-xl h-fit" id="project-form">
                  <div className="flex items-center gap-4 mb-8 text-pearl">
                    <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                    <h2 className="text-pearl font-semibold text-sm tracking-wide flex items-center gap-3">
                      {editProjectId ? <><FaUserEdit className="text-yellow-500" /> Update Project</> : <><FaPlus className="text-cerulean" /> New Project</>}
                    </h2>
                    <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                  </div>

                  {editProjectId && (
                    <div className="mb-4 bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-yellow-200 text-xs flex justify-between items-center">
                      <span>Editing: {formData.title}</span>
                      <button onClick={handleCancelEdit} className="text-pearl hover:text-yellow-500 underline font-medium">Cancel</button>
                    </div>
                  )}

                  <form onSubmit={handleAddProject} className="space-y-5">
                    <div>
                      <label className="text-xs text-pearl/40 font-medium mb-2 block">Title</label>
                      <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" required />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-pearl/40 font-medium mb-2 block">Category</label>
                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl focus:border-cerulean/50 focus:outline-none transition-colors">
                          <option>Web Dev</option><option>Mobile</option><option>Design</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-pearl/40 font-medium mb-2 block">Tech Stack</label>
                        <input value={formData.tech} onChange={e => setFormData({ ...formData, tech: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" placeholder="React, Next" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-pearl/40 font-medium mb-2 block">Client</label>
                        <input value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" placeholder="Client Co." />
                      </div>
                      <div>
                        <label className="text-xs text-pearl/40 font-medium mb-2 block">Timeline</label>
                        <input value={formData.timeline} onChange={e => setFormData({ ...formData, timeline: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" placeholder="Jan - Mar 2024" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-pearl/40 font-medium mb-2 block">Role / Stack Description</label>
                      <input value={formData.roleStack} onChange={e => setFormData({ ...formData, roleStack: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" placeholder="Lead Developer - Full Stack" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-pearl/40 font-medium mb-2 block">Github Link</label>
                        <input value={formData.github} onChange={e => setFormData({ ...formData, github: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="text-xs text-pearl/40 font-medium mb-2 block">Demo Link</label>
                        <input value={formData.demo} onChange={e => setFormData({ ...formData, demo: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-pearl/40 font-medium mb-2 block">Project Images</label>
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
                        className="w-full border border-white/[0.08] border-dashed py-4 hover:bg-cerulean/10 text-cerulean transition-colors flex items-center justify-center gap-2 rounded-lg mb-4"
                      >
                        <FaUpload /> Upload Image
                      </button>

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                          {formData.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-video group border border-white/[0.06] rounded-lg overflow-hidden">
                              <img src={img} className="w-full h-full object-cover" alt="Asset" />
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                className="absolute top-1 right-1 bg-red-500 text-pearl p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <FaTrash size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="text-xs text-pearl/40 font-medium mb-2 block">Description</label>
                      <textarea value={formData.desc} onChange={e => setFormData({ ...formData, desc: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors h-20" />
                    </div>
                    <div>
                      <label className="text-xs text-pearl/40 font-medium mb-2 block">Core Challenge</label>
                      <textarea value={formData.coreChallenge} onChange={e => setFormData({ ...formData, coreChallenge: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors h-20" />
                    </div>
                    <div>
                      <label className="text-xs text-pearl/40 font-medium mb-2 block">Technical Solution</label>
                      <textarea value={formData.technicalSolution} onChange={e => setFormData({ ...formData, technicalSolution: e.target.value })} className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-pearl placeholder-pearl/25 focus:border-cerulean/50 focus:outline-none transition-colors h-20" />
                    </div>
                    <button type="submit" className={`w-full font-semibold py-3 rounded-lg transition-all ${editProjectId ? "bg-yellow-600 hover:bg-yellow-500 text-black" : "bg-cerulean hover:bg-cerulean/90 text-deep-bg"}`}>
                      {editProjectId ? "Update Project" : "Create Project"}
                    </button>
                  </form>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] p-6 sm:p-8 rounded-xl h-[600px] overflow-y-auto">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-1 h-6 bg-cerulean rounded-full"></div>
                    <h2 className="text-pearl font-semibold text-sm tracking-wide flex items-center gap-3">
                      <FaDatabase className="text-cerulean" /> Existing Projects
                    </h2>
                    <div className="h-[1px] flex-1 bg-white/[0.06]"></div>
                  </div>
                  <ul className="space-y-4">
                    {projects.map(p => (
                      <li key={p._id} className="flex justify-between items-center bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl hover:border-cerulean/20 transition-all group">
                        <div className="min-w-0">
                          <div className="font-semibold text-pearl text-base truncate">{p.title}</div>
                          <div className="text-xs text-cerulean mt-1">{p.category}</div>
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
