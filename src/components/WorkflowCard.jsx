import { useNavigate } from "react-router-dom";
import { Play, Clock, Trash2 } from "lucide-react";

export default function WorkflowCard({ workflow, onDelete }) {
  const navigate = useNavigate();
  const nodeCount = workflow.nodes?.length || 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <Play size={18} className="text-emerald-600 ml-0.5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{workflow.name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <Clock size={14} />
              <span className="text-emerald-600">{workflow.schedule}</span>
              <span>→</span>
              <span>{nodeCount} nodes</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Last run:{" "}
              <span className="text-emerald-600">{workflow.lastRun.status}</span>
              {workflow.lastRun.time && ` ${workflow.lastRun.time}`}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded">
            Run
          </button>
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

      <div className="text-xs text-gray-400 mt-3 text-right">
        Next run at: {workflow.nextRun}
      </div>
    </div>
  );
}
