import GuidePage from "../GuidePage"

const RealtimePresence = () => (
  <GuidePage
    category="Team collaboration"
    categoryColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
    title="Real-time presence"
    readTime="3 min"
    description="When multiple people are on the same board at the same time, Buildernote shows you where everyone is. You can see their cursors and which card they're working on."
    prevGuide={{ title: "Using the calendar", slug: "calendar" }}
    nextGuide={{ title: "Notifications", slug: "notifications" }}
    steps={[
      {
        title: "How presence works",
        content: (
          <>
            <p>When you open a board, Buildernote registers your presence on that board. Every 3 seconds your position is updated in real time. When you leave the board, your presence is removed within a few seconds.</p>
            <p>Presence is board-specific — being on the dashboard doesn't mean you appear on a board.</p>
          </>
        ),
      },
      {
        title: "Seeing other cursors",
        content: (
          <>
            <p>When a teammate is on the same board, their cursor appears as a colored arrow with their display name next to it. Each person gets a unique color.</p>
            <p>The cursor updates as they move their mouse around the canvas in near real time.</p>
          </>
        ),
      },
      {
        title: "Card selection indicators",
        content: (
          <>
            <p>When a teammate clicks on a card or starts editing it, a colored outline appears around the card. Their name badge is shown above the card so you know who is working on it.</p>
            <p>This helps you avoid editing the same card at the same time as someone else.</p>
          </>
        ),
      },
      {
        title: "Online avatars in the header",
        content: (
          <>
            <p>The board header shows small avatar circles for everyone currently online on that board. Hover an avatar to see the person's name.</p>
            <p>The Team button also shows a count of how many people are in the board including you.</p>
          </>
        ),
      },
      {
        title: "Presence and notifications",
        content: (
          <p>If a teammate makes changes to a board while you are <span className="text-white font-medium">not</span> on it, you receive a notification in your bell icon. If you are currently on the board, no notification is sent — you can already see what's happening in real time.</p>
        ),
      },
    ]}
  />
)

export default RealtimePresence
