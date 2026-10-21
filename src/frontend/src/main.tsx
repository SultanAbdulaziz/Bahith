import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./i18n"
import "./index.css"
import App from "./App"
import ClickSpark from "@/components/ClickSpark"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AuthProvider } from "@/providers/auth-provider"
import { LanguageProvider } from "@/providers/language-provider"
import { ThemeProvider } from "@/providers/theme-provider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <AuthProvider>
            <ClickSpark
              sparkColor={["#f5c542", "#0a0a0a"]}
              sparkSize={10}
              sparkRadius={22}
              sparkCount={8}
              duration={450}
              // Only buttons and links spark, not empty space.
              selector='button, a, [role="button"], label'
            >
              <App />
            </ClickSpark>
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>,
)
