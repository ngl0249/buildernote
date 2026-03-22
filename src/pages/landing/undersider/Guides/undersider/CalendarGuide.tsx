import GuidePage from "../GuidePage"

const CalendarGuide = () => (
  <GuidePage
    category="Tasks & calendar"
    categoryColor="bg-green-500/10 text-green-400 border-green-500/20"
    title="Using the calendar"
    readTime="4 min"
    description="The Calendar tab gives you a monthly view where you can add personal events, set times and color-code them. It's built into your dashboard and always available."
    prevGuide={{ title: "Using the to-do list", slug: "todo-list" }}
    nextGuide={{ title: "Real-time presence", slug: "realtime-presence" }}
    steps={[
      {
        title: "Open the Calendar tab",
        content: (
          <>
            <p>Click <span className="text-white font-medium">Calendar</span> in the left sidebar under Tools. The monthly calendar opens in the main content area.</p>
            <p>You start on the current month. Today's date has an orange circle highlight.</p>
          </>
        ),
      },
      {
        title: "Navigate between months",
        content: (
          <>
            <p>Use the <span className="text-white font-medium">‹</span> and <span className="text-white font-medium">›</span> arrows in the top-right to go back and forward by month. Click <span className="text-white font-medium">Today</span> to jump back to the current month.</p>
            <p>The calendar shows all 12 months of the year and you can navigate freely in both directions.</p>
          </>
        ),
      },
      {
        title: "Adding an event",
        content: (
          <>
            <p>Click any day on the calendar. A panel slides out on the right showing that day's events and an <span className="text-white font-medium">Add event</span> form.</p>
            <p>Type the event name, set a time and choose a color. Press <span className="text-white font-medium">Enter</span> or click <span className="text-white font-medium">Add event</span> to save.</p>
          </>
        ),
      },
      {
        title: "Event colors",
        content: (
          <>
            <p>Each event can be one of four colors: <span className="text-orange-400 font-medium">Orange</span>, <span className="text-blue-400 font-medium">Blue</span>, <span className="text-emerald-400 font-medium">Green</span> or <span className="text-violet-400 font-medium">Purple</span>.</p>
            <p>Use colors to categorize events — for example orange for deadlines, blue for meetings, green for personal events.</p>
          </>
        ),
      },
      {
        title: "Deleting an event",
        content: (
          <>
            <p>Click the day that has the event. In the right panel, hover the event and click the <span className="text-white font-medium">✕</span> button to delete it.</p>
            <p>Events are stored locally in your browser, so they persist between sessions on the same device.</p>
          </>
        ),
      },
    ]}
  />
)

export default CalendarGuide
