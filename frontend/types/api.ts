export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar_url?: string | null;
  created_at: string;
}

export interface Image {
  id: string;
  file_path: string;
  storage_path?: string;
  is_primary: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
}

export interface Style {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  is_featured: boolean;
  is_published: boolean;
  is_saved: boolean;
  category_id: string | null;
  collection_id: string | null;
  created_at: string;
  images?: Image[];
  category?: Category;
  collection?: Collection;
}

export interface Material {
  id: string;
  name: string;
  type: string;
  description: string | null;
  is_available: boolean;
  created_at: string;
  images?: Image[];
}

export interface Attachment {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  url: string;
  created_at: string;
}

export interface StyleRequest {
  id: string;
  user_id: string;
  style_id: string | null;
  status: string;
  description: string;
  preferred_color: string | null;
  preferred_material: string | null;
  sourcing_preference: 'customer_provided' | 'kingjoebridd_sourced' | null;
  notes: string | null;
  attachments?: Attachment[];
  user?: User;
  style?: Style;
  created_at: string;
}

export interface Message {
  id: string;
  sender_id: string | null;
  is_read: boolean;
  content: string | null;
  attachments?: Attachment[];
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  context_type: 'style' | 'style_request' | 'order';
  context_id: string;
  status: string;
  messages?: Message[];
  latest_message?: Message;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  id: string;
  type: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Quote {
  id: string;
  user_id: string;
  conversation_id: string | null;
  subtotal: number;
  discount: number;
  total: number;
  status: 'draft' | 'sent' | 'accepted' | 'expired';
  notes: string | null;
  expires_at: string | null;
  accepted_at: string | null;
  created_at: string;
  items?: QuoteItem[];
}

export interface Order {
  id: string;
  user_id: string;
  quote_id: string;
  payment_status: 'pending_payment' | 'partially_paid' | 'paid_in_full';
  production_status: string;
  snapshot: {
    quote: Quote;
    customer_id: string;
    accepted_at: string;
    [key: string]: any;
  };
  created_at: string;
  production_updates?: ProductionUpdate[];
  fulfillment?: Fulfillment;
}

export interface ProductionUpdate {
  id: string;
  order_id: string;
  status: 'not_started' | 'cutting' | 'sewing' | 'finishing' | 'quality_check' | 'ready';
  note: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  type: 'deposit' | 'full' | 'balance';
  provider: string;
  provider_reference: string;
  status: 'pending' | 'successful';
  paid_at: string | null;
  created_at: string;
}

export interface Fulfillment {
  id: string;
  order_id: string;
  type: 'pickup' | 'delivery';
  recipient_name: string | null;
  phone: string | null;
  address: string | null;
  delivery_fee: number | null;
  tracking_reference: string | null;
  status: 'pending' | 'shipped' | 'ready_for_pickup' | 'delivered' | 'picked_up';
  created_at: string;
  updated_at: string;
}

export interface MeasurementValue {
  id: string;
  measurement_set_id: string;
  key: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface MeasurementSet {
  id: string;
  profile_id: string;
  version: number;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  values?: MeasurementValue[];
}

export interface MeasurementProfile {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  measurement_sets?: MeasurementSet[];
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  message?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
