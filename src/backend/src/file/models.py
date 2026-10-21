from pydantic import BaseModel

class uploadRequest(BaseModel):
    content_type: str