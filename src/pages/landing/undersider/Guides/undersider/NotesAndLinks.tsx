import GuidePage from "../GuidePage"

const NotesAndLinks = () => (
  <GuidePage
    category="Boards & cards"
    categoryColor="bg-blue-500/10 text-blue-400 border-blue-500/20"
    title="Using notes and links"
    readTime="4 min"
    description="Notes and link cards are the two most common card types. Notes are for free-form text and links are for saving URLs with a label. Here's how to use both."
    prevGuide={{ title: "Understanding roles", slug: "understanding-roles" }}
    nextGuide={{ title: "Drag & drop on canvas", slug: "drag-drop" }}
    steps={[
      {
        title: "Adding a note card",
        content: (
          <>
            <p>Click <span className="text-white font-medium">Note</span> in the left sidebar of any board. A note card appears on the canvas with a text area ready to type in.</p>
            <p>Notes support plain text. They're perfect for ideas, reminders, meeting notes or anything you'd write on a sticky note.</p>
          </>
        ),
      },
      {
        title: "Typing in a note",
        content: (
          <>
            <p>Click inside the note card to focus it. Start typing — the card auto-saves as you type. Click anywhere outside the card to deselect it.</p>
            <p>The card border turns orange while you're focused on it, making it easy to see what you're editing. Other teammates on the same board see your cursor and a colored outline around the card.</p>
          </>
        ),
      },
      {
        title: "Adding a link card",
        content: (
          <>
            <p>Click <span className="text-white font-medium">Link</span> in the left sidebar. A link card appears with fields for a URL and a label.</p>
            <p>Paste your URL in the URL field and give it a readable label — for example <span className="text-white font-mono text-xs">Design docs</span> instead of a long URL.</p>
          </>
        ),
      },
      {
        title: "Opening a link",
        content: (
          <p>Click the link card to open the URL in a new tab. The card stores both the URL and the label so your board stays readable without long URLs cluttering the canvas.</p>
        ),
      },
      {
        title: "Deleting a card",
        content: (
          <>
            <p>Hover any card and click the small <span className="text-white font-medium">✕</span> button that appears in the top-right corner. The card is moved to Trash.</p>
            <p>You can restore cards from Trash by clicking the Trash icon at the bottom of the left sidebar.</p>
          </>
        ),
      },
    ]}
  />
)

export default NotesAndLinks
