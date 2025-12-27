'use client';

import { useRouter } from 'next/navigation';
import type { EquipmentDetail } from '@/lib/types';

interface EquipmentTableRowProps {
  equipment: EquipmentDetail;
}

export default function EquipmentTableRow({ equipment }: EquipmentTableRowProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/equipment/${equipment.id}`);
  };

  return (
    <tr className="equipment-table-row" onClick={handleClick}>
      <td className="equipment-table-cell">{equipment.name}</td>
      <td className="equipment-table-cell">
        {equipment.employeeOwner?.name || equipment.defaultTechnician?.name || 'Unassigned'}
      </td>
      <td className="equipment-table-cell">{equipment.department}</td>
      <td className="equipment-table-cell">{equipment.serial_number}</td>
      <td className="equipment-table-cell">
        {equipment.defaultTechnician?.name || 'Not assigned'}
      </td>
      <td className="equipment-table-cell">
        {equipment.category?.name || 'Uncategorized'}
      </td>
      <td className="equipment-table-cell">
        {equipment.location || 'Not specified'}
      </td>
    </tr>
  );
}


