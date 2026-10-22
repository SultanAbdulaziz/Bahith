import resend
import os


# todo
resend.api_key = os.environ.get("RESEND_API_KEY", "")

r = resend.Emails.send({
  "from": "",
  "to": "",
  "subject": "",
  "html": "<p></p>"
})
