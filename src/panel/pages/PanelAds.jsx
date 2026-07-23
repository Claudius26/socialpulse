import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Megaphone, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import { getAds, createAd, deleteAd, uploadAdImage } from "../../admin/api/adminApi";

const EMPTY = {
  kind: "promo", title: "", caption: "", image_url: "",
  cta_label: "", cta_url: "", priority: 0, active: true,
};

const input =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0d1c17] px-3 py-2 text-sm text-slate-900 dark:text-slate-100";

export default function PanelAds() {
  const token = useSelector(selectAdminToken);
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setAds(await getAds(token));
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (token) load(); /* eslint-disable-next-line */ }, [token]);

  const set = (k) => (e) =>
    setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image too large (max 5MB).");
    setUploading(true);
    try {
      const { url } = await uploadAdImage(token, file);
      setForm((f) => ({ ...f, image_url: url, kind: "image" }));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Give your ad a title.");
    setSaving(true);
    try {
      await createAd(token, form);
      toast.success("Ad posted — every user will see it.");
      setForm(EMPTY);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this ad?")) return;
    try {
      await deleteAd(token, id);
      load();
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Megaphone className="text-emerald-600 dark:text-emerald-400" /> Post Ads
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Announce a new service or promo. Ads show to <strong>every user</strong> on the platform —
          not just the ones you referred.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create */}
        <form onSubmit={submit} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1c17] p-5 space-y-3">
          <h2 className="font-bold text-slate-900 dark:text-white">New ad</h2>
          <input className={input} placeholder="Title" value={form.title} onChange={set("title")} />
          <textarea className={input} rows={3} placeholder="Caption / message" value={form.caption} onChange={set("caption")} />
          <div className="grid grid-cols-2 gap-3">
            <input className={input} placeholder="Button label (optional)" value={form.cta_label} onChange={set("cta_label")} />
            <input className={input} placeholder="Button link (optional)" value={form.cta_url} onChange={set("cta_url")} />
          </div>
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400 cursor-pointer">
              <Upload size={16} /> {uploading ? "Uploading…" : "Add image"}
              <input type="file" accept="image/*" className="hidden" onChange={pickImage} disabled={uploading} />
            </label>
            {form.image_url && <img src={form.image_url} alt="" className="h-10 rounded-lg" />}
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input type="checkbox" checked={form.active} onChange={set("active")} /> Active
          </label>
          <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-50">
            <Plus size={16} /> {saving ? "Posting…" : "Post ad"}
          </button>
        </form>

        {/* Existing */}
        <div>
          <h2 className="font-bold text-slate-900 dark:text-white mb-3">Live ads</h2>
          {loading ? (
            <p className="text-slate-500 dark:text-slate-300">Loading…</p>
          ) : ads.length === 0 ? (
            <p className="text-slate-400 text-sm">No ads yet.</p>
          ) : (
            <div className="space-y-3">
              {ads.map((ad) => (
                <div key={ad.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1c17] p-4 flex items-start gap-3">
                  {ad.image_url && <img src={ad.image_url} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />}
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">{ad.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{ad.caption}</p>
                    <span className={`inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ad.active ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400" : "bg-slate-200 dark:bg-slate-800 text-slate-500"}`}>
                      {ad.active ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                  <button onClick={() => remove(ad.id)} className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
