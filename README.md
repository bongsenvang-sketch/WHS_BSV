# WHS_BSV - Pharmacy CRM & Inventory Management System

Hệ thống quản lý CRM cho phòng khám đông y với chức năng quản lý đơn thuốc bệnh nhân và kho dược liệu.

## 🎯 Tính năng chính

### A - Xác định nhu cầu & Mua hàng
- Dashboard tổng hợp dữ liệu
- Tạo nhu cầu mua hàng
- Tạo đơn mua hàng gửi nhà cung cấp
- Xác nhận đơn mua và thời gian giao hàng

### B - Nhập kho
- Nhận hàng và kiểm tra
- Kiểm tra chất lượng
- Nhập kho dược liệu thô, nguyên liệu, bao bì, dụng cụ vật tư
- Theo dõi người nhập, thời gian nhập

### C - Sao tẩm, chế biến
- Ra lệnh chế biến thành vị thuốc
- Xuất kho dược liệu thô
- Thực hiện chế biến vị thuốc
- Kiểm tra chất lượng
- Nhập kho thành phẩm

### D - Khám bệnh, kê đơn & xuất kho
- Quản lý lịch hẹn khám bệnh
- Đón tiếp và khám bệnh
- Kê đơn thuốc
- Bốc thuốc (FIFO + vị trí tủ kệ)
- Gói thuốc
- Giao thuốc (trực tiếp hoặc ship)
- Chăm sóc khách hàng

### E - Xuất kho (mục đích khác)
- Chuyển hàng sang kho khác
- Xuất kho cho các mục đích khác

### F - Kiểm kê định kỳ
- Lập kế hoạch kiểm kê
- Cân/Đếm số lượng thực tế
- Đối chiếu giữa thực tế với tồn kho trên hệ thống
- Điều tra nguyên nhân chênh lệch
- Lập phiếu điều chỉnh tồn kho

## 🛠 Tech Stack

- **Backend:** Python (FastAPI)
- **Frontend:** React + TypeScript
- **Database:** Google Sheets
- **State Management:** Redux Toolkit
- **UI Components:** Material-UI (MUI)

## 📁 Cấu trúc thư mục

```
WHS_BSV/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── purchase.py
│   │   │   ├── inventory.py
│   │   │   ├── dispensing.py
│   │   │   ├── patient.py
│   │   │   ├── prescription.py
│   │   │   └── stock.py
│   │   ├── routes/
│   │   ├── services/
│   │   │   └── google_sheet.py
│   │   └── utils/
│   ├── requirements.txt
│   ├── .env.example
│   └── config.py
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── store/
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── docs/
│   ├── SETUP.md
│   ├── API.md
│   └── DATABASE_SCHEMA.md
│
└── .gitignore
```

## 🚀 Hướng dẫn cài đặt

Xem chi tiết tại: [docs/SETUP.md](docs/SETUP.md)

## 📝 Tài liệu

- [Setup Guide](docs/SETUP.md) - Hướng dẫn cài đặt hệ thống
- [API Documentation](docs/API.md) - Tài liệu API endpoints
- [Database Schema](docs/DATABASE_SCHEMA.md) - Cấu trúc dữ liệu

## 👥 Team

- Developer: bongsenvang-sketch

## 📄 License

MIT

---

**Cập nhật lần cuối:** 2026-06-01
