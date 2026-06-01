"""
Configuration settings for the application
"""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application Settings"""
    
    # API
    API_HOST = os.getenv("API_HOST", "localhost")
    API_PORT = int(os.getenv("API_PORT", 8000))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # Google Sheets
    GOOGLE_SHEET_ID = os.getenv("GOOGLE_SHEET_ID")
    GOOGLE_CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_PATH", "./credentials.json")
    
    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pharmacy.db")
    
    # App Info
    APP_NAME = "WHS_BSV - Pharmacy CRM & Inventory Management"
    APP_VERSION = "1.0.0"


settings = Settings()
