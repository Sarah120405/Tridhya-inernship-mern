import { useState } from "react";
import ProjectList from "./Pages/projectList";
import TaskList from "./Pages/taskList";

function App() {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  return (
    <div>
      {selectedProjectId === null ? (
        <ProjectList onSelectProject={setSelectedProjectId} />
      ) : (
        <TaskList
          projectId={selectedProjectId}
          onBack={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
}

export default App;
