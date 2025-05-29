# **10.1P:Cloud Native Monitoring & Visibility**

## **Project Overview**
This project demonstrates the deployment of a **Node.js + MongoDB** cloud-native application on **Google Kubernetes Engine (GKE)** with monitoring using **GCP Stackdriver**.  

### **Key Features**
✅ **Containerized Node.js App** (Docker + Kubernetes)  
✅ **MongoDB StatefulSet** with Persistent Storage  
✅ **GKE Cluster** with Auto-Scaling & Load Balancing  
✅ **Stackdriver Logging & Monitoring**  
✅ **Health Checks (Liveness/Readiness Probes)**  

---

## **Prerequisites**
1. **Google Cloud Account** with billing enabled.
2. **Tools Installed**:
   - `gcloud` CLI ([Install Guide](https://cloud.google.com/sdk/docs/install))
   - `kubectl` ([Install Guide](https://kubernetes.io/docs/tasks/tools/))
   - `docker` ([Install Guide](https://docs.docker.com/get-docker/))
   - `node.js` (v16+)
   - VS Code (Recommended)

---

## **Setup Instructions**
### **1. Clone the Repository**
```bash
git clone <your-repo-url>
cd sit737-10.1P
```

### **2. Build & Push Docker Image**
```bash
docker build -t gcr.io/YOUR-PROJECT-ID/monitoring-app .
docker push gcr.io/YOUR-PROJECT-ID/monitoring-app
```

### **3. Deploy to GKE**
```bash
# Create GKE cluster
gcloud container clusters create monitoring-cluster \
  --zone australia-southeast1-a \
  --num-nodes=2 \
  --machine-type=e2-medium \
  --logging=SYSTEM \
  --monitoring=SYSTEM

# Apply Kubernetes manifests
kubectl apply -f k8s/mongo-secret.yaml
kubectl apply -f k8s/mongo-pv-pvc.yaml
kubectl apply -f k8s/mongo-statefulset.yaml
kubectl apply -f k8s/app-deployment.yaml
kubectl apply -f k8s/app-service.yaml
```

### **4. Verify Deployment**
```bash
# Check running pods
kubectl get pods -o wide

# Get LoadBalancer IP
kubectl get service monitoring-app-service

# Test the app
curl http://<EXTERNAL_IP>
curl http://<EXTERNAL_IP>/health
```

---

## **Monitoring & Logging**
### **1. View Logs**
```bash
# Application logs
kubectl logs -l app=monitoring-app --tail=20

# MongoDB logs
kubectl logs mongo-0
```

### **2. Access Stackdriver**
- Open [GCP Logging Console](https://console.cloud.google.com/logs)  
- Filter by:  
  `resource.type="k8s_container"`  
  `resource.labels.cluster_name="monitoring-cluster"`  

### **3. Check Metrics**
- Navigate to:  
  **GCP Console > Monitoring > Dashboards**  

---

## **MongoDB Operations**
### **1. Connect to MongoDB**
```bash
kubectl exec -it mongo-0 -- mongosh --username Nouman --password Pakistan123 --authenticationDatabase admin
```

### **2. Run Queries**
```javascript
use sit323db
db.items.insertOne({name: "test", value: 123})
db.items.find()
db.stats()
```

---

## **Troubleshooting**
| **Issue** | **Solution** |
|-----------|-------------|
| `PVC stuck in "Pending"` | Check `kubectl describe pvc mongo-pvc` |
| `ImagePullBackOff` | Verify `docker push` and GCR permissions |
| `MongoDB connection failed` | Check secrets (`kubectl describe secret mongo-secret`) |

---