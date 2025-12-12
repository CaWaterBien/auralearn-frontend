"use client";

import { useEffect, useState } from "react";
import { 
  Table, 
  Card, 
  Typography, 
  Button, 
  Space, 
  Tag, 
  Modal, 
  Form, 
  Switch, 
  App,
  Popconfirm,
  Tooltip,
  InputNumber,
  Breadcrumb,
  Select,
  Tabs,
  Input,
  Row,
  Col,
  Badge,
  Empty,
  List,
  Collapse
} from "antd";
import type { TabsProps } from "antd";

// Helper function to convert storage paths to relative URLs for Next.js proxy
const getStorageUrl = (path: string) => {
  // Strip localhost URLs - these were saved when uploading locally
  if (path.includes('localhost:8000')) {
    let storagePath = path.split('localhost:8000')[1]; // Get path after localhost:8000
    return storagePath.replace(/^\/+/, '/'); // Remove multiple leading slashes
  }
  
  // Strip Heroku URLs and use relative path for proxy
  if (path.includes('.herokuapp.com')) {
    let storagePath = path.split('.herokuapp.com')[1]; // Get path after domain
    return storagePath.replace(/^\/+/, '/'); // Remove multiple leading slashes
  }
  
  // If it's any other full URL (external), return as-is
  if (path.startsWith('http')) return path;
  
  // Handle relative paths
  if (path.startsWith('/storage/')) return path; // Already has /storage/
  if (path.startsWith('storage/')) return `/${path}`; // Add leading slash
  return `/storage/${path}`; // Add /storage/ prefix
};
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  ReloadOutlined,
  BookOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  CodeOutlined,
  DragOutlined,
  LockOutlined,
  UnlockOutlined,
  EyeOutlined
} from "@ant-design/icons";
import { 
  adminGetCourse,
  adminGetLessons,
  adminGetLesson,
  adminCreateLesson,
  adminUpdateLesson,
  adminDeleteLesson,
  adminCreateTopic,
  adminUpdateTopic,
  adminDeleteTopic,
  adminCreateCodeExample,
  adminUpdateCodeExample,
  adminDeleteCodeExample,
  adminCreateActivity,
  adminUpdateActivity,
  adminDeleteActivity,
  type AdminCourse,
  type AdminLesson,
  type AdminTopic,
  type AdminCodeExample,
  type AdminActivity
} from "@/lib/admin-api";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";

const { TextArea } = Input;
const { Panel } = Collapse;
const { Text } = Typography;


// Dynamic import for code editor
const CodeEditor = dynamic(() => import("@/components/admin/CodeEditor"), { 
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

// Dynamic import for rich text editor
const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), {
  ssr: false,
  loading: () => <div>Loading rich text editor...</div>
});

// Dynamic import for upload components
const ImageUpload = dynamic(() => import("@/components/admin/ImageUpload"), {
  ssr: false,
  loading: () => <div>Loading image upload...</div>
});

const VideoUpload = dynamic(() => import("@/components/admin/VideoUpload"), {
  ssr: false,
  loading: () => <div>Loading video upload...</div>
});

export default function AdminLessonsPage() {
  const params = useParams();
  const courseId = params?.courseId as string;
  const [course, setCourse] = useState<AdminCourse | null>(null);
  const [lessons, setLessons] = useState<AdminLesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<AdminLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [topicModalVisible, setTopicModalVisible] = useState(false);
  const [codeExampleModalVisible, setCodeExampleModalVisible] = useState(false);
  const [activityModalVisible, setActivityModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<AdminTopic | null>(null);
  const [selectedCodeExample, setSelectedCodeExample] = useState<AdminCodeExample | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<AdminActivity | null>(null);
  const [viewCodeModalVisible, setViewCodeModalVisible] = useState(false);
  const [viewingCodeExample, setViewingCodeExample] = useState<AdminCodeExample | null>(null);
  
  const [lessonForm] = Form.useForm();
  const [topicForm] = Form.useForm();
  const [codeExampleForm] = Form.useForm();
  const [activityForm] = Form.useForm();
  
  const { message } = App.useApp();
  const router = useRouter();

  const loadCourseAndLessons = async () => {
    try {
      setLoading(true);
      const [courseRes, lessonsRes] = await Promise.all([
        adminGetCourse(courseId),
        adminGetLessons(courseId)
      ]);
      setCourse(courseRes.course);
      setLessons(lessonsRes.lessons);
      
      // If no lesson is selected, select the first lesson
      if (lessonsRes.lessons.length > 0 && !selectedLesson) {
        const firstLesson = lessonsRes.lessons[0];
        setSelectedLesson(firstLesson);
        // Also load detailed view to ensure all relationships are loaded
        await loadLessonDetails(firstLesson);
      }
    } catch (error) {
      message.error('Failed to load course data');
      console.error('Load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLessonDetails = async (lesson: AdminLesson) => {
    try {
      // Get full lesson details including relationships
      const lessonRes = await adminGetLesson(courseId, lesson.id);
      
      // Ensure we're setting the lesson with all its data
      setSelectedLesson({
        ...lessonRes.lesson,
        codeExamples: lessonRes.lesson.codeExamples || [],
        topics: lessonRes.lesson.topics || [],
        activities: lessonRes.lesson.activities || []
      });
    } catch (error) {
      console.error('Failed to load lesson details:', error);
      // Fallback to the lesson data we have - use what we have from the list
      // Make sure counts are preserved
      const lessonWithCounts = {
        ...lesson,
        topics_count: lesson.topics?.length || lesson.topics_count || 0,
        exercises_count: lesson.codeExamples?.length || lesson.exercises_count || 0,
        activities_count: lesson.activities?.length || lesson.activities_count || 0,
        codeExamples: lesson.codeExamples || [],
        topics: lesson.topics || [],
        activities: lesson.activities || []
      };
      setSelectedLesson(lessonWithCounts);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadCourseAndLessons();
    }
  }, [courseId]);

  // Lesson CRUD operations
  const handleCreateLesson = async (values: any) => {
    try {
      await adminCreateLesson(courseId, values);
      message.success('Lesson created successfully');
      setLessonModalVisible(false);
      lessonForm.resetFields();
      loadCourseAndLessons();
    } catch (error: any) {
      message.error(error?.message || 'Failed to create lesson');
    }
  };

  const handleUpdateLesson = async (values: any) => {
    if (!selectedLesson) return;
    try {
      await adminUpdateLesson(courseId, selectedLesson.id, values);
      message.success('Lesson updated successfully');
      setLessonModalVisible(false);
      lessonForm.resetFields();
      setEditMode(false);
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update lesson');
    }
  };

  const handleDeleteLesson = async (lesson: AdminLesson) => {
    try {
      await adminDeleteLesson(courseId, lesson.id);
      message.success(`Lesson '${lesson.title}' deleted successfully`);
      if (selectedLesson?.id === lesson.id) {
        setSelectedLesson(null);
      }
      loadCourseAndLessons();
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete lesson');
    }
  };

  // Topic CRUD operations
  const handleCreateTopic = async (values: any) => {
    if (!selectedLesson) return;
    try {
      await adminCreateTopic(selectedLesson.id, values);
      message.success('Topic created successfully');
      setTopicModalVisible(false);
      topicForm.resetFields();
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to create topic');
    }
  };

  const handleUpdateTopic = async (values: any) => {
    if (!selectedLesson || !selectedTopic) return;
    try {
      await adminUpdateTopic(selectedLesson.id, selectedTopic.id, values);
      message.success('Topic updated successfully');
      setTopicModalVisible(false);
      topicForm.resetFields();
      setSelectedTopic(null);
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update topic');
    }
  };

  const handleDeleteTopic = async (topic: AdminTopic) => {
    if (!selectedLesson) return;
    try {
      await adminDeleteTopic(selectedLesson.id, topic.id);
      message.success('Topic deleted successfully');
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete topic');
    }
  };

  // Code Example CRUD operations
  const handleCreateCodeExample = async (values: any) => {
    if (!selectedLesson) return;
    try {
      const data = {
        ...values,
        lesson_id: selectedLesson.id,
        topic_id: values.topic_id || null  // Convert empty string to null for backend
      };
      await adminCreateCodeExample(data);
      message.success('Code example created successfully');
      setCodeExampleModalVisible(false);
      codeExampleForm.resetFields();
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      // Reload the lesson details to get fresh data
      const updatedLessons = await adminGetLessons(courseId);
      const updatedLesson = updatedLessons.lessons.find(l => l.id === selectedLesson.id);
      if (updatedLesson) {
        await loadLessonDetails(updatedLesson);
      }
    } catch (error: any) {
      message.error(error?.message || 'Failed to create code example');
    }
  };

  const handleUpdateCodeExample = async (values: any) => {
    if (!selectedCodeExample || !selectedLesson) return;
    try {
      const data = {
        ...values,
        topic_id: values.topic_id || null  // Convert empty string to null for backend
      };
      await adminUpdateCodeExample(selectedCodeExample.id, data);
      message.success('Code example updated successfully');
      setCodeExampleModalVisible(false);
      codeExampleForm.resetFields();
      setSelectedCodeExample(null);
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update code example');
    }
  };

  const handleDeleteCodeExample = async (codeExample: AdminCodeExample) => {
    if (!selectedLesson) return;
    try {
      await adminDeleteCodeExample(codeExample.id);
      message.success('Code example deleted successfully');
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete code example');
    }
  };

  // Activity CRUD operations
  const handleCreateActivity = async (values: any) => {
    if (!selectedLesson) return;
    try {
      await adminCreateActivity(selectedLesson.id, values);
      message.success('Activity created successfully');
      setActivityModalVisible(false);
      activityForm.resetFields();
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to create activity');
    }
  };

  const handleUpdateActivity = async (values: any) => {
    if (!selectedLesson || !selectedActivity) return;
    try {
      await adminUpdateActivity(selectedLesson.id, selectedActivity.id, values);
      message.success('Activity updated successfully');
      setActivityModalVisible(false);
      activityForm.resetFields();
      setSelectedActivity(null);
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to update activity');
    }
  };

  const handleDeleteActivity = async (activity: AdminActivity) => {
    if (!selectedLesson) return;
    try {
      await adminDeleteActivity(selectedLesson.id, activity.id);
      message.success('Activity deleted successfully');
      // Reload both the lesson list and the selected lesson details
      await loadCourseAndLessons();
      await loadLessonDetails(selectedLesson);
    } catch (error: any) {
      message.error(error?.message || 'Failed to delete activity');
    }
  };

  // Render lesson content
  const renderLessonContent = () => {
    if (!selectedLesson) {
      return <Empty description="Select a lesson to view its content" />;
    }



    return (
      <div>
        <Card style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Space>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {selectedLesson.title}
                </Typography.Title>
                {selectedLesson.is_locked && <Tag icon={<LockOutlined />} color="warning">Locked</Tag>}
                {!selectedLesson.is_published && <Tag color="default">Draft</Tag>}
              </Space>
            </Col>
            <Col>
              <Space>
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditMode(true);
                    lessonForm.setFieldsValue({
                      title: selectedLesson.title,
                      description: selectedLesson.description,
                      content: selectedLesson.content,
                      lesson_type: selectedLesson.lesson_type,
                      duration_minutes: selectedLesson.duration_minutes,
                      is_locked: selectedLesson.is_locked,
                      is_published: selectedLesson.is_published,
                      order_index: selectedLesson.order_index
                    });
                    setLessonModalVisible(true);
                  }}
                >
                  Edit Lesson
                </Button>
                <Button 
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setTopicModalVisible(true)}
                >
                  Add Topic
                </Button>
                <Button 
                  type="primary"
                  icon={<CodeOutlined />}
                  onClick={() => setCodeExampleModalVisible(true)}
                >
                  Add Code Example
                </Button>
                <Button 
                  type="primary"
                  icon={<FileTextOutlined />}
                  onClick={() => setActivityModalVisible(true)}
                >
                  Add Activity
                </Button>
                <Tooltip title="Refresh Lesson Data">
                  <Button
                    icon={<ReloadOutlined />}
                    onClick={async () => {
                      message.info('Refreshing lesson data...');
                      await loadLessonDetails(selectedLesson);
                      message.success('Lesson data refreshed');
                    }}
                  />
                </Tooltip>
              </Space>
            </Col>
          </Row>
          
          {selectedLesson.description && (
            <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
              {selectedLesson.description}
            </Typography.Paragraph>
          )}
        </Card>

        <Tabs 
          defaultActiveKey="content"
          items={[
            {
              key: 'content',
              label: 'Lesson Content',
              children: (
                <Card>
                  {selectedLesson.content ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedLesson.content }} />
                  ) : (
                    <Empty description="No content yet. Edit the lesson to add content." />
                  )}
                </Card>
              ),
            },
            {
              key: 'topics',
              label: `Topics (${selectedLesson.topics?.length || selectedLesson.topics_count || 0})`,
              children: selectedLesson.topics && selectedLesson.topics.length > 0 ? (
                <List
                  dataSource={selectedLesson.topics}
                  renderItem={(topic: AdminTopic) => (
                    <List.Item
                      key={topic.id}
                      actions={[
                        <Button 
                          type="text" 
                          icon={<EditOutlined />}
                          onClick={() => {
                            setSelectedTopic(topic);
                            topicForm.setFieldsValue({
                              title: topic.title,
                              content: topic.content,
                              content_type: topic.content_type,
                              order_index: topic.order_index
                            });
                            setTopicModalVisible(true);
                          }}
                        />,
                        <Popconfirm
                          title="Delete Topic"
                          description="Are you sure you want to delete this topic?"
                          onConfirm={() => handleDeleteTopic(topic)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        title={topic.title}
                        description={
                          <div>
                            <Tag>{topic.content_type}</Tag>
                            {topic.content && (
                              <div style={{ marginTop: 8 }}>
                                {topic.content_type === 'image' && (
                                  <div style={{ marginBottom: 8 }}>
                                    <img 
                                      src={getStorageUrl(topic.content)}
                                      alt={topic.title}
                                      style={{ 
                                        maxWidth: 200, 
                                        maxHeight: 120, 
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        border: '1px solid #d9d9d9'
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                {topic.content_type === 'video' && (
                                  <div style={{ marginBottom: 8 }}>
                                    <video 
                                      src={getStorageUrl(topic.content)}
                                      style={{ 
                                        maxWidth: 200, 
                                        maxHeight: 120, 
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        border: '1px solid #d9d9d9'
                                      }}
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  </div>
                                )}
                                <Typography.Paragraph 
                                  ellipsis={{ rows: topic.content_type === 'text' ? 2 : 1 }} 
                                  style={{ fontSize: 12, color: '#666' }}
                                >
                                  {topic.content_type === 'text' 
                                    ? topic.content.replace(/<[^>]*>/g, '').substring(0, 100) 
                                    : topic.content
                                  }
                                </Typography.Paragraph>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No topics yet. Click 'Add Topic' to create one." />
              ),
            },
            {
              key: 'code',
              label: (
                <Space>
                  <span>Code Examples ({selectedLesson.codeExamples?.length || selectedLesson.exercises_count || 0})</span>
                  <Tooltip title="Refresh">
                    <Button
                      type="text"
                      size="small"
                      icon={<ReloadOutlined />}
                      onClick={async (e) => {
                        e.stopPropagation();
                        await loadLessonDetails(selectedLesson);
                        message.success('Code examples refreshed');
                      }}
                    />
                  </Tooltip>
                </Space>
              ),
              children: (selectedLesson.codeExamples && Array.isArray(selectedLesson.codeExamples) && selectedLesson.codeExamples.length > 0) ? (
                <List
                  dataSource={selectedLesson.codeExamples}
                  renderItem={(example: AdminCodeExample) => (
                    <List.Item
                      key={example.id}
                      actions={[
                        <Tooltip title="View Code">
                          <Button 
                            type="text" 
                            icon={<EyeOutlined />}
                            onClick={() => {
                              setViewingCodeExample(example);
                              setViewCodeModalVisible(true);
                            }}
                          />
                        </Tooltip>,
                        <Tooltip title="Edit">
                          <Button 
                            type="text" 
                            icon={<EditOutlined />}
                            onClick={() => {
                              setSelectedCodeExample(example);
                              codeExampleForm.setFieldsValue({
                                title: example.title,
                                description: example.description,
                                language: example.language,
                                initial_code: example.initial_code,
                                solution_code: example.solution_code,
                                hints: example.hints,
                                is_interactive: example.is_interactive,
                                show_preview: example.show_preview,
                                allow_reset: example.allow_reset,
                                topic_id: example.topic_id
                              });
                              setCodeExampleModalVisible(true);
                            }}
                          />
                        </Tooltip>,
                        <Popconfirm
                          title="Delete Code Example"
                          description="Are you sure you want to delete this code example?"
                          onConfirm={() => handleDeleteCodeExample(example)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        title={example.title}
                        description={
                          <div>
                            <Space>
                              <Tag color="blue">{example.language}</Tag>
                              {example.is_interactive && <Tag color="green">Interactive</Tag>}
                              {example.show_preview && <Tag color="cyan">Preview</Tag>}
                              {example.topic_id ? (
                                <Tag color="purple">
                                  Topic: {selectedLesson.topics?.find(t => t.id === example.topic_id)?.title || 'Unknown'}
                                </Tag>
                              ) : (
                                <Tag color="orange">Lesson-level</Tag>
                              )}
                            </Space>
                            {example.description && (
                              <Typography.Paragraph 
                                ellipsis={{ rows: 2 }} 
                                style={{ marginTop: 8 }}
                              >
                                {example.description}
                              </Typography.Paragraph>
                            )}
                            {/* Code Preview */}
                            {example.initial_code && (
                              <div style={{ marginTop: 12 }}>
                                <Typography.Text strong style={{ display: 'block', marginBottom: 8 }}>
                                  Code Preview:
                                </Typography.Text>
                                <div style={{ 
                                  backgroundColor: '#f5f5f5', 
                                  border: '1px solid #d9d9d9',
                                  borderRadius: 4,
                                  padding: 12,
                                  overflow: 'auto',
                                  maxHeight: 200
                                }}>
                                  <pre style={{ 
                                    margin: 0, 
                                    fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                                    fontSize: 12,
                                    lineHeight: 1.5
                                  }}>
                                    <code>{example.initial_code}</code>
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No code examples yet. Click 'Add Code Example' to create one." />
              ),
            },
            {
              key: 'activities',
              label: `Activities (${selectedLesson.activities?.length || selectedLesson.activities_count || 0})`,
              children: selectedLesson.activities && selectedLesson.activities.length > 0 ? (
                <List
                  dataSource={selectedLesson.activities}
                  renderItem={(activity: AdminActivity) => (
                    <List.Item
                      key={activity.id}
                      actions={[
                        <Button 
                          type="text" 
                          icon={<EditOutlined />}
                          onClick={() => {
                            setSelectedActivity(activity);
                            activityForm.setFieldsValue({
                              title: activity.title,
                              description: activity.description,
                              activity_type: activity.activity_type,
                              instructions: activity.instructions,
                              time_limit: activity.time_limit,
                              max_attempts: activity.max_attempts,
                              passing_score: activity.passing_score,
                              points: activity.points,
                              is_required: activity.is_required,
                              is_published: activity.is_published
                            });
                            setActivityModalVisible(true);
                          }}
                        />,
                        <Popconfirm
                          title="Delete Activity"
                          description="Are you sure you want to delete this activity?"
                          onConfirm={() => handleDeleteActivity(activity)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                      ]}
                    >
                      <List.Item.Meta
                        title={activity.title}
                        description={
                          <div>
                            <Space>
                              <Tag color="purple">{activity.activity_type}</Tag>
                              {activity.is_required && <Tag color="red">Required</Tag>}
                              {activity.points && <Tag color="blue">{activity.points} points</Tag>}
                              {activity.time_limit && <Tag color="orange">{activity.time_limit} min</Tag>}
                            </Space>
                            {activity.description && (
                              <Typography.Paragraph 
                                ellipsis={{ rows: 2 }} 
                                style={{ marginTop: 8 }}
                              >
                                {activity.description}
                              </Typography.Paragraph>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="No activities yet. Click 'Add Activity' to create one." />
              ),
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div>
      <Breadcrumb 
        style={{ marginBottom: 16 }}
        items={[
          {
            title: (
              <Button 
                type="link" 
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push('/admin/courses')}
                style={{ padding: 0 }}
              >
                Courses
              </Button>
            ),
          },
          {
            title: course?.title || 'Loading...',
          },
          {
            title: 'Lessons',
          },
        ]}
      />

      <Row gutter={16}>
        <Col span={8}>
          <Card 
            title="Lessons"
            extra={
              <Button
                type="primary"
                size="small"
                icon={<PlusOutlined />}
                onClick={() => {
                  setEditMode(false);
                  lessonForm.resetFields();
                  setLessonModalVisible(true);
                }}
              >
                Add Lesson
              </Button>
            }
            style={{ height: 'calc(100vh - 200px)', overflow: 'auto' }}
          >
            <List
              loading={loading}
              dataSource={lessons}
              renderItem={(lesson: AdminLesson) => (
                <List.Item
                  key={lesson.id}
                  className={selectedLesson?.id === lesson.id ? 'ant-list-item-active' : ''}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: selectedLesson?.id === lesson.id ? '#f0f0f0' : 'transparent'
                  }}
                  onClick={() => loadLessonDetails(lesson)}
                  actions={[
                    <Popconfirm
                      title="Delete Lesson"
                      description="Are you sure? This will delete all topics and code examples."
                      onConfirm={(e) => {
                        e?.stopPropagation();
                        handleDeleteLesson(lesson);
                      }}
                    >
                      <Button 
                        type="text" 
                        danger 
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Popconfirm>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <Space>
                        {lesson.title}
                        {lesson.is_locked && <LockOutlined style={{ fontSize: 12 }} />}
                      </Space>
                    }
                    description={
                      <Space size={4}>
                        <Badge count={lesson.topics_count} showZero size="small" />
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          topics
                        </Typography.Text>
                        <Badge count={lesson.exercises_count} showZero size="small" style={{ marginLeft: 8 }} />
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          exercises
                        </Typography.Text>
                        <Badge count={lesson.activities_count} showZero size="small" style={{ marginLeft: 8 }} />
                        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                          activities
                        </Typography.Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={16}>
          {renderLessonContent()}
        </Col>
      </Row>

      {/* Lesson Modal */}
      <Modal
        title={editMode ? "Edit Lesson" : "Create New Lesson"}
        open={lessonModalVisible}
        onCancel={() => {
          setLessonModalVisible(false);
          lessonForm.resetFields();
          setEditMode(false);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={lessonForm}
          layout="vertical"
          onFinish={editMode ? handleUpdateLesson : handleCreateLesson}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Lesson Title"
                rules={[{ required: true, message: 'Please enter lesson title' }]}
              >
                <Input placeholder="e.g., Introduction to HTML" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lesson_type"
                label="Lesson Type"
                initialValue="text"
              >
                <Select>
                  <Select.Option value="text">Text</Select.Option>
                  <Select.Option value="video">Video</Select.Option>
                  <Select.Option value="quiz">Quiz</Select.Option>
                  <Select.Option value="interactive">Interactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={3} placeholder="Brief description of the lesson" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Lesson Content (HTML/Markdown)"
          >
            <TextArea rows={10} placeholder="Enter lesson content in HTML or Markdown format" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="duration_minutes"
                label="Duration (minutes)"
                initialValue={30}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="order_index"
                label="Order"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space>
                <Form.Item
                  name="is_locked"
                  valuePropName="checked"
                  initialValue={false}
                >
                  <Switch checkedChildren="Locked" unCheckedChildren="Open" />
                </Form.Item>
                <Form.Item
                  name="is_published"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Switch checkedChildren="Published" unCheckedChildren="Draft" />
                </Form.Item>
              </Space>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setLessonModalVisible(false);
                lessonForm.resetFields();
                setEditMode(false);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editMode ? 'Update' : 'Create'} Lesson
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Topic Modal */}
      <Modal
        title={selectedTopic ? "Edit Topic" : "Create New Topic"}
        open={topicModalVisible}
        onCancel={() => {
          setTopicModalVisible(false);
          topicForm.resetFields();
          setSelectedTopic(null);
        }}
        footer={null}
        width={700}
      >
        <Form
          form={topicForm}
          layout="vertical"
          onFinish={selectedTopic ? handleUpdateTopic : handleCreateTopic}
        >
          <Form.Item
            name="title"
            label="Topic Title"
            rules={[{ required: true, message: 'Please enter topic title' }]}
          >
            <Input placeholder="e.g., What is HTML?" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="content_type"
                label="Content Type"
                initialValue="text"
              >
                <Select>
                  <Select.Option value="text">Text</Select.Option>
                  <Select.Option value="video">Video</Select.Option>
                  <Select.Option value="image">Image</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="order_index"
                label="Order"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter topic content' }]}
          >
            <Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.content_type !== currentValues.content_type}>
              {({ getFieldValue }) => {
                const contentType = getFieldValue('content_type');
                
                // Rich Text Editor for "text" content type
                if (contentType === 'text' || !contentType) {
                  return (
                    <Form.Item name="content" noStyle>
                      <RichTextEditor
                        value={topicForm.getFieldValue('content') || ''}
                        onChange={(value) => topicForm.setFieldValue('content', value)}
                        placeholder="Type your lesson content here. Use the toolbar above to format text (bold, italic, headings, lists, etc.)"
                        height="400px"
                      />
                    </Form.Item>
                  );
                }
                
                // Image Upload for "image" content type
                if (contentType === 'image') {
                  return (
                    <Form.Item name="content" noStyle>
                      <ImageUpload
                        value={topicForm.getFieldValue('content') || ''}
                        onChange={(value) => topicForm.setFieldValue('content', value)}
                        maxSize={10}
                      />
                    </Form.Item>
                  );
                }
                
                // Video Upload for "video" content type
                if (contentType === 'video') {
                  return (
                    <Form.Item name="content" noStyle>
                      <VideoUpload
                        value={topicForm.getFieldValue('content') || ''}
                        onChange={(value) => topicForm.setFieldValue('content', value)}
                        maxSize={100}
                      />
                    </Form.Item>
                  );
                }
                
                // Fallback TextArea for any other content type
                return <TextArea rows={10} placeholder="Enter content..." />;
              }}
            </Form.Item>
          </Form.Item>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setTopicModalVisible(false);
                topicForm.resetFields();
                setSelectedTopic(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedTopic ? 'Update' : 'Create'} Topic
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Code Example Modal */}
      <Modal
        title={selectedCodeExample ? "Edit Code Example" : "Create New Code Example"}
        open={codeExampleModalVisible}
        onCancel={() => {
          setCodeExampleModalVisible(false);
          codeExampleForm.resetFields();
          setSelectedCodeExample(null);
        }}
        footer={null}
        width={900}
      >
        <Form
          form={codeExampleForm}
          layout="vertical"
          onFinish={selectedCodeExample ? handleUpdateCodeExample : handleCreateCodeExample}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter title' }]}
              >
                <Input placeholder="e.g., Try it Yourself - Basic HTML" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="language"
                label="Language"
                initialValue="html"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="html">HTML</Select.Option>
                  <Select.Option value="css">CSS</Select.Option>
                  <Select.Option value="javascript">JavaScript</Select.Option>
                  <Select.Option value="php">PHP</Select.Option>
                  <Select.Option value="python">Python</Select.Option>
                  <Select.Option value="sql">SQL</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={2} placeholder="Brief description of the exercise" />
          </Form.Item>

          <Form.Item
            name="topic_id"
            label="Associated Topic (Optional)"
          >
            <Select
              placeholder="Select a topic to associate this code example with"
              allowClear
            >
              <Select.Option value="">Lesson-level (no specific topic)</Select.Option>
              {selectedLesson?.topics?.map((topic) => (
                <Select.Option key={topic.id} value={topic.id}>
                  {topic.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="initial_code"
            label="Initial Code (shown to user)"
            rules={[{ required: true, message: 'Please enter initial code' }]}
          >
            <TextArea 
              rows={10} 
              style={{ fontFamily: 'monospace' }}
              placeholder="Enter the initial code that will be shown to users"
            />
          </Form.Item>

          <Form.Item
            name="solution_code"
            label="Solution Code (for validation)"
          >
            <TextArea 
              rows={10} 
              style={{ fontFamily: 'monospace' }}
              placeholder="Enter the solution code (optional)"
            />
          </Form.Item>

          <Form.Item
            name="hints"
            label="Hints"
          >
            <TextArea rows={3} placeholder="Provide hints for users (optional)" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="is_interactive"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Interactive" unCheckedChildren="View Only" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="show_preview"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Show Preview" unCheckedChildren="No Preview" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="allow_reset"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Allow Reset" unCheckedChildren="No Reset" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setCodeExampleModalVisible(false);
                codeExampleForm.resetFields();
                setSelectedCodeExample(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedCodeExample ? 'Update' : 'Create'} Code Example
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Activity Modal */}
      <Modal
        title={selectedActivity ? "Edit Activity" : "Create New Activity"}
        open={activityModalVisible}
        onCancel={() => {
          setActivityModalVisible(false);
          activityForm.resetFields();
          setSelectedActivity(null);
        }}
        footer={null}
        width={800}
      >
        <Form
          form={activityForm}
          layout="vertical"
          onFinish={selectedActivity ? handleUpdateActivity : handleCreateActivity}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Activity Title"
                rules={[{ required: true, message: 'Please enter activity title' }]}
              >
                <Input placeholder="e.g., HTML Coding Exercise - Chapter 1" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="activity_type"
                label="Activity Type"
                initialValue="coding"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="coding">Coding</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Description"
          >
            <TextArea rows={2} placeholder="Brief description of the activity" />
          </Form.Item>

          <Form.Item
            name="instructions"
            label="Instructions"
            rules={[{ required: true, message: 'Please enter activity instructions' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Detailed instructions for completing the activity"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="time_limit"
                label="Time Limit (minutes)"
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="30" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="max_attempts"
                label="Max Attempts"
              >
                <InputNumber min={1} style={{ width: '100%' }} placeholder="3" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="passing_score"
                label="Passing Score (%)"
              >
                <InputNumber min={0} max={100} style={{ width: '100%' }} placeholder="70" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="points"
                label="Points"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="is_required"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch checkedChildren="Required" unCheckedChildren="Optional" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_published"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch checkedChildren="Published" unCheckedChildren="Draft" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Space>
              <Button onClick={() => {
                setActivityModalVisible(false);
                activityForm.resetFields();
                setSelectedActivity(null);
              }}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {selectedActivity ? 'Update' : 'Create'} Activity
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Code Modal */}
      <Modal
        title={viewingCodeExample?.title || "View Code"}
        open={viewCodeModalVisible}
        onCancel={() => {
          setViewCodeModalVisible(false);
          setViewingCodeExample(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setViewCodeModalVisible(false);
            setViewingCodeExample(null);
          }}>
            Close
          </Button>
        ]}
        width={900}
      >
        {viewingCodeExample && (
          <div>
            {viewingCodeExample.description && (
              <Typography.Paragraph style={{ marginBottom: 16 }}>
                {viewingCodeExample.description}
              </Typography.Paragraph>
            )}
            
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Tag color="blue">{viewingCodeExample.language.toUpperCase()}</Tag>
                {viewingCodeExample.is_interactive && <Tag color="green">Interactive</Tag>}
                {viewingCodeExample.show_preview && <Tag color="cyan">Preview Enabled</Tag>}
                {viewingCodeExample.allow_reset && <Tag color="purple">Reset Allowed</Tag>}
                {viewingCodeExample.topic_id ? (
                  <Tag color="orange">
                    Topic: {selectedLesson?.topics?.find(t => t.id === viewingCodeExample.topic_id)?.title || 'Unknown'}
                  </Tag>
                ) : (
                  <Tag color="gold">Lesson-level</Tag>
                )}
              </Space>
            </div>

            <Tabs 
              defaultActiveKey="initial"
              items={[
                {
                  key: 'initial',
                  label: 'Initial Code',
                  children: (
                    <div style={{ 
                      backgroundColor: '#f5f5f5', 
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                      padding: 16,
                      overflow: 'auto',
                      maxHeight: '60vh'
                    }}>
                      <pre style={{ 
                        margin: 0, 
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: 14,
                        lineHeight: 1.6
                      }}>
                        <code>{viewingCodeExample.initial_code}</code>
                      </pre>
                    </div>
                  )
                },
                ...(viewingCodeExample.solution_code ? [{
                  key: 'solution',
                  label: 'Solution Code',
                  children: (
                    <div style={{ 
                      backgroundColor: '#f5f5f5', 
                      border: '1px solid #d9d9d9',
                      borderRadius: 4,
                      padding: 16,
                      overflow: 'auto',
                      maxHeight: '60vh'
                    }}>
                      <pre style={{ 
                        margin: 0, 
                        fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                        fontSize: 14,
                        lineHeight: 1.6
                      }}>
                        <code>{viewingCodeExample.solution_code}</code>
                      </pre>
                    </div>
                  )
                }] : []),
                ...(viewingCodeExample.hints ? [{
                  key: 'hints',
                  label: 'Hints',
                  children: (
                    <Typography.Paragraph>
                      {viewingCodeExample.hints}
                    </Typography.Paragraph>
                  )
                }] : [])
              ]}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
