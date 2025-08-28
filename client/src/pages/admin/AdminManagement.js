import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Form, Button } from 'react-bootstrap';
import { toast , ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const AdminManagement = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'admin' 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/home', { withCredentials: true });
        if (response.status === 200) {
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error)
        navigate('/admin/login')
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/admins', {withCredentials: true});
        setAdmins(response.data);
        setIsSuperAdmin(true);
        setIsLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          toast.error('This page is only accessible by super admins');
          setIsSuperAdmin(false);
        } else {
          toast.error('Failed to fetch admins');
        }
        setIsLoading(false);
      }
    };
    fetchAdmins();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isSuperAdmin) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="text-center">
          <FaExclamationTriangle size={64} className="text-danger mb-4" />
          <h3>This page is only accessible by super admins</h3>
          <p>You do not have permission to view this content.</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/admin/admins', formData, {withCredentials: true});
      setAdmins([...admins, response.data]);
      toast.success('Admin created successfully');
      window.location.reload();
      setFormData({ username: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      toast.error('Failed to create admin');
    }
  };

  const handleToggleBlock = async (id) => {
    try {
      await axios.put(`http://localhost:5000/admin/admins/${id}/block`,{}, {withCredentials: true});
      // Refetch the admins to get the updated status
      const response = await axios.get('http://localhost:5000/admin/admins', {withCredentials: true});
      setAdmins(response.data);
      toast.success('Admin block status toggled successfully');
    } catch (err) {
      toast.error('Failed to toggle block status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Management</h1>
      <ToastContainer />
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
                  {admin.isVerified ? (
                    <span className="badge bg-success">Active</span>
                  ) : (
                    <span className="badge bg-danger">Block</span>
                  )}
                </td>
                <td>
                  <Button 
                    variant={!admin.isVerified ? 'success' : 'danger'} 
                    onClick={() => handleToggleBlock(admin.id)}
                  >
                    {!admin.isVerified ? 'Unblock' : 'Block'}
                  </Button>
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
