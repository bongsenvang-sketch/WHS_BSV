from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Quản lý tồn kho

class StockItem(BaseModel):
    """Model cho từng item trong tồn kho"""
    id: Optional[str] = None
    item_code: str
    item_name: str
    batch_number: str
    unit: str
    quantity_in: float
    unit_price_in: float
    date_in: datetime
    quantity_out: float
    date_out: Optional[datetime] = None
    current_quantity: float
    warehouse_location: str
    expiry_date: Optional[datetime] = None
    supplier: str
    notes: str


class StockSummary(BaseModel):
    """Model cho tóm tắt tồn kho"""
    id: Optional[str] = None
    item_code: str
    item_name: str
    total_quantity: float
    unit: str
    batches: list
    low_stock_alert: bool
    minimum_stock_level: float
    warehouse_location: str
    last_updated: datetime


class WarehouseTransfer(BaseModel):
    """Model cho chuyển kho"""
    id: Optional[str] = None
    transfer_number: str
    from_warehouse: str
    to_warehouse: str
    transfer_date: datetime
    transferred_by: str
    items: list
    status: str
    notes: str
