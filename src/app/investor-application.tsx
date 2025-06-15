import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { submitInvestorApplication } from '../services/investorApplicationService';

const InvestorApplication: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await submitInvestorApplication(formData);
      
      if (response.success) {
        setShowConfirmation(true);
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        setError(response.error || 'Failed to submit application');
      }
    } catch (err) {
      setError('An error occurred while submitting your application');
      console.error('Error submitting application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Render your form here */}
    </div>
  );
};

export default InvestorApplication; 