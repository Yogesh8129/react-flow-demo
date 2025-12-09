import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import WorkflowEditor from "./pages/WorkflowEditor";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/workflow/new" element={<WorkflowEditor />} />
      <Route path="/workflow/:id" element={<WorkflowEditor />} />
    </Routes>
  );
}
