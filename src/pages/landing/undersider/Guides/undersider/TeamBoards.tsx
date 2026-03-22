import GuidePage from "../GuidePage"

const TeamBoards = () => (
  <GuidePage
    category="Team collaboration"
    categoryColor="bg-purple-500/10 text-purple-400 border-purple-500/20"
    title="Team boards"
    readTime="5 min"
    description="Team boards are shared boards that appear in your sidebar under Team boards. They belong to another user but you've been invited to collaborate on them."
    prevGuide={{ title: "Notifications", slug: "notifications" }}
    nextGuide={undefined}
    steps={[
      {
        title: "What is a team board?",
        content: (
          <>
            <p>A team board is a board owned by someone else that you've been given access to. It appears in your sidebar under <span className="text-white font-medium">Team boards</span> with the owner's username shown below the board name.</p>
            <p>You can have multiple team boards from different people.</p>
          </>
        ),
      },
      {
        title: "Accessing a team board",
        content: (
          <>
            <p>Click the board name in the <span className="text-white font-medium">Team boards</span> section of the sidebar. The board opens in a new view with the owner's username in the URL.</p>
            <p>An external link icon next to the board name indicates it belongs to someone else.</p>
          </>
        ),
      },
      {
        title: "Editor vs Viewer role",
        content: (
          <>
            <p>Your access level is shown as a badge next to the board name in the sidebar.</p>
            <p><span className="text-sky-400 font-medium">Editor</span> — you can add, edit and delete cards on the board. <span className="text-gray-400 font-medium">Viewer</span> — you can see the board and all its cards but cannot make changes.</p>
          </>
        ),
      },
      {
        title: "Seeing the team panel",
        content: (
          <>
            <p>Open the board and click the <span className="text-white font-medium">Team</span> button in the top-right header. You'll see all members of the board and their roles.</p>
            <p>Only the board owner can invite new members or remove existing ones.</p>
          </>
        ),
      },
      {
        title: "Real-time collaboration",
        content: (
          <>
            <p>When multiple editors are on the board simultaneously, you'll see each other's cursors and card selections in real time — just like on your own boards.</p>
            <p>If you're an Editor and you add or delete a card, the owner and other offline members receive a notification about your change.</p>
          </>
        ),
      },
    ]}
  />
)

export default TeamBoards
