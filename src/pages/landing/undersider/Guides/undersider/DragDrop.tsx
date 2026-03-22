import GuidePage from "../GuidePage"

const DragDrop = () => (
  <GuidePage
    category="Boards & cards"
    categoryColor="bg-blue-500/10 text-blue-400 border-blue-500/20"
    title="Drag & drop on canvas"
    readTime="3 min"
    description="The Buildernote canvas is completely free-form. Cards can be placed anywhere and rearranged at any time. Here's how the drag system works."
    prevGuide={{ title: "Using notes and links", slug: "notes-and-links" }}
    nextGuide={{ title: "All card types explained", slug: "card-types" }}
    steps={[
      {
        title: "Dragging a card",
        content: (
          <>
            <p>Every card has a <span className="text-white font-medium">grip handle</span> (⠿ icon) at the top. Click and hold the grip or anywhere on the card's header area to start dragging.</p>
            <p>Drag the card to any position on the canvas. Release to drop it. The position is saved automatically.</p>
          </>
        ),
      },
      {
        title: "Dragging the whole card",
        content: (
          <>
            <p>You can drag from anywhere on the card — not just the grip icon. As long as you're not clicking inside a text field or interactive element, clicking and dragging the card will move it.</p>
            <p>The cursor changes to a grab cursor to indicate the card is ready to move.</p>
          </>
        ),
      },
      {
        title: "Panning the canvas",
        content: (
          <>
            <p>The canvas is <span className="text-white font-medium">4000 × 3000 pixels</span> — much larger than your screen. To pan around, hold the <span className="text-white font-medium">middle mouse button</span> and drag.</p>
            <p>The dot grid background moves with you to give you a sense of position on the canvas.</p>
          </>
        ),
      },
      {
        title: "Overlapping cards",
        content: (
          <p>Cards can freely overlap each other. There is no snapping or grid alignment — place cards wherever makes sense for your workflow. Some people create clusters of related cards, others prefer a clean grid layout.</p>
        ),
      },
      {
        title: "Cards follow you when scrolling",
        content: (
          <p>Cards stay at their absolute canvas position. If you pan to a different part of the canvas and come back, everything is exactly where you left it. The canvas remembers your layout permanently.</p>
        ),
      },
    ]}
  />
)

export default DragDrop
