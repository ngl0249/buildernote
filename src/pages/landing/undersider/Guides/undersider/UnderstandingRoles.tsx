import GuidePage from "../GuidePage"

const UnderstandingRoles = () => (
  <GuidePage
    category="Getting started"
    categoryColor="bg-orange-500/10 text-orange-400 border-orange-500/20"
    title="Understanding roles"
    readTime="4 min"
    description="Buildernote has five account roles. Your role is assigned by the platform and controls what you can access. Here's what each one means."
    prevGuide={{ title: "Invite your team", slug: "invite-team" }}
    nextGuide={{ title: "Using notes and links", slug: "notes-and-links" }}
    steps={[
      {
        title: "Default — the free plan",
        content: (
          <>
            <p>All new accounts start as <span className="text-white font-medium">Default</span>. You can create up to <span className="text-white font-medium">100 boards</span>, use all card types, invite teammates to your boards and access the to-do list and calendar.</p>
            <p>A progress bar in your profile menu shows how many of your 100 boards you've used.</p>
          </>
        ),
      },
      {
        title: "BuilderPro — unlimited boards",
        content: (
          <>
            <p><span className="text-emerald-400 font-medium">BuilderPro</span> is the paid plan. It removes the 100-board limit and gives you access to all Pro features.</p>
            <p>Your profile menu shows a board counter with no upper limit, and a green progress bar that grows as you create more boards.</p>
          </>
        ),
      },
      {
        title: "Moderator — platform trust",
        content: (
          <>
            <p><span className="text-violet-400 font-medium">Moderators</span> are trusted community members. This role is assigned by the platform — you cannot apply for it.</p>
            <p>Moderators have access to moderation tools in the sidebar and their profile shows a purple Moderator badge.</p>
          </>
        ),
      },
      {
        title: "Developer — API and dev tools",
        content: (
          <>
            <p><span className="text-sky-400 font-medium">Developers</span> have access to developer tools and the Buildernote API. This role is assigned to people building on or integrating with Buildernote.</p>
            <p>Developers see a Developer tab in their sidebar with relevant tools and API access information.</p>
          </>
        ),
      },
      {
        title: "Owner — full control",
        content: (
          <>
            <p><span className="text-orange-400 font-medium">Owner</span> is the top-level role held by the Buildernote team. Owners have full access to everything — member management, platform settings and all features.</p>
            <p>Owners see an Admin section in their sidebar for managing users and platform-wide settings.</p>
          </>
        ),
      },
    ]}
  />
)

export default UnderstandingRoles
