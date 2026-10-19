import resend
import os

resend.api_key = os.environ.get("RESEND_API_KEY")

r = resend.Emails.send({
  "from": "",
  "to": "",
  "subject": "",
  "html": "<p></p>"
})
