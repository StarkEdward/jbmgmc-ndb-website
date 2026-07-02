# 🚀 Zero to Live: AWS ECS Fargate + EFS + GitHub Actions Complete SOP

Ye document ekdam **"Zero to Live"** (From Scratch) guide hai. Isme hum ECR banane se lekar EFS, Load Balancer, aur aakhir me ECS Fargate tak ka sab kuch cover karenge. Is SOP ko step-by-step follow karein, aapse koi galti nahi hogi.

**Pre-requisite:** Aapke paas AWS Account aur GitHub me aapka project repository hona chahiye.

---

## Step 1: ECR (Elastic Container Registry) Banayein (Aapka Godown)
Yahan GitHub Actions naye Docker images push karega.
1. AWS Console me **ECR** search karein aur "Elastic Container Registry" par click karein.
2. **Create repository** par click karein.
3. Visibility settings: **Private**
4. Repository name: `jbmgmc-nandurbar-app`
5. Niche scroll karke **Create repository** dabayein.
6. Banane ke baad uski **URI** copy karke save kar lein *(e.g. `123456789.dkr.ecr.ap-south-1.amazonaws.com/jbmgmc-nandurbar-app`)*. Ye Step 5 me kaam aayegi.

---

## Step 2: GitHub Actions Setup Karein (Automatic Deployment)
1. Apne GitHub repository me jayein -> **Settings** -> **Secrets and variables** -> **Actions**.
2. **New repository secret** par click karein aur ye 3 secrets add karein (Aapke AWS IAM user ki keys):
   - `AWS_ACCESS_KEY_ID`: (Aapki IAM access key yahan dalein)
   - `AWS_SECRET_ACCESS_KEY`: (Aapki IAM secret key yahan dalein)
   - `AWS_REGION`: `ap-south-1` (Ya jo bhi aapka Mumbai/other region ho)
3. Code me `.github/workflows/aws-deploy.yml` pehle se hai. Ab jab bhi aap code me changes karke `main` branch me push karenge, code automatically AWS ECR me pohoch jayega!

---

## Step 3: Security Groups Banayein (Networking Rules)
Security Groups aapke AWS system ke "Guard" hote hain. Hum 3 Security Groups banayenge taaki sabhi resources aapas me baat kar sakein. 
AWS Console me **EC2** search karein -> Left menu me **Security Groups** par jayein -> **Create security group**.

1. **Pehla Guard (Load Balancer ke liye):**
   - Name: `ALB-SG`, Description: `For Load Balancer`
   - Inbound rules -> Add rule -> Type: **HTTP**, Source: **Anywhere-IPv4**.
   - Create karein.
2. **Dusra Guard (ECS Website Server ke liye):**
   - Name: `ECS-SG`, Description: `For Fargate Task`
   - Inbound rules -> Add rule -> Type: **Custom TCP**, Port: **3000**, Source: **Anywhere-IPv4**.
   - Create karein.
3. **Teesra Guard (EFS Hard Drive ke liye):**
   - Name: `EFS-SG`, Description: `For EFS Storage`
   - Inbound rules -> Add rule -> Type: **NFS**, Port: **2049**, Source: **Anywhere-IPv4**.
   - Create karein.

---

## Step 4: EFS (Permanent Hard Drive) aur Access Point Banayein
Kyunki Docker image ek non-root user (`nextjs`, ID: 1001) par chalti hai, isliye **Access Point** bohot zaroori hai. Iske bina file read/write permissions nahi milengi.
1. AWS Console me **EFS** search karein -> **Create file system** (Customize par click karein).
2. Name: `jbmgmc-efs-storage`, VPC: Default chunein.
3. **Network step me:** Sabhi Subnets ke aage jo default security group laga hai usko hatayein aur apna naya **`EFS-SG`** select karein. Next karke Create kar dein.
4. Ab is naye EFS file system par click karein.
5. Upar **Access Points** tab me jayein aur **Create access point** par click karein:
   - Name: `nextjs-app-data`
   - Root directory path: `/app/data`
   - **POSIX user**: User ID `1001`, Group ID `1001`
   - **Root directory creation permissions**: Owner user ID `1001`, Owner group ID `1001`, POSIX permissions `0755`.
