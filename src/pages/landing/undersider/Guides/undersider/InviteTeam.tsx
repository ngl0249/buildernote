import GuidePage from "../GuidePage"

const InviteTeam = () => (
  <GuidePage
    category="Getting started"
    categoryColor="bg-orange-500/10 text-orange-400 border-orange-500/20"
    title="Invite your team"
    readTime="3 min"
    description="Buildernote lets you share individual boards with teammates. They can view or edit the board in real time, and you can see each other's cursors while working."
    prevGuide={{ title: "Create your first board", slug: "create-first-board" }}
    nextGuide={{ title: "Understanding roles", slug: "understanding-roles" }}
    steps={[
      {
        title: "Open a board",
        content: (
          <p>Navigate to the board you want to share. Invitations are per-board — you invite people to specific boards, not to your whole account.</p>
        ),
      },
      {
        title: "Click the Team button",
        content: (
          <>
            <p>In the top-right of the board header, click the <span className="text-white font-medium">Team</span> button. A panel slides out from the right.</p>
            <p>You'll see any existing members listed, and a field to invite someone new.</p>
          </>
        ),
      },
      {
        title: "Enter their username",
        content: (
          <>
            <p>Type the <span className="text-white font-medium">@username</span> of the person you want to invite. They must already have a Buildernote account.</p>
            <p>Choose whether to invite them as an <span className="text-white font-medium">Editor</span> (can add and edit cards) or <span className="text-white font-medium">Viewer</span> (read-only).</p>
          </>
        ),
      },
      {
        title: "They receive a notification",
        content: (
          <>
            <p>The invited person receives a notification in their bell icon. They can <span className="text-white font-medium">Accept</span> or <span className="text-white font-medium">Decline</span> the invitation.</p>
            <p>Once accepted, the board appears in their sidebar under <span className="text-white font-medium">Team boards</span>.</p>
          </>
        ),
      },
      {
        title: "Collaborate in real time",
        content: (
          <>
            <p>When both of you are on the board at the same time, you'll see each other's colored cursors with your name label. If someone selects a card, a colored outline appears around it with their name.</p>
            <p>If a teammate makes a change while you're away, you'll receive a notification in your bell icon when you return.</p>
          </>
        ),
      },
    ]}
  />
)

export default InviteTeam
