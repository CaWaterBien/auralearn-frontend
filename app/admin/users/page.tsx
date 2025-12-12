"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Input, 
  Tag, 
  Modal, 
  Form, 
  Switch, 
  DatePicker, 
  App,
  Popconfirm,
  Tooltip,
  Statistic,
  Row,
  Col,
  Alert
} from "antd";
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  UserOutlined,
  EyeOutlined,
  CopyOutlined,
  WarningOutlined
} from "@ant-design/icons";
import { 
  adminGetUsers, 
  adminGetUser,
  adminCreateUser, 
  adminUpdateUser, 
  adminDeleteUser, 
  adminToggleUserStatus,
  adminGetUserStats,
  type AdminUser,
  type AdminUserCreateData,
  type AdminUserUpdateData 
} from "@/lib/admin-api";
import dayjs from 'dayjs';

const { Search } = Input;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userStats, setUserStats] = useState<{ total: number; active: number; inactive: number; recent: number } | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  const { message } = App.useApp();

  const loadUsers = async (search?: string) => {
    try {
      setLoading(true);
      const res = await adminGetUsers(50, search);
      setUsers(res.users);
    } catch (error) {
      message.error('Failed to load users');
      console.error('Load users error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const res = await adminGetUserStats();
      setUserStats(res.stats);
    } catch (error) {
      console.error('Load user stats error:', error);
    }
  };

  useEffect(() => {
    loadUsers();
    loadUserStats();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    loadUsers(value);
  };

  const handleCreateUser = async (values: AdminUserCreateData) => {
    try {
      await adminCreateUser(values);
      message.success('User created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      loadUsers(searchTerm);
      loadUserStats();
    } catch (error: any) {
      message.error(error?.message || 'Failed to create user');
      console.error('Create user error:', error);
    }
  };

  const handleEditUser = async (values: AdminUserUpdateData) => {
    if (!selectedUser) return;
    
    try {
      await adminUpdateUser(selectedUser.id, values);
      message.success('User updated successfully');
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedUser(null);
      loadUsers(searchTerm);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update user');
      console.error('Update user error:', error);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    try {
      await adminDeleteUser(user.id);
      message.success(`User '${user.name}' deleted successfully`);
      loadUsers(searchTerm);
      loadUserStats();
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete user');
      console.error('Delete user error:', error);
    }
  };

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await adminToggleUserStatus(user.id);
      message.success(`User status updated successfully`);
      loadUsers(searchTerm);
      loadUserStats();
    } catch (error: any) {
      message.error(error?.message || 'Failed to update user status');
      console.error('Toggle status error:', error);
    }
  };

  const handleViewUser = async (user: AdminUser) => {
    try {
      const res = await adminGetUser(user.id);
      setSelectedUser(res.user);
      setViewModalVisible(true);
    } catch (error: any) {
      message.error(error?.message || 'Failed to load user details');
      console.error('View user error:', error);
    }
  };

  const handleEditClick = async (user: AdminUser) => {
    try {
      const res = await adminGetUser(user.id);
      setSelectedUser(res.user);
      editForm.setFieldsValue({
        name: res.user.name,
        full_name: res.user.full_name,
        email: res.user.email,
        is_active: res.user.is_active === 1,
        join_date: res.user.join_date ? dayjs(res.user.join_date) : null,
      });
      setEditModalVisible(true);
    } catch (error: any) {
      message.error(error?.message || 'Failed to load user details');
      console.error('Edit user error:', error);
    }
  };

  const handleResetPassword = async (values: { password: string }) => {
    if (!selectedUser) return;
    
    try {
      await adminUpdateUser(selectedUser.id, { password: values.password });
      message.success(`Password reset successfully for user '${selectedUser.name}'`);
      setResetPasswordModalVisible(false);
      resetPasswordForm.resetFields();
      // Reload user to get updated password hash
      handleViewUser(selectedUser);
    } catch (error: any) {
      message.error(error?.message || 'Failed to reset password');
      console.error('Reset password error:', error);
    }
  };

  const columns = [
    // ID column removed for security - IDs are still used internally for operations
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: AdminUser, b: AdminUser) => a.name.localeCompare(b.name),
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      sorter: (a: AdminUser, b: AdminUser) => a.full_name.localeCompare(b.full_name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a: AdminUser, b: AdminUser) => a.email.localeCompare(b.email),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      width: 80,
      render: (is_active: number, record: AdminUser) => (
        <Tag color={is_active ? 'green' : 'red'} onClick={() => handleToggleStatus(record)} style={{ cursor: 'pointer' }}>
          {is_active ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: 1 },
        { text: 'Inactive', value: 0 },
      ],
      onFilter: (value: any, record: AdminUser) => record.is_active === value,
    },
    {
      title: 'Join Date',
      dataIndex: 'join_date',
      width: 100,
      render: (date: string) => date ? dayjs(date).format('MMM DD, YYYY') : '-',
      sorter: (a: AdminUser, b: AdminUser) => dayjs(a.join_date).unix() - dayjs(b.join_date).unix(),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      width: 100,
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: (a: AdminUser, b: AdminUser) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
    },
    {
      title: 'Actions',
      width: 150,
      render: (_: any, record: AdminUser) => (
        <Space>
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => handleViewUser(record)}
            />
          </Tooltip>
          <Tooltip title="Edit User">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete User"
            description={`Are you sure you want to permanently delete '${record.name}'? This action cannot be undone.`}
            onConfirm={() => handleDeleteUser(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete User">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* Statistics Cards */}
      {userStats && (
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Users"
                value={userStats.total}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Active Users"
                value={userStats.active}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Inactive Users"
                value={userStats.inactive}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="Recent (7 days)"
                value={userStats.recent}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Users Card */}
      <Card 
        title={<span style={{ color: "#111827" }}>User Management</span>} 
        style={{ borderRadius: 12, background: "#ffffff" }}
        extra={
          <Space>
            <Search
              placeholder="Search users..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
              enterButton={<SearchOutlined />}
            />
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={() => loadUsers(searchTerm)}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setCreateModalVisible(true)}
            >
              Create User
            </Button>
          </Space>
        }
      >
        <Typography.Paragraph type="secondary" style={{ marginTop: -8 }}>
          Manage users - create, edit, delete, and toggle status.
        </Typography.Paragraph>
        
        <Table<AdminUser>
          rowKey="id"
          loading={loading}
          dataSource={users}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      {/* Create User Modal */}
      <Modal
        title="Create New User"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>
          
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Please enter password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          
          <Form.Item
            name="join_date"
            label="Join Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="is_active"
            label="Active Status"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        title="Edit User"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditUser}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter user name' }]}
          >
            <Input placeholder="Enter user name" />
          </Form.Item>
          
          <Form.Item
            name="full_name"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter full name' }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>
          
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter email' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          
          <Form.Item
            name="password"
            label="Password (leave empty to keep current)"
            rules={[
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
            extra={
              selectedUser?.password_hash && (
                <div style={{ marginTop: 8 }}>
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>Current hash:</Typography.Text>
                  <Typography.Text 
                    style={{ 
                      fontSize: '10px',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      background: '#f5f5f5',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      display: 'block',
                      marginTop: '4px'
                    }}
                  >
                    {selectedUser.password_hash}
                  </Typography.Text>
                </div>
              )
            }
          >
            <Input.Password placeholder="Enter new password (optional)" />
          </Form.Item>
          
          <Form.Item
            name="join_date"
            label="Join Date"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="is_active"
            label="Active Status"
            valuePropName="checked"
          >
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedUser(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update User
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View User Modal */}
      <Modal
        title="User Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedUser(null);
        }}
        footer={[
          <Button 
            key="reset-password" 
            type="primary"
            danger
            onClick={() => {
              setResetPasswordModalVisible(true);
            }}
          >
            Reset Password
          </Button>,
          <Button key="close" onClick={() => {
            setViewModalVisible(false);
            setSelectedUser(null);
          }}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedUser && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                {/* ID hidden for security */}
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Name:</Typography.Text>
                  <br />
                  <Typography.Text>{selectedUser.name}</Typography.Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Full Name:</Typography.Text>
                  <br />
                  <Typography.Text>{selectedUser.full_name}</Typography.Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Email:</Typography.Text>
                  <br />
                  <Typography.Text>{selectedUser.email}</Typography.Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Password Hash:</Typography.Text>
                  <Space style={{ marginLeft: 8 }}>
                    <Tooltip title="Copy hash to clipboard">
                      <Button 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => {
                          if (selectedUser.password_hash) {
                            navigator.clipboard.writeText(selectedUser.password_hash);
                            message.success('Password hash copied to clipboard');
                          }
                        }}
                      />
                    </Tooltip>
                  </Space>
                  <br />
                  <Typography.Text 
                    style={{ 
                      fontSize: '11px', 
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                      background: '#f5f5f5',
                      padding: '8px',
                      borderRadius: '4px',
                      display: 'block',
                      marginTop: '4px'
                    }}
                  >
                    {selectedUser.password_hash || 'Not available'}
                  </Typography.Text>
                  <Alert
                    message="Security Notice"
                    description="This is a bcrypt hash of the user's password. Hashes are one-way encrypted and cannot be reversed to reveal the original password. To change a user's password, use the Edit function."
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    style={{ marginTop: 8, fontSize: '11px' }}
                  />
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Status:</Typography.Text>
                  <br />
                  <Tag color={selectedUser.is_active ? 'green' : 'red'}>
                    {selectedUser.is_active ? 'Active' : 'Inactive'}
                  </Tag>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Join Date:</Typography.Text>
                  <br />
                  <Typography.Text>
                    {selectedUser.join_date ? dayjs(selectedUser.join_date).format('MMMM DD, YYYY') : 'Not set'}
                  </Typography.Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Created:</Typography.Text>
                  <br />
                  <Typography.Text>{dayjs(selectedUser.created_at).format('MMMM DD, YYYY HH:mm')}</Typography.Text>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Typography.Text strong>Last Updated:</Typography.Text>
                  <br />
                  <Typography.Text>
                    {selectedUser.updated_at ? dayjs(selectedUser.updated_at).format('MMMM DD, YYYY HH:mm') : 'Never'}
                  </Typography.Text>
                </div>
              </Col>
            </Row>
            
            {selectedUser.progress && (
              <div style={{ marginTop: 24 }}>
                <Typography.Text strong>Learning Progress:</Typography.Text>
                <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, marginTop: 8 }}>
                  <pre style={{ margin: 0, fontSize: 12 }}>
                    {JSON.stringify(selectedUser.progress, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {selectedUser.preferences && (
              <div style={{ marginTop: 16 }}>
                <Typography.Text strong>Preferences:</Typography.Text>
                <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 6, marginTop: 8 }}>
                  <pre style={{ margin: 0, fontSize: 12 }}>
                    {JSON.stringify(selectedUser.preferences, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password for ${selectedUser?.name}`}
        open={resetPasswordModalVisible}
        onCancel={() => {
          setResetPasswordModalVisible(false);
          resetPasswordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Alert
          message="Admin Password Reset"
          description="You are about to reset this user's password. The user will need to use the new password to log in."
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
        
        <Form
          form={resetPasswordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Form.Item
            name="password"
            label="New Password"
            rules={[
              { required: true, message: 'Please enter a new password' },
              { min: 8, message: 'Password must be at least 8 characters' }
            ]}
          >
            <Input.Password 
              placeholder="Enter new password" 
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm the password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm new password" 
              autoComplete="new-password"
            />
          </Form.Item>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setResetPasswordModalVisible(false);
                resetPasswordForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" danger htmlType="submit">
                Reset Password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
} 