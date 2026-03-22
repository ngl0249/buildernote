import GuidePage from "../GuidePage"

const Notifications = () => (
  <GuidePage
    category="Team collaboration"
    categoryColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
    title="Notifications"
    readTime="3 min"
    description="Buildernote notifies you when teammates make changes to shared boards while you're away, and when you receive a board invitation. Here's how the notification system works."
    prevGuide={{ title: "Real-time presence", slug: "realtime-presence" }}
    nextGuide={{ title: "Team boards", slug: "team-boards" }}
    steps={[
      {
        title: "The notification bell",
        content: (
          <>
            <p>The bell icon in the top-right of your dashboard shows a red badge with the number of unread notifications. Click it to open the notification panel.</p>
            <p>The panel groups notifications into <span className="text-white font-medium">Invitations</span> and <span className="text-white font-medium">Activity</span> sections.</p>
          </>
        ),
      },
      {
        title: "Board invitations",
        content: (
          <>
            <p>When someone invites you to a board, you receive an invitation notification. It shows who invited you, which board and what role (Editor or Viewer).</p>
            <p>Click <span className="text-white font-medium">Accept</span> to join the board — you'll be taken directly to it. Click <span className="text-white font-medium">Decline</span> to dismiss the invitation.</p>
          </>
        ),
      },
      {
        title: "Activity notifications",
        content: (
          <>
            <p>When a teammate adds or deletes a card on a shared board while you're offline or on a different page, you receive an activity notification.</p>
            <p>The notification shows the board name, who made the change and what they did — for example "john added a note".</p>
          </>
        ),
      },
      {
        title: "When notifications are NOT sent",
        content: (
          <>
            <p>If you are currently on the board when someone makes a change, <span className="text-white font-medium">no notification is sent</span>. You can already see the change happening in real time through the presence system.</p>
            <p>Notifications are only sent to people who are away from the board.</p>
          </>
        ),
      },
      {
        title: "Marking notifications as read",
        content: (
          <>
            <p>Click any notification to mark it as read. The orange dot disappears. Click <span className="text-white font-medium">Mark all read</span> at the top of the panel to clear all at once.</p>
            <p>Click the <span className="text-white font-medium">✕</span> on a notification to dismiss it permanently. Dismissed notifications are removed from your list.</p>
          </>
        ),
      },
    ]}
  />
)

export default Notifications
