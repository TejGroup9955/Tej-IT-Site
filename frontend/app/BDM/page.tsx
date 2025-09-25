import BDMClient from './BDMClient';

export async function generateMetadata() {
  return {
    title: 'BDM Smart System | All-in-One Business Development & CRM Software',
    description: 'Transform leads into lasting relationships with BDM Smart System. Streamline lead management, sales, and customer support with our advanced CRM platform. Request a free demo today.',
  };
}

export default function BDM() {
  return <BDMClient />;
}