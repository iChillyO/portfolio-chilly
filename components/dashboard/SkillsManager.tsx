"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaEye, FaEyeSlash, FaSave, FaSpinner } from "react-icons/fa";
import { SkillCategoryData, SkillItem } from "@/types";

// Available icons for the dropdown selector
const iconOptions = [
  "FaCode", "FaServer", "FaDatabase", "FaMobileAlt", "FaPalette", "FaTools",
  "FaReact", "FaNodeJs", "FaPython", "FaDocker", "FaGitAlt", "FaFigma",
  "FaGlobe", "FaLock", "FaCogs", "FaRocket", "FaTerminal", "FaCloud",
  "FaGamepad", "FaMusic", "FaPen", "FaChartBar", "FaShieldAlt", "FaBolt",
  "FaCube", "FaLayerGroup",
  "SiTypescript", "SiNextdotjs", "SiTailwindcss", "SiMongodb", "SiPostgresql",
  "SiGraphql", "SiFirebase", "SiVercel", "SiAdobephotoshop", "SiBlender",
  "SiDocker", "SiGit", "SiPython", "SiNodedotjs", "SiReact",
];

const colorOptions = [
  "text-cerulean", "text-lilac", "text-gold", "text-pearl", "text-green-400",
  "text-sky-400", "text-blue-400", "text-blue-300", "text-blue-500",
  "text-pink-400", "text-purple-400", "text-orange-400", "text-orange-500",
  "text-amber-400", "text-yellow-400", "text-green-500", "text-cyan-400", "text-red-400",
];

const levelOptions = ["Expert", "Advanced", "Intermediate", "Learning"] as const;

