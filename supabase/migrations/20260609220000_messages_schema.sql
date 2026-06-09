-- Sprint 1.7: conversations + messages (schema only, no UI yet)
-- Chat is scoped to mutual matches; RLS enforces participants-only access.

CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES public.matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);

CREATE INDEX idx_messages_conversation_created
  ON public.messages (conversation_id, created_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user a participant in the conversation's match,
-- and is the match mutual?
CREATE OR REPLACE FUNCTION public.is_conversation_participant(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.conversations c
    JOIN public.matches m ON m.id = c.match_id
    WHERE c.id = p_conversation_id
      AND m.is_mutual
      AND auth.uid() IN (m.user1_id, m.user2_id)
  );
$$;

CREATE POLICY "participants can view conversations"
  ON public.conversations FOR SELECT
  USING (public.is_conversation_participant(id));

CREATE POLICY "participants can create conversation for their mutual match"
  ON public.conversations FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.matches m
    WHERE m.id = match_id
      AND m.is_mutual
      AND auth.uid() IN (m.user1_id, m.user2_id)
  ));

CREATE POLICY "participants can read messages"
  ON public.messages FOR SELECT
  USING (public.is_conversation_participant(conversation_id));

CREATE POLICY "participants can send messages as themselves"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND public.is_conversation_participant(conversation_id)
  );

-- Mark-as-read: recipients may set read_at on messages they received
CREATE POLICY "recipients can mark messages read"
  ON public.messages FOR UPDATE
  USING (public.is_conversation_participant(conversation_id) AND sender_id <> auth.uid())
  WITH CHECK (sender_id <> auth.uid());

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
