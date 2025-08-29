import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Table, Badge } from 'react-bootstrap';
import { FaFilePdf, FaCalendarAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ReportGeneration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('doctorSchedules');
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [expandedDoctors, setExpandedDoctors] = useState({});
  const [doctorSummary, setDoctorSummary] = useState([]);
  const [groupedSchedules, setGroupedSchedules] = useState({});
  const tableRef = useRef(null);

  const calculateDoctorSummary = (data) => {
    const summary = data.reduce((acc, item) => {
      if (!acc[item.doctorId]) {
        acc[item.doctorId] = {
          id: item.doctorId,
          name: item.doctorName,
          totalClinics: 0,
          totalReservations: 0,
          totalRevenue: 0,
          schedules: []
        };
      }
      const revenue = parseFloat(item.fees || 0) * parseInt(item.totalReservations || 0);
      acc[item.doctorId].totalClinics += 1;
      acc[item.doctorId].totalReservations += parseInt(item.totalReservations || 0);
      acc[item.doctorId].totalRevenue += revenue;
      acc[item.doctorId].schedules.push(item);
      return acc;
    }, {});
    return Object.values(summary);
  };

  // Group schedules by doctor name
  const groupSchedulesByDoctor = (data) => {
    return data.reduce((acc, item) => {
      const doctorName = item.doctorName;
      if (!acc[doctorName]) {
        acc[doctorName] = [];
      }
      acc[doctorName].push(item);
      return acc;
    }, {});
  };

  const toggleDoctorDetails = (doctorId) => {
    setExpandedDoctors(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }));
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/home', { withCredentials: true });
      if (response.status === 200) setIsLoading(false);
    } catch (error) {
      navigate('/admin/login');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (startDate > endDate) {
      toast.error('Start date cannot be after end date');
      return;
    }
    setLoading(true);
    try {
      await checkAuth();
      const response = await axios.get('http://localhost:5000/admin/reports/doctor-schedules', {
        params: {
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0]
        },
        withCredentials: true
      });

      if (response.data.success) {
        const data = response.data.data || [];
        const sortedDoctorSummary = calculateDoctorSummary(data).sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const groupedData = groupSchedulesByDoctor(data);
        
        setReportData(data);
        setDoctorSummary(sortedDoctorSummary);
        setGroupedSchedules(groupedData);
        setExpandedDoctors({}); // Reset expanded doctors when new report is generated
        toast.success('Report generated successfully');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = () => {
    if (Object.keys(groupedSchedules).length === 0) {
      toast.warning('No data to export');
      return;
    }
    
    const doc = new jsPDF();
    let yPos = 20;
    
    // Add title
    doc.setFontSize(18);
    doc.text('Doctor Schedules Report', 14, yPos);
    yPos += 10;
    
    // Add date range
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`, 14, yPos);
    yPos += 15;

    // Process each doctor's data
    Object.entries(groupedSchedules).forEach(([doctorName, schedules]) => {
      // Add doctor header
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Doctor: ${doctorName}`, 14, yPos);
      yPos += 10;

      // Prepare table data
      const headers = [['Date', 'Time', 'Room', 'Reservations', 'Fees (Rs.)', 'Revenue (Rs.)']];
      const body = schedules.map(schedule => {
        const revenue = parseFloat(schedule.fees || 0) * parseInt(schedule.totalReservations || 0);
        return [
          new Date(schedule.scheduleDate).toLocaleDateString(),
          schedule.scheduleTime,
          schedule.roomNumber || 'N/A',
          schedule.totalReservations.toString(),
          parseFloat(schedule.fees || 0).toFixed(2),
          revenue.toFixed(2)
        ];
      });

      // Calculate totals
      const totalReservations = schedules.reduce((sum, s) => sum + parseInt(s.totalReservations || 0), 0);
      const totalRevenue = schedules.reduce((sum, s) => 
        sum + (parseFloat(s.fees || 0) * parseInt(s.totalReservations || 0)), 0);

      // Add the table with adjusted column widths
      autoTable(doc, {
        head: headers,
        body: body,
        startY: yPos,
        margin: { 
          top: 20,
          left: 10,
          right: 10
        },
        tableWidth: 'wrap',
        styles: {
          fontSize: 8,  // Smaller font size to fit more content
          cellPadding: 2,
          overflow: 'linebreak',
          lineWidth: 0.1
        },
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold',
          halign: 'center',
          fontSize: 9
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Date
          1: { cellWidth: 25 }, // Time
          2: { cellWidth: 20 }, // Room
          3: { cellWidth: 25, halign: 'center' }, // Reservations
          4: { cellWidth: 25, halign: 'right' },  // Fees
          5: { cellWidth: 30, halign: 'right' }   // Revenue
        },
        didDrawPage: function(data) {
          // Add total row after the table
          const finalY = data.cursor.y + 5;
          doc.setFontSize(9);
          doc.setFont(undefined, 'bold');
          doc.text(`Total for ${doctorName}:`, 14, finalY);
          doc.text(totalReservations.toString(), 120, finalY);
          doc.text('-', 165, finalY);
          doc.text(totalRevenue.toFixed(2), 200, finalY, { align: 'right' });
          
          // Update yPos for next doctor
          yPos = finalY + 15;
          
          // Add new page if needed
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
        }
      });
    });

    // Save the PDF
    doc.save(`doctor-schedules-${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success('PDF exported successfully');
  };

  if (isLoading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  return (
    <Container fluid className="py-4" style={{ minHeight: '80vh' }}>
      <Row className="mb-4 align-items-center">
        <Col xs="auto">
          <Button variant="outline-secondary" onClick={() => window.history.back()} className="me-3">
            &larr; Back
          </Button>
        </Col>
        <Col><h2 className="mb-0 text-black">Reports</h2></Col>
      </Row>

      <Card>
        <Card.Body>
          <Tabs 
            activeKey={activeTab} 
            onSelect={(k) => setActiveTab(k)} 
            className="mb-4"
          >
            <Tab 
              eventKey="doctorSchedules" 
              title={
                <p className="text-black">Doctor Schedules</p>
              } 
              className="p-3"
            >
              <Row className="mb-4">
                <Col md={3}>
                  <Form.Label>Start Date</Form.Label>
                  <div className="d-flex align-items-center">
                    <DatePicker 
                      selected={startDate} 
                      onChange={setStartDate} 
                      selectsStart 
                      startDate={startDate} 
                      endDate={endDate} 
                      className="form-control" 
                      dateFormat="yyyy-MM-dd" 
                    />
                    <FaCalendarAlt className="ms-2" />
                  </div>
                </Col>
                <Col md={3}>
                  <Form.Label>End Date</Form.Label>
                  <div className="d-flex align-items-center">
                    <DatePicker 
                      selected={endDate} 
                      onChange={setEndDate} 
                      selectsEnd 
                      startDate={startDate} 
                      endDate={endDate} 
                      minDate={startDate} 
                      className="form-control" 
                      dateFormat="yyyy-MM-dd" 
                    />
                    <FaCalendarAlt className="ms-2" />
                  </div>
                </Col>
                <Col md={6} className="d-flex align-items-end">
                  <Button variant="primary" onClick={generateReport} disabled={loading} className="me-2">
                    {loading ? 'Generating...' : 'Generate Report'}
                  </Button>
                  <Button variant="outline-secondary" onClick={exportToPDF} disabled={!reportData.length}>
                    <FaFilePdf className="me-1" /> Export PDF
                  </Button>
                </Col>
              </Row>
              

              {/* Second table showing schedules grouped by doctor */}
              {Object.keys(groupedSchedules).length > 0 && (
                <Card>
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Schedules by Doctor</h5>
                    <small className="text-muted">
                      Showing all schedules organized by doctor
                    </small>
                  </Card.Header>
                  <Table responsive striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Room</th>
                        <th className="text-center">Reservations</th>
                        <th className="text-center">Fees</th>
                        <th className="text-center">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedSchedules).map(([doctorName, schedules]) => {
                        const doctorTotalRevenue = schedules.reduce((sum, schedule) => 
                          sum + (parseFloat(schedule.fees || 0) * parseInt(schedule.totalReservations || 0)), 0);
                        
                        return (
                          <React.Fragment key={doctorName}>
                            {schedules.map((schedule, index) => {
                              const revenue = parseFloat(schedule.fees || 0) * parseInt(schedule.totalReservations || 0);
                              return (
                                <tr key={`${doctorName}-${index}`}>
                                  {index === 0 ? (
                                    <td rowSpan={schedules.length + 1} className="fw-bold bg-light">
                                      {doctorName}
                                    </td>
                                  ) : null}
                                  <td>{new Date(schedule.scheduleDate).toLocaleDateString()}</td>
                                  <td>{schedule.scheduleTime}</td>
                                  <td>{schedule.roomNumber || 'N/A'}</td>
                                  <td className="text-center">{schedule.totalReservations}</td>
                                  <td className="text-center">${parseFloat(schedule.fees || 0).toFixed(2)}</td>
                                  <td className="text-center fw-bold text-success">Rs.{revenue.toFixed(2)}</td>
                                </tr>
                              );
                            })}
                            <tr className="table-warning">
                              <td colSpan="3" className="text-end fw-bold">Total for {doctorName}:</td>
                              <td className="text-center fw-bold">
                                {schedules.reduce((sum, s) => sum + parseInt(s.totalReservations || 0), 0)}
                              </td>
                              <td className="text-center fw-bold">-</td>
                              <td className="text-center fw-bold">Rs.{doctorTotalRevenue.toFixed(2)}</td>
                            </tr>
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                  </Table>
                </Card>
              )}
            </Tab>

            <Tab 
              eventKey="futureReport" 
              title={
                <p className="text-black">Future Report</p>
              } 
              className="p-3"
            >
              <div className="mt-4 p-4 text-center text-muted">
                <p>This report will be available in a future update.</p>
              </div>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ReportGeneration;