from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Module C: Sao tẩm, chế biến

class DispensingOrder(BaseModel):
    """Model cho lệnh chế biến"""
    id: Optional[str] = None
    order_number: str
    created_date: datetime
    created_by: str
    items: list
    target_product: str
    quantity_target: float
    unit: str
    status: str


class WarehouseExit(BaseModel):
    """Model cho xuất kho dược liệu"""
    id: Optional[str] = None
    exit_number: str
    dispensing_order_id: str
    exit_date: datetime
    exited_by: str
    items: list
    purpose: str
    status: str


class FinishedProduct(BaseModel):
    """Model cho thành phẩm sau chế biến"""
    id: Optional[str] = None
    product_name: str
    batch_number: str
    quantity: float
    unit: str
    created_date: datetime
    created_by: str
    quality_status: str
    expiry_date: Optional[datetime] = None
