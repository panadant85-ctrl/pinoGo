export type OrderStatus = 'registrado' | 'aprobado' | 'comprado' | 'cancelado' | 'entregado';

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  price: number;
  image: string;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  tier: 'Nuevo' | 'Recurrente' | 'VIP';
  notes?: string;
  avatarColor?: string;
}

export interface PaymentInfo {
  method: 'Transferencia SPEI' | 'Bizum / Móvil' | 'Efectivo contra entrega' | 'Enlace de Pago';
  status: 'Verificado' | 'Pendiente' | 'Por Cobrar';
  referenceCode: string;
  receiptImage?: string;
  verifiedAt?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: 'customer' | 'operator';
  text: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  operator: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  elapsedTime: string;
  customer: Customer;
  items: OrderItem[];
  status: OrderStatus;
  payment: PaymentInfo;
  deliveryFee: number;
  subtotal: number;
  total: number;
  messages: WhatsAppMessage[];
  internalNotes?: string;
  isUrgent?: boolean;
  deliveryType: 'Envío Express' | 'Envío Estándar' | 'Retiro en Tienda';
  timeline: OrderTimelineEvent[];
}
