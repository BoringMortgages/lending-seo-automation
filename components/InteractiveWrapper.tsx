'use client';

import { useState, ReactNode } from "react";
import ContactForm from "./ContactForm";
import PreApprovalForm from "./PreApprovalForm";

interface InteractiveWrapperProps {
  children: ReactNode;
}

export default function InteractiveWrapper({ children }: InteractiveWrapperProps) {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isPreApprovalFormOpen, setIsPreApprovalFormOpen] = useState(false);

  return (
    <>
      {children}
      
      <ContactForm 
        isOpen={isContactFormOpen} 
        onClose={() => setIsContactFormOpen(false)} 
      />
      
      <PreApprovalForm 
        isOpen={isPreApprovalFormOpen} 
        onClose={() => setIsPreApprovalFormOpen(false)} 
      />
    </>
  );
}