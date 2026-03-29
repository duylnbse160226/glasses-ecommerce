import { useQuery } from "@tanstack/react-query";
import agent from "../api/agent";
import type {
  InboundRecordDto,
  InboundRecordItemDto,
} from "../types/inventory";

export type { InboundRecordDto, InboundRecordItemDto };

export function useInboundDetail(id: string | undefined) {
  return useQuery<InboundRecordDto>({
    queryKey: ["inbound-detail", id],
    queryFn: async () => {
      const res = await agent.get<InboundRecordDto>(
        `/manager/inventory/inbound/${id}`,
      );
      return res.data;
    },
    enabled: !!id,
  });
}
