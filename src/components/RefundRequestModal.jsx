import { useEffect, useRef, useState } from "react";
import { X, UploadCloud, Trash2, Loader2, ImageIcon, Video, CheckCircle2, AlertCircle } from "lucide-react";
import { uploadToCloudinary } from "../lib/cloudinary";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_BASE || "http://localhost:8000";
const MAX_IMAGE = 5 * 1024 * 1024; // 5 MB
const MAX_VIDEO = 25 * 1024 * 1024; // 25 MB
const MAX_IMAGES = 4;
const MIN_IMAGES = 2;

let uid = 0;

/**
 * Refund request form. Uploads 2–4 image proofs (required) plus an optional
 * short video to Cloudinary, then POSTs the collected proof URLs to the backend.
 *
 * Props: item (the purchased number), token, onClose(), onSubmitted(request).
 */
export default function RefundRequestModal({ item, token, onClose, onSubmitted }) {
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]); // {id, kind, name, preview, status, proof, error}
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  // Revoke object URLs on unmount.
  useEffect(() => () => files.forEach((f) => f.preview && URL.revokeObjectURL(f.preview)), [files]);

  const images = files.filter((f) => f.kind === "image");
  const videos = files.filter((f) => f.kind === "video");
  const uploadedImages = images.filter((f) => f.status === "done");
  const anyUploading = files.some((f) => f.status === "uploading");

  const startUpload = async (entry, file) => {
    try {
      const proof = await uploadToCloudinary(file);
      setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, status: "done", proof } : f)));
    } catch (err) {
      setFiles((prev) => prev.map((f) => (f.id === entry.id ? { ...f, status: "error", error: err.message } : f)));
    }
  };

  const onPick = (e) => {
    setFormError("");
    const picked = Array.from(e.target.files || []);
    e.target.value = ""; // allow re-picking the same file

    let imgCount = images.length;
    let vidCount = videos.length;

    for (const file of picked) {
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) {
        setFormError("Only images and video files are allowed.");
        continue;
      }
      if (isImage) {
        if (imgCount >= MAX_IMAGES) { setFormError(`You can attach at most ${MAX_IMAGES} images.`); continue; }
        if (file.size > MAX_IMAGE) { setFormError("Each image must be 5MB or smaller."); continue; }
        imgCount += 1;
      } else {
        if (vidCount >= 1) { setFormError("You can attach only 1 video."); continue; }
        if (file.size > MAX_VIDEO) { setFormError("The video must be 25MB or smaller."); continue; }
        vidCount += 1;
      }
      const entry = {
        id: ++uid,
        kind: isVideo ? "video" : "image",
        name: file.name,
        preview: URL.createObjectURL(file),
        status: "uploading",
        proof: null,
        error: "",
      };
      setFiles((prev) => [...prev, entry]);
      startUpload(entry, file);
    }
  };

  const removeFile = (id) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.preview) URL.revokeObjectURL(target.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  const canSubmit = description.trim() && uploadedImages.length >= MIN_IMAGES && !anyUploading && !submitting;

  const submit = async () => {
    setFormError("");
    if (!description.trim()) { setFormError("Please describe what went wrong."); return; }
    if (uploadedImages.length < MIN_IMAGES) { setFormError(`Please upload at least ${MIN_IMAGES} images as proof.`); return; }
    if (anyUploading) { setFormError("Please wait for uploads to finish."); return; }

    const proofs = files.filter((f) => f.status === "done" && f.proof).map((f) => f.proof);

    setSubmitting(true);
    try {
      const res = await fetch(`${BACKEND_BASE}/api/refund-requests/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ number_id: item.id, description: description.trim(), proofs }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.detail || data?.error || "Could not submit your request. Please check your input and try again.");
      setDone(true);
      onSubmitted?.(data);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request a refund</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">{item.phone_number}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="py-8 text-center">
            <CheckCircle2 size={48} className="mx-auto text-emerald-500" />
            <p className="mt-3 font-semibold text-slate-900 dark:text-white">Request submitted</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              An admin will review your proof. You'll see the status here.
            </p>
            <button onClick={onClose} className="btn btn-md btn-primary mt-5">Done</button>
          </div>
        ) : (
          <>
            <div className="mt-4">
              <label className="label">What went wrong?</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the issue with this number…"
                className="input resize-none"
              />
            </div>

            <div className="mt-4">
              <label className="label">Proof — 2 to 4 images (required){videos.length ? "" : " + 1 optional video"}</label>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-500 py-6 flex flex-col items-center gap-1 text-slate-500 dark:text-slate-400 transition"
              >
                <UploadCloud size={26} />
                <span className="text-sm font-medium">Click to add screenshots or a short video</span>
                <span className="text-xs">Images ≤ 5MB · Video ≤ 25MB</span>
              </button>
              <input ref={inputRef} type="file" accept="image/*,video/*" multiple hidden onChange={onPick} />

              {files.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {files.map((f) => (
                    <div key={f.id} className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 aspect-square">
                      {f.kind === "image" ? (
                        <img src={f.preview} alt={f.name} className="w-full h-full object-cover" />
                      ) : (
                        <video src={f.preview} className="w-full h-full object-cover" muted />
                      )}

                      <div className="absolute top-1 left-1 rounded bg-black/50 text-white p-0.5">
                        {f.kind === "image" ? <ImageIcon size={12} /> : <Video size={12} />}
                      </div>

                      {f.status === "uploading" && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                          <Loader2 size={20} className="animate-spin" />
                        </div>
                      )}
                      {f.status === "error" && (
                        <div className="absolute inset-0 bg-rose-900/70 flex flex-col items-center justify-center text-white text-center px-1">
                          <AlertCircle size={18} />
                          <span className="text-[10px] mt-0.5 leading-tight">Upload failed</span>
                        </div>
                      )}
                      {f.status === "done" && (
                        <div className="absolute bottom-1 left-1 rounded-full bg-emerald-500 text-white p-0.5">
                          <CheckCircle2 size={12} />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeFile(f.id)}
                        aria-label="Remove"
                        className="absolute top-1 right-1 rounded-full bg-black/60 hover:bg-black/80 text-white p-1"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-2 text-xs text-slate-400">
                {uploadedImages.length}/{MAX_IMAGES} images uploaded
                {videos.length ? ` · 1 video` : ""}
                {uploadedImages.length < MIN_IMAGES ? ` — at least ${MIN_IMAGES} images required` : ""}
              </p>
            </div>

            {formError && <p className="mt-3 text-sm text-rose-600">{formError}</p>}

            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={onClose} className="btn btn-md btn-ghost">Cancel</button>
              <button type="button" onClick={submit} disabled={!canSubmit} className="btn btn-md btn-primary">
                {submitting ? "Submitting…" : "Submit request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
