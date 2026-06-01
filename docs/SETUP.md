# WHS_BSV - Setup Guide

Hướng dẫn cài đặt hệ thống Pharmacy CRM & Inventory Management

## 📋 Yêu cầu trước khi bắt đầu

- Python 3.9+
- Node.js 16+
- npm hoặc yarn
- Google Cloud Account

## 🚀 Bước 1: Thiết lập Google Sheets

### 1.1 Tạo Google Cloud Project
1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới: `WHS_BSV`
3. Bật Google Sheets API
4. Bật Google Drive API

### 1.2 Tạo Service Account
1. Vào **Service Accounts** → **Create Service Account**
2. Tên: `whs-bsv-service`
3. Tạo key (JSON format) và tải về
4. Lưu file vào thư mục backend: `backend/credentials.json`

### 1.3 Tạo Google Sheet
1. Tạo Google Sheet mới
2. Đặt tên: `WHS_BSV_Database`
3. Chia sẻ với email của Service Account (edit access)
4. Copy Sheet ID từ URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`

### 1.4 Tạo các Sheet tabs
Tạo các sheet tabs sau trong Google Sheet:
- `Suppliers` - Nhà cung cấp
- `PurchaseOrders` - Đơn mua hàng
- `Inventory` - Tồn kho
- `WarehouseEntries` - Nhập kho
- `WarehouseExits` - Xuất kho
- `Patients` - Bệnh nhân
- `Appointments` - Lịch hẹn
- `Exams` - Khám bệnh
- `Prescriptions` - Đơn kê thuốc
- `Picking` - Bốc thuốc
- `Delivery` - Giao thuốc
- `InventoryChecks` - Kiểm kê

## 🔧 Bước 2: Thiết lập Backend

### 2.1 Tạo Virtual Environment
```bash
cd backend
python -m venv venv

# macOS/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 2.2 Cài đặt Dependencies
```bash
pip install -r requirements.txt
```

### 2.3 Tạo File .env
```bash
cp .env.example .env
```

Sửa các giá trị trong `.env`:
```
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_CREDENTIALS_PATH=./credentials.json
API_HOST=localhost
API_PORT=8000
DEBUG=True
```

### 2.4 Chạy Backend
```bash
python -m app.main
# Hoặc: uvicorn app.main:app --reload
```

Backend chạy tại: `http://localhost:8000`

API Docs: `http://localhost:8000/docs`

## 🎨 Bước 3: Thiết lập Frontend

### 3.1 Cài đặt Dependencies
```bash
cd frontend
npm install
```

### 3.2 Tạo File .env
```bash
echo "REACT_APP_API_BASE_URL=http://localhost:8000" > .env.local
```

### 3.3 Chạy Frontend
```bash
npm start
```

Frontend chạy tại: `http://localhost:3000`

## ✅ Kiểm tra cài đặt

```bash
# Backend
curl http://localhost:8000/
curl http://localhost:8000/health

# Frontend
# Mở: http://localhost:3000
```

## 🐛 Troubleshooting

- **Credentials not found**: Kiểm tra `credentials.json` trong backend
- **Sheet ID not valid**: Đảm bảo ID đúng từ URL Google Sheet
- **CORS errors**: Kiểm tra CORS middleware trong backend

---

**Cập nhật:** 2026-06-01
