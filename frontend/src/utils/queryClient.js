import { QueryClient } from '@tanstack/vue-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // Số lần retry mặc định
      refetchOnWindowFocus: false, // Không refetch khi quay lại tab
      staleTime: 1000 * 60 * 5 // 5 phút dữ liệu cũ
    }
  }
});
