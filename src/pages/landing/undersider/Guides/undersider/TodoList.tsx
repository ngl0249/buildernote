import GuidePage from "../GuidePage"

const TodoList = () => (
  <GuidePage
    category="Tasks & calendar"
    categoryColor="bg-green-500/10 text-green-400 border-green-500/20"
    title="Using the to-do list"
    readTime="5 min"
    description="The To-do tab in Buildernote is a standalone task manager separate from your boards. Use it to track personal tasks across all your projects."
    prevGuide={{ title: "All card types explained", slug: "card-types" }}
    nextGuide={{ title: "Using the calendar", slug: "calendar" }}
    steps={[
      {
        title: "Open the To-do tab",
        content: (
          <>
            <p>Click <span className="text-white font-medium">To-do</span> in the left sidebar of your dashboard. This opens the task manager in the main content area.</p>
            <p>The to-do list is personal to your account — teammates cannot see your tasks unless you put them on a shared board as a to-do card.</p>
          </>
        ),
      },
      {
        title: "Adding a task",
        content: (
          <>
            <p>Click the input field at the top and type your task. Press <span className="text-white font-medium">Enter</span> or click the add button to save it.</p>
            <p>Tasks appear in a list below the input. New tasks are added to the bottom of the list.</p>
          </>
        ),
      },
      {
        title: "Completing a task",
        content: (
          <>
            <p>Click the circle checkbox to the left of a task to mark it complete. The task text gets a strikethrough and moves to the completed section.</p>
            <p>You can uncheck a task at any time to move it back to active.</p>
          </>
        ),
      },
      {
        title: "Deleting tasks",
        content: (
          <p>Hover a task and click the delete icon that appears on the right. Completed tasks can also be cleared in bulk using the <span className="text-white font-medium">Clear completed</span> option.</p>
        ),
      },
      {
        title: "To-do cards on boards",
        content: (
          <>
            <p>In addition to the sidebar to-do list, you can add <span className="text-white font-medium">To-do cards</span> directly on any board canvas. These are separate from your personal to-do list.</p>
            <p>Board to-do cards are useful for project-specific checklists that you want visible alongside other cards on the board.</p>
          </>
        ),
      },
    ]}
  />
)

export default TodoList
