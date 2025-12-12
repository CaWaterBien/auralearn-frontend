'use client';

import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Badge, Space, Typography, Spin, Alert, Tabs, Tag } from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import { useParams } from 'next/navigation';
import HtmlOutputComparison from '../../../../components/admin/html-output-comparison';

const { Title, Text } = Typography;

interface Submission {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  attempt_number: number;
  score: number;
  completion_status: 'passed' | 'failed' | 'in_progress';
  is_completed: boolean;
  time_spent_minutes: number;
  submitted_at: string;
  completed_at?: string;
  submitted_code: string;
  generated_output: string;
  validation_results: any;
  instruction_compliance: any;
  feedback: string;
  similarity_check?: {
    passes_similarity_check: boolean;
    max_similarity_percentage: number;
    originality_score: number;
    risk_level: string;
  };
}

interface Activity {
  id: number;
  title: string;
  instructions: string;
  metadata: {
    expected_output?: string;
    template_code?: string;
    validation_criteria?: any;
  };
}

export default function AdminSubmissionsPage() {
  const params = useParams();
  const activityId = params?.activityId as string;
  
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadSubmissions();
    loadActivity();
  }, [activityId]);

  const loadSubmissions = async () => {
    try {
      const response = await fetch(`/api/lessons/0/activities/${activityId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${activityId}`);
      if (response.ok) {
        const data = await response.json();
        setActivity(data.activity);
      }
    } catch (error) {
      console.error('Error loading activity:', error);
    }
  };

  const handleViewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setViewMode('detail');
  };

  const handleUpdateSubmissionStatus = async (submissionId: number, status: string, score?: number) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: JSON.stringify({
          completion_status: status,
          override_score: score,
          instructor_notes: `Status updated by instructor at ${new Date().toISOString()}`
        })
      });

      if (response.ok) {
        loadSubmissions(); // Refresh the list
        Modal.success({
          title: 'Success',
          content: 'Submission status updated successfully.',
        });
      }
    } catch (error) {
      console.error('Error updating submission status:', error);
      Modal.error({
        title: 'Error',
        content: 'Failed to update submission status.',
      });
    }
  };

  const getStatusBadge = (status: string, isCompleted: boolean) => {
    if (isCompleted && status === 'passed') {
      return <Badge status="success" text="Completed" />;
    } else if (status === 'failed') {
      return <Badge status="error" text="Failed" />;
    } else {
      return <Badge status="processing" text="In Progress" />;
    }
  };

  const getSimilarityBadge = (similarityCheck?: any) => {
    if (!similarityCheck) {
      return <Tag color="default">No Check</Tag>;
    }

    const { risk_level, passes_similarity_check, max_similarity_percentage } = similarityCheck;
    
    if (!passes_similarity_check) {
      return <Tag color="red">High Similarity ({max_similarity_percentage}%)</Tag>;
    } else if (risk_level === 'medium') {
      return <Tag color="orange">Medium Risk ({max_similarity_percentage}%)</Tag>;
    } else if (risk_level === 'low') {
      return <Tag color="yellow">Low Risk ({max_similarity_percentage}%)</Tag>;
    } else {
      return <Tag color="green">Original ({max_similarity_percentage}%)</Tag>;
    }
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: ['user', 'name'],
      key: 'student',
      render: (name: string, record: Submission) => (
        <div>
          <div className="font-medium">{name}</div>
          <div className="text-sm text-gray-500">{record.user.email}</div>
        </div>
      ),
    },
    {
      title: 'Attempt',
      dataIndex: 'attempt_number',
      key: 'attempt',
      width: 80,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 80,
      render: (score: number) => (
        <span className={score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-600' : 'text-red-600'}>
          {score}%
        </span>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 120,
      render: (record: Submission) => getStatusBadge(record.completion_status, record.is_completed),
    },
    {
      title: 'Similarity',
      key: 'similarity',
      width: 150,
      render: (record: Submission) => getSimilarityBadge(record.validation_results?.similarity_check),
    },
    {
      title: 'Time Spent',
      dataIndex: 'time_spent_minutes',
      key: 'time_spent',
      width: 100,
      render: (minutes: number) => `${minutes}m`,
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      width: 120,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (record: Submission) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewSubmission(record)}
          >
            View
          </Button>
          <Button
            icon={<CheckCircleOutlined />}
            size="small"
            type="primary"
            disabled={record.is_completed && record.completion_status === 'passed'}
            onClick={() => handleUpdateSubmissionStatus(record.id, 'passed', Math.max(record.score, 80))}
          >
            Pass
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            size="small"
            danger
            disabled={record.completion_status === 'failed'}
            onClick={() => handleUpdateSubmissionStatus(record.id, 'failed', record.score)}
          >
            Fail
          </Button>
        </Space>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (viewMode === 'detail' && selectedSubmission) {
    return (
      <div className="p-6">
        <Button onClick={() => setViewMode('list')} className="mb-4">
          ← Back to List
        </Button>
        
        <Card title={`Submission Detail - ${selectedSubmission.user.name}`}>
          <Tabs 
            defaultActiveKey="comparison"
            items={[
              {
                key: 'comparison',
                label: 'HTML Comparison',
                children: (
                  <HtmlOutputComparison
                    expectedHtml={activity?.metadata?.template_code}
                    actualHtml={selectedSubmission.submitted_code}
                    expectedOutput={activity?.metadata?.expected_output}
                    submissionId={selectedSubmission.id.toString()}
                  />
                )
              },
              {
                key: 'validation',
                label: 'Validation Results',
                children: (
                  <div className="space-y-4">
                    <Card size="small" title="Overall Results">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Text strong>Score: </Text>
                          <span className={selectedSubmission.score >= 80 ? 'text-green-600' : 'text-red-600'}>
                            {selectedSubmission.score}%
                          </span>
                        </div>
                        <div>
                          <Text strong>Status: </Text>
                          {getStatusBadge(selectedSubmission.completion_status, selectedSubmission.is_completed)}
                        </div>
                        <div>
                          <Text strong>Attempt: </Text>
                          {selectedSubmission.attempt_number}
                        </div>
                        <div>
                          <Text strong>Time Spent: </Text>
                          {selectedSubmission.time_spent_minutes} minutes
                        </div>
                      </div>
                    </Card>

                    <Card size="small" title="Validation Checks">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedSubmission.validation_results || {}).map(([key, value]) => {
                          if (key === 'similarity_check') return null;
                          return (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                              {typeof value === 'boolean' ? (
                                value ? <CheckCircleOutlined className="text-green-600" /> : <CloseCircleOutlined className="text-red-600" />
                              ) : (
                                <span>{JSON.stringify(value)}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>

                    {selectedSubmission.validation_results?.similarity_check && (
                      <Card size="small" title="Similarity Analysis">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Passes Check:</span>
                            {selectedSubmission.validation_results.similarity_check.passes_similarity_check ? 
                              <CheckCircleOutlined className="text-green-600" /> : 
                              <WarningOutlined className="text-red-600" />
                            }
                          </div>
                          <div className="flex justify-between">
                            <span>Max Similarity:</span>
                            <span>{selectedSubmission.validation_results.similarity_check.max_similarity_percentage}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Originality Score:</span>
                            <span>{selectedSubmission.validation_results.similarity_check.originality_score}/100</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Level:</span>
                            {getSimilarityBadge(selectedSubmission.validation_results.similarity_check)}
                          </div>
                        </div>
                      </Card>
                    )}

                    <Card size="small" title="Code Preview">
                      <pre className="text-sm bg-gray-50 p-4 rounded max-h-64 overflow-auto">
                        <code>{selectedSubmission.submitted_code}</code>
                      </pre>
                    </Card>

                    <Card size="small" title="Feedback">
                      <div className="whitespace-pre-wrap">{selectedSubmission.feedback}</div>
                    </Card>
                  </div>
                )
              }
            ]}
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <Title level={2}>Activity Submissions</Title>
        {activity && (
          <div className="mb-4">
            <Title level={4}>{activity.title}</Title>
            <Text type="secondary">{activity.instructions}</Text>
          </div>
        )}
      </div>

      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card size="small">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.total_submissions}</div>
              <div className="text-sm text-gray-500">Total Submissions</div>
            </div>
          </Card>
          <Card size="small">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completed_submissions}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </Card>
          <Card size="small">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{Math.round(stats.average_score)}%</div>
              <div className="text-sm text-gray-500">Average Score</div>
            </div>
          </Card>
          <Card size="small">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((stats.completed_submissions / stats.total_submissions) * 100)}%
              </div>
              <div className="text-sm text-gray-500">Completion Rate</div>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <Table
          columns={columns}
          dataSource={submissions}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
}
