import cancelHistoryPickupsData from '../mock/cancel-history-pickups.json';

export interface CancelHistoryPickup {
  id: string;
  dateTime: string;
  status: 'Complete' | 'Cancelled';
  carrier: string;
  carrierImg: string;
  address: string;
  recipient?: string;
  isMyPickup?: boolean;
  price?: number;
  serviceType?: string;
}

export interface CancelHistoryPickupsResponse {
  success: boolean;
  data: {
    pickups: CancelHistoryPickup[];
  };
  message: string;
}

/**
 * Get all cancel history pickups
 */
export async function getCancelHistoryPickups(): Promise<CancelHistoryPickupsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real implementation, this would be:
  // const response = await fetch('/api/v1/pickups/cancel-history');
  // return response.json();

  // Mock API implementation using fetch interceptor pattern
  const mockData = cancelHistoryPickupsData as CancelHistoryPickup[];

  return {
    success: true,
    data: {
      pickups: mockData,
    },
    message: 'Cancel history pickups retrieved successfully',
  };
}

