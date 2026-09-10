import { createContext, useState, useMemo } from "react";
import { useGetChannel } from "../hooks/channel/useGetChannel";

export const ChannelContext = createContext();

export const ChannelProvider = ({ children }) => {
  const [activeChannelId, setActiveChannelId] = useState(null);
  const { data, isPending, error, refetch } = useGetChannel();

  const channels = useMemo(() => data?.channels ?? [], [data]);

  // Derived, not stored: when a channel is deleted or we are removed from it,
  // the selection falls back to null on its own.
  const activeChannel = useMemo(
    () => channels.find((c) => c.id === activeChannelId) ?? null,
    [channels, activeChannelId]
  );

  const value = useMemo(
    () => ({
      channels,
      activeChannel,
      setActiveChannel: (channel) => setActiveChannelId(channel?.id ?? null),
      isLoading: isPending,
      error,
      refetchChannels: refetch,
    }),
    [channels, activeChannel, isPending, error, refetch]
  );

  return (
    <ChannelContext.Provider value={value}>{children}</ChannelContext.Provider>
  );
};
