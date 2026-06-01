from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Module A: Xác định nhu cầu & Mua hàng

class PurchaseRequirement(BaseModel):
    """Model cho nhu cầu mua hàng"""
    id: Optional[str] = None
    date_created: datetime
    item_name: str
    quantity_needed: float
    unit: str
    reason: str
    priority: str  # low, medium, high


class Supplier(BaseModel):
    """Model cho nhà cung cấp"""
    id: Optional[str] = None
    name: str
    phone: str
    email: str
    address: str
    specialties: str


class PurchaseOrder(BaseModel):
    """Model cho đơn mua hàng"""
    id: Optional[str] = None
    order_number: str
    supplier_id: str
    supplier_name: str
    date_created: datetime
    items: list
    total_amount: float
    quality_requirement: str
    delivery_date_required: datetime
    supplier_confirmed: bool = False
    supplier_confirmed_time: Optional[datetime] = None
    status: str
    notes: str


class PurchaseOrderItem(BaseModel):
    """Model cho từng item trong đơn mua hàng"""
    item_name: str
    item_code: str
    quantity: float
    unit_price: float
    total_price: float
    unit: str
