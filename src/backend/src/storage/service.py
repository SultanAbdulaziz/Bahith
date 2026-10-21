import os
import boto3
from types_boto3_s3 import S3Client

BUCKET = os.environ["S3_BUCKET"]

s3: S3Client = boto3.client(
    "s3",
    endpoint_url=os.environ["S3_ENDPOINT_URL"],
    aws_access_key_id=os.environ["S3_ACCESS_KEY"],
    aws_secret_access_key=os.environ["S3_SECRET_KEY"],
    region_name="auto",
)

def upload_url(key: str, content_type: str, size_bytes: int, expires: int = 900) -> str:
    return s3.generate_presigned_url(
        "put_object",
        Params={"Bucket": BUCKET, "Key": key, "ContentType": content_type, "ContentLength": size_bytes},  #R2 cost guard: R2 rejects any other size
        ExpiresIn=expires,
    )


def download_url(key: str, expires: int = 3600) -> str:
    return s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET, "Key": key},
        ExpiresIn=expires,
    )


def delete(key: str) -> None:
    s3.delete_object(Bucket=BUCKET, Key=key)



