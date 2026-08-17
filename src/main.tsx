import { createRoot } from "react-dom/client";
import { applyA11yPrefs, readA11yPrefs } from "@/lib/accessibilityPrefs";
import App from "./App.tsx";
import "./index.css";

applyA11yPrefs(readA11yPrefs());

createRoot(document.getElementById("root")!).render(<App />);
