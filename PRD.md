# True Valence Relationship Mapper
## Product Requirements Document

---

## Executive Summary

True Valence Relationship Mapper is a visual tool that helps people understand and improve their personal relationships by mapping trust dynamics. Users place themselves at the center of an interactive canvas and position the people in their lives around them, then score each relationship on trust dimensions to reveal patterns and insights.

---

## Problem Statement

### The Challenge

People struggle to understand the quality of their relationships. We often have vague feelings about who we trust and why, but lack a structured way to:

1. **Visualize our social network** - We carry mental models of our relationships but can't easily see the full picture
2. **Articulate trust** - "I trust them" is too simplistic; trust has multiple dimensions (reliability, emotional safety, competence)
3. **Identify patterns** - Without externalization, we miss patterns like over-reliance on one person or neglected relationships
4. **Track changes** - Relationships evolve, but we lack tools to notice gradual shifts

### User Pain Points

- **Overwhelm**: "I have so many relationships, I don't know where to focus my energy"
- **Confusion**: "I feel uneasy about this person but can't explain why"
- **Blind spots**: "I didn't realize I was depending so heavily on just two people"
- **Drift**: "We used to be close, but I can't pinpoint when things changed"

---

## Target Users

### Primary Persona: The Reflective Individual

**Who they are:**
- Adults interested in personal growth and self-awareness
- People going through life transitions (new job, move, relationship changes)
- Those in therapy or coaching who want structured reflection tools
- Anyone who values intentional relationship building

**What they need:**
- A private, personal space for reflection (not social media)
- Simple tools that don't require extensive training
- Visual representation of abstract concepts
- Ability to return and refine their thinking over time

### Secondary Persona: The Coach/Therapist

**Who they are:**
- Mental health professionals
- Life coaches
- Relationship counselors

**What they need:**
- A tool to recommend to clients for homework/reflection
- Visual output that can inform session discussions
- Non-clinical, approachable interface

---

## Core Value Proposition

**"See your relationships clearly, understand them deeply, improve them intentionally."**

True Valence transforms the abstract feeling of "how are my relationships?" into a concrete, visual, actionable map.

---

## Features

### Feature 1: Relationship Canvas

**User Story:**
> As a user, I want to create a visual map of my relationships so that I can see my entire social network at a glance.

**Description:**
An interactive canvas where the user places themselves at the center. Around them, they add the people in their lives, positioning them to reflect perceived closeness or importance.

**User Experience:**
1. User opens the app and sees themselves represented at the center
2. User adds people by typing names
3. New people appear around the center, evenly distributed
4. User can drag people to reposition them freely
5. The visual distance from center can represent emotional closeness, trust level, or any meaning the user assigns

**Success Criteria:**
- User can add unlimited people to their map
- Positioning is intuitive (drag and drop)
- The canvas accommodates growth (zooming out as network expands)
- Users report the visual helps them "see" their network in a new way

---

### Feature 2: Trust Scoring

**User Story:**
> As a user, I want to score each relationship on trust dimensions so that I can understand specifically where trust is strong or weak.

**Description:**
Each person on the map can be scored across multiple trust dimensions. Rather than a single "trust score," users rate specific aspects like reliability, emotional safety, and competence.

**Trust Dimensions:**
1. **Reliability** - "Do they follow through on commitments?"
2. **Emotional Safety** - "Can I be vulnerable with them?"
3. **Competence** - "Do I trust their judgment and abilities?"
4. **Integrity** - "Do their actions match their words?"
5. **Benevolence** - "Do they have my best interests at heart?"

**User Experience:**
1. User clicks on a person to open their trust profile
2. User sees sliders or rating inputs for each dimension
3. User adjusts scores based on their honest assessment
4. Visual feedback shows the overall trust picture for that person
5. Changes are saved automatically

**Success Criteria:**
- Scoring feels reflective, not judgmental
- Users gain new insights ("I trust their competence but not their reliability")
- The multi-dimensional view reveals nuance lost in binary thinking

---

### Feature 3: Visual Trust Indicators

**User Story:**
> As a user, I want to see trust levels visually on the map so that patterns emerge at a glance.

**Description:**
Trust scores translate into visual cues on the canvas, allowing users to see their entire network's trust landscape without clicking into each person.

**Visual Elements:**
- Connection lines from self to each person
- Line color/thickness reflects overall trust level
- Arrows indicate trust direction (you → them, them → you, or mutual)
- Nodes may show color coding or badges for quick reference

**User Experience:**
1. After scoring people, the map updates visually
2. User can see at a glance who has strong/weak trust connections
3. Patterns emerge: clusters of high trust, isolated low-trust individuals
4. User can toggle visual indicators on/off for cleaner view

**Success Criteria:**
- Visual patterns are immediately apparent
- Users can identify their "inner circle" vs "outer circle" visually
- The map reveals surprising patterns users hadn't consciously noticed

---

### Feature 4: Persistence & Continuity

**User Story:**
> As a user, I want my map to be saved automatically so that I can return to it over days, weeks, or months.

**Description:**
The relationship map persists between sessions. Users never lose their work and can build their map incrementally over time.

**User Experience:**
1. User adds people and scores in one session
2. User closes the app or browser
3. User returns later and sees exactly where they left off
4. Changes are saved continuously (no "save" button needed)