6. **Create** dabayein aur iska ID (`fsap-0x...`) note kar lein.

---

## Step 5: Load Balancer (ALB) Banayein
Load balancer website ka fixed link dega.
1. AWS Console me **EC2** search karein. Left menu me niche **Load Balancers** par jayein.
2. **Create Load Balancer** -> **Application Load Balancer (ALB)**.
   - Name: `jbmgmc-alb`
   - Scheme: **Internet-facing**
   - Network mapping: Apna VPC chunein, aur kam se kam **2 Availability Zones** tick karein.
3. **Security groups**: Yahan apna banaya hua **`ALB-SG`** select karein.
4. **Listeners and routing**:
   - HTTP: 80.
   - **Create target group** (Naye tab me khulega):
     - Target type: **IP addresses** (Fargate ke liye V.IMP).
     - Target group name: `jbmgmc-tg`
     - Protocol: **HTTP**, Port: **3000**
     - Health checks: Path me `/` rakhein. Create kar dein.
5. Wapas ALB tab me aakar refresh karein aur `jbmgmc-tg` select karke Load Balancer **Create** kar dein.

---

## Step 6: ECS Task Definition (App ka Blueprint)
1. AWS Console me **ECS** search karein > **Task definitions** > **Create new task definition**.
2. **Configuration**:
   - Name: `jbmgmc-task`
   - Launch type: **AWS Fargate**, OS: Linux.
   - **Task size (Cost Optimized):** **.25 vCPU** aur **1 GB Memory**. (Isse mahine ka bill bohot kam aayega).
3. **Container - 1**:
   - Name: `nextjs-app`
   - Image URI: Step 1 me copy ki hui ECR URI yahan dalein aur end me `:latest` lagayein. (e.g. `...amazonaws.com/jbmgmc-nandurbar-app:latest`).
   - Port mappings: **3000** (TCP).
4. **Environment variables**:
   - `NODE_ENV` = `production`
   - `PORT` = `3000`
   - `DATABASE_PATH` = `/app/data`
   - `ADMIN_PASSWORD` = `AapkaPasswordYahan`
   - `ADMIN_SESSION_SECRET` = `4b82f75e50da6436ae63089492d0d71774fe2894578516883e178259ee422ae5`
5. **Storage**:
   - **Add volume** > Type: **EFS**, Name: `efs-data`. Apna EFS file system chunein.
   - **Access point ID** me apna banaya hua `fsap-...` chunein.
   - **Transit encryption** ko zaroor **Enable (ON)** karein (Access point use karne ke liye ye zaroori hai).
   - **Container mount points** > Source: `efs-data`, Container path: `/app/data`
6. **Create** par click karein.

---

## Step 7: ECS Cluster aur Service Banayein (App Live Karna)
1. ECS menu me **Clusters** > **Create cluster** > Name: `jbmgmc-cluster` (AWS Fargate option checked hona chahiye). Create karein.
2. Cluster ke andar **Services** tab me **Create** dabayein.
   - Compute options: **FARGATE**
   - Application type: **Service**
   - Family: `jbmgmc-task`
   - Service name: `jbmgmc-service`
   - Desired tasks: **1**
3. **Networking**: 
   - VPC aur sabhi subnets chunein.
   - **Security group**: Yahan apna banaya hua **`ECS-SG`** chunein.
4. **Load balancing**:
   - Type: **Application Load Balancer**
   - Load balancer: `jbmgmc-alb`
   - Container to load balance: `nextjs-app:3000:3000`
   - Listener: 80, Target group: `jbmgmc-tg`.
5. **Create** par click karein.

Jab Service ka status "Running" ho jaye, toh apne ALB ka DNS link open karke website check karein!

---

## Step 8: Domain Name Connect Karein (Route 53 & DigitalPlat)
Jab ALB live ho jaye, toh hume apna Domain (`jbmgmcnandurbar.in`) ALB se jorna hota hai.
1. **AWS me Route 53 setup karein:**
   - AWS Console me **Route 53** search karein.
   - **Hosted zones** me jayein aur **Create hosted zone** par click karein.
   - Domain name: `jbmgmcnandurbar.in` dalein (Public hosted zone select rakhein) aur Create karein.
   - Create hone ke baad, aapko ek NS (Name Server) type ka record dikhega jisme **4 lambe links** honge (e.g. `ns-123.awsdns.com`). Un chaaro ko ek notepad me copy kar lein.
2. **DigitalPlat (Domain Provider) me DNS update karein:**
   - Apne **DigitalPlat** account me login karein jahan se domain liya hai.
   - Apne domain ke **Manage DNS** ya **Nameservers** section me jayein.
   - Wahan pehle se jo Nameservers likhe hain unhe delete karke, upar copy kiye hue **4 AWS Nameservers** paste kar dein aur Save karein. *(Isme 2-4 ghante ka time lag sakta hai internet par update hone me).*
3. **AWS Route 53 me A-Record banayein (Domain ko ALB se jorna):**
   - Wapas AWS Route 53 me apni Hosted zone ke andar aakar **Create record** par click karein.
   - Record name: Khali chhod dein.
   - Record type: **A - Routes traffic to an IPv4 address...**
   - **Alias** button ko ON karein.
   - Route traffic to me: **Alias to Application and Classic Load Balancer** chunein.
   - Apna Region (e.g., ap-south-1) select karein aur niche apna ALB (`jbmgmc-alb`) select karein.
   - **Create records** daba dein.
4. (Optional) Ek aur record banayein `www` wala, same step 3 ki tarah, bas "Record name" me `www` likh dein aur ALB select karke create kar dein.

Ab thodi der baad aapki website direct `jbmgmcnandurbar.in` par khulne lagegi!

---

## Step 9: Naya Code Deploy Kaise Karein (Future Updates)
Jab bhi aap website me kuch changes karke code GitHub par push karenge:
1. GitHub Actions naya image banakar ECR me daal dega (2-3 mins lagte hain).
2. Phir AWS me **ECS Console** > Apna Cluster (`jbmgmc-cluster`) > Apni Service (`jbmgmc-service`) me jayein.
3. Upar **Update service** par click karein.
4. **"Force new deployment"** box par Tick (✅) karein.
5. Niche **Update** daba dein. 3-4 minute baad nayi website live ho jayegi! (Agar cache issue ho toh **Ctrl+F5** dabayein).

---

## Step 10: Free SSL (HTTPS) Lagayein (AWS Certificate Manager se)
AWS par SSL lagana **100% Free** aur bohot aasan hai. Iske liye hum AWS Certificate Manager (ACM) ka use karenge:

1. **Free Certificate Request karein:**
   - AWS Console me **Certificate Manager (ACM)** search karein.
   - **Request a certificate** > **Request a public certificate** par click karein.
   - Domain names me apni website dalein: `jbmgmcnandurbar.in` aur "Add another name" karke `*.jbmgmcnandurbar.in` bhi daal dein.
   - Validation method me **DNS validation** select rakhein aur **Request** dabayein.
2. **Domain Verify Karein:**
   - Ab apne naye banaye hue certificate par click karein.
   - Wahan ek button hoga **"Create records in Route 53"**. Uspar click karke Create kar dein. AWS apne aap Route 53 me verification code daal dega. 1-2 minute me certificate ka status "Issued" ho jayega.
3. **ALB par SSL lagayein (HTTPS Listener):**
   - Wapas EC2 > **Load Balancers** me jayein aur apne ALB (`jbmgmc-alb`) par click karein.
   - Niche **Listeners and routing** tab me **Add listener** par click karein.
   - Protocol: **HTTPS**, Port: **443** chunein.
   - Default actions me: **Forward** select karein aur Target group `jbmgmc-tg` chunein.
   - Default SSL/TLS certificate me: From ACM chunein aur apna naya certificate select kar lein. **Add** dabayein.
4. **HTTP ko HTTPS par redirect karein (Taki hamesha secure site khule):**
   - Apne purane wale **HTTP: 80** listener ko select karke **Edit** karein.
   - Action ko "Forward" se badalkar **"Redirect"** karein.
   - URI me **HTTPS** aur Port **443** dalein. Status code **301 - Permanently moved** chunein aur Save karein.

Bas! Ab aapki website par Lock (🔒) ban kar aayega aur wo hamesha secure (HTTPS) chalegi.
