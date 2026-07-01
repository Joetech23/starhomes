import AgentManager from "@/components/admin/AgentManager";

export const dynamic = "force-dynamic";

export default function AdminAgents() {
  return (
    <div>
      <h1 className="m-0 mb-6 font-display text-[26px] font-extrabold text-ink-900">
        Agents
      </h1>
      <AgentManager />
    </div>
  );
}
