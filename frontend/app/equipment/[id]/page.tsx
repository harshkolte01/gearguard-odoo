'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEquipmentDetail } from '@/lib/hooks/useEquipmentDetail';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import MaintenanceSmartButton from '@/components/equipment/MaintenanceSmartButton';

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<'new' | 'equipment'>('equipment');

  const { equipment, loading, error } = useEquipmentDetail(id);

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="equipment-detail-header">
            <Button variant="ghost" onClick={() => router.push('/equipment')}>
              ← Back to Equipment
            </Button>
          </div>
          
          <div className="equipment-detail-loading">
            <Skeleton height="3rem" className="skeleton-mb" />
            <Skeleton height="20rem" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !equipment) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-main">
          <div className="equipment-detail-header">
            <Button variant="ghost" onClick={() => router.push('/equipment')}>
              ← Back to Equipment
            </Button>
          </div>
          
          <div className="equipment-error-container">
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h2 className="empty-state-title">Equipment Not Found</h2>
              <p className="empty-state-message">{error || 'The equipment you are looking for does not exist.'}</p>
              <Button onClick={() => router.push('/equipment')}>
                Return to Equipment List
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const relatedRequestsCount = equipment.maintenanceRequests?.length || 0;

  return (
    <div className="dashboard-container">
      <div className="dashboard-main">
        {/* Header with Tabs */}
        <div className="equipment-detail-header">
          <Button variant="ghost" onClick={() => router.push('/equipment')} className="back-button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Equipment
          </Button>
        </div>

        {/* Tabs and Smart Button */}
        <div className="equipment-detail-tabs-container">
          <div className="equipment-tabs">
            <button
              className={`equipment-tab ${activeTab === 'new' ? 'equipment-tab-active' : ''}`}
              onClick={() => setActiveTab('new')}
            >
              New
            </button>
            <button
              className={`equipment-tab ${activeTab === 'equipment' ? 'equipment-tab-active' : ''}`}
              onClick={() => setActiveTab('equipment')}
            >
              Equipment
            </button>
          </div>
          
          {/* Smart Button for Related Requests */}
          <MaintenanceSmartButton
            equipmentId={equipment.id}
            maintenanceRequests={equipment.maintenanceRequests}
          />
        </div>

        {/* Equipment Detail Form */}
        <div className="equipment-detail-form">
          <div className="equipment-detail-grid">
            {/* Left Column */}
            <div className="equipment-detail-column">
              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Name?</label>
                <div className="equipment-detail-value">{equipment.name}</div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Equipment Category?</label>
                <div className="equipment-detail-value">{equipment.category?.name || 'Uncategorized'}</div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Company?</label>
                <div className="equipment-detail-value">{equipment.location || 'Not specified'}</div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Used By?</label>
                <div className="equipment-detail-value">
                  {equipment.employeeOwner?.name || 'Employee'}
                </div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Maintenance Team?</label>
                <div className="equipment-detail-value">{equipment.maintenanceTeam?.name || 'Internal Maintenance'}</div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Assigned Date?</label>
                <div className="equipment-detail-value">{formatDate(equipment.purchase_date)}</div>
              </div>
            </div>

            {/* Right Column */}
            <div className="equipment-detail-column">
              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Technician?</label>
                <div className="equipment-detail-value">{equipment.defaultTechnician?.name || 'Mitchell Admin'}</div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Employee?</label>
                <div className="equipment-detail-value">{equipment.employeeOwner?.name || 'Abigail Peterson'}</div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Scrap Date?</label>
                <div className="equipment-detail-value">
                  {equipment.status === 'scrapped' ? formatDate(equipment.warranty_expiry) : ''}
                </div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Used in location?</label>
                <div className="equipment-detail-value">{equipment.location || ''}</div>
              </div>

              <div className="equipment-detail-field">
                <label className="equipment-detail-label">Work Center?</label>
                <div className="equipment-detail-value">{equipment.workCenter?.name || ''}</div>
              </div>
            </div>
          </div>

          {/* Description - Full Width */}
          <div className="equipment-detail-description">
            <label className="equipment-detail-label">Description</label>
            <div className="equipment-detail-textarea">
              {equipment.category?.description || 'No description available.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

