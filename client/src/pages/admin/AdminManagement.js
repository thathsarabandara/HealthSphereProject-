import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button, Alert } from 'react-bootstrap';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch existing admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('/api/admins');
        setAdmins(response.data);
      } catch (err) {
        setError('Failed to fetch admins');
      }
    };
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/admins', formData);
      setAdmins([...admins, response.data]);
      setSuccess('Admin created successfully');
      setFormData({ username: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      setError('Failed to create admin');
    }
  };

  const handleBlock = async (id) => {
    try {
      await axios.put(`/api/admins/${id}/block`);
      setAdmins(admins.map(admin => 
        admin.id === id ? { ...admin, isBlocked: true } : admin
      ));
      setSuccess('Admin blocked successfully');
    } catch (err) {
      setError('Failed to block admin');
    }
  };

  const handleUnblock = async (id) => {
    try {
      await axios.put(`/api/admins/${id}/unblock`);
      setAdmins(admins.map(admin => 
        admin.id === id ? { ...admin, isBlocked: false } : admin
      ));
      setSuccess('Admin unblocked successfully');
    } catch (err) {
      setError('Failed to unblock admin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
      
      {/* Success and Error Alerts */}
      {success && <Alert variant="success">{success}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Create Admin Form */}
      <div className="mb-8 pb-5">
        <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
        <Form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md p-5">
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </Form.Select>
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Admin
          </Button>
        </Form>
      </div>

      {/* Admins Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Admins</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map(admin => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.email}</td>
                <td>
                  {admin.isBlocked ? (
                    <span className="badge bg-danger">Blocked</span>
                  ) : (
                    <span className="badge bg-success">Active</span>
                  )}
                </td>
                <td>
                  {admin.isBlocked ? (
                    <Button variant="outline-success" onClick={() => handleUnblock(admin.id)}>
                      Unblock
                    </Button>
                  ) : (
                    <Button variant="outline-danger" onClick={() => handleBlock(admin.id)}>
                      Block
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AdminManagement;
