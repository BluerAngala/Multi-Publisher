import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { AlertTriangleIcon } from 'lucide-react';

interface OverwriteConfirmModalProps {
  /** 是否显示 */
  isOpen: boolean;
  /** 关闭回调 */
  onClose: () => void;
  /** 确认覆盖回调 */
  onConfirm: () => void;
  /** 取消覆盖回调 */
  onCancel: () => void;
}

/**
 * 内容覆盖确认对话框
 * 当用户已手动输入内容后选择资讯时显示
 */
const OverwriteConfirmModal: React.FC<OverwriteConfirmModalProps> = ({ isOpen, onClose, onConfirm, onCancel }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onCancel();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <AlertTriangleIcon className="text-warning size-5" />
          <span>确认覆盖内容</span>
        </ModalHeader>
        <ModalBody>
          <p className="text-default-600">
            检测到您已手动输入内容，选择新的资讯将使用 AI 重新生成内容。是否覆盖现有内容？
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={handleCancel}>
            保留原内容
          </Button>
          <Button
            color="primary"
            onPress={handleConfirm}>
            覆盖并生成
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OverwriteConfirmModal;
