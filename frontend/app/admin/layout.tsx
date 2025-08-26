import type { Metadata } from 'next';
     import '../globals.css'; // Relative path to root globals.css

     export const metadata: Metadata = {
         title: 'Tej IT Solutions - Admin',
         description: 'Admin panel for managing blogs',
     };

     export default function AdminLayout({ children }: { children: React.ReactNode }) {
         return (
             <html lang="en">
                 <body>{children}</body>
             </html>
         );
     }