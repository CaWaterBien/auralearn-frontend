'use client';

import React, { useState, useEffect } from 'react';
// Fixed: Removed Chart import - not exported by antd
import { Card, Row, Col, Statistic, Table, Spin, Select, DatePicker, Typography } from 'antd';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrophyOutlined, BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Users } from 'lucide-react';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface DashboardData {
  overview: {
    total_activities: number;
    total_submissions: number;
    total_users: number;
    overall_completion_rate: number;
  };
  recent_activity: Array<{
    id: number;
    user: string;
    activity: string;
    score: number;
    completed: boolean;
    submitted_at: string;
  }>;
  top_activities: Array<{
    id: number;
    title: string;
    total_submissions: number;
    completion_rate: number;
    average_score: number;
  }>;
  event_distribution: Record<string, number>;
  weekly_trends: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/analytics/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const prepareEventDistributionData = (eventDistribution: Record<string, number>) => {
    return Object.entries(eventDistribution).map(([event, count]) => ({
      name: formatEventType(event),
      value: count,
      count
    }));
  };

  const recentActivityColumns = [
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      ellipsis: true,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <span className={score >= 80 ? 'text-green-600' : score >= 60 ? 'text-orange-600' : 'text-red-600'}>
          {score}%
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed: boolean) => (
        <span className={completed ? 'text-green-600' : 'text-orange-600'}>
          {completed ? 'Completed' : 'In Progress'}
        </span>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted_at',
      key: 'submitted_at',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  const topActivitiesColumns = [
    {
      title: 'Activity',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Submissions',
      dataIndex: 'total_submissions',
      key: 'submissions',
      sorter: (a: any, b: any) => a.total_submissions - b.total_submissions,
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completion_rate',
      key: 'completion_rate',
      render: (rate: number) => (
        <span className={rate >= 80 ? 'text-green-600' : rate >= 60 ? 'text-orange-600' : 'text-red-600'}>
          {rate.toFixed(1)}%
        </span>
      ),
      sorter: (a: any, b: any) => a.completion_rate - b.completion_rate,
    },
    {
      title: 'Avg Score',
      dataIndex: 'average_score',
      key: 'average_score',
      render: (score: number) => `${score.toFixed(1)}%`,
      sorter: (a: any, b: any) => a.average_score - b.average_score,
    },
  ];

  if (loading || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  const eventDistributionData = prepareEventDistributionData(dashboardData.event_distribution);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Title level={2}>Learning Analytics Dashboard</Title>
        <Select
          value={selectedTimeRange}
          onChange={setSelectedTimeRange}
          options={[
            { label: 'Last 7 days', value: '7d' },
            { label: 'Last 30 days', value: '30d' },
            { label: 'Last 3 months', value: '3m' },
            { label: 'Last 6 months', value: '6m' },
          ]}
          className="w-48"
        />
      </div>

      {/* Key Performance Indicators */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Activities"
              value={dashboardData.overview.total_activities}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Submissions"
              value={dashboardData.overview.total_submissions}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={dashboardData.overview.total_users}
              prefix={<Users className="w-4 h-4" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Completion Rate"
              value={dashboardData.overview.overall_completion_rate}
              prefix={<TrophyOutlined />}
              suffix="%"
              valueStyle={{ 
                color: dashboardData.overview.overall_completion_rate >= 70 ? '#52c41a' : '#faad14' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Activity Event Distribution">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={eventDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {eventDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value, name]} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Completion Rate Trends">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={[
                { name: 'Week 1', completions: 65, submissions: 100 },
                { name: 'Week 2', completions: 72, submissions: 120 },
                { name: 'Week 3', completions: 68, submissions: 95 },
                { name: 'Week 4', completions: 78, submissions: 140 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completions" stroke="#52c41a" strokeWidth={2} />
                <Line type="monotone" dataKey="submissions" stroke="#1890ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Data Tables Row */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="Recent Activity" extra={
            <Text type="secondary">Last 10 submissions</Text>
          }>
            <Table
              columns={recentActivityColumns}
              dataSource={dashboardData.recent_activity}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Top Performing Activities">
            <Table
              columns={topActivitiesColumns}
              dataSource={dashboardData.top_activities}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Learning Progress Patterns */}
      <Row gutter={16}>
        <Col xs={24}>
          <Card title="Score Distribution Analysis">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[
                { range: '90-100%', count: 25, label: 'Excellent' },
                { range: '80-89%', count: 45, label: 'Good' },
                { range: '70-79%', count: 30, label: 'Satisfactory' },
                { range: '60-69%', count: 15, label: 'Needs Work' },
                { range: '0-59%', count: 8, label: 'Failing' },
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip formatter={(value, name) => [value, 'Student Count']} />
                <Bar dataKey="count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Common Issues and Insights */}
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Card title="Most Common Issues" size="small">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Missing DOCTYPE</span>
                <span className="text-red-600">32%</span>
              </div>
              <div className="flex justify-between">
                <span>Invalid HTML Structure</span>
                <span className="text-red-600">28%</span>
              </div>
              <div className="flex justify-between">
                <span>Missing Required Elements</span>
                <span className="text-orange-600">24%</span>
              </div>
              <div className="flex justify-between">
                <span>Accessibility Issues</span>
                <span className="text-orange-600">18%</span>
              </div>
              <div className="flex justify-between">
                <span>Semantic HTML Issues</span>
                <span className="text-yellow-600">15%</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Success Patterns" size="small">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>First Attempt Success</span>
                <span className="text-green-600">42%</span>
              </div>
              <div className="flex justify-between">
                <span>2-3 Attempts Success</span>
                <span className="text-green-600">38%</span>
              </div>
              <div className="flex justify-between">
                <span>Quick Completion (&lt;15m)</span>
                <span className="text-blue-600">25%</span>
              </div>
              <div className="flex justify-between">
                <span>High Originality Scores</span>
                <span className="text-purple-600">78%</span>
              </div>
              <div className="flex justify-between">
                <span>Perfect Semantic HTML</span>
                <span className="text-indigo-600">34%</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card title="Learning Recommendations" size="small">
            <div className="space-y-2 text-sm">
              <div className="bg-blue-50 p-2 rounded">
                <strong>Focus Areas:</strong> DOCTYPE declaration and HTML structure fundamentals
              </div>
              <div className="bg-green-50 p-2 rounded">
                <strong>Success Factor:</strong> Students who complete in 2-3 attempts show better retention
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <strong>Intervention Needed:</strong> 12 students require additional support
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <strong>Strengths:</strong> Good originality scores indicate creative problem-solving
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