**Success Criteria:**
- Zero data loss between sessions
- Users trust that their work is preserved
- Returning to the app feels like opening a journal, not starting over

---

### Feature 5: Fresh Start

**User Story:**
> As a user, I want to be able to start over with a clean map so that I can begin fresh if my situation changes significantly.

**Description:**
A clear, intentional way to reset the entire map. Protected by confirmation to prevent accidental loss.

**User Experience:**
1. User decides they want to start completely fresh
2. User clicks "Reset Map"
3. System asks for confirmation ("Are you sure? This cannot be undone.")
4. Upon confirmation, map returns to initial state (just self, no scored relationships)

**Success Criteria:**
- Reset is easy to find but hard to trigger accidentally
- Users feel empowered, not trapped by past entries
- Fresh starts enable the tool to remain relevant through life changes

---

### Feature 6: Intuitive Navigation

**User Story:**
> As a user, I want to navigate my map easily so that I can focus on reflection rather than fighting with the interface.

**Description:**
The canvas supports natural navigation patterns for viewing a potentially large and detailed relationship network.

**Navigation Capabilities:**
- **Zoom**: Get the big picture or focus on details
- **Pan**: Move around a large map
- **Center**: Quickly return to self at the center
- **Keyboard shortcuts**: Power users can navigate efficiently

**User Experience:**
1. User with many people zooms out to see everyone
2. User zooms in to focus on a particular cluster
3. User pans to reach people positioned far from center
4. User presses a key to snap back to center
5. All navigation feels smooth and responsive

**Success Criteria:**
- Navigation never frustrates or distracts from reflection
- Users with 20+ people can comfortably explore their map
- Both mouse/touch and keyboard users feel supported

---

## User Journeys

### Journey 1: First-Time Exploration

**Scenario:** Sarah just downloaded the app after a friend recommended it.

1. Sarah opens the app and sees herself at the center of an empty canvas
2. She adds her partner, best friend, and mom
3. She drags them closer to her center (they're her core people)
4. She adds coworkers, positioning them further out
5. She steps back and thinks, "Huh, I have way more work relationships than personal ones"
6. She closes the app, planning to add more people later

**Outcome:** Sarah gained an immediate visual insight about her network composition.

---

### Journey 2: Deep Reflection Session

**Scenario:** Michael is in therapy and his therapist suggested mapping his relationships.

1. Michael opens his existing map (saved from last week)
2. He clicks on his brother to score their relationship
3. He rates reliability high (his brother always shows up)
4. He rates emotional safety low (they never talk about feelings)
5. He sees the trust visualization update
6. He notices his brother and his boss have similar profiles
7. He saves a mental note to discuss this pattern with his therapist

**Outcome:** Michael uncovered a pattern he can explore in therapy.

---

### Journey 3: Life Transition Reset

**Scenario:** Priya just moved to a new city for work.

1. Priya opens her map from six months ago
2. Many people are no longer relevant (former coworkers, neighbors)
3. She decides to start fresh
4. She clicks Reset Map and confirms
5. She begins adding people from her new context
6. Her new map reflects her current reality

**Outcome:** Priya's tool evolved with her life circumstances.

---

## Success Metrics

### Engagement Metrics
- **Return rate**: % of users who return after first session
- **Session depth**: Average number of people added per session
- **Completion rate**: % of added people who receive trust scores

### Outcome Metrics
- **Insight generation**: Users report gaining new understanding (survey)
- **Action inspiration**: Users report making relationship decisions based on map
- **Recommendation rate**: Users recommend the tool to others

### Quality Metrics
- **Frustration rate**: % of sessions with rage-clicks or rapid abandonment
- **Data integrity**: Zero reported data loss incidents
- **Accessibility**: Tool is usable across devices and ability levels

---

## Out of Scope (For Initial Release)

The following are explicitly NOT part of the initial product:

1. **Social features** - No sharing, collaboration, or comparing maps with others
2. **AI insights** - No automated analysis or suggestions (user interprets their own map)
3. **Sync across devices** - Single-device persistence only initially
4. **Historical tracking** - No timeline view of how scores changed over time
5. **Export/reporting** - No PDF generation or data export
6. **Relationship categorization** - No predefined categories (family, work, friends)

These may be considered for future versions based on user feedback.

---

## Design Principles

1. **Reflection over judgment** - The tool facilitates self-understanding, not scoring people as "good" or "bad"

2. **Privacy first** - This is deeply personal data; user controls it completely

3. **Simplicity over features** - Every interaction should feel lightweight; reflection shouldn't feel like work

4. **Visual clarity** - The map should reveal, not obscure; design serves insight

5. **Graceful growth** - Works for 5 people or 50; early simplicity doesn't create later pain

---

## Appendix: Trust Dimension Definitions

| Dimension | Definition | Example Questions |
|-----------|------------|-------------------|
| Reliability | Consistency in following through on commitments | "When they say they'll do something, do they do it?" |
| Emotional Safety | Feeling secure being vulnerable | "Can I share my fears without judgment?" |
| Competence | Confidence in their abilities and judgment | "Do I trust their advice in their area of expertise?" |
| Integrity | Alignment between words and actions | "Do they practice what they preach?" |
| Benevolence | Belief they have your best interests at heart | "Would they sacrifice for my benefit?" |

---

*Document Version: 1.0*
*Based on implemented features through December 2024*
