import GuidePage from "../GuidePage"

const CreateFirstBoard = () => (
  <GuidePage
    category="Getting started"
    categoryColor="bg-orange-500/10 text-orange-400 border-orange-500/20"
    title="Create your first board"
    readTime="5 min"
    description="Boards are the heart of Buildernote. Each board is a free canvas where you can place notes, tasks, links and more. This guide walks you through creating your first one."
    prevGuide={undefined}
    nextGuide={{ title: "Invite your team", slug: "invite-team" }}
    steps={[
      {
        title: "Go to your home dashboard",
        content: (
          <>
            <p>After logging in, you land on your home page at <span className="text-orange-400 font-mono text-xs">/@username/home</span>. This is where all your boards live.</p>
            <p>You'll see a grid of your existing boards, and a <span className="text-white font-medium">+ New board</span> card at the end.</p>
          </>
        ),
      },
      {
        title: "Click \"New board\"",
        content: (
          <>
            <p>Click the dashed <span className="text-white font-medium">+ New board</span> card. A modal will appear asking you to give your board a name, choose an icon and pick a color.</p>
            <p>The name can be anything — a project name, a topic, or just "scratch pad". You can rename it later.</p>
          </>
        ),
      },
      {
        title: "Pick an icon and color",
        content: (
          <>
            <p>Choose an icon that represents your board from the icon picker. Then pick an accent color — this color is used throughout the board UI to keep things visually distinct.</p>
            <p>These are purely cosmetic and can be changed at any time by hovering the board card and clicking the three-dot menu.</p>
          </>
        ),
      },
      {
        title: "Open your board",
        content: (
          <>
            <p>Click your new board card to open it. You'll land on an empty canvas with a dot-grid background. The toolbar on the left lets you add different types of cards.</p>
            <p>Try clicking <span className="text-white font-medium">Note</span> in the left sidebar to add your first card.</p>
          </>
        ),
      },
      {
        title: "Add your first card",
        content: (
          <>
            <p>Cards appear at the top-left of the canvas and can be dragged anywhere. Click inside a note card to start typing.</p>
            <p>You can add as many cards as you like — there is no limit. Cards can overlap, be stacked or arranged in any layout that works for you.</p>
          </>
        ),
      },
    ]}
  />
)

export default CreateFirstBoard
