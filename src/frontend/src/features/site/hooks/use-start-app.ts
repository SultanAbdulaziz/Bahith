import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuth } from "@/providers/auth-provider"

// Sends a visitor to the app, starting a guest session first if they don't have one.
export function useStartApp() {
  const { user, continueAsGuest } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [starting, setStarting] = useState(false)

  const start = async () => {
    if (user) return navigate("/app")
    setStarting(true)
    try {
      await continueAsGuest()
      navigate("/app")
    } catch {
      toast.error(t("common.somethingWrong"))
    } finally {
      setStarting(false)
    }
  }

  return { start, starting }
}
