import GuidePage from "../GuidePage"

const CardTypes = () => (
  <GuidePage
    category="Boards & cards"
    categoryColor="bg-blue-500/10 text-blue-400 border-blue-500/20"
    title="All card types explained"
    readTime="6 min"
    description="Buildernote has 9 different card types, each suited for different kinds of content. Here's what each one does and when to use it."
    prevGuide={{ title: "Drag & drop on canvas", slug: "drag-drop" }}
    nextGuide={{ title: "Using the to-do list", slug: "todo-list" }}
    steps={[
      {
        title: "Note — free text",
        content: (
          <>
            <p>The most basic card. Use it for any text content — ideas, meeting notes, reminders, descriptions. Supports multi-line plain text.</p>
            <p>Best for: brainstorming, quick capture, sticky-note style content.</p>
          </>
        ),
      },
      {
        title: "Heading — section titles",
        content: (
          <>
            <p>A large-text heading card. Use headings to label sections of your canvas and create visual hierarchy between groups of cards.</p>
            <p>Best for: organizing a large board into named sections.</p>
          </>
        ),
      },
      {
        title: "To-do — task checklist",
        content: (
          <>
            <p>A checklist card with tasks you can check off. Each item can be ticked complete and new items can be added at any time.</p>
            <p>Best for: action items, shopping lists, project checklists on a specific board. For a standalone task manager, use the <span className="text-white font-medium">To-do</span> tab in the sidebar instead.</p>
          </>
        ),
      },
      {
        title: "Link — saved URL",
        content: (
          <>
            <p>Save a URL with a readable label. Click the card to open the link in a new tab.</p>
            <p>Best for: reference links, documentation URLs, design files, GitHub repos.</p>
          </>
        ),
      },
      {
        title: "Color — visual accent",
        content: (
          <>
            <p>A solid-color block you can use as a visual divider, background, or highlight area behind other cards.</p>
            <p>Best for: color-coding areas of the canvas, creating visual sections, adding emphasis.</p>
          </>
        ),
      },
      {
        title: "Document — long-form writing",
        content: (
          <>
            <p>A larger card for longer text content. Use it when a note card feels too small — documents scroll internally to show more content.</p>
            <p>Best for: specs, briefs, meeting minutes, detailed descriptions.</p>
          </>
        ),
      },
      {
        title: "Column — grouped list",
        content: (
          <>
            <p>A vertical column card for organizing items in a list. Great for kanban-style boards where you want to group cards by status.</p>
            <p>Best for: kanban columns (To Do / In Progress / Done), categorized lists.</p>
          </>
        ),
      },
      {
        title: "Comment — threaded note",
        content: (
          <>
            <p>A comment card styled differently from a note — visually distinct to indicate it's a remark or annotation rather than primary content.</p>
            <p>Best for: feedback on a design, annotations on a plan, team remarks on a board.</p>
          </>
        ),
      },
      {
        title: "Table — structured data",
        content: (
          <>
            <p>A basic table for structured information. Add rows and columns to organize data in a grid format.</p>
            <p>Best for: comparisons, schedules, structured reference data.</p>
          </>
        ),
      },
    ]}
  />
)

export default CardTypes
