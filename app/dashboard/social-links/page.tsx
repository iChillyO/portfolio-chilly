"use client";
import { useState, useEffect } from "react";
import { FaPlus, FaTrash, FaSave, FaSpinner, FaExternalLinkAlt, FaDiscord, FaTwitter, FaInstagram, FaGoogle, FaLinkedin, FaGithub, FaYoutube, FaTwitch } from "react-icons/fa";

const getIcon = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("discord")) return <FaDiscord />;
  if (p.includes("twitter") || p.includes("x")) return <FaTwitter />;
  if (p.includes("instagram")) return <FaInstagram />;
  if (p.includes("google") || p.includes("mail")) return <FaGoogle />;
  if (p.includes("linkedin")) return <FaLinkedin />;
  if (p.includes("github")) return <FaGithub />;
  if (p.includes("youtube")) return <FaYoutube />;
  if (p.includes("twitch")) return <FaTwitch />;
  return <FaExternalLinkAlt />;
};

export default function SocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) setSocialLinks(data.data.socialLinks || []);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const showMsg = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ socialLinks })
      });
      const data = await res.json();
      if (data.success) showMsg("Links saved successfully", "success");
      else showMsg("Failed to save", "error");
    } catch {
      showMsg("Error saving", "error");
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => setSocialLinks([...socialLinks, { platform: "New Platform", url: "https://" }]);
  const removeLink = (index: number) => setSocialLinks(socialLinks.filter((_, i) => i !== index));
  const updateLink = (index: number, field: "platform" | "url", value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setSocialLinks(newLinks);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-10 h-10 border-2 border-cerulean/30 border-t-cerulean rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-deep-bg font-sans text-pearl p-6 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 pb-6 border-b border-white/[0.04] gap-4">
          <div>
            <h1 className="text-xl font-bold text-pearl mb-1">Social Links</h1>
            <p className="text-[11px] text-pearl/30">Manage your public social media connections</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-cerulean hover:bg-cerulean/90 disabled:bg-cerulean/50 text-deep-bg text-xs font-medium rounded-lg transition-all shadow-sm shadow-cerulean/20"
          >
            {saving ? <FaSpinner className="animate-spin" size={11} /> : <FaSave size={11} />}
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 px-3.5 py-2 rounded-lg text-[11px] font-medium flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${message.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
            {message.text}
          </div>
        )}

        {/* List */}
        <div className="space-y-3">
          {socialLinks.map((link, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/[0.06] p-4 rounded-xl hover:border-cerulean/20 transition-all flex flex-col md:flex-row gap-4 items-start md:items-center group">
              <div className={`text-lg w-10 h-10 flex items-center justify-center bg-white/[0.04] rounded-lg border border-white/[0.05] shrink-0 ${link.url ? "text-cerulean" : "text-pearl/20"}`}>
                {getIcon(link.platform)}
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                <div>
                  <label className="text-[10px] text-pearl/30 block mb-1">Platform Name</label>
                  <input
                    value={link.platform}
                    onChange={(e) => updateLink(idx, 'platform', e.target.value)}
                    className="input-field"
                    placeholder="e.g. Twitter"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-pearl/30 block mb-1">URL</label>
                  <input
                    value={link.url}
                    onChange={(e) => updateLink(idx, 'url', e.target.value)}
                    className="input-field"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button
                onClick={() => removeLink(idx)}
                className="text-red-500/50 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}

          {socialLinks.length === 0 && (
            <div className="text-center py-12 border border-dashed border-white/[0.06] rounded-xl">
              <p className="text-sm text-pearl/30">No social links added yet</p>
            </div>
          )}

          <button
            onClick={addLink}
            className="w-full py-3 mt-4 border border-dashed border-white/[0.08] hover:border-cerulean/40 text-pearl/40 hover:text-cerulean hover:bg-cerulean/5 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-2"
          >
            <FaPlus size={10} /> Add New Link
          </button>
        </div>
      </div>
    </main>
  );
}
