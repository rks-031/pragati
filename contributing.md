## To run the frontend

1. clone the repo
2. install dependencies
```shell
npm install
```
3. run the following
```bash
npm run dev
```
## To run the backend
```bash
cd backend
python -m venv venv
```   
```bash
venv\Scripts\activate
```
```bash
pip install -r requirements.txt
python run.py

```

## AWS SNS configuration

- Create a new IAM user in the ***ap-south-1*** region.
- Attach ***AmazonSNSFullAccess*** policy to it and create the user.
- Once the user is created, create access key (Access Key and Secret Key will be generated).

## Fetching latest code from repo keeping local uncommitted changes

```bash
git stash
git pull
git stash pop
```
