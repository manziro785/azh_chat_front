import { useCallback, useEffect, useRef, useState } from "react";
import { useSocket } from "../../contexts/socketContext";
import { useChannelContext } from "../channel/useChannelContext";
import { useQueryClient } from "@tanstack/react-query";
import { normalizeMessage } from "../../lib/message";

const TYPING_PING_MS = 2000; // don't spam "typing" on every keystroke
const TYPING_IDLE_MS = 1500; // send "stop_typing" after this much silence
const TYPING_TTL_MS = 6000; // drop a typist if their stop event never lands

const EMPTY = [];

// Live half of a channel: messages arriving over the socket, plus who is
// typing. History comes from useGetChannelMessagesHistory.
export const useChannelMessages = () => {
  const { socket, isConnected } = useSocket();
  const { activeChannel } = useChannelContext();
  const queryClient = useQueryClient();

  const channelId = activeChannel?.id ?? null;

  // Live state is stamped with the channel it belongs to instead of being
  // cleared in an effect, so the previous channel's messages can never show
  // up — not even for the render between switching and the effect firing.
  const [live, setLive] = useState({
    channelId: null,
    messages: EMPTY,
    typing: EMPTY,
  });
  const isCurrent = live.channelId === channelId;
  const messages = isCurrent ? live.messages : EMPTY;
  const typingUsers = isCurrent ? live.typing : EMPTY;

  const idleTimer = useRef(null);
  const lastPing = useRef(0);
  const typingTimers = useRef(new Map());

  useEffect(() => {
    if (!socket || !channelId || !isConnected) return;

    socket.emit("join_channel", { channelId });

    const handleNewMessage = (raw) => {
      if (raw.channelId && String(raw.channelId) !== String(channelId)) return;
      const incoming = normalizeMessage(raw);

      setLive((prev) => {
        const base = prev.channelId === channelId ? prev : { messages: EMPTY, typing: EMPTY };
        if (base.messages.some((m) => m.id === incoming.id)) {
          return { channelId, messages: base.messages, typing: base.typing };
        }
        return {
          channelId,
          messages: [...base.messages, incoming],
          // Sending a message means that person stopped typing.
          typing: base.typing.filter((u) => u.userId !== incoming.senderId),
        };
      });
    };

    const dropTypist = (userId) => {
      setLive((prev) =>
        prev.channelId === channelId
          ? { ...prev, typing: prev.typing.filter((u) => u.userId !== userId) }
          : prev
      );
      const timer = typingTimers.current.get(userId);
      if (timer) {
        clearTimeout(timer);
        typingTimers.current.delete(userId);
      }
    };

    const handleTyping = ({ userId, nickname }) => {
      const id = String(userId);

      setLive((prev) => {
        const base =
          prev.channelId === channelId ? prev : { messages: EMPTY, typing: EMPTY };
        if (base.typing.some((u) => u.userId === id)) {
          return { channelId, messages: base.messages, typing: base.typing };
        }
        return {
          channelId,
          messages: base.messages,
          typing: [...base.typing, { userId: id, nickname }],
        };
      });

      clearTimeout(typingTimers.current.get(id));
      typingTimers.current.set(
        id,
        setTimeout(() => dropTypist(id), TYPING_TTL_MS)
      );
    };

    const handleStopTyping = ({ userId }) => dropTypist(String(userId));

    const handleMembership = () => {
      queryClient.invalidateQueries({ queryKey: ["members", channelId] });
    };

    socket.on("new_message", handleNewMessage);
    socket.on("typing_indicator", handleTyping);
    socket.on("stop_typing_indicator", handleStopTyping);
    socket.on("user_joined", handleMembership);
    socket.on("user_left", handleMembership);

    const timers = typingTimers.current;
    return () => {
      socket.emit("leave_channel", { channelId });
      socket.off("new_message", handleNewMessage);
      socket.off("typing_indicator", handleTyping);
      socket.off("stop_typing_indicator", handleStopTyping);
      socket.off("user_joined", handleMembership);
      socket.off("user_left", handleMembership);
      timers.forEach(clearTimeout);
      timers.clear();
    };
  }, [socket, channelId, isConnected, queryClient]);

  const stopTyping = useCallback(() => {
    clearTimeout(idleTimer.current);
    lastPing.current = 0;
    if (socket && channelId) socket.emit("stop_typing", { channelId });
  }, [socket, channelId]);

  // Called on every keystroke; throttles the outgoing ping and schedules the
  // "stopped typing" event itself, so the composer stays dumb.
  const notifyTyping = useCallback(() => {
    if (!socket || !channelId) return;

    const now = Date.now();
    if (now - lastPing.current > TYPING_PING_MS) {
      socket.emit("typing", { channelId });
      lastPing.current = now;
    }

    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(stopTyping, TYPING_IDLE_MS);
  }, [socket, channelId, stopTyping]);

  const sendMessage = useCallback(
    (content) => {
      if (!socket || !channelId || !content.trim()) return;
      socket.emit("send_message", { channelId, content: content.trim() });
      stopTyping();
    },
    [socket, channelId, stopTyping]
  );

  useEffect(() => () => clearTimeout(idleTimer.current), []);

  return {
    messages,
    typingUsers,
    sendMessage,
    notifyTyping,
    stopTyping,
    isConnected,
  };
};
