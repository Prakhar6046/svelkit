import type { title } from 'process';
import { writable } from 'svelte/store';

// Example: Show/Hide Results
export const showResults = writable<boolean>(true);
interface estimateDataType {
  from: string;
  to: string;
  packageType: string;
  weight: string;
}
export const estimateData = writable<estimateDataType>({
  from: '',
  to: '',
  packageType: '',
  weight: '',
});

export const showDashboardSidebar = writable<boolean>(true);

interface schedulePickupDataType {
  address: string;
  pickUpDate: string;
  pickupTimeWindow: string;
  carreieAndService: string;
  carrierDescription: string;
  packageType: string;
  totalWeight: string;
  totalWeightUnit: string;
  dimensions1: string;
  dimensions2: string;
  dimensions3: string;
  packageDescription: string;
}
export const schedulePickupData = writable<schedulePickupDataType>({
  address: '',
  pickUpDate: '',
  pickupTimeWindow: '',
  carreieAndService: '',
  carrierDescription: '',
  packageType: '',
  totalWeight: '',
  totalWeightUnit: '',
  dimensions1: '',
  dimensions2: '',
  dimensions3: '',
  packageDescription: '',
});

interface SavedAddressesType {
  addressType: string;
  default: boolean;
  address: string;
}
export const savedAddresses = writable<SavedAddressesType[]>([
  {
    addressType: 'Home',
    default: true,
    address: '123 Main St, Dhaka',
  },
  {
    addressType: 'Office',
    default: false,

    address: '125 Groove St, Dhaka',
  },
  {
    addressType: 'Office2',
    default: false,
    address: '212 NY St, Dhaka',
  },
  {
    addressType: 'Home2',
    default: false,
    address: '616 Man Rd, Dhaka',
  },
  {
    addressType: 'John House',
    default: false,
    address: '212, Main St, NY, USA',
  },
]);

interface SelectType {
  value: string;
  label: string;
}
export const packageType = writable<SelectType[]>([
  { value: 'box', label: 'Box' },
  { value: 'envelope', label: 'Envelope' },
  { value: 'crate', label: 'Crate' },
]);

interface WeightType {
  value: string;
  label: string;
}
export const weightType = writable<SelectType[]>([
  { value: 'kg', label: 'KG' },
  { value: 'lbs', label: 'LBS' },
  { value: 'oz', label: 'OZ' },
]);

export const pickupTimeWindow = writable<SelectType[]>([
  { value: '9:00 AM - 12:00 PM', label: '9:00 AM - 12:00 PM' },
  { value: '1:00 AM - 12:00 PM', label: '1:00 AM - 12:00 PM' },
  { value: '2:00 AM - 12:00 PM', label: '2:00 AM - 12:00 PM' },
  { value: '3:00 AM - 12:00 PM', label: '3:00 AM - 12:00 PM' },
  { value: '4:00 AM - 12:00 PM', label: '4:00 AM - 12:00 PM' },
  { value: '5:00 AM - 12:00 PM', label: '5:00 AM - 12:00 PM' },
  { value: '6:00 AM - 12:00 PM', label: '6:00 AM - 12:00 PM' },
]);

interface CarrierOption {
  id: string;
  name: string;
  description: string;
  price: string;
  logo: string;
}

export const carriers = writable<CarrierOption[]>([
  {
    id: 'option-one',
    name: 'FedEx Express',
    description: 'International Priority • Next Business Day',
    price: '$25.99',
    logo: '../../../../public/assets/images/fedex-with-bg.svg ',
  },
  {
    id: 'option-two',
    name: 'UPS Worldwide Saver',
    description: '2 Business Days Delivery',
    price: '$22.49',
    logo: '../../../../public/assets/images/ups.svg',
  },
  {
    id: 'option-three',
    name: 'DHL Express',
    description: 'Fastest International Shipping',
    price: '$28.10',
    logo: '../../../../public/assets/images/ups.svg',
  },
]);
