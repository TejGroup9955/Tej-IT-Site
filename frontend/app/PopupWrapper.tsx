'use client';
     import { usePathname } from 'next/navigation';
     import EnquiryPopup from './contact/EnquiryPopup';

     export default function PopupWrapper() {
       const pathname = usePathname();
        return (
            <>
            <EnquiryPopup />
            </>
        );
     }