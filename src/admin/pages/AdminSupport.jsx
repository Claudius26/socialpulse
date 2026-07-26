import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectAdminToken } from "../../features/auth/adminAuth/adminAuthSlice";
import SupportInbox from "../../components/support/SupportInbox";
import {
  getSupportInbox, getSupportThread, replySupport, editSupportMessage,
  setSupportMode, assignSupport, getAdmins,
} from "../api/adminApi";

// Super-admin support inbox (INDIGO). Sees every thread; can reply to the ones
// it handles, hand a chat to the AI, or reassign to a referral admin. Threads it
// doesn't handle render read-only. All API calls carry the admin access token.
const INDIGO = {
  gradient: "from-brand-600 to-violet-600",
  activeBg: "bg-brand-50 dark:bg-brand-950/40",
  activeBorder: "border-brand-500 dark:border-brand-700",
};

export default function AdminSupport() {
  const token = useSelector(selectAdminToken);

  const api = useMemo(
    () => ({
      inbox: () => getSupportInbox(token),
      thread: (id) => getSupportThread(token, id),
      reply: (id, msg) => replySupport(token, id, msg),
      editMessage: (id, msg) => editSupportMessage(token, id, msg),
      setMode: (id, mode) => setSupportMode(token, id, mode),
      assign: (id, adminId) => assignSupport(token, id, adminId),
      listAdmins: () => getAdmins(token),
    }),
    [token]
  );

  return (
    <SupportInbox
      token={token}
      accent={INDIGO}
      isSuperView
      api={api}
      showWhatsApp={false}
    />
  );
}
