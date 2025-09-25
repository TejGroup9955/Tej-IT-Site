import TradeBookClient from './TradeBookClient';

export async function generateMetadata() {
  return {
    title: 'BDM TradeBook | Sales & Purchase Management Software',
    description: 'Track sales, purchases, and inventory with BDM TradeBook. Integrated with BDM Smart System for seamless business decisions. Request a demo today.',
  };
}

export default function TradeBook() {
  return <TradeBookClient />;
}