# BP Optima Backend

A production-ready Node.js & TypeScript document processing system using **Clean Architecture**.

## 🏗️ Architecture Flow
1. **API Layer**: Express processes incoming requests and validates data.
2. **Service Layer**: Business logic handles job creation and storage in **MongoDB**.
3. **Queue Layer**: **BullMQ (Redis)** offloads long-running tasks for background execution.
4. **Worker Layer**: Independent process consumes jobs, simulates 10–20s work, updates MongoDB, and triggers optional **Webhooks**.

---

## 🚀 API Endpoints

### 1. Health Check
*   **GET** `/health`
*   **Response**: `200 OK` (System status and uptime)

### 2. Create Job
*   **POST** `/jobs`
*   **Body (JSON)**:
    ```json
    {
      "fileUrl": "https://example.com/doc.pdf",
      "webhookUrl": "https://your-app.com/callback" (Optional)
    }
    ```
*   **Body (Multipart Form-Data)**:
    *   `file`: Binary file (PDF, DOCX, TXT, etc.)
    *   `webhookUrl`: String (Optional)
*   **Response (201)**:
    ```json
    { "jobId": "69c9...", "status": "queued" }
    ```

### 3. List All Jobs
*   **GET** `/jobs`
*   **Response (200)**: Array of simplified job objects.

### 4. Fetch Job Status
*   **GET** `/jobs/:id`
*   **Response (200)**:
    ```json
    {
      "jobId": "...",
      "status": "completed",
      "result": { "processedFileUrl": "...", "duration": "15.4s" },
      "timestamps": { "createdAt": "...", "startedAt": "...", "completedAt": "..." }
    }
    ```

---

## 🛠️ Development Setup

### 1. Configure Environment
Create a **`.env`** file:
```env
MONGODB_URI=your_mongodb_atlas_url
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
PORT=3000
```

### 2. Run Services
*   **Terminal 1 (API)**: `npm run dev`
*   **Terminal 2 (Worker)**: `npm run worker`

---

## 🧪 Testing & Verification

### 1. Test Webhook Connectivity
To verify you can receive callbacks without building a separate server:
1.  Go to **[Beeceptor](https://beeceptor.com)** and create a new temporary endpoint (e.g., `bp-tester`).
2.  Send a `POST /jobs` request with your unique Beeceptor URL:
    ```json
    {
      "fileUrl": "https://example.com/test.pdf",
      "webhookUrl": "https://bp-tester.free.beeceptor.com"
    }
    ```
3.  Wait **10-20 seconds** (the simulated processing time) and your results will automatically appear in your Beeceptor dashboard.

### 2. Test with direct File Upload
If you prefer to upload a local file instead of providing a URL:
1.  Open **Postman** or **Insomnia**.
2.  Set the request method to **`POST`** and URL to `http://localhost:3000/jobs`.
3.  Go to the **Body** tab and select **`form-data`**.
4.  Add a key named **`file`**, change the type to **`file`**, and upload your document.
5.  *(Optional)* Add a key named **`webhookUrl`** with your callback link.
6.  Send the request.

### 3. Test with cURL
*   **Create JSON Job**:
    ```bash
    curl -X POST http://localhost:3000/jobs \
    -H "Content-Type: application/json" \
    -d '{"fileUrl": "https://test.com/doc.pdf"}'
    ```
*   **Create File Upload Job**:
    ```bash
    curl -X POST http://localhost:3000/jobs \
    -F "file=@/path/to/your/document.pdf"
    ```
*   **Check Status**:
    ```bash
    curl http://localhost:3000/jobs/65f...
    ```
