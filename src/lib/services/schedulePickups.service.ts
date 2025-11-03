import schedulePickupsData from '../mock/schedule-pickups.json';

export interface SchedulePickup {
  id: string;
  dateTime: string;
  carrier: string;
  address: string;
  recipient?: string;
  isMyPickup?: boolean;
  status: string;
}

export interface SchedulePickupsResponse {
  success: boolean;
  data: {
    pickups: SchedulePickup[];
  };
  message: string;
}

/**
 * Get all scheduled pickups
 */
export async function getSchedulePickups(): Promise<SchedulePickupsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real implementation, this would be:
  // const response = await fetch('/api/v1/pickups/schedule');
  // return response.json();

  // Mock API implementation using fetch interceptor pattern
  const mockData = schedulePickupsData as SchedulePickup[];

  return {
    success: true,
    data: {
      pickups: mockData,
    },
    message: 'Scheduled pickups retrieved successfully',
  };
}

