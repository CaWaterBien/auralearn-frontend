"use client";

import { useEffect, useState } from "react";
import { Card, Typography, Select, Spin, Tabs, Table, Tag } from "antd";
import { adminLogs } from "@/lib/admin-api";

type AuditLog = {
  id: number;
  user_type: string;
  user_id: number | null;
  event_type: string;
  description: string;
  event_data: any;
  ip_address: string;
  device_type: string;
  browser: string;
  platform: string;
  location: string | null;
  created_at: string;
};

export default function AdminLogsPage() {
  const [limit, setLimit] = useState(100);
  const [logType, setLogType] = useState<"audit" | "application">("audit");
  const [lines, setLines] = useState<string[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async (n: number, type: "audit" | "application") => {
    setLoading(true);
    try {
      const res = await adminLogs(n, type);
      if (res.type === "audit" && res.logs) {
        setAuditLogs(res.logs);
        setLines([]);
      } else if (res.lines) {
        setLines(res.lines);
        setAuditLogs([]);
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
      setLines([]);
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(limit, logType);
  }, []);

  const handleTabChange = (key: string) => {
    const type = key as "audit" | "application";
    setLogType(type);
    load(limit, type);
  };

  const auditColumns = [
    {
      title: "Time",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: "Type",
      dataIndex: "user_type",
      key: "user_type",
      width: 80,
      render: (text: string) => (
        <Tag color={text === "admin" ? "red" : "blue"}>{text.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Event",
      dataIndex: "event_type",
      key: "event_type",
      width: 120,
      render: (text: string) => {
        const color =
          text === "login"
            ? "green"
            : text === "logout"
            ? "orange"
            : text === "failed_login"
            ? "red"
            : "default";
        return <Tag color={color}>{text.replace("_", " ").toUpperCase()}</Tag>;
      },
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width: 80,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      width: 140,
    },
    {
      title: "Device",
      dataIndex: "device_type",
      key: "device_type",
      width: 100,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: "Browser",
      dataIndex: "browser",
      key: "browser",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Platform",
      dataIndex: "platform",
      key: "platform",
      width: 150,
      ellipsis: true,
    },
  ];

  return (
    <Card
      title={<span style={{ color: "#111827" }}>System Logs</span>}
      style={{ borderRadius: 12, background: "#ffffff" }}
    >
      <Tabs
        activeKey={logType}
        onChange={handleTabChange}
        items={[
          {
            key: "audit",
            label: "Audit Logs",
            children: (
              <div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <Select
                    value={limit}
                    onChange={(v) => {
                      setLimit(v);
                      load(v, logType);
                    }}
                    options={[50, 100, 200, 500].map((v) => ({
                      value: v,
                      label: `${v} records`,
                    }))}
                    style={{ width: 140 }}
                  />
                </div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <Table
                    columns={auditColumns}
                    dataSource={auditLogs}
                    rowKey="id"
                    pagination={{ pageSize: 20 }}
                    scroll={{ x: 1200 }}
                    size="small"
                  />
                )}
              </div>
            ),
          },
          {
            key: "application",
            label: "Application Logs",
            children: (
              <div>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <Select
                    value={limit}
                    onChange={(v) => {
                      setLimit(v);
                      load(v, logType);
                    }}
                    options={[100, 200, 500, 1000].map((v) => ({
                      value: v,
                      label: `${v} lines`,
                    }))}
                    style={{ width: 140 }}
                  />
                </div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: 40 }}>
                    <Spin size="large" />
                  </div>
                ) : (
                  <pre
                    style={{
                      background: "#0a0a0a",
                      color: "#e5e7eb",
                      padding: 12,
                      borderRadius: 8,
                      overflow: "auto",
                      maxHeight: 520,
                    }}
                  >
                    {lines && lines.length > 0 ? lines.join("\n") : "No logs available"}
                  </pre>
                )}
              </div>
            ),
          },
        ]}
      />
    </Card>
  );
}
