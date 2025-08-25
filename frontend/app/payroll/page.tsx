import PayrollClient from './PayrollClient';

export async function generateMetadata() {
  return {
    title: 'Tej Payroll Software | Streamline HR & Payroll Management',
    description: 'Discover Tej Payroll Software - an intuitive solution to automate HR, payroll, and compliance for small and large businesses. Request a demo today.',
  };
}

export default function Payroll() {
  return <PayrollClient />;
}