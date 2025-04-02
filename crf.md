## main.py

```python
import functions_framework
from google.cloud import documentai, firestore, storage
from google.cloud.documentai_v1 import DocumentProcessorServiceClient, ProcessRequest, GcsDocument
import json

PROJECT_ID = "model-magnet-453318-g1"
PROCESSOR_ID = "496bf1dbab544828"
BUCKET_NAME = "exam-upload"
LOCATION = "us"

@functions_framework.cloud_event
def process_pdf(cloud_event):
    """Triggered when a PDF is uploaded to Cloud Storage."""
    data = cloud_event.data

    file_name = data["name"]
    bucket_name = data["bucket"]

    if not file_name.endswith(".pdf"):
        print(f"Skipping non-PDF file: {file_name}")
        return

    # Get file metadata from GCS
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.get_blob(file_name)
    metadata = blob.metadata or {}

    # Extract text from PDF
    text = extract_text_from_pdf(bucket_name, file_name)
    
    # Store text and metadata in Firestore
    store_in_firestore(file_name, text, metadata)

def extract_text_from_pdf(bucket_name, file_name):
    """Extract text using Document AI OCR."""
    client = DocumentProcessorServiceClient()
    gcs_input_uri = f"gs://{bucket_name}/{file_name}"
    gcs_document = GcsDocument(gcs_uri=gcs_input_uri, mime_type="application/pdf")

    name = f"projects/{PROJECT_ID}/locations/{LOCATION}/processors/{PROCESSOR_ID}"
    request = ProcessRequest(
        name=name, 
        raw_document=None, 
        gcs_document=gcs_document, 
        skip_human_review=True
    )

    result = client.process_document(request=request)
    return result.document.text

def store_in_firestore(file_name, text, metadata):
    """Store extracted text and metadata in Firestore."""
    db = firestore.Client()
    doc_ref = db.collection("Question_papers").document(file_name)
    
    document_data = {
        "file_name": file_name,
        "extracted_text": text,
        "class": metadata.get("class", ""),
        "subject": metadata.get("subject", ""),
        "chapters": metadata.get("chapters", []),
        "start_date": metadata.get("start_date", ""),
        "end_date": metadata.get("end_date", "")
    }
    
    doc_ref.set(document_data)
    print(f"✅ Stored document data for {file_name}")
```

## requirements.txt

```txt
functions-framework==3.*
google-cloud-functions
google-cloud-storage
google-cloud-firestore
google-cloud-documentai
```