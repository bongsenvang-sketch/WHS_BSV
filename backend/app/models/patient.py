from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Module D: Quản lý bệnh nhân & khám bệnh

class Patient(BaseModel):
    """Model cho bệnh nhân"""
    id: Optional[str] = None
    patient_code: str
    name: str
    date_of_birth: datetime
    gender: str
    phone: str
    email: Optional[str] = None
    address: str
    medical_history: str
    date_registered: datetime
    source: str


class Appointment(BaseModel):
    """Model cho lịch hẹn khám"""
    id: Optional[str] = None
    appointment_number: str
    patient_id: str
    patient_name: str
    appointment_date: datetime
    appointment_time: str
    status: str
    symptoms: str
    notes: str
    confirmed_by_patient: bool = False
    confirmed_date: Optional[datetime] = None


class MedicalExamination(BaseModel):
    """Model cho khám bệnh"""
    id: Optional[str] = None
    exam_number: str
    patient_id: str
    patient_name: str
    appointment_id: Optional[str] = None
    exam_date: datetime
    exam_type: str
    patient_symptoms: str
    doctor_diagnosis: str
    doctor_name: str
    notes: str
    status: str
