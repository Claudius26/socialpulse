import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAds, createAd, updateAd, deleteAd } from "../api/adminApi";
import { Trash2, Plus, Eye, Megaphone } from "lucide-react";

const EMPTY = {
  kind: "promo", title: "", caption: "", youtube_url: "", image_url: "",
  cta_label: "", cta_url: "", must_watch: false, countdown_seconds: 5,
  priority: 0, active: true,
};

const inputCls =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100";

export default function AdminAds() {
  const token = useSelector(selectAdminToken);
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setAds(await getAds(token));
    } catch (e) {
      setError(e.message || "Failed to load ads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim()) return setError("Title is required.");
    if (form.kind === "youtube" && !form.youtube_url.trim()) return setError("YouTube URL is required.");
    if (form.kind === "image" && !form.image_url.trim()) return setError("Image URL is required.");
    setSaving(true);
    try {
      await createAd(token, {
        ...form,
        countdown_seconds: Number(form.countdown_seconds) || 5,
        priority: Number(form.priority) || 0,
      });
      setForm(EMPTY);
      await load();
    } catch (e) {
      setError(e.message || "Failed to create ad");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (ad) => {
    try {
      await updateAd(token, ad.id, { active: !ad.active });
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (ad) => {
    if (!window.confirm("Delete this ad? Users who haven't seen it won't anymore.")) return;
    try {
      await deleteAd(token, ad.id);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <span className="grid place-items-center w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400">
          <Megaphone size={20} />
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Ads</h1>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
        Post announcements users see right after login — a YouTube video, an image, or an
        upcoming-service promo. "Must watch" locks the close button for a few seconds.
      </p>

      {error && <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-sm">{error}</div>}

      {/* Create form */}
      <form onSubmit={submit} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 mb-8 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-slate-500">Type</label>
          <select value={form.kind} onChange={set("kind")} className={inputCls}>
            <option value="promo">Service / promo</option>
            <option value="youtube">YouTube video</option>
            <option value="image">Image</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500">Priority (lower shows first)</label>
          <input type="number" value={form.priority} onChange={set("priority")} className={inputCls} />
        </div>

        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500">Title</label>
          <input value={form.title} onChange={set("title")} placeholder="e.g. VPN & Proxies — coming soon" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-500">Caption / description</label>
          <textarea rows={2} value={form.caption} onChange={set("caption")} className={inputCls} />
        </div>

        {form.kind === "youtube" && (
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500">YouTube URL</label>
            <input value={form.youtube_url} onChange={set("youtube_url")} placeholder="https://youtube.com/watch?v=…" className={inputCls} />
          </div>
        )}
        {(form.kind === "image" || form.kind === "promo") && (
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-500">Image URL {form.kind === "promo" && "(optional)"}</label>
            <input value={form.image_url} onChange={set("image_url")} placeholder="https://…/banner.png" className={inputCls} />
          </div>
        )}
        {form.kind !== "youtube" && (
          <>
            <div>
              <label className="text-xs font-semibold text-slate-500">Button label (optional)</label>
              <input value={form.cta_label} onChange={set("cta_label")} placeholder="Learn more" className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Button link (optional)</label>
              <input value={form.cta_url} onChange={set("cta_url")} placeholder="/deposits or https://…" className={inputCls} />
            </div>
          </>
        )}

        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.must_watch} onChange={set("must_watch")} className="w-4 h-4" />
          Must watch (lock close button)
        </label>
        {form.must_watch && (
          <div>
            <label className="text-xs font-semibold text-slate-500">Countdown (seconds)</label>
            <input type="number" min={1} value={form.countdown_seconds} onChange={set("countdown_seconds")} className={inputCls} />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
          <input type="checkbox" checked={form.active} onChange={set("active")} className="w-4 h-4" />
          Active
        </label>

        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 text-white font-semibold px-4 py-2.5 hover:bg-brand-500 disabled:opacity-50">
            <Plus size={18} /> {saving ? "Posting…" : "Post ad"}
          </button>
        </div>
      </form>

      {/* List */}
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Posted ads</h2>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : ads.length === 0 ? (
        <p className="text-slate-400 text-sm">No ads yet.</p>
      ) : (
        <div className="space-y-3">
          {ads.map((ad) => (
            <div key={ad.id} className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">{ad.kind}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-white truncate">{ad.title}</p>
                <p className="text-xs text-slate-500 truncate">
                  {ad.must_watch && `Must-watch ${ad.countdown_seconds}s · `}priority {ad.priority}
                  <span className="inline-flex items-center gap-1 ml-2"><Eye size={12} /> {ad.views_count}</span>
                </p>
              </div>
              <button onClick={() => toggle(ad)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg ${ad.active ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                {ad.active ? "Active" : "Inactive"}
              </button>
              <button onClick={() => remove(ad)} className="text-rose-500 hover:text-rose-600 p-2" title="Delete">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
