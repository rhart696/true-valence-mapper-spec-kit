# Quickstart: Data Persistence Testing

**Feature**: 003-data-persistence
**Purpose**: Manual test scenarios for validating persistence functionality

## Prerequisites

- Development server running: `cd app/client && npm run dev`
- Browser with DevTools access (to inspect localStorage)
- Clear localStorage before testing: DevTools > Application > Storage > Local Storage > Clear

## Test Scenarios

### Scenario 1: Automatic Save on Add Node

**Steps:**
1. Open http://localhost:5173/canvas-test
2. Open DevTools > Application > Local Storage
3. Look for key `true-valence-canvas-state` (should be empty initially)
4. Add a new person "Alice" using the input field
5. Check localStorage within 1 second

**Expected:**
- localStorage contains JSON with "Alice" node
- `version` is "1.0.0"
- `savedAt` timestamp is recent

---

### Scenario 2: Automatic Save on Drag

**Steps:**
1. With Alice on canvas, drag her node to a new position
2. Wait 500ms (debounce delay)
3. Check localStorage

**Expected:**
- Alice's position updated in stored data
- `savedAt` timestamp updated

---

### Scenario 3: Save Trust Score

**Steps:**
1. Click on Alice's node to select it
2. Click the trust score button (if available) or trigger trust modal
3. Set outward trust to "High", inward to "Medium"
4. Save the trust score
5. Check localStorage

**Expected:**
- Alice's `trustScore` object present: `{ "outward": "high", "inward": "medium" }`
- Trust arrows should display

---

### Scenario 4: Save View Transform

**Steps:**
1. Use + key or zoom control to zoom in to 120%
2. Use arrow keys to pan right
3. Wait 500ms
4. Check localStorage

**Expected:**
- `viewTransform.zoom` is approximately 1.2
- `viewTransform.panX` reflects pan offset

---

### Scenario 5: Restore on Refresh (Core Test)

**Steps:**
1. Ensure you have a map with:
   - 3+ people besides "You"
   - At least one trust score set
   - Non-default zoom level
2. Hard refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
3. Observe canvas immediately after load

**Expected:**
- All nodes restored in exact positions
- Trust scores and arrows restored
- Zoom level and pan position restored
- No flash of default state

---

### Scenario 6: Restore After Browser Close

**Steps:**
1. Create a recognizable map (unique names, positions)
2. Close the browser tab completely
3. Open a new tab and navigate to http://localhost:5173/canvas-test

**Expected:**
- Map fully restored as before

---

### Scenario 7: Fresh Browser (No Data)

**Steps:**
1. Clear localStorage: DevTools > Application > Clear site data
2. Refresh the page

**Expected:**
- Only "You" node at center
- Default zoom (1.0)
- Default pan (0, 0)

---

### Scenario 8: Corrupted Data Recovery

**Steps:**
1. Open DevTools Console
2. Manually corrupt localStorage:
   ```javascript
   localStorage.setItem('true-valence-canvas-state', 'not valid json{');
   ```
3. Refresh the page

**Expected:**
- App loads without crashing
- Default state displayed (just "You" node)
- Console shows warning about corrupted data

---

### Scenario 9: Reset Map (P2 Feature)

**Steps:**
1. Create a map with 5+ people
2. Click "Reset Map" button
3. Confirm in the dialog

**Expected:**
- Confirmation dialog appears first
- After confirm: only "You" node remains
- localStorage updated to reflect reset state
- Refresh shows reset state persists

---

### Scenario 10: Reset Map Cancel

**Steps:**
1. Create a map with people
2. Click "Reset Map" button
3. Click "Cancel" or press Escape

**Expected:**
- Map unchanged
- All nodes still present

---

## Debugging Tips

### View Current Storage

```javascript
// In browser console
JSON.parse(localStorage.getItem('true-valence-canvas-state'))
```

### Clear Storage

```javascript
// In browser console
localStorage.removeItem('true-valence-canvas-state')
```

### Watch for Saves

```javascript
// In browser console - watch for storage changes
window.addEventListener('storage', (e) => console.log('Storage changed:', e));
```

### Check Debounce

Rapidly drag a node and watch console - should see save logs only every 500ms, not on every mouse move.

## Pass Criteria

| Scenario | Status |
|----------|--------|
| 1. Auto-save on add | [ ] |
| 2. Auto-save on drag | [ ] |
| 3. Save trust score | [ ] |
| 4. Save view transform | [ ] |
| 5. Restore on refresh | [ ] |
| 6. Restore after close | [ ] |
| 7. Fresh browser | [ ] |
| 8. Corrupted data | [ ] |
| 9. Reset map confirm | [ ] |
| 10. Reset map cancel | [ ] |

All 10 scenarios must pass for feature completion.
