# Quickstart Guide: Relationship Canvas

**Feature**: 001-relationship-canvas
**Audience**: Developers setting up local environment + End users trying the feature

---

## For Developers: Local Setup

### Prerequisites

- Node.js 18+ (check: `node --version`)
- npm 9+ (check: `npm --version`)
- Git (check: `git --version`)
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

```bash
# 1. Clone the repository (if not already done)
git clone https://github.com/rhart696/true-valence-mapper-spec-kit.git
cd true-valence-mapper-spec-kit

# 2. Checkout the feature branch
git checkout 001-relationship-canvas

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev

# 5. Open in browser
# Server will print URL, typically: http://localhost:5173
```

### Expected Output

When dev server starts successfully:
```
VITE v7.2.4  ready in 423 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

Open the Local URL in your browser to see the canvas.

### Troubleshooting

**Problem**: `npm install` fails with peer dependency warnings
- **Solution**: Use `npm install --legacy-peer-deps` or upgrade to npm 10+

**Problem**: Port 5173 already in use
- **Solution**: Stop other Vite processes or use `npm run dev -- --port 3000`

**Problem**: Blank page in browser, no errors
- **Solution**: Check browser console (F12), run `npm run build` to see TypeScript errors

---

## For End Users: First-Run Experience

### Opening the Canvas

1. Navigate to the application URL (provided by your coach or IT team)
2. You'll see a canvas with one node labeled "You" in the center
3. The canvas is ready to use - no login or setup required

### Adding People to Your Map

1. **Click the "Add Person" button** (top of screen or toolbar)
2. **Enter the person's name** in the input field that appears
3. **Press Enter or click "Add"**
4. **A new node appears** on the canvas with that person's name

**Tip**: Start with your manager, direct reports, or closest collaborators.

### Positioning Nodes

1. **Click and hold** on any node (except "You")
2. **Drag** to move it to a new position
3. **Release** to drop it in place
4. **Position represents relationship**:
   - Closer to "You" = closer relationship
   - Further away = more distant relationship
   - Clustering = teams or groups

**Your "You" node stays in the center** and cannot be moved.

### Editing Node Names

1. **Click on a node** you want to rename
2. An **edit field appears** (or right-click → "Rename")
3. **Type the new name**
4. **Press Enter** to save

### Removing People

1. **Click on a node** you want to remove
2. **Click the "Remove" button** or press **Delete key**
3. Node disappears from the canvas

**Note**: You cannot remove your own "You" node.

### Navigating Large Maps (20+ people)

**Zoom In/Out**:
- **Mouse Wheel**: Scroll to zoom
- **Zoom Buttons**: Click + or - buttons in toolbar
- **Keyboard**: Ctrl/Cmd + Plus or Minus

**Pan (Move the Canvas)**:
- **Click and drag on empty space** (not on a node)
- **Arrow keys**: Move the view in that direction

**Reset View**:
- **Click "Reset View" button** to return to 100% zoom and centered view

---

## Typical Workflow: Creating Your First Map

**Scenario**: Maria, a team lead, wants to map her key workplace relationships for a coaching session.

### Step 1: Add Core Team (2 minutes)

1. Open the canvas - sees "You" in the center
2. Click "Add Person", type "Sarah (Manager)"
3. Click "Add Person", type "James (Peer)"
4. Click "Add Person", type "Alex (Direct Report)"
5. Repeat for 5-7 more key people

Result: 8-10 nodes scattered on the canvas.

### Step 2: Position Relationships (3 minutes)

1. Drag "Sarah (Manager)" above "You" - close distance (strong relationship)
2. Drag "James (Peer)" to the left - medium distance (cordial but not close)
3. Drag "Alex (Direct Report)" below "You" - very close (mentoring relationship)
4. Cluster similar relationships (e.g., all direct reports near each other)

Result: Visual representation of relationship closeness through spatial positioning.

### Step 3: Refine (1 minute)

1. Rename "Alex (Direct Report)" to just "Alex" for simplicity
2. Remove a node for someone who left the team
3. Adjust positioning to feel "right" emotionally

Result: Clean, accurate map ready for coaching discussion.

### Step 4: Discuss with Coach (30-60 minutes)

1. Share screen in video call
2. Coach asks: "Tell me about the people closest to you"
3. Maria explains each relationship while pointing to nodes
4. Coach suggests: "Let's explore the people further away - why is that?"
5. Maria adds new insights, repositions nodes in real-time

Result: Living document that evolves during the coaching conversation.

**Total time: ~5 minutes to create, ongoing refinement during session**

---

## Tips for Effective Mapping

**Start Small**: Don't try to map everyone at once. Focus on 5-10 key relationships first.

**Use Distance Meaningfully**: Closer to "You" = stronger/closer relationship. Let your intuition guide positioning.

**Cluster Similar People**: Group team members, colleagues from the same department, or people with similar dynamics.

**Don't Overthink Exact Positions**: The map is a conversation starter, not a precise measurement. Approximate positioning is fine.

**Iterate During Conversation**: As you discuss with your coach, you'll realize new insights - move nodes around freely.

**Session-Based**: This MVP doesn't save your map. Complete your session before closing the browser, or take a screenshot if you want to keep it.

---

## Known Limitations (MVP)

**No Persistence**: Refreshing the page or closing the browser will lose your map. Take screenshots if you want to keep it.

**No Export**: Can't export to PDF or image file. Use browser screenshot tools (or share screen).

**No Undo**: Can't undo changes. Be deliberate when removing nodes.

**Desktop Only**: Optimized for desktop/laptop browsers (768px+ width). Mobile experience may be limited.

**Session-Based**: Each browser tab is a separate session. Multiple tabs = multiple independent maps.

---

## What's Next?

After trying the basic canvas, future features will add:
- **Valence Scoring**: Color-code relationships by trust dimensions
- **Save/Load Maps**: Persistent storage, return to your maps later
- **Export to Image**: Download PNG/PDF of your map
- **Multiple Maps**: Create separate maps for different contexts (work, family, etc.)

For now, focus on the core experience: visualizing relationships through spatial positioning.

---

## Support

**For Developers**: Check the [plan.md](./plan.md) and [data-model.md](./data-model.md) for implementation details.

**For Users**: Contact your ProActive Coach or the support team if you encounter issues.

**Report Bugs**: Open an issue in the GitHub repository with:
- What you were trying to do
- What happened instead
- Browser and OS version
- Screenshot if helpful
