export type Property = {
  id: string;
  name: string;
  address: string;
  neighborhood: string;
  image: string;
  rent: number;
  beds: number;
  baths: number;
  area: number;
  status: "Occupied" | "Available";
  tenant: string | null;
};

export const initialProperties: Property[] = [
  {
    id: "FM-001",
    name: "The Olive House",
    address: "124 Olive Street",
    neighborhood: "Silver Lake, Los Angeles",
    image: "olive",
    rent: 2400,
    beds: 3,
    baths: 2,
    area: 1850,
    status: "Occupied",
    tenant: "Alex Morgan",
  },
  {
    id: "FM-002",
    name: "Casa Vista",
    address: "86 Vista Avenue",
    neighborhood: "Echo Park, Los Angeles",
    image: "casa",
    rent: 3200,
    beds: 4,
    baths: 3,
    area: 2400,
    status: "Available",
    tenant: null,
  },
  {
    id: "FM-003",
    name: "Cedar Residence",
    address: "32 Cedar Lane",
    neighborhood: "Pasadena, Los Angeles",
    image: "cedar",
    rent: 2800,
    beds: 3,
    baths: 2,
    area: 1950,
    status: "Occupied",
    tenant: "Jamie Chen",
  },
  {
    id: "FM-004",
    name: "Parkside House",
    address: "17 Parkside Drive",
    neighborhood: "Los Feliz, Los Angeles",
    image: "park",
    rent: 3600,
    beds: 4,
    baths: 3,
    area: 2650,
    status: "Occupied",
    tenant: "Sam Rivera",
  },
  {
    id: "FM-005",
    name: "Oak & Stone",
    address: "209 Oak Street",
    neighborhood: "Highland Park, Los Angeles",
    image: "oak",
    rent: 2600,
    beds: 2,
    baths: 2,
    area: 1600,
    status: "Occupied",
    tenant: "Taylor Brooks",
  },
  {
    id: "FM-006",
    name: "Sunset Apartment",
    address: "54 Sunset Boulevard",
    neighborhood: "Silver Lake, Los Angeles",
    image: "sunset",
    rent: 2900,
    beds: 2,
    baths: 2,
    area: 1450,
    status: "Available",
    tenant: null,
  },
];

export type Payment = {
  propertyId: string;
  status: "Paid" | "Overdue";
  date: string;
};
export const initialPayments: Payment[] = [
  { propertyId: "FM-001", status: "Paid", date: "Nov 01, 2026" },
  { propertyId: "FM-003", status: "Overdue", date: "Nov 01, 2026" },
  { propertyId: "FM-004", status: "Paid", date: "Nov 02, 2026" },
  { propertyId: "FM-005", status: "Paid", date: "Nov 03, 2026" },
];

export type Maintenance = {
  id: string;
  title: string;
  property: string;
  category: string;
  priority: "High" | "Normal";
  completed: boolean;
};
export const initialMaintenance: Maintenance[] = [
  {
    id: "MT-024",
    title: "Kitchen faucet leak",
    property: "The Olive House",
    category: "Plumbing",
    priority: "High",
    completed: false,
  },
  {
    id: "MT-023",
    title: "Annual AC service",
    property: "Cedar Residence",
    category: "HVAC",
    priority: "Normal",
    completed: false,
  },
  {
    id: "MT-022",
    title: "Garage door inspection",
    property: "Parkside House",
    category: "General",
    priority: "Normal",
    completed: false,
  },
];

export const money = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
