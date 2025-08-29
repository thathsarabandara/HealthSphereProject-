import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Tabs, Tab, Table, Badge } from 'react-bootstrap';
import { FaFilePdf, FaCalendarAlt, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

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
        setReportData(data);
        setDoctorSummary(sortedDoctorSummary);
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
    if (!reportData.length) {
      toast.warning('No data to export');
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Doctor Schedules Report', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Date Range: ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`, 14, 30);

    doctorSummary.forEach((doctor) => {
      const headers = [['Date', 'Time', 'Room', 'Reservations', 'Fees', 'Revenue']];
      const body = doctor.schedules.map(s => {
        const revenue = parseFloat(s.fees || 0) * parseInt(s.totalReservations || 0);
        return [
          new Date(s.scheduleDate).toLocaleDateString(),
          s.scheduleTime,
          s.roomNumber || 'N/A',
          s.totalReservations,
          `$${parseFloat(s.fees || 0).toFixed(2)}`,
          `$${revenue.toFixed(2)}`
        ];
      });

      doc.autoTable({
        head: headers,
        body,
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 40,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        didDrawPage: (data) => {
          doc.setFontSize(14);
          doc.setTextColor(0, 0, 0);
          doc.text(`Doctor: ${doctor.name}`, 14, data.settings.startY - 5);
        }
      });

      const finalY = doc.lastAutoTable.finalY || 50;
      doc.setFontSize(12);
      doc.text(`Total Clinics: ${doctor.totalClinics}`, 14, finalY + 10);
      doc.text(`Total Reservations: ${doctor.totalReservations}`, 70, finalY + 10);
      doc.text(`Total Revenue: $${doctor.totalRevenue.toFixed(2)}`, 150, finalY + 10);
    });

    doc.save(`doctor-schedules-report-${new Date().toISOString().split('T')[0]}.pdf`);
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
        <Col><h2 className="mb-0">Reports</h2></Col>
      </Row>

      <Card>
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="doctorSchedules" title="Doctor Schedules" className="p-3">
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

              {doctorSummary.length > 0 && (
                <Card>
                  <Card.Header className="bg-light">
                    <h5 className="mb-0">Doctor Schedule Summary</h5>
                    <small className="text-muted">
                      Showing data from {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                    </small>
                  </Card.Header>
                  <Table responsive striped bordered hover className="mb-0">
                    <thead className="table-dark">
                      <tr>
                        <th style={{ width: '30%' }}>Doctor</th>
                        <th className="text-center">Total Clinics</th>
                        <th className="text-center">Total Reservations</th>
                        <th className="text-center">Total Revenue</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorSummary.map((doctor) => (
                        <React.Fragment key={doctor.id}>
                          <tr className={expandedDoctors[doctor.id] ? 'table-active' : ''}>
                            <td>
                              <div className="d-flex align-items-center">
                                <Button 
                                  variant="link" 
                                  className="p-0 me-2" 
                                  onClick={() => toggleDoctorDetails(doctor.id)}
                                >
                                  {expandedDoctors[doctor.id] ? <FaChevronDown /> : <FaChevronRight />}
                                </Button>
                                <span className="fw-medium">{doctor.name}</span>
                              </div>
                            </td>
                            <td className="text-center">
                              <Badge bg="primary" pill>{doctor.totalClinics}</Badge>
                            </td>
                            <td className="text-center">
                              <Badge bg="info" pill>{doctor.totalReservations}</Badge>
                            </td>
                            <td className="text-center fw-bold text-success">
                              ${doctor.totalRevenue.toFixed(2)}
                            </td>
                            <td className="text-center">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => toggleDoctorDetails(doctor.id)}
                              >
                                {expandedDoctors[doctor.id] ? 'Hide Details' : 'View Details'}
                              </Button>
                            </td>
                          </tr>
                          {expandedDoctors[doctor.id] && (
                            <tr>
                              <td colSpan="5" className="p-0">
                                <Card className="m-2 border-primary">
                                  <Card.Header className="bg-primary text-white py-2">
                                    <h6 className="mb-0">Schedule Details for Dr. {doctor.name}</h6>
                                  </Card.Header>
                                  <Table striped bordered hover size="sm" className="mb-0">
                                    <thead>
                                      <tr>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Room</th>
                                        <th className="text-center">Reservations</th>
                                        <th className="text-center">Fees per Clinic</th>
                                        <th className="text-center">Total Revenue</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {doctor.schedules.map((s, idx) => {
                                        const revenue = parseFloat(s.fees || 0) * parseInt(s.totalReservations || 0);
                                        return (
                                          <tr key={idx}>
                                            <td>{new Date(s.scheduleDate).toLocaleDateString()}</td>
                                            <td>{s.scheduleTime}</td>
                                            <td>{s.roomNumber || 'N/A'}</td>
                                            <td className="text-center">{s.totalReservations}</td>
                                            <td className="text-center">${parseFloat(s.fees || 0).toFixed(2)}</td>
                                            <td className="text-center fw-bold">${revenue.toFixed(2)}</td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </Table>
                                </Card>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </Table>
                </Card>
              )}
            </Tab>

            <Tab eventKey="futureReport" title="Future Report" className="p-3">
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