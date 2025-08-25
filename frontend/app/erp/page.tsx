import ERPClient from './ERPClient';

export async function generateMetadata() {
  return {
    title: 'Tej Smart ERP for Contractors | Efficient Project Management Software',
    description: 'Discover Tej Smart ERP - an intuitive software solution designed for contractors. Streamline project management, accounting, procurement, and inventory in one smart platform. Get a personalized demo today.',
  };
}

export default function ERP() {
  return <ERPClient />;
}