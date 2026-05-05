import { supabase } from "./supabase";
import type { PlantInstance, PresenceUser } from "@/engine/types";

export function subscribeToGarden(
  onPlantAdded: (plant: PlantInstance) => void
) {
  return supabase
    .channel("garden")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "plants",
      },
      (payload) => {
        onPlantAdded(payload.new as unknown as PlantInstance);
      }
    )
    .subscribe();
}

export function subscribeToPresence(
  onSync: (users: PresenceUser[]) => void
) {
  const channel = supabase.channel("garden-presence");

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<PresenceUser>();
      const users = Object.values(state).flat();
      onSync(users);
    })
    .subscribe();

  return channel;
}
