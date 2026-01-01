---
description: Deploy Code to VPS
---
# Deployment Instructions

1. **SSH into your server**:
   ```bash
   ssh root@104.168.68.252
   ```

2. **Navigate to the project directory**:
   (Assuming the folder is named 'ant-portfolio-v2-react' in the home root)
   ```bash
   cd ~/ant-portfolio-v2-react
   ```

3. **Pull the latest changes**:
   ```bash
   git pull origin main
   ```

4. **Install dependencies (if needed)**:
   ```bash
   npm install
   ```

5. **Build the project**:
   ```bash
   npm run build
   ```

6. **Deploy to Web Root**:
   ```bash
   cp -r dist/* /var/www/mtanthony.com/
   ```

7. **Verify**:
   Visit https://mtanthony.com
