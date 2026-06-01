import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Box,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const ExamAndPrescription = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [patientInfo, setPatientInfo] = useState({
    patientId: '',
    patientName: '',
    examType: 'in-person',
    appointmentId: ''
  });
  
  const [symptoms, setSymptoms] = useState({
    chiefComplaint: '', // Vấn đề chính
    diet: '', // Ăn uống
    sleep: '', // Ngủ
    urination: '', // Tiểu tiện
    defecation: '', // Đại tiện
    medicalHistory: '', // Tiền sử bệnh tây y (tim, gan, thận, phổi, dạ dày, ...)
    otherSymptoms: '' // Vấn đề khác
  });
  
  const [diagnosis, setDiagnosis] = useState({
    doctorDiagnosis: '', // Chẩn đoán nguyên gốc bệnh
    treatmentPlan: '', // Kế hoạch chữa trị
    doctorName: 'Bác sĩ Tuấn' // Tên thầy thuốc
  });
  
  const [prescriptionItems, setPrescriptionItems] = useState([]);
  const [newItem, setNewItem] = useState({
    itemName: '',
    itemCode: '',
    quantity: '',
    unit: 'g',
    usageInstruction: ''
  });
  
  const [stockWarnings, setStockWarnings] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openItemDialog, setOpenItemDialog] = useState(false);
  const [examNumber, setExamNumber] = useState('');
  const [prescriptionNumber, setPrescriptionNumber] = useState('');
  const [pickingStatus, setPickingStatus] = useState('');
  
  const steps = [
    'Thông tin bệnh nhân',
    'Ghi nhận triệu chứng',
    'Chẩn đoán & Kê đơn',
    'Bốc thuốc & Xuất kho'
  ];

  // Kiểm tra tồn kho khi thêm dược liệu
  const checkStockAvailable = async (itemCode) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/exams/available-stock/${itemCode}`
      );
      
      if (!response.data.available) {
        setStockWarnings(prev => ({
          ...prev,
          [itemCode]: {
            status: 'outofstock',
            message: `Hết hàng: ${itemCode}`
          }
        }));
      } else {
        setStockWarnings(prev => ({
          ...prev,
          [itemCode]: {
            status: 'available',
            message: `Còn: ${response.data.total_quantity} ${prescriptionItems[0]?.unit || 'cái'}`
          }
        }));
      }
    } catch (error) {
      console.error('Lỗi kiểm tra tồn kho:', error);
    }
  };

  const handleAddItem = () => {
    if (!newItem.itemName || !newItem.itemCode || !newItem.quantity) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin dược liệu');
      return;
    }
    
    setPrescriptionItems([...prescriptionItems, newItem]);
    checkStockAvailable(newItem.itemCode);
    setNewItem({
      itemName: '',
      itemCode: '',
      quantity: '',
      unit: 'g',
      usageInstruction: ''
    });
    setOpenItemDialog(false);
    setSuccessMessage(`Đã thêm ${newItem.itemName} vào đơn`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleRemoveItem = (index) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };

  const handleCreateExam = async () => {
    if (!patientInfo.patientId || !patientInfo.patientName) {
      setErrorMessage('Vui lòng nhập thông tin bệnh nhân');
      return;
    }

    setLoading(true);
    try {
      const symptomsText = `
        Vấn đề chính: ${symptoms.chiefComplaint}
        Ăn uống: ${symptoms.diet}
        Ngủ: ${symptoms.sleep}
        Tiểu tiện: ${symptoms.urination}
        Đại tiện: ${symptoms.defecation}
        Tiền sử bệnh tây y: ${symptoms.medicalHistory}
        Vấn đề khác: ${symptoms.otherSymptoms}
      `.trim();

      const response = await axios.post(`${API_BASE_URL}/exams/create-exam`, {
        patient_id: patientInfo.patientId,
        patient_name: patientInfo.patientName,
        exam_type: patientInfo.examType,
        patient_symptoms: symptomsText,
        doctor_diagnosis: diagnosis.doctorDiagnosis,
        doctor_name: diagnosis.doctorName,
        notes: diagnosis.treatmentPlan,
        appointment_id: patientInfo.appointmentId
      });

      setExamNumber(response.data.exam_number);
      setSuccessMessage('✓ Phiếu khám bệnh đã lưu');
      setActiveStep(2);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Lỗi tạo phiếu khám: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async () => {
    if (prescriptionItems.length === 0) {
      setErrorMessage('Vui lòng thêm ít nhất 1 dược liệu vào đơn');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/exams/create-prescription`, {
        exam_id: examNumber,
        patient_id: patientInfo.patientId,
        patient_name: patientInfo.patientName,
        doctor_name: diagnosis.doctorName,
        items: prescriptionItems,
        doctor_notes: diagnosis.treatmentPlan
      });

      setPrescriptionNumber(response.data.prescription_number);
      setSuccessMessage('✓ Đơn thuốc đã lưu');
      setActiveStep(3);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Lỗi tạo đơn thuốc: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleAutoPicking = async () => {
    setLoading(true);
    try {
      const itemsForPicking = prescriptionItems.map(item => ({
        item_code: item.itemCode,
        quantity: parseFloat(item.quantity),
        batch_number: '', // Sẽ lấy lô gần nhất
        warehouse_location: '' // Sẽ lấy từ kho
      }));

      const response = await axios.post(`${API_BASE_URL}/exams/pick-medicine`, {
        prescription_number: prescriptionNumber,
        picked_by: diagnosis.doctorName,
        items_picked: itemsForPicking
      });

      setPickingStatus(response.data.picking_number);
      setSuccessMessage('✓ Đã bốc thuốc & xuất kho thành công!');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Lỗi bốc thuốc: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        🏥 Khám Bệnh & Kê Đơn Thuốc
      </Typography>

      {successMessage && (
        <Alert severity="success" onClose={() => setSuccessMessage('')} sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" onClose={() => setErrorMessage('')} sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* BƯỚC 1: Thông tin bệnh nhân */}
      {activeStep === 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Thông tin bệnh nhân
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mã bệnh nhân"
                  value={patientInfo.patientId}
                  onChange={(e) => setPatientInfo({ ...patientInfo, patientId: e.target.value })}
                  placeholder="PT-2026-001"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên bệnh nhân"
                  value={patientInfo.patientName}
                  onChange={(e) => setPatientInfo({ ...patientInfo, patientName: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Hình thức khám"
                  value={patientInfo.examType}
                  onChange={(e) => setPatientInfo({ ...patientInfo, examType: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="in-person">Khám trực tiếp</option>
                  <option value="online">Khám online</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mã lịch hẹn (nếu có)"
                  value={patientInfo.appointmentId}
                  onChange={(e) => setPatientInfo({ ...patientInfo, appointmentId: e.target.value })}
                  placeholder="APT-2026-001"
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setActiveStep(1)}
                fullWidth
              >
                Tiếp tục →
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* BƯỚC 2: Ghi nhận triệu chứng */}
      {activeStep === 1 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ghi nhận triệu chứng & khai báo sức khỏe
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Hỏi bệnh nhân về các vấn đề trong sinh hoạt, ăn ngủ, tiêu đại tiện và tiền sử bệnh
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Vấn đề chính (chính bệnh nhân nói)"
                  value={symptoms.chiefComplaint}
                  onChange={(e) => setSymptoms({ ...symptoms, chiefComplaint: e.target.value })}
                  placeholder="Ví dụ: Đau dạ dày, chán ăn, người mệt"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Ăn uống"
                  value={symptoms.diet}
                  onChange={(e) => setSymptoms({ ...symptoms, diet: e.target.value })}
                  placeholder="Ăn được bao nhiêu, thích gì, tránh gì"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Ngủ"
                  value={symptoms.sleep}
                  onChange={(e) => setSymptoms({ ...symptoms, sleep: e.target.value })}
                  placeholder="Ngủ bao lâu, có khó ngủ không"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Tiểu tiện"
                  value={symptoms.urination}
                  onChange={(e) => setSymptoms({ ...symptoms, urination: e.target.value })}
                  placeholder="Tần suất, màu sắc, có vấn đề gì không"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Đại tiện"
                  value={symptoms.defecation}
                  onChange={(e) => setSymptoms({ ...symptoms, defecation: e.target.value })}
                  placeholder="Tần suất, độ cứng, có máu không"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Tiền sử bệnh tây y (nếu có)"
                  value={symptoms.medicalHistory}
                  onChange={(e) => setSymptoms({ ...symptoms, medicalHistory: e.target.value })}
                  placeholder="Tim, gan, thận, phổi, dạ dày, huyết áp, đường huyết, ..."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Vấn đề khác (vị trí đau, khô miệng, etc.)"
                  value={symptoms.otherSymptoms}
                  onChange={(e) => setSymptoms({ ...symptoms, otherSymptoms: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setActiveStep(0)}>
                ← Quay lại
              </Button>
              <Button variant="contained" onClick={() => setActiveStep(2)} sx={{ flex: 1 }}>
                Tiếp tục →
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* BƯỚC 3: Chẩn đoán & Kê đơn */}
      {activeStep === 2 && (
        <>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Chẩn đoán & Kế hoạch chữa trị
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tên thầy thuốc"
                    value={diagnosis.doctorName}
                    onChange={(e) => setDiagnosis({ ...diagnosis, doctorName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Chẩn đoán (Nguyên gốc bệnh ở đâu, chữa vào đâu)"
                    value={diagnosis.doctorDiagnosis}
                    onChange={(e) => setDiagnosis({ ...diagnosis, doctorDiagnosis: e.target.value })}
                    placeholder="Ví dụ: Viêm dạ dày do hư hàng. Chữa: Hành khí, bổ huyết, tiêu thực"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    label="Kế hoạch chữa trị"
                    value={diagnosis.treatmentPlan}
                    onChange={(e) => setDiagnosis({ ...diagnosis, treatmentPlan: e.target.value })}
                    placeholder="Sắc liên tiếp bao nhiêu ngày, có cần uống gì thêm không, ..."
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleCreateExam}
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : '✓ Lưu phiếu khám'}
              </Button>
            </CardContent>
          </Card>

          {/* Kê đơn thuốc */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kê đơn thuốc
              </Typography>

              {/* Thêm dược liệu */}
              <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Thêm dược liệu vào đơn:
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Tên dược liệu"
                      value={newItem.itemName}
                      onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                      placeholder="Ví dụ: Bạch linh"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Mã dược liệu"
                      value={newItem.itemCode}
                      onChange={(e) => setNewItem({ ...newItem, itemCode: e.target.value })}
                      placeholder="BL-001"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      size="small"
                      type="number"
                      label="Số lượng"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                      placeholder="30"
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      select
                      fullWidth
                      size="small"
                      label="Đơn vị"
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      SelectProps={{ native: true }}
                    >
                      <option value="g">g (gam)</option>
                      <option value="ml">ml (mililít)</option>
                      <option value="viên">viên</option>
                      <option value="chiếc">chiếc</option>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={5}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Cách dùng"
                      value={newItem.usageInstruction}
                      onChange={(e) => setNewItem({ ...newItem, usageInstruction: e.target.value })}
                      placeholder="Sắc với nước uống 2 lần/ngày"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<AddIcon />}
                      onClick={handleAddItem}
                    >
                      Thêm vào đơn
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {/* Danh sách dược liệu trong đơn */}
              {prescriptionItems.length > 0 && (
                <TableContainer sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: '#e3f2fd' }}>
                      <TableRow>
                        <TableCell><strong>Dược liệu</strong></TableCell>
                        <TableCell align="center"><strong>Mã</strong></TableCell>
                        <TableCell align="right"><strong>SL</strong></TableCell>
                        <TableCell><strong>ĐV</strong></TableCell>
                        <TableCell><strong>Cách dùng</strong></TableCell>
                        <TableCell align="center"><strong>Tồn kho</strong></TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptionItems.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.itemName}</TableCell>
                          <TableCell align="center">{item.itemCode}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.usageInstruction}</TableCell>
                          <TableCell align="center">
                            {stockWarnings[item.itemCode] && (
                              <Chip
                                size="small"
                                icon={stockWarnings[item.itemCode].status === 'available' ? <CheckCircleIcon /> : <WarningIcon />}
                                label={stockWarnings[item.itemCode].message}
                                color={stockWarnings[item.itemCode].status === 'available' ? 'success' : 'error'}
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveItem(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button variant="outlined" onClick={() => setActiveStep(1)}>
                  ← Quay lại
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreatePrescription}
                  disabled={loading || prescriptionItems.length === 0}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Đang lưu...' : '✓ Lưu đơn thuốc'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}

      {/* BƯỚC 4: Bốc thuốc & Xuất kho */}
      {activeStep === 3 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              ✓ Bốc thuốc & Xuất kho
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Đơn thuốc đã được tạo! Bây giờ sẽ bốc thuốc từ kho và cập nhật tồn kho.
            </Alert>

            <TableContainer sx={{ mb: 3 }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#f0f0f0' }}>
                  <TableRow>
                    <TableCell><strong>Dược liệu</strong></TableCell>
                    <TableCell align="right"><strong>Số lượng</strong></TableCell>
                    <TableCell><strong>Đơn vị</strong></TableCell>
                    <TableCell><strong>Cách dùng</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {prescriptionItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>{item.usageInstruction}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              fullWidth
              variant="contained"
              color="success"
              size="large"
              onClick={handleAutoPicking}
              disabled={loading}
              sx={{ p: 2 }}
            >
              {loading ? '⏳ Đang bốc thuốc...' : '✓ Bốc thuốc & Xuất kho'}
            </Button>

            {pickingStatus && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <strong>Thành công!</strong>
                <br />
                Phiếu bốc: {pickingStatus}
                <br />
                Thuốc đã được bốc từ kho và tồn kho đã được cập nhật tự động.
              </Alert>
            )}

            <Box sx={{ mt: 3 }}>
              <Button fullWidth variant="outlined" onClick={() => {
                // Reset form
                setActiveStep(0);
                setPatientInfo({ patientId: '', patientName: '', examType: 'in-person', appointmentId: '' });
                setSymptoms({ chiefComplaint: '', diet: '', sleep: '', urination: '', defecation: '', medicalHistory: '', otherSymptoms: '' });
                setDiagnosis({ doctorDiagnosis: '', treatmentPlan: '', doctorName: 'Bác sĩ Tuấn' });
                setPrescriptionItems([]);
                setNewItem({ itemName: '', itemCode: '', quantity: '', unit: 'g', usageInstruction: '' });
                setExamNumber('');
                setPrescriptionNumber('');
                setPickingStatus('');
              }}>
                Bắt đầu khám bệnh mới
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ExamAndPrescription;
