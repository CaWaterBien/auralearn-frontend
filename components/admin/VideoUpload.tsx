'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Button, Progress, Card, Typography, Space, Modal, App } from 'antd';
import { 
  InboxOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CloudUploadOutlined,
  LoadingOutlined,
  PlayCircleOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import type { UploadProps } from 'antd';

const { Dragger } = Upload;
const { Text } = Typography;

interface VideoUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  onUploadProgress?: (progress: number) => void;
  maxSize?: number; // in MB
  accept?: string;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  value,
  onChange,
  onUploadProgress,
  maxSize = 100,
  accept = '.mp4,.avi,.mov,.wmv,.flv,.webm'
}) => {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress with slower progression for large video files
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('type', 'topic_video');

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_ADMIN_API_BASE || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/test-upload/video`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Extract file path as clean string to avoid circular references
      const filePath = String(result.file_path || '');
      
      // Complete progress
      setUploadProgress(100);
      
      // Brief delay to show 100% completion
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        onChange?.(filePath);
        message.success(`${file.name} uploaded successfully!`);
      }, 800);

    } catch (error: any) {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
      message.error(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    }
  }, [maxSize, message]);

  const uploadProps: UploadProps = {
    name: 'video',
    multiple: false,
    accept,
    beforeUpload: (file) => {
      // Check file type
      const isValidType = [
        'video/mp4', 'video/avi', 'video/quicktime', 
        'video/x-msvideo', 'video/x-flv', 'video/webm'
      ].includes(file.type);
      
      if (!isValidType) {
        message.error('You can only upload MP4, AVI, MOV, WMV, FLV, or WebM video files!');
        return false;
      }

      // Check file size
      const isValidSize = file.size / 1024 / 1024 < maxSize;
      if (!isValidSize) {
        message.error(`Video must be smaller than ${maxSize}MB!`);
        return false;
      }

      handleUpload(file);
      return false; // Prevent automatic upload
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
    disabled: uploading,
  };

  const handleRemove = () => {
    onChange?.('');
    message.success('Video removed');
  };

  const getFileSize = (filePath: string) => {
    // This would normally come from the server, but for now we'll show a placeholder
    return 'Unknown size';
  };

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop() || 'video';
  };

  if (value) {
    return (
      <div className="video-upload-preview">
        <Card 
          style={{ maxWidth: 500 }}
          cover={
            <div 
              style={{ 
                position: 'relative', 
                height: 280, 
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px 8px 0 0'
              }}
            >
              <video
                src={value}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain' 
                }}
                controls={false}
                preload="metadata"
              />
              <div 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#fff',
                  fontSize: 48,
                  cursor: 'pointer',
                  background: 'rgba(0,0,0,0.6)',
                  borderRadius: '50%',
                  padding: '12px',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => setPreviewVisible(true)}
              >
                <PlayCircleOutlined />
              </div>
            </div>
          }
          actions={[
            <Button
              key="preview"
              type="text"
              icon={<EyeOutlined />}
              onClick={() => setPreviewVisible(true)}
            >
              Preview
            </Button>,
            <Button
              key="remove"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={handleRemove}
            >
              Remove
            </Button>,
          ]}
        >
          <Card.Meta
            avatar={<VideoCameraOutlined style={{ fontSize: 24, color: '#1890ff' }} />}
            title="Video Uploaded"
            description={
              <div>
                <Text ellipsis style={{ display: 'block' }}>
                  {getFileName(value)}
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {getFileSize(value)}
                </Text>
              </div>
            }
          />
        </Card>

        {/* Video Preview Modal */}
        <Modal
          title="Video Preview"
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={800}
          centered
        >
          <video
            src={value}
            controls
            style={{ width: '100%', height: 'auto', maxHeight: '70vh' }}
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </Modal>
      </div>
    );
  }

  return (
    <div className="video-upload-container">
      {uploading ? (
        <Card className="upload-progress-card">
          <div style={{ textAlign: 'center', padding: '50px 20px' }}>
            <LoadingOutlined style={{ fontSize: 56, color: '#722ed1', marginBottom: 20 }} />
            <div style={{ marginBottom: 20 }}>
              <Text strong style={{ fontSize: 18 }}>Uploading Video...</Text>
            </div>
            <Progress
              percent={Math.round(uploadProgress)}
              status="active"
              strokeColor={{
                '0%': '#722ed1',
                '100%': '#52c41a',
              }}
              style={{ maxWidth: 350, margin: '0 auto' }}
              size="default"
            />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                Large video files may take a few minutes to upload. Please don't close this window.
              </Text>
            </div>
          </div>
        </Card>
      ) : (
        <Dragger {...uploadProps} className="video-upload-dragger">
          <div className="ant-upload-drag-icon">
            <VideoCameraOutlined style={{ fontSize: 56, color: '#722ed1' }} />
          </div>
          <p className="ant-upload-text" style={{ fontSize: 18, marginBottom: 8 }}>
            <strong>Click or drag video file to this area to upload</strong>
          </p>
          <p className="ant-upload-hint" style={{ fontSize: 14, marginBottom: 20 }}>
            Support for MP4, AVI, MOV, WMV, FLV, WebM formats. Maximum size: {maxSize}MB
          </p>
          <div style={{ marginTop: 20 }}>
            <Space>
              <Button 
                type="primary" 
                size="large" 
                icon={<CloudUploadOutlined />}
                style={{ background: '#722ed1', borderColor: '#722ed1' }}
              >
                Select Video File
              </Button>
            </Space>
          </div>
        </Dragger>
      )}

      <style jsx global>{`
        .video-upload-container .video-upload-dragger {
          background: linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%);
          border: 2px dashed #d9d9d9;
          border-radius: 12px;
          transition: all 0.3s ease;
          min-height: 300px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .video-upload-container .video-upload-dragger:hover {
          border-color: #722ed1;
          background: linear-gradient(135deg, #f6ffed 0%, #d6f7ff 100%);
        }

        .video-upload-container .upload-progress-card {
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(114, 46, 209, 0.15);
          border: 1px solid #efdbff;
        }

        .video-upload-preview .ant-card {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }

        .video-upload-container .ant-upload-drag-icon {
          margin-bottom: 20px;
        }

        .video-upload-container .ant-progress-inner {
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default VideoUpload;
