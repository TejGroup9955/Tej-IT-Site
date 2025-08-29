import PayrollClient from './PayrollClient';

export async function generateMetadata() {
  return {
    title: 'Tej Payroll Software | All-in-One Payroll & HR Management',
    description: 'Simplify payroll, empower HR, and ensure 100% compliance with Tej Payroll Software. Automate attendance, salary, and compliance for businesses of all sizes. Request a demo today.',
  };
}

export default function Payroll() {
  return <PayrollClient />;
}