from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Module B: Nhập kho

class GoodsReceipt(BaseModel):
    """Model cho nhận hàng"""
    id: Optional[str] = None
    purchase_order_id: str
    receipt_date: datetime
    received_by: str
    items: list
    quality_check_status: str
    quality_notes: str
    status: str


class WarehouseEntry(BaseModel):
    """Model cho nhập kho"""
    id: Optional[str] = None
    entry_number: str
    goods_receipt_id: Optional[str] = None
    entry_type: str
    entry_date: datetime
    entered_by: str
    items: list


class WarehouseEntryItem(BaseModel):
    """Model cho từng item trong nhập kho"""
    item_name: str
    item_code: str
    batch_number: str
    quantity: float
    unit_price: float
    total_price: float
    unit: str
    supplier_name: str
    expiry_date: Optional[datetime] = None
