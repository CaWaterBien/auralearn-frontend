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
  App,
  Popconfirm,
  Tooltip,
  Select,
  InputNumber,
  Badge,
  Row,
  Col,
  Statistic
} from "antd";
import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  BookOutlined,
  EyeOutlined,
  CopyOutlined,
  FileTextOutlined,
  CodeOutlined
} from "@ant-design/icons";
import { 
  adminGetCourses,
  adminCreateCourse,
  adminUpdateCourse,
  adminDeleteCourse,
  adminToggleCoursePublished,
  type AdminCourse,
  type AdminCourseCreateData,
  type AdminCourseUpdateData
} from "@/lib/admin-api";
import { useRouter } from "next/navigation";

const { Search } = Input;
const { TextArea } = Input;

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<AdminCourse | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const { message } = App.useApp();
  const router = useRouter();

  const loadCourses = async (search?: string) => {
    try {
      setLoading(true);
      const res = await adminGetCourses(search);
      setCourses(res.courses);
    } catch (error) {
      message.error('Failed to load courses');
      console.error('Load courses error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    loadCourses(value);
  };

  const handleCreateCourse = async (values: AdminCourseCreateData) => {
    try {
      await adminCreateCourse(values);
      message.success('Course created successfully');
      setCreateModalVisible(false);
      createForm.resetFields();
      loadCourses(searchTerm);
    } catch (error: any) {
      message.error(error?.message || 'Failed to create course');
      console.error('Create course error:', error);
    }
  };

  const handleUpdateCourse = async (values: AdminCourseUpdateData) => {
    if (!selectedCourse) return;
    
    try {
      await adminUpdateCourse(selectedCourse.id, values);
      message.success('Course updated successfully');
      setEditModalVisible(false);
      editForm.resetFields();
      setSelectedCourse(null);
      loadCourses(searchTerm);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update course');
      console.error('Update course error:', error);
    }
  };

  const handleDeleteCourse = async (course: AdminCourse) => {
    try {
      await adminDeleteCourse(course.id);
      message.success(`Course '${course.title}' deleted successfully`);
      loadCourses(searchTerm);
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete course');
      console.error('Delete course error:', error);
    }
  };

  const handleTogglePublished = async (course: AdminCourse) => {
    try {
      await adminToggleCoursePublished(course.id);
      message.success(`Course ${course.is_published ? 'unpublished' : 'published'} successfully`);
      loadCourses(searchTerm);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update course status');
      console.error('Toggle published error:', error);
    }
  };

  const handleEditClick = (course: AdminCourse) => {
    setSelectedCourse(course);
    editForm.setFieldsValue({
      title: course.title,
      description: course.description,
      category: course.category,
      difficulty_level: course.difficulty_level,
      tags: course.tags,
      is_free: course.is_free,
      is_published: course.is_published,
      order_index: course.order_index,
    });
    setEditModalVisible(true);
  };

  const handleManageLessons = (course: AdminCourse) => {
    router.push(`/admin/courses/${course.id}/lessons`);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: AdminCourse) => (
        <Space>
          <Typography.Text strong>{title}</Typography.Text>
          {record.is_free && <Tag color="green">Free</Tag>}
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => (
        <Tag color="blue">{category || 'Uncategorized'}</Tag>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty_level',
      key: 'difficulty_level',
      render: (level: string) => {
        const colors: Record<string, string> = {
          beginner: 'green',
          intermediate: 'orange',
          advanced: 'red'
        };
        return <Tag color={colors[level] || 'default'}>{level}</Tag>;
      },
    },
    {
      title: 'Lessons',
      dataIndex: 'total_lessons',
      key: 'total_lessons',
      width: 100,
      render: (count: number) => (
        <Badge count={count} showZero style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'duration_hours',
      key: 'duration_hours',
      width: 100,
      render: (hours: number) => `${hours || 0}h`,
    },
    {
      title: 'Status',
      dataIndex: 'is_published',
      key: 'is_published',
      width: 100,
      render: (is_published: boolean, record: AdminCourse) => (
        <Switch
          checked={is_published}
          onChange={() => handleTogglePublished(record)}
          checkedChildren="Published"
          unCheckedChildren="Draft"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_: any, record: AdminCourse) => (
        <Space>
          <Tooltip title="Manage Lessons">
            <Button
              type="primary"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleManageLessons(record)}
            >
              Lessons
            </Button>
          </Tooltip>
          <Tooltip title="Edit Course">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditClick(record)}
            />
          </Tooltip>
          <Tooltip title="Duplicate Course">
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => message.info('Duplicate feature coming soon')}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Course"
            description={`Are you sure you want to delete '${record.title}'? This will also delete all lessons and content.`}
            onConfirm={() => handleDeleteCourse(record)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Course">
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

  // Course statistics
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(c => c.is_published).length;
  const totalLessons = courses.reduce((sum, c) => sum + (c.total_lessons || 0), 0);
  const totalHours = courses.reduce((sum, c) => sum + (c.duration_hours || 0), 0);

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Courses"
              value={totalCourses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Published"
              value={publishedCourses}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Lessons"
              value={totalLessons}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Hours"
              value={totalHours}
              suffix="h"
            />
          </Card>
        </Col>
      </Row>

      {/* Main Courses Card */}
      <Card 
        title={<span style={{ color: "#111827" }}>Course Management</span>} 
        style={{ borderRadius: 12, background: "#ffffff" }}
        extra={
          <Space>
            <Search
              placeholder="Search courses..."
              allowClear
              onSearch={handleSearch}
              style={{ width: 200 }}
              enterButton={<SearchOutlined />}
            />
            <Button
              type="default"
              icon={<ReloadOutlined />}
              onClick={() => loadCourses(searchTerm)}
            >
              Refresh
            </Button>
           
          </Space>
        }
      >
        <Typography.Paragraph type="secondary" style={{ marginTop: -8 }}>
          Manage courses, lessons, and learning content for your platform.
        </Typography.Paragraph>
        
        <Table
          rowKey="id"
          loading={loading}
          dataSource={courses}
          columns={columns}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} courses`,
          }}
        />
      </Card>

      {/* Create Course Modal */}
      <Modal
        title="Create New Course"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          createForm.resetFields();
        }}
        footer={null}
        width={700}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateCourse}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: 'Please enter course title' }]}
              >
                <Input placeholder="e.g., HTML5 Tutorial" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                initialValue="web-development"
              >
                <Select>
                  <Select.Option value="web-development">Web Development</Select.Option>
                  <Select.Option value="programming">Programming</Select.Option>
                  <Select.Option value="design">Design</Select.Option>
                  <Select.Option value="database">Database</Select.Option>
                  <Select.Option value="mobile">Mobile Development</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea 
              rows={4} 
              placeholder="Describe what students will learn in this course" 
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficulty_level"
                label="Difficulty Level"
                initialValue="beginner"
              >
                <Select>
                  <Select.Option value="beginner">Beginner</Select.Option>
                  <Select.Option value="intermediate">Intermediate</Select.Option>
                  <Select.Option value="advanced">Advanced</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="order_index"
                label="Display Order"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tags"
                label="Tags (comma separated)"
              >
                <Input placeholder="HTML, CSS, JavaScript" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="is_free"
                label="Free Course"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="is_published"
                label="Publish Immediately"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false);
                createForm.resetFields();
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Create Course
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal
        title="Edit Course"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          editForm.resetFields();
          setSelectedCourse(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateCourse}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Course Title"
                rules={[{ required: true, message: 'Please enter course title' }]}
              >
                <Input placeholder="e.g., HTML5 Tutorial" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
              >
                <Select>
                  <Select.Option value="web-development">Web Development</Select.Option>
                  <Select.Option value="programming">Programming</Select.Option>
                  <Select.Option value="design">Design</Select.Option>
                  <Select.Option value="database">Database</Select.Option>
                  <Select.Option value="mobile">Mobile Development</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea 
              rows={4} 
              placeholder="Describe what students will learn in this course" 
            />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="difficulty_level"
                label="Difficulty Level"
              >
                <Select>
                  <Select.Option value="beginner">Beginner</Select.Option>
                  <Select.Option value="intermediate">Intermediate</Select.Option>
                  <Select.Option value="advanced">Advanced</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="order_index"
                label="Display Order"
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="tags"
                label="Tags"
              >
                <Input placeholder="HTML, CSS, JavaScript" />
              </Form.Item>
            </Col>
          </Row>
          
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="is_free"
                label="Free Course"
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="is_published"
                label="Published"
                valuePropName="checked"
              >
                <Switch checkedChildren="Yes" unCheckedChildren="No" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setEditModalVisible(false);
                editForm.resetFields();
                setSelectedCourse(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Update Course
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
