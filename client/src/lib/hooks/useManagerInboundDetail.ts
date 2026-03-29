import { useQuery } from "@tanstack/react-query";
import agent from "../api/agent";
import type {
  InboundRecordDto,
  InboundRecordItemDto,
} from "../types/inventory";

export type InboundRecordDetailDto = InboundRecordDto;
export type { InboundRecordItemDto };

export function useManagerInboundDetail(id: string | undefined) {
  return useQuery<InboundRecordDetailDto>({
    queryKey: ["manager-inbound-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await agent.get<InboundRecordDetailDto>(
        `/manager/inventory/inbound/${id}`,
      );
      return res.data;
    },
  });
}
