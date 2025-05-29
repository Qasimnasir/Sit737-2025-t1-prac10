# **Monitoring App Deployment on GKE 10.1P**

## **Project Overview**
This project demonstrates the deployment of a Node.js monitoring application with MongoDB on Google Kubernetes Engine (GKE). The setup includes:
- Containerized Node.js application
- MongoDB with persistent storage
- Kubernetes deployment manifests
- CronJob for database backups

## **Project Structure**
```
SIT737-2025-T1-PRAC10/
│   ├── db-backup-cronjob.yaml    # Database backup job
│   ├── db-pv.yaml                # Persistent Volume
│   ├── db-pvc.yaml               # Persistent Volume Claim
│   ├── db-secret.yaml            # MongoDB credentials
│   ├── db-service.yaml           # MongoDB service
│   ├── db-statefulset.yaml       # MongoDB deployment
│   ├── deployment.yaml           # App deployment
│   |── service.yaml              # App service
├   |── index.js                  # Application entry point
│   ├── package.json              # Node.js dependencies
│   └── package-lock.json
|   |── Dockerfile                # Container configuration
└── README.md                     # This file
```

## **Prerequisites**
- Google Cloud account with billing enabled
- Google Cloud SDK (`gcloud`) installed
- Docker installed
- `kubectl` configured for GKE

## **Deployment Steps**

### **1. Build and Push Docker Image**
```bash
docker build -t gcr.io/sit737-10-p-monitoring/monitoring-app .
docker push gcr.io/sit737-10-p-monitoring/monitoring-app
```

### **2. Deploy MongoDB**
```bash
kubectl apply -f db-secret.yaml
kubectl apply -f db-pv.yaml
kubectl apply -f db-pvc.yaml
kubectl apply -f db-statefulset.yaml
kubectl apply -f db-service.yaml
```

### **3. Deploy Monitoring App**
```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

### **4. Set Up Database Backups (Optional)**
```bash
kubectl apply -f db-backup-cronjob.yaml
```

## **Verification**
Check deployment status:
```bash
kubectl get pods
kubectl get services
```

## **Accessing the Application**
Get the external IP:
```bash
kubectl get service monitoring-app-service
```
Access the app at: `http://<EXTERNAL_IP>`

## **Monitoring and Maintenance**
- View logs: `kubectl logs <pod-name>`
- Check cron jobs: `kubectl get cronjobs`
- Monitor in GCP Console > Kubernetes Engine > Workloads

## **Troubleshooting**
| Issue | Solution |
|-------|----------|
| Pods stuck in ContainerCreating | Check PVC/PV binding |
| No external IP assigned | Wait 1-2 minutes |
| MongoDB connection errors | Verify service name in app config |
