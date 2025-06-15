interface InvestorApplicationData {
  [key: string]: any;
}

interface SubmitResponse {
  success: boolean;
  error?: string;
}

export const submitInvestorApplication = async (data: InvestorApplicationData): Promise<SubmitResponse> => {
  try {
    const response = await fetch('/api/investor-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit application');
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error submitting investor application:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };
  }
}; 