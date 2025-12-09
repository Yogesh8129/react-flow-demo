import { useNavigate } from "react-router-dom";
import { Play, Trash2, Power, GitBranch, Mail, MessageSquare } from "lucide-react";

export default function WorkflowCard({ workflow, onDelete }) {
  const navigate = useNavigate();

  // Count nodes by type
  const rulesCount = workflow.nodes?.filter((n) => n.type === "rule").length || 0;
  const actionsCount =
    workflow.nodes?.filter(
      (n) => n.type === "emailAction" || n.type === "smsAction"
    ).length || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              workflow.enabled ? "bg-emerald-100" : "bg-gray-100"
            }`}
          >
            <Play
              size={18}
              className={`ml-0.5 ${
                workflow.enabled ? "text-emerald-600" : "text-gray-400"
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900">{workflow.name}</h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${
                  workflow.enabled
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                <Power size={10} />
                {workflow.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            {workflow.description && (
              <p className="text-sm text-gray-500 mt-0.5">{workflow.description}</p>
            )}

            <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <GitBranch size={14} className="text-amber-500" />
                {rulesCount} {rulesCount === 1 ? "rule" : "rules"}
              </span>
              <span className="flex items-center gap-1">
                <Mail size={14} className="text-emerald-500" />
                <MessageSquare size={14} className="text-violet-500" />
                {actionsCount} {actionsCount === 1 ? "action" : "actions"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/workflow/${workflow.id}`)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
