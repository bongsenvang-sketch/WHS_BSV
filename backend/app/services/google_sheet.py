"""
Google Sheets Service - Tích hợp với Google Sheets để lưu dữ liệu
"""
import os
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import pandas as pd
from typing import List, Dict, Any

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']


class GoogleSheetService:
    def __init__(self):
        self.sheet_id = os.getenv("GOOGLE_SHEET_ID")
        self.credentials_path = os.getenv("GOOGLE_CREDENTIALS_PATH", "./credentials.json")
        self.service = self._authenticate()
    
    def _authenticate(self):
        """Xác thực với Google Sheets API"""
        try:
            credentials = Credentials.from_service_account_file(
                self.credentials_path, scopes=SCOPES
            )
            return build('sheets', 'v4', credentials=credentials)
        except FileNotFoundError:
            print(f"Credentials file not found at {self.credentials_path}")
            return None
    
    def read_sheet(self, sheet_name: str, range_name: str = None) -> List[List[Any]]:
        """Đọc dữ liệu từ sheet"""
        if not self.service:
            return []
        
        try:
            if range_name:
                full_range = f"'{sheet_name}'!{range_name}"
            else:
                full_range = f"'{sheet_name}'"
            
            result = self.service.spreadsheets().values().get(
                spreadsheetId=self.sheet_id,
                range=full_range
            ).execute()
            
            return result.get('values', [])
        except Exception as e:
            print(f"Error reading sheet: {e}")
            return []
    
    def write_sheet(self, sheet_name: str, range_name: str, values: List[List[Any]]) -> bool:
        """Ghi dữ liệu vào sheet"""
        if not self.service:
            return False
        
        try:
            full_range = f"'{sheet_name}'!{range_name}"
            body = {'values': values}
            
            self.service.spreadsheets().values().update(
                spreadsheetId=self.sheet_id,
                range=full_range,
                valueInputOption='USER_ENTERED',
                body=body
            ).execute()
            
            return True
        except Exception as e:
            print(f"Error writing to sheet: {e}")
            return False
    
    def append_sheet(self, sheet_name: str, values: List[List[Any]]) -> bool:
        """Thêm dữ liệu vào cuối sheet"""
        if not self.service:
            return False
        
        try:
            full_range = f"'{sheet_name}'!A:Z"
            body = {'values': values}
            
            self.service.spreadsheets().values().append(
                spreadsheetId=self.sheet_id,
                range=full_range,
                valueInputOption='USER_ENTERED',
                body=body
            ).execute()
            
            return True
        except Exception as e:
            print(f"Error appending to sheet: {e}")
            return False
    
    def read_as_dataframe(self, sheet_name: str) -> pd.DataFrame:
        """Đọc sheet và convert thành DataFrame"""
        data = self.read_sheet(sheet_name)
        if not data:
            return pd.DataFrame()
        
        headers = data[0]
        rows = data[1:]
        
        return pd.DataFrame(rows, columns=headers)


# Singleton instance
_google_sheet_service = None


def get_google_sheet_service() -> GoogleSheetService:
    """Get or create Google Sheet service instance"""
    global _google_sheet_service
    if _google_sheet_service is None:
        _google_sheet_service = GoogleSheetService()
    return _google_sheet_service
