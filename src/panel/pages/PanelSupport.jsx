import { useMemo } from "react";
import SupportInbox from "../../components/support/SupportInbox";
import { getAdminAccess } from "../../features/auth/token";
import {
  getSupportInbox, getSupportThread, replySupport, editSupportMessage,
  setSupportMode,
} from "../api/panelApi";

// Referral-admin support inbox (EMERALD/TEAL). Scoped by the server to this
// admin's own threads. Can reply and hand a chat to the AI, but cannot reassign
// (super admin only). A WhatsApp button lets them escalate to the super admin.
// panelApi carries the token internally; the socket needs the raw token, read
// from the in-memory holder.
const EMERALD = {
  gradient: "from-emerald-500 to-teal-600",
  activeBg: "bg-emerald-50 dark:bg-emerald-950/40",
  activeBorder: "border-emerald-500 dark:border-emerald-700",
};

export default function PanelSupport() {
  const api = useMemo(
    () => ({
      inbox: () => getSupportInbox(),
      thread: (id) => getSupportThread(id),
      reply: (id, msg) => replySupport(id, msg),
      editMessage: (id, msg) => editSupportMessage(id, msg),
      setMode: (id, mode) => setSupportMode(id, mode),
    }),
    []
  );

  return (
    <SupportInbox
      token={getAdminAccess()}
      accent={EMERALD}
      isSuperView={false}
      api={api}
      showWhatsApp
    />
  );
}
