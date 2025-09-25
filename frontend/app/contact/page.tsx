import ContactClient from './ContactClient';
import EnquiryPopup from './EnquiryPopup';

export async function generateMetadata() {
  return {
    title: 'Contact Tej ERP | Schedule a Demo or Ask a Question',
    description: 'Reach out to the Tej team for product demos, technical support, or business inquiries.',
  };
}

export default function Contact() {
  return (
    <>
      <ContactClient />
      <EnquiryPopup />
    </>
  );
}