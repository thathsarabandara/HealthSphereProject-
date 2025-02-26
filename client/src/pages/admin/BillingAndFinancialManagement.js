import React,{ useState, useEffect } from "react";
import { Button, Table, Container, Row, Col } from "react-bootstrap";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const refundRequests = [
  { id: "D001", name: "Nathasha", receipt: "Receipt", amount: "Rs. 2000.00", date: "2024/10/04", time: "11:00 P.M." },
  { id: "D001", name: "Nathasha", receipt: "Receipt", amount: "Rs. 2000.00", date: "2024/10/04", time: "11:00 P.M." },
  { id: "D001", name: "Nathasha", receipt: "Receipt", amount: "Rs. 2000.00", date: "2024/10/04", time: "11:00 P.M." },
  { id: "D001", name: "Nathasha", receipt: "Receipt", amount: "Rs. 2000.00", date: "2024/10/04", time: "11:00 P.M." },
  { id: "D001", name: "Nathasha", receipt: "Receipt", amount: "Rs. 2000.00", date: "2024/10/04", time: "11:00 P.M." },
];

const revenueData = [
  { month: "Jan", revenue: 500 },
  { month: "Feb", revenue: 400 },
  { month: "Mar", revenue: 600 },
  { month: "Apr", revenue: 650 },
  { month: "May", revenue: 700 },
  { month: "Jun", revenue: 800 },
];

function BillingAndFinancialManagement() {


  const [dateTime, setDateTime] = useState(new Date().toLocaleString());
  
    useEffect(() => {
      const interval = setInterval(() => {
        setDateTime(new Date().toLocaleString());
      }, 1000); // Update every second
  
      return () => clearInterval(interval); // Cleanup on component unmount
    }, []);


    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    };
  


  return (

   

    <Container fluid className="p-3" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Date and Time Button */}
      
      <div style={headerStyle}>
        <h4>Billing & financial management</h4>
        <p style={{backgroundColor: "#bacae7", borderRadius: "10px", textAlign: "center", padding: "5px"}}> {dateTime}</p>
      </div>
      

      {/* Revenue Graph */}
      <Row className="mb-4">
        <Col>
          <div className="border p-3 bg-white shadow-sm">
            <h5 className="text-center">Revenue</h5>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <XAxis dataKey="month" label={{ value: "Months", position: "insideBottom", offset: -5 }} />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={2} />
                <ReferenceLine y={972} label="972" stroke="red" strokeDasharray="3 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>

      {/* Refund Requests */}
      <Row>
        <Col>
          <h5>Refund Requests</h5>
          <div className="table-responsive">
            <Table striped bordered hover className="text-center">
              <thead className="bg-primary text-white">
                <tr>
                  <th>Patient Id</th>
                  <th>First Name</th>
                  <th>Receipt No</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refundRequests.map((req, index) => (
                  <tr key={index}>
                    <td>{req.id}</td>
                    <td>{req.name}</td>
                    <td>{req.receipt}</td>
                    <td>{req.amount}</td>
                    <td>{req.date}</td>
                    <td>{req.time}</td>
                    <td>
                      <Button variant="success" className="me-2">Accept</Button>
                      <Button variant="danger">Reject</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BillingAndFinancialManagement;






