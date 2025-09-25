import ClassManagementClient from './ClassManagementClient';

export async function generateMetadata() {
  return {
    title: 'Tej Class Management System | All-in-One Student & Exam Management',
    description: 'Streamline student, class, and exam management with Tej Class Management System. Automate admissions, attendance, and analytics for schools and institutes. Request a demo today.',
  };
}

export default function ClassManagement() {
  return <ClassManagementClient />;
}