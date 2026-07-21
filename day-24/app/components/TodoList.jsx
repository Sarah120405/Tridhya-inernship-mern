import TodoItem from "./TodoItem";
import EmptyState from "./EmptyState";

export default function TodoList({
  todos,
  savingId,
  onToggle,
  onEdit,
  onDelete,
}) {
  if (todos.length === 0) return <EmptyState />;

  return (
    <ul className="flex flex-col gap-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isSaving={savingId === todo.id}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