export default function SkillsManager() {
  const [categories, setCategories] = useState<SkillCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null); // Track which category is saving
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Fetch all categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // --- CATEGORY CRUD ---

  const addCategory = async () => {
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Category",
          icon: "FaCode",
          iconColor: "text-cerulean",
          description: "Description...",
          skills: [],
          visible: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories([...categories, data.data]);
        showMessage("Category created", "success");
      }
    } catch (err) {
      showMessage("Failed to create category", "error");
    }
  };

  const saveCategory = async (cat: SkillCategoryData) => {
    setSaving(cat._id || null);
    try {
      const res = await fetch("/api/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.map(c => c._id === cat._id ? data.data : c));
        showMessage(`"${cat.title}" saved`, "success");
      } else {
        showMessage("Save failed", "error");
      }
    } catch (err) {
      showMessage("Save failed", "error");
    } finally {
      setSaving(null);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete this entire category and all its skills?")) return;
    try {
      const res = await fetch(`/api/skills?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setCategories(categories.filter(c => c._id !== id));
        showMessage("Category deleted", "success");
      }
    } catch (err) {
      showMessage("Delete failed", "error");
    }
  };

  const toggleVisibility = (catId: string) => {
    setCategories(categories.map(c =>
      c._id === catId ? { ...c, visible: !c.visible } : c
    ));
  };

  const updateCategory = (catId: string, field: keyof SkillCategoryData, value: any) => {
    setCategories(categories.map(c =>
      c._id === catId ? { ...c, [field]: value } : c
    ));
  };

  const moveCategory = (catId: string, direction: "up" | "down") => {
    const idx = categories.findIndex(c => c._id === catId);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === categories.length - 1) return;

    const newCats = [...categories];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    [newCats[idx], newCats[swapIdx]] = [newCats[swapIdx], newCats[idx]];
    // Update order fields
    newCats.forEach((c, i) => c.order = i);
    setCategories(newCats);
  };

  // --- SKILL ITEM CRUD ---

  const addSkill = (catId: string) => {
    setCategories(categories.map(c =>
      c._id === catId
        ? { ...c, skills: [...c.skills, { name: "New Skill", icon: "FaCode", level: "Intermediate" as const, color: "text-cerulean", order: c.skills.length }] }
        : c
    ));
  };

  const updateSkill = (catId: string, skillIdx: number, field: keyof SkillItem, value: any) => {
    setCategories(categories.map(c => {
      if (c._id !== catId) return c;
      const newSkills = [...c.skills];
      newSkills[skillIdx] = { ...newSkills[skillIdx], [field]: value };
      return { ...c, skills: newSkills };
    }));
  };

  const removeSkill = (catId: string, skillIdx: number) => {
    setCategories(categories.map(c => {
      if (c._id !== catId) return c;
      const newSkills = c.skills.filter((_, i) => i !== skillIdx);
      return { ...c, skills: newSkills };
    }));
  };

  const moveSkill = (catId: string, skillIdx: number, direction: "up" | "down") => {
    setCategories(categories.map(c => {
      if (c._id !== catId) return c;
      const newSkills = [...c.skills];
      if (direction === "up" && skillIdx === 0) return c;
      if (direction === "down" && skillIdx === newSkills.length - 1) return c;
      const swapIdx = direction === "up" ? skillIdx - 1 : skillIdx + 1;
      [newSkills[skillIdx], newSkills[swapIdx]] = [newSkills[swapIdx], newSkills[skillIdx]];
      newSkills.forEach((s, i) => s.order = i);
      return { ...c, skills: newSkills };
    }));
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header + Message */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-cerulean rounded-full" />
          <h3 className="text-pearl font-semibold text-sm">Skill Categories</h3>
          <span className="text-[10px] text-pearl/30 bg-white/[0.04] px-2 py-0.5 rounded-full">{categories.length} categories</span>
        </div>
        <button onClick={addCategory} className="text-xs bg-cerulean hover:bg-cerulean/90 text-white px-4 py-2 rounded-lg font-medium flex gap-2 items-center transition-all">
          <FaPlus size={10} /> Add Category
        </button>
      </div>

      {message && (
        <div className={`px-4 py-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${message.type === "success" ? "bg-green-500/10 border border-green-500/20 text-green-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
          {message.text}
        </div>
      )}

      <p className="text-xs text-pearl/30">
        Manage skill categories shown on the public /skills page. Changes are saved per-category.
      </p>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((cat, catIdx) => (
          <div key={cat._id || catIdx} className={`bg-white/[0.02] border rounded-xl overflow-hidden transition-all ${cat.visible ? "border-white/[0.06]" : "border-red-500/20 opacity-60"}`}>

            {/* Category Header Bar */}
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 border-b border-white/[0.04]">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-3 w-full">
                <div>
                  <label className="text-[9px] text-pearl/30 block mb-1">Title</label>
                  <input
                    value={cat.title}
                    onChange={e => updateCategory(cat._id!, "title", e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-pearl/30 block mb-1">Icon</label>
                  <select
                    value={cat.icon}
                    onChange={e => updateCategory(cat._id!, "icon", e.target.value)}
                    className="input-field text-xs appearance-none"
                  >
                    {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-pearl/30 block mb-1">Icon Color</label>
                  <select
                    value={cat.iconColor}
                    onChange={e => updateCategory(cat._id!, "iconColor", e.target.value)}
                    className="input-field text-xs appearance-none"
                  >
                    {colorOptions.map(c => <option key={c} value={c}>{c.replace("text-", "")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[9px] text-pearl/30 block mb-1">Description</label>
                  <input
                    value={cat.description}
                    onChange={e => updateCategory(cat._id!, "description", e.target.value)}
                    className="input-field text-xs"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => moveCategory(cat._id!, "up")} className="p-1.5 text-pearl/30 hover:text-pearl rounded transition-colors" title="Move up"><FaChevronUp size={10} /></button>
                <button onClick={() => moveCategory(cat._id!, "down")} className="p-1.5 text-pearl/30 hover:text-pearl rounded transition-colors" title="Move down"><FaChevronDown size={10} /></button>
                <button onClick={() => toggleVisibility(cat._id!)} className={`p-1.5 rounded transition-colors ${cat.visible ? "text-green-400 hover:text-green-300" : "text-red-400 hover:text-red-300"}`} title="Toggle visibility">
                  {cat.visible ? <FaEye size={11} /> : <FaEyeSlash size={11} />}
                </button>
                <button onClick={() => saveCategory(cat)} disabled={saving === cat._id} className="p-1.5 text-cerulean hover:text-cerulean/80 rounded transition-colors disabled:opacity-50" title="Save category">
                  {saving === cat._id ? <FaSpinner size={11} className="animate-spin" /> : <FaSave size={11} />}
                </button>
                <button onClick={() => deleteCategory(cat._id!)} className="p-1.5 text-red-500/50 hover:text-red-400 rounded transition-colors" title="Delete category"><FaTrash size={10} /></button>
              </div>
            </div>

            {/* Skills within this category */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-pearl/30 uppercase tracking-widest">Skills ({cat.skills.length})</span>
                <button onClick={() => addSkill(cat._id!)} className="text-[10px] text-cerulean hover:text-cerulean/80 flex items-center gap-1 transition-colors">
                  <FaPlus size={8} /> Add Skill
                </button>
              </div>

              {cat.skills.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/[0.06] rounded-lg">
                  <p className="text-[11px] text-pearl/25">No skills yet. Click "Add Skill" above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cat.skills.map((skill, skillIdx) => (
                    <div key={skill._id || skillIdx} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04] group">
                      {/* Skill fields */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <input
                          value={skill.name}
                          onChange={e => updateSkill(cat._id!, skillIdx, "name", e.target.value)}
                          className="input-field text-[11px] py-1.5 px-2.5"
                          placeholder="Skill name"
                        />
                        <select
                          value={skill.icon}
                          onChange={e => updateSkill(cat._id!, skillIdx, "icon", e.target.value)}
                          className="input-field text-[11px] py-1.5 px-2.5 appearance-none"
                        >
                          {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                        <select
                          value={skill.level}
                          onChange={e => updateSkill(cat._id!, skillIdx, "level", e.target.value)}
                          className="input-field text-[11px] py-1.5 px-2.5 appearance-none"
                        >
                          {levelOptions.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select
                          value={skill.color}
                          onChange={e => updateSkill(cat._id!, skillIdx, "color", e.target.value)}
                          className="input-field text-[11px] py-1.5 px-2.5 appearance-none"
                        >
                          {colorOptions.map(c => <option key={c} value={c}>{c.replace("text-", "")}</option>)}
                        </select>
                      </div>

                      {/* Skill actions */}
                      <div className="flex items-center gap-0.5 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveSkill(cat._id!, skillIdx, "up")} className="p-1 text-pearl/40 hover:text-pearl rounded"><FaChevronUp size={8} /></button>
                        <button onClick={() => moveSkill(cat._id!, skillIdx, "down")} className="p-1 text-pearl/40 hover:text-pearl rounded"><FaChevronDown size={8} /></button>
                        <button onClick={() => removeSkill(cat._id!, skillIdx)} className="p-1 text-red-500/40 hover:text-red-400 rounded"><FaTrash size={8} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/[0.06] rounded-xl">
            <p className="text-sm text-pearl/30 mb-3">No skill categories yet.</p>
            <button onClick={addCategory} className="text-xs bg-cerulean hover:bg-cerulean/90 text-white px-4 py-2 rounded-lg font-medium">
              Create First Category
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
