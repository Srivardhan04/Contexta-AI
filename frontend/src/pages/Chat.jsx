import { useContext } from "react";
import UploadPanel from "../components/UploadPanel";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  return (
    <div className="glass-container">
      <UploadPanel />
      <ChatWindow />
    </div>
  );
}
