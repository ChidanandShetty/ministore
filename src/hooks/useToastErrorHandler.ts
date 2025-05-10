import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { UseQueryResult, UseMutationResult } from '@tanstack/react-query';

export const useToastErrorHandler = (
  result: UseQueryResult<any> | UseMutationResult<any, any, any, any>
) => {
  useEffect(() => {
    if (result.isError && result.error instanceof Error) {
      toast.error(result.error.message || 'Something went wrong');
    }
  }, [result.isError, result.error]);
};
