import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
      
      {/* Create Admin Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Admin</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              >
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-black py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Create Admin
          </button>
        </form>
      </div>

      {/* Admins Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Current Admins</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase text-black tracking-wider">ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase text-black tracking-wider">Username</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase text-black tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase text-black tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium uppercase text-black tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map(admin => (
                <tr key={admin.id} className="hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{admin.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {admin.isBlocked ? (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {admin.isBlocked ? (
                      <button
                        onClick={() => handleUnblock(admin.id)}
                        className="px-3 py-1 text-red-600 border border-red-600 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBlock(admin.id)}
                        className="px-3 py-1 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
