import shipmentsData from '../mock/shipments.json';

export interface ShipmentData {
  id: number;
  trackingId: string;
  status: 'Delivered' | 'Created' | 'In Transit' | 'Exception';
  recipient: string;
  location: string;
  carrier: string;
  carrierImg: string;
  service: string;
  date: string;
  shipper: string;
  trackingNumber: string;
  weight: string;
  dimensions: string;
  estimatedDelivery: string;
  shippingCost: string;
  isCarrierDirect?: boolean;
  isDeleted?: boolean;
}

export interface ShipmentsResponse {
  success: boolean;
  data: {
    shipments: ShipmentData[];
  };
  message: string;
}

/**
 * Get all shipments
 */
export async function getShipments(): Promise<ShipmentsResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real implementation, this would be:
  // const response = await fetch('/api/v1/shipments');
  // return response.json();

  // Mock API implementation using fetch interceptor pattern
  const mockData = shipmentsData as ShipmentData[];

  return {
    success: true,
    data: {
      shipments: mockData,
    },
    message: 'Shipments retrieved successfully',
  };
}

