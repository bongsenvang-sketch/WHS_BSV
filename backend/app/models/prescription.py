from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Module D: Kê đơn thuốc

class Prescription(BaseModel):
    """Model cho đơn kê thuốc"""
    id: Optional[str] = None
    prescription_number: str
    exam_id: str
    patient_id: str
    patient_name: str
    doctor_name: str
    prescription_date: datetime
    items: list
    doctor_notes: str
    status: str


class PrescriptionItem(BaseModel):
    """Model cho từng dược liệu trong đơn"""
    item_name: str
    item_code: str
    quantity: float
    unit: str
    batch_number: Optional[str] = None
    warehouse_location: Optional[str] = None
    usage_instruction: str


class PickingOrder(BaseModel):
    """Model cho lệnh bốc thuốc"""
    id: Optional[str] = None
    picking_number: str
    prescription_id: str
    exam_id: str
    patient_name: str
    picking_date: datetime
    picked_by: str
    items: list
    actual_quantity_picked: dict
    status: str
    picking_method: str
    notes: str


class MedicineDelivery(BaseModel):
    """Model cho giao thuốc"""
    id: Optional[str] = None
    delivery_number: str
    prescription_id: str
    patient_id: str
    patient_name: str
    delivery_date: datetime
    delivery_time: Optional[str] = None
    delivery_method: str
    delivered_by: str
    received_by: str
    delivery_address: str
    status: str
    notes: str


class PatientFollowUp(BaseModel):
    """Model cho chăm sóc/hỏi thăm bệnh nhân"""
    id: Optional[str] = None
    followup_number: str
    patient_id: str
    patient_name: str
    followup_date: datetime
    followup_by: str
    patient_feedback: str
    health_status: str
    next_appointment_scheduled: bool
    next_appointment_date: Optional[datetime] = None
    doctor_adjustment_needed: bool
    notes: str
