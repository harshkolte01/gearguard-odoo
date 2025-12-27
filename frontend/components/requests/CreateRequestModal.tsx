'use client';

import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import DatePicker from '../ui/DatePicker';
import Button from '../ui/Button';
import { useEquipment } from '@/lib/hooks/useEquipment';
import { useWorkCenters } from '@/lib/hooks/useWorkCenters';
import { useCreateRequest } from '@/lib/hooks/useCreateRequest';
import { validateCreateRequestForm } from '@/lib/validation';
import { userStorage } from '@/lib/auth';
import type { CreateRequestData, EquipmentDetail, WorkCenterDetail } from '@/lib/types';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateRequestModalProps) {
  const [formData, setFormData] = useState<CreateRequestData>({
    subject: '',
    description: '',
    category: 'equipment',
    equipment_id: '',
    work_center_id: '',
    type: 'corrective',
    scheduled_date: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [workCenterSearchTerm, setWorkCenterSearchTerm] = useState('');
  
  // Get current user's role
  const currentUser = userStorage.get();
  const isPortalUser = currentUser?.role === 'portal';

  const { equipment, loading: equipmentLoading } = useEquipment({
    search: equipmentSearchTerm,
    status: 'active',
  });

  const { workCenters, loading: workCentersLoading } = useWorkCenters({
    search: workCenterSearchTerm,
  });

  const { createRequest, loading: creating, error: apiError } = useCreateRequest();

  // Find selected equipment details for auto-fill preview
  const selectedEquipment = equipment.find((eq) => eq.id === formData.equipment_id);
  
  // Find selected work center details for auto-fill preview
  const selectedWorkCenter = workCenters.find((wc) => wc.id === formData.work_center_id);
  
  // Check if selected work center has a default team
  const workCenterHasTeam = selectedWorkCenter?.default_team_id != null;

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        subject: '',
        description: '',
        category: 'equipment',
        equipment_id: '',
        work_center_id: '',
        type: 'corrective',
        scheduled_date: '',
      });
      setErrors({});
      setEquipmentSearchTerm('');
      setWorkCenterSearchTerm('');
    }
  }, [isOpen]);

  const handleChange = (field: keyof CreateRequestData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateCreateRequestForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Additional validation for work center requests
    if (formData.category === 'work_center' && formData.work_center_id) {
      if (!workCenterHasTeam) {
        setErrors((prev) => ({
          ...prev,
          work_center_id: 'This work center does not have a default maintenance team. Please select a different work center or contact an administrator.',
        }));
        return;
      }
    }

    try {
      await createRequest(formData);
      onSuccess();
      onClose();
    } catch (err) {
      // Error is handled by the hook
      console.error('Failed to create request:', err);
    }
  };

  const equipmentOptions = equipment.map((eq) => ({
    value: eq.id,
    label: eq.name,
    description: `${eq.serial_number} • ${eq.department} • ${eq.location}`,
  }));

  const workCenterOptions = workCenters.map((wc) => ({
    value: wc.id,
    label: wc.name,
    description: wc.code ? `Code: ${wc.code}` : undefined,
  }));

  const maintenanceForOptions = [
    { value: 'equipment', label: 'Equipment', description: 'Maintenance for a specific equipment' },
    ...(isPortalUser ? [] : [{ value: 'work_center', label: 'Work Center', description: 'Maintenance for a location/area' }]),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Maintenance Request"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="create-request-form">
        {apiError && (
          <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
            {apiError}
          </div>
        )}

        {/* Maintenance For Selection */}
        <Select
          label="Maintenance For *"
          options={maintenanceForOptions}
          value={formData.category || 'equipment'}
          onChange={(value) => {
            handleChange('category', value);
            // Clear the other field when switching
            if (value === 'equipment') {
              handleChange('work_center_id', '');
            } else {
              handleChange('equipment_id', '');
            }
          }}
          error={errors.category}
          helperText={isPortalUser ? "Work center requests are for internal operations only" : undefined}
        />

        {/* Conditional Equipment or Work Center Selection */}
        {formData.category === 'equipment' ? (
          <>
            {/* Equipment Selection */}
            <Select
              label="Equipment *"
              options={equipmentOptions}
              value={formData.equipment_id || ''}
              onChange={(value) => handleChange('equipment_id', value)}
              error={errors.equipment_id}
              placeholder="Select equipment that needs maintenance"
              searchable
              loading={equipmentLoading}
              helperText={isPortalUser ? "Showing only your assigned equipment" : undefined}
            />

            {/* Auto-fill Preview for Equipment */}
            {selectedEquipment && (
              <div className="auto-fill-preview">
                <div className="auto-fill-title">Auto-assigned Details</div>
                <div className="auto-fill-grid">
                  <div className="auto-fill-item">
                    <span className="auto-fill-label">Team:</span>
                    <span className="auto-fill-value">
                      {selectedEquipment.maintenanceTeam?.name || 'Not assigned'}
                    </span>
                  </div>
                  <div className="auto-fill-item">
                    <span className="auto-fill-label">Technician:</span>
                    <span className="auto-fill-value">
                      {selectedEquipment.defaultTechnician?.name || 'Will be assigned later'}
                    </span>
                  </div>
                  {selectedEquipment.workCenter && (
                    <div className="auto-fill-item">
                      <span className="auto-fill-label">Work Center:</span>
                      <span className="auto-fill-value">
                        {selectedEquipment.workCenter.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Work Center Selection */}
            <Select
              label="Work Center *"
              options={workCenterOptions}
              value={formData.work_center_id || ''}
              onChange={(value) => handleChange('work_center_id', value)}
              error={errors.work_center_id}
              placeholder="Select work center that needs maintenance"
              searchable
              loading={workCentersLoading}
              helperText="Select the location or area that requires maintenance"
            />

            {/* Auto-fill Preview for Work Center */}
            {selectedWorkCenter && (
              <div className="auto-fill-preview">
                <div className="auto-fill-title">Auto-assigned Details</div>
                {!workCenterHasTeam && (
                  <div className="alert alert-warning" style={{ marginBottom: '1rem', padding: '0.75rem' }}>
                    <strong>Warning:</strong> This work center does not have a default maintenance team assigned. 
                    Please select a different work center or contact an administrator to configure this work center.
                  </div>
                )}
                <div className="auto-fill-grid">
                  <div className="auto-fill-item">
                    <span className="auto-fill-label">Team:</span>
                    <span className="auto-fill-value">
                      {selectedWorkCenter.defaultTeam?.name || 'Not assigned'}
                    </span>
                  </div>
                  {selectedWorkCenter.code && (
                    <div className="auto-fill-item">
                      <span className="auto-fill-label">Code:</span>
                      <span className="auto-fill-value">
                        {selectedWorkCenter.code}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Subject */}
        <Input
          label="Subject *"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          error={errors.subject}
          maxLength={200}
        />

        {/* Description */}
        <Textarea
          label="Description"
          value={formData.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          error={errors.description}
          helperText="Provide additional details about the maintenance needed"
          showCharCount
          maxLength={500}
          rows={4}
        />

        {/* Request Type */}
        <Select
          label="Request Type *"
          options={[
            { value: 'corrective', label: 'Corrective', description: 'Unplanned breakdown repair' },
            { value: 'preventive', label: 'Preventive', description: 'Scheduled routine maintenance' },
          ]}
          value={formData.type}
          onChange={(value) => handleChange('type', value as 'corrective' | 'preventive')}
          error={errors.type}
        />

        {/* Scheduled Date (only for preventive) */}
        {formData.type === 'preventive' && (
          <DatePicker
            label="Scheduled Date & Time *"
            value={formData.scheduled_date || ''}
            onChange={(value) => handleChange('scheduled_date', value)}
            error={errors.scheduled_date}
            helperText="When should this maintenance be performed?"
            showTime
          />
        )}

        {/* Form Actions */}
        <div className="modal-actions">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={creating}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={creating}
            disabled={creating}
          >
            Create Request
          </Button>
        </div>
      </form>
    </Modal>
  );
}

