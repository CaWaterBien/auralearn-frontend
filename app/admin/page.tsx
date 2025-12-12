"use client";

import React, { useEffect, useState } from "react";
import { App, Button, Card, Typography, Space, Statistic, Row, Col, Table, Tag } from "antd";
import { adminLogout, adminMe, adminOverview, adminUsers } from "@/lib/admin-api";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

type AdminInfo = { id: number; name: string; email: string };

type Overview = {
  stats: {
    users: number;
    admins: number;
    queuedJobs: number;
    supabase?: { ok: boolean; error?: string };
  };
};

type UserRow = { id: number; name: string; email: string; created_at: string };

type AdminMeResponse = { admin: AdminInfo };

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<Overview["stats"] | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const { message } = App.useApp();

  useEffect(() => {
    const load = async () => {
      try {
        const me: AdminMeResponse | null = await adminMe();
        if (!me) {
          window.location.href = "/admin/login";
          return;
        }
        setAdmin(me.admin);
        const [ov, us]: [Overview, { users: UserRow[] }] = await Promise.all([
          adminOverview(),
          adminUsers(10),
        ]);
        setOverview(ov.stats);
        setUsers(us.users);
      } catch (e) {
        message.error((e as Error).message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [message]);

  const logout = async () => {
    try {
      await adminLogout();
      window.location.href = "/admin/login";
    } catch {}
  };

  if (loading) return <div style={{ padding: 24 }}>Loading…</div>;

  const spark = [
    { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 7 }, { x: 6, y: 6 }
  ];

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>Dashboard</Typography.Title>
          <Typography.Text type="secondary">AuraLearn Admin ({admin?.email})</Typography.Text>
        </div>
        <div>
          <Button onClick={logout}>Logout</Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, background: "#ffffff" }}>
            <Statistic title={<span style={{ color: "#6b7280" }}>Users</span>} value={overview?.users ?? 0} valueStyle={{ color: "#111827" }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card style={{ borderRadius: 12, background: "#ffffff" }}>
            <Statistic title={<span style={{ color: "#6b7280" }}>Admins</span>} value={overview?.admins ?? 0} valueStyle={{ color: "#111827" }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card title={<span style={{ color: "#111827" }}>System</span>} style={{ borderRadius: 12, background: "#ffffff" }}>
            <Space direction="vertical">
              <div>
                <Typography.Text style={{ color: "#6b7280" }}>Supabase:</Typography.Text>{' '}
                {overview?.supabase?.ok ? <Tag color="success">OK</Tag> : <Tag color="error">Error</Tag>}
              </div>
              {!overview?.supabase?.ok && overview?.supabase?.error && (
                <Typography.Text type="warning">{String(overview.supabase.error)}</Typography.Text>
              )}
            </Space>
          </Card>
        </Col>
      </Row>

      <Card title={<span style={{ color: "#111827" }}>Latest Users</span>} style={{ borderRadius: 12, background: "#ffffff" }}>
        <Table<UserRow>
          rowKey="id"
          dataSource={users}
          pagination={false}
          columns={[
            { title: 'ID', dataIndex: 'id', width: 80 },
            { title: 'Name', dataIndex: 'name' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Joined', dataIndex: 'created_at' },
          ]}
        />
      </Card>
    </div>
  );
} 