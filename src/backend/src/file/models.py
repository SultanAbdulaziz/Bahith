from pydantic import BaseModel, Field

class uploadRequest(BaseModel):
    content_type: str
    size_bytes: int = Field(gt=0)  #R2 cost guard