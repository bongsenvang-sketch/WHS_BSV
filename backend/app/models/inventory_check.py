from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Module F: Kiểm kê định kỳ

class InventoryCheckPlan(BaseModel):
    """Model cho kế hoạch kiểm kê"""
    id: Optional[str] = None
    check_plan_number: str
    planned_date: datetime
    warehouse_location: str
    responsible_person: str
    status: str
    items_to_check: list
    notes: str


class InventoryCheck(BaseModel):
    """Model cho kiểm kê thực tế"""
    id: Optional[str] = None
    check_number: str
    check_plan_id: str
    check_date: datetime
    checked_by: str
    warehouse_location: str
    items: list
    status: str
    notes: str


class InventoryCheckItem(BaseModel):
    """Model cho từng item trong kiểm kê"""
    item_code: str
    item_name: str
    batch_number: str
    system_quantity: float
    actual_quantity_weighed: float
    unit: str
    discrepancy: float
    qr_code_scanned: bool
    notes: str


class InventoryAdjustmentBatch(BaseModel):
    """Model cho phiếu điều chỉnh tồn kho từ kiểm kê"""
    id: Optional[str] = None
    adjustment_number: str
    check_id: str
    check_number: str
    adjustment_date: datetime
    adjusted_by: str
    items: list
    total_adjustment_value: float
    approval_status: str
    notes: str
