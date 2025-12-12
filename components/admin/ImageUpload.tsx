'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Button, Progress, Card, Image, Typography, Space, App } from 'antd';
import { 
  InboxOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  CloudUploadOutlined,
  LoadingOutlined 
} from '@ant-design/icons';
import type { UploadProps, UploadFile } from 'antd';

const { Dragger } = Upload;
const { Text } = Typography;

interface ImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  onUploadProgress?: (progress: number) => void;
  maxSize?: number; // in MB
  accept?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onUploadProgress,
  maxSize = 10,
  accept = '.jpg,.jpeg,.png,.gif,.webp'
}) => {
  const { message } = App.useApp();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('type', 'topic_image');

      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || process.env.NEXT_PUBLIC_ADMIN_API_BASE || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/test-upload/image`, {
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
      }, 500);

    } catch (error: any) {
      clearInterval(progressInterval);
      setUploading(false);
      setUploadProgress(0);
      message.error(`Upload failed: ${error.message}`);
      console.error('Upload error:', error);
    }
  }, [maxSize, message]);

  const uploadProps: UploadProps = {
    name: 'image',
    multiple: false,
    accept,
    beforeUpload: (file) => {
      // Check file type
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      if (!isValidType) {
        message.error('You can only upload JPG, PNG, GIF, or WebP image files!');
        return false;
      }

      // Check file size
      const isValidSize = file.size / 1024 / 1024 < maxSize;
      if (!isValidSize) {
        message.error(`Image must be smaller than ${maxSize}MB!`);
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
    message.success('Image removed');
  };

  if (value) {
    return (
      <Card 
        className="image-upload-preview"
        style={{ maxWidth: 400 }}
        cover={
          <div style={{ position: 'relative', height: 200 }}>
            <Image
              src={value}
              alt="Uploaded image"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover' 
              }}
              preview={false}
            />
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
          title="Image Uploaded"
          description={
            <Text type="secondary" ellipsis>
              {value}
            </Text>
          }
        />
        
        {/* Full Screen Preview */}
        <Image
          style={{ display: 'none' }}
          src={value}
          preview={{
            visible: previewVisible,
            onVisibleChange: setPreviewVisible,
          }}
        />
      </Card>
    );
  }

  return (
    <div className="image-upload-container">
      {uploading ? (
        <Card className="upload-progress-card">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <LoadingOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
            <div style={{ marginBottom: 16 }}>
              <Text strong>Uploading Image...</Text>
            </div>
            <Progress
              percent={Math.round(uploadProgress)}
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              style={{ maxWidth: 300, margin: '0 auto' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Please wait while we upload your image</Text>
            </div>
          </div>
        </Card>
      ) : (
        <Dragger {...uploadProps} className="image-upload-dragger">
          <div className="ant-upload-drag-icon">
            <CloudUploadOutlined style={{ fontSize: 48, color: '#1890ff' }} />
          </div>
          <p className="ant-upload-text">
            <strong>Click or drag image file to this area to upload</strong>
          </p>
          <p className="ant-upload-hint">
            Support for JPG, PNG, GIF, WebP formats. Maximum size: {maxSize}MB
          </p>
          <div style={{ marginTop: 16 }}>
            <Space>
              <Button type="primary" icon={<CloudUploadOutlined />}>
                Select Image
              </Button>
            </Space>
          </div>
        </Dragger>
      )}

      <style jsx global>{`
        .image-upload-container .image-upload-dragger {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border: 2px dashed #d9d9d9;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .image-upload-container .image-upload-dragger:hover {
          border-color: #1890ff;
          background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
        }

        .image-upload-container .upload-progress-card {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .image-upload-container .image-upload-preview {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .image-upload-container .ant-upload-drag-icon {
          margin-bottom: 16px;
        }
      `}</style>
    </div>
  );
};

export default ImageUpload;
