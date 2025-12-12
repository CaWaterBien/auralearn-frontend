"use client";

import { useEffect, useState } from "react";
import { Card, Spin, Collapse, Form, Input, Switch, Button, Space, message, Typography, Divider } from "antd";
import { SaveOutlined, ReloadOutlined } from "@ant-design/icons";
import { adminSettings, adminUpdateSettings, SystemSettings, SystemSetting } from "@/lib/admin-api";

const { Panel } = Collapse;
const { Text } = Typography;

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await adminSettings();
      setSettings(res.settings);
      
      // Set initial form values
      const initialValues: Record<string, any> = {};
      Object.entries(res.settings).forEach(([group, groupSettings]) => {
        groupSettings.forEach((setting) => {
          if (setting.type === 'boolean') {
            initialValues[setting.key] = setting.typed_value;
          } else {
            initialValues[setting.key] = setting.value;
          }
        });
      });
      form.setFieldsValue(initialValues);
    } catch (error) {
      messageApi.error("Failed to load settings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formValues = form.getFieldsValue();
      const updates: { id: number; value: string }[] = [];

      Object.entries(settings).forEach(([group, groupSettings]) => {
        groupSettings.forEach((setting) => {
          if (setting.is_editable) {
            const newValue = formValues[setting.key];
            let valueString: string;

            if (setting.type === 'boolean') {
              valueString = newValue ? '1' : '0';
            } else if (setting.type === 'number') {
              valueString = String(newValue || 0);
            } else {
              valueString = String(newValue || '');
            }

            // Only update if value changed
            if (valueString !== setting.value) {
              updates.push({
                id: setting.id,
                value: valueString
              });
            }
          }
        });
      });

      if (updates.length === 0) {
        messageApi.info("No changes to save");
        return;
      }

      const result = await adminUpdateSettings(updates);
      messageApi.success(`Settings updated successfully! (${result.changes} changes)`);
      
      // Reload settings
      await loadSettings();
    } catch (error) {
      messageApi.error("Failed to save settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const renderSettingInput = (setting: SystemSetting) => {
    if (!setting.is_editable) {
      return (
        <Input
          value={setting.is_sensitive ? "••••••••" : setting.value}
          disabled
          style={{ backgroundColor: "#f5f5f5" }}
        />
      );
    }

    if (setting.type === 'boolean') {
      return (
        <Form.Item name={setting.key} valuePropName="checked" style={{ marginBottom: 0 }}>
          <Switch />
        </Form.Item>
      );
    }

    if (setting.type === 'number') {
      return (
        <Form.Item name={setting.key} style={{ marginBottom: 0 }}>
          <Input type="number" />
        </Form.Item>
      );
    }

    return (
      <Form.Item name={setting.key} style={{ marginBottom: 0 }}>
        <Input type={setting.is_sensitive ? "password" : "text"} />
      </Form.Item>
    );
  };

  const groupLabels: Record<string, string> = {
    general: "General Settings",
    database: "Database Configuration",
    ai: "AI Configuration",
    rag: "RAG System",
    performance: "Performance & Caching",
    mail: "Email Settings",
    supabase: "Supabase Configuration",
    storage: "File Storage"
  };

  return (
    <>
      {contextHolder}
      <Card
        title={<span style={{ color: "#111827" }}>System Settings</span>}
        style={{ borderRadius: 12, background: "#ffffff" }}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadSettings}
              loading={loading}
            >
              Refresh
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              disabled={loading}
            >
              Save Changes
            </Button>
          </Space>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form form={form} layout="vertical">
            <Collapse defaultActiveKey={Object.keys(settings)}>
              {Object.entries(settings).map(([group, groupSettings]) => (
                <Panel
                  header={
                    <div>
                      <strong>{groupLabels[group] || group}</strong>
                      <Text type="secondary" style={{ marginLeft: 8, fontSize: 12 }}>
                        ({groupSettings.length} settings)
                      </Text>
                    </div>
                  }
                  key={group}
                >
                  <div style={{ display: "grid", gap: 16 }}>
                    {groupSettings.map((setting) => (
                      <div key={setting.key} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, alignItems: "start" }}>
                        <div>
                          <Text strong>{setting.label}</Text>
                          {setting.description && (
                            <div>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {setting.description}
                              </Text>
                            </div>
                          )}
                          <div style={{ marginTop: 4 }}>
                            <Text type="secondary" style={{ fontSize: 11, fontFamily: "monospace" }}>
                              {setting.key}
                            </Text>
                          </div>
                        </div>
                        <div>
                          {renderSettingInput(setting)}
                          {!setting.is_editable && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                              (Read-only)
                            </Text>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Divider />
                </Panel>
              ))}
            </Collapse>
          </Form>
        )}
      </Card>
    </>
  );
}
