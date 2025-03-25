### Note 
The links attached redirect to the **Strangers** GCP account and can only be accessed via it's G-account.

## GCP services used until now
- Cloud Storage
- Firestore 
- Cloud Run function
- EventArc Trigger
- Document AI (OCR processor)

### Cloud Storage

Two buckets (both in ***asia-south1***):
- [exam-upload](https://console.cloud.google.com/storage/browser/exam-upload;tab=objects?forceOnBucketsSortingFiltering=true&project=model-magnet-453318-g1&prefix=&forceOnObjectsSortingFiltering=false) (has the question papers)
- [pragati study material](https://console.cloud.google.com/storage/browser/pragati-study-material;tab=objects?forceOnBucketsSortingFiltering=true&project=model-magnet-453318-g1&prefix=&forceOnObjectsSortingFiltering=false) (has the course contents)

### Firestore 

Has the DB named [**(default)**](https://console.cloud.google.com/firestore/databases/-default-/data/panel?project=model-magnet-453318-g1) that stores the ***Question_Papers*** Collection which has the extracted text from the uploaded pdfs.

### Cloud Run Function

Has a trigger and a service that sends the uploaded pdfs from the cloud strorage to the (default) db in the firestore where text is extracted from them.

Region: ***us-central1***

Service Name: [gcs-to-docai](https://console.cloud.google.com/run/detail/us-central1/gcs-to-docai)

Source Code: [Click to View](https://console.cloud.google.com/run/detail/us-central1/gcs-to-docai/source?project=model-magnet-453318-g1)

Trigger: <br/>
- Name: ***[file-upload-trigger](https://console.cloud.google.com/eventarc/triggers/asia-south1/file-upload-trigger?hl=en&project=model-magnet-453318-g1)***
- Region: ***asia-south1***


### Document AI Processor

Location: ***us***

Processor name: [exam-ocr-processor](https://console.cloud.google.com/ai/document-ai/locations/us/processors/496bf1dbab544828/details?hl=en&project=model-magnet-453318-g1)


