import cutoffTimesData from '../mock/cutoff-times.json';

export interface CutoffTime {
  carrier: string;
  serviceType: string;
  cutoffTime: string;
  note: string;
  image: string;
}

export interface CutoffTimesResponse {
  success: boolean;
  data: {
    country: string;
    postalCode: string;
    cutoffTimes: CutoffTime[];
  };
  message: string;
}

export async function getCutoffTimes(
  country: string,
  postalCode: string
): Promise<CutoffTimesResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  // In a real implementation, this would be:
  // const response = await fetch(`/api/v1/cutoff-times?country=${country}&postalCode=${postalCode}`);
  // return response.json();

  // Mock API implementation using fetch interceptor pattern
  const mockData = cutoffTimesData as Record<
    string,
    Record<string, CutoffTime[]>
  >;

  // Find cutoff times for the specific country and postal code
  const countryData = mockData[country];
  if (!countryData) {
    return {
      success: false,
      data: {
        country,
        postalCode,
        cutoffTimes: [],
      },
      message: `No cutoff times found for country: ${country}`,
    };
  }

  // Try exact postal code match first
  let cutoffTimes = countryData[postalCode];

  // If exact match not found, use first available postal code for that country
  if (!cutoffTimes || cutoffTimes.length === 0) {
    const firstPostalCode = Object.keys(countryData)[0];
    cutoffTimes = countryData[firstPostalCode] || [];
  }

  return {
    success: true,
    data: {
      country,
      postalCode,
      cutoffTimes,
    },
    message:
      cutoffTimes.length > 0
        ? 'Cutoff times retrieved successfully'
        : 'No cutoff times found for the specified postal code',
  };
}

/**
 * Get list of available countries
 */
export function getAvailableCountries(): string[] {
  const mockData = cutoffTimesData as Record<
    string,
    Record<string, CutoffTime[]>
  >;
  return Object.keys(mockData);
}

/**
 * Get postal codes for a specific country
 */
export function getPostalCodesByCountry(country: string): string[] {
  const mockData = cutoffTimesData as Record<
    string,
    Record<string, CutoffTime[]>
  >;
  const countryData = mockData[country];
  return countryData ? Object.keys(countryData) : [];
}
