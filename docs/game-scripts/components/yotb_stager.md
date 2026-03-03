---
id: yotb_stager
title: Yotb Stager
description: Manages the flow of the YOTB contest event, including registration, evaluation, suspense-building, winner declaration, and prize distribution for beefalo contests.
tags: [contest, event, ai, evaluation]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: components
source_hash: 2fe894af
system_scope: world
---

# Yotb Stager

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`YOTB_Stager` orchestrates the annual YOTB (Your Own Taste Beefs) contest event in DST. It handles the full lifecycle of a contest: verifying arena safety and conditions, spawning temporary contestants (trainers and beefalo), evaluating outfit combinations against randomized category targets, building suspense via voiceover dialogue, declaring winners, and distributing prizes. It relies on several supporting components (`combat`, `hitcher`, `markable`, `named`, `skinner_beefalo`, `talker`, `timer`, `workable`, `yotb_stagemanager`) to manage state and interactions, and consumes external data (`yotb_costumes`) for outfit scoring.

## Usage example
```lua
-- Assume stage_entity is a valid entity prefabricated for contest hosting
stage_entity:AddComponent("yotb_stager")
-- To initiate a contest (e.g., after player interaction)
stage_entity.components.yotb_stager:StartContest(player_entity)
```

## Dependencies & tags
**Components used:**  
- `combat`, `hitcher`, `markable`, `markable_proxy`, `named`, `skinner_beefalo`, `talker`, `timer`, `workable`, `yotb_stagemanager`  
**Tags added/removed:**  
- Adds: `yotb_contestenabled`, `yotb_conteststartable`, `nomagic`, `NPC_contestant` (temporarily on spawned entities)  
- Removes: `yotb_conteststartable` during active contest

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | `nil` (set in constructor) | The entity this component is attached to (the contest host/stage). |
| `tasks` | table | `{}` | List of pending delayed tasks (DoTaskInTime handles), used for cleanup on abort. |
| `choice` | string | `"far"` | Evaluation strategy for comment selection: `"random"`, `"far"`, or `"close"`. |
| `queue` | table | `{}` | Ordered queue of callback functions for linear sequencing of phases. |
| `posts` | table | `nil` | List of hitching posts found within range during contest start. |
| `temp_trainers` | table | `nil` | List of temporary trainer NPCs spawned for the current contest. |
| `temp_beefalo` | table | `nil` | List of temporary beefalo NPCs spawned for the current contest. |
| `victors` | table | `nil` | List of winners (players or NPCs) after prize evaluation. |
| `others` | table | `nil` | List of non-winners receiving consolation prizes. |
| `target_values` | table | `{ FEARSOME=0, FESTIVE=0, FORMAL=0 }` | Randomly generated target scores per category during contest start. |
| `doll_values` | table | `nil` | Precomputed scores for doll appraisal (used in `appraisedoll` workflow). |

## Main functions
### `cleartimers()`
*   **Description:** Stops any running timers (`prizedeadline`, `warndeadline`) on the host entity.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AdvanceQueue(data)`
*   **Description:** Executes the next callback in the `queue` table (used for ordered phase transitions).
*   **Parameters:** `data` (table) — unused argument passed from event callbacks.
*   **Returns:** Nothing.

### `SpawnVoice(pos, comment, duration)`
*   **Description:** Spawns the `yotb_stage_voice` entity and makes it speak a comment at the given world position.
*   **Parameters:**  
    - `pos` (Vector3) — World position for the voice entity.  
    - `comment` (string) — Localized string to speak.  
    - `duration` (number) — Approximate playback duration (subtracts `0.5` internally).  
*   **Returns:** Nothing.

### `AbortContest(data)`
*   **Description:** Immediately cancels the current contest, cleaning up spawned entities, clearing timers, and resetting tags. Often triggered by player/contestant attack or death. Pushes `yotb_onabortcontest` event.
*   **Parameters:** `data` (table) — Contains `reason` (e.g., `"attack"`).  
*   **Returns:** Nothing.

### `EnableContest()`
*   **Description:** Enables the contest host to accept start requests by adding tags and pushing `contestenabled` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `DisableContest()`
*   **Description:** Disables the contest host by removing contest-specific tags and pushing `contestdisabled` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `TestStartContest(starter)`
*   **Description:** Checks game conditions (no hostiles nearby, sufficient time until night, minimum posts/contestants) to determine if a contest can start.
*   **Parameters:** `starter` (Entity, unused in function) — Player entity initiating the request.
*   **Returns:**  
    - `nil` if safe to start.  
    - `"unsafe"` (hostiles/players too close, combat active), `"notime"` (night approaching), `"notenoughposts"` (< 4 posts), `"nocontestants"` (no hitched beefalo).  

### `Start_fail(result)`
*   **Description:** Handles failure messages and exits after a contest attempt fails `TestStartContest`.
*   **Parameters:** `result` (string) — One of the failure codes returned by `TestStartContest`.
*   **Returns:** Nothing.

### `StartContest(starter)`
*   **Description:** Begins the contest flow if `TestStartContest` succeeds. Spawns `yotb_stage_voice`, locks posts, and queues `Start_phase2`.
*   **Parameters:** `starter` (Entity) — Player entity initiating the contest.
*   **Returns:** Nothing.

### `Start_phase2()`
*   **Description:** Initializes contest parameters (posts, target values per category) and pushes `onflourishstart`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Start_phase3()`
*   **Description:** Announces the start, spawns extra beefalo if needed (for ≥ 4 posts), and schedules `StateParameters` to set target scores.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetParameterLine(category)`
*   **Description:** Returns a localized string corresponding to how close the current `target_values[category]` is to zero, based on `target_thresholds`.
*   **Parameters:** `category` (string) — One of `"FEARSOME"`, `"FESTIVE"`, `"FORMAL"`.
*   **Returns:** string — Localized speech line (from `target_lines`).

### `StateParameters()`
*   **Description:** Begins announcing target score categories and schedules `StateParameters_Phase2`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `StateParameters_Phase2()`
*   **Description:** Sequentially announces each category's target (FORMAL → FESTIVE → FEARSOME) and kicks off `BuildSuspense`.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `GetBeefScore(beefalo)`
*   **Description:** Sums costume part scores (FEARSOME/FESTIVE/FORMAL) for a beefalo using data from `yotb_costumes`.
*   **Parameters:** `beefalo` (Entity) — The beefalo to evaluate.
*   **Returns:** table `{ FEARSOME=n, FESTIVE=n, FORMAL=n }` — Total scores.

### `GetClosest(values)`, `GetFurthest(values)`, `GetRandom()`
*   **Description:** Determines which category (FEARSOME/FESTIVE/FORMAL) best matches the evaluation strategy (`"close"`, `"far"`, or `"random"`) between `values` (e.g., `beefalo.candidate_values`) and `self.target_values`.
*   **Parameters:** `values` (table) — Scores from `GetBeefScore`.
*   **Returns:** string — Selected category key.

### `GetComment(post)`
*   **Description:** Generates a localized comment string describing how well a hitched beefalo's outfit matches the target.
*   **Parameters:** `post` (Entity) — The hitching post (must have a hitched beefalo).
*   **Returns:** table — Contains `duration` (number) and `strs` (localized strings) based on `lines` and `thresholds`.

### `BuildSuspense()`
*   **Description:** Starts suspense period: enables markable on beefalo, plays music, triggers trainer panic timers, and waits for player marks via `yotb_post_mark` events.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `CheckForMarks(post, doer)`
*   **Description:** Checks if `doer` has already marked the given `post`.
*   **Parameters:**  
    - `post` (Entity) — Hitching post to check.  
    - `doer` (Entity) — Marking entity (usually player).  
*   **Returns:** `post` (Entity) if already marked, else `false`.

### `DeclareWinner()`
*   **Description:** Computes aggregate scores per beefalo, sorts by total deviation, and hosts podium ceremony with comments.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `Tossprize(target, pattern, other)`
*   **Description:** Spawns and launches a prize item (red pouch with gold nuggets or a pattern fragment) toward `target` or into the air.
*   **Parameters:**  
    - `target` (Entity or `nil`) — Entity to target (for NPC winners or players).  
    - `pattern` (boolean) — If `true`, spawns a random pattern fragment instead of a pouch.  
    - `other` (boolean) — If `true`, uses a fixed prize for non-winners.  
*   **Returns:** Nothing.

### `Tossprizes()`
*   **Description:** Distributes prizes to victors, consolation recipients, and pattern fragments.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `AwardVictors()`
*   **Description:** Identifies winners based on marks on the winning post, sets `victors`, `notvictors`, `prizes`, and triggers `yotb_throwprizes` event.
*   **Parameters:** None.
*   **Returns:** Nothing.

### `EndContest(reason)`
*   **Description:** Finalizes the contest: cleans up marks, unlocks posts, resets state, and begins shutdown sequence.
*   **Parameters:** `reason` (string or `nil`) — `"attack"`, `"toolate"`, or `nil` for normal end.  
*   **Returns:** Nothing.

### `appraisedoll(doll)`
*   **Description:** Initiates doll appraisal workflow (distinct from full contest): computes `doll_values`, shows feedback, and ends.
*   **Parameters:** `doll` (Entity) — The doll being appraised (used to read `category` from its data).
*   **Returns:** Nothing.

### `LoadPostPass(ents, data)`
*   **Description:** Hook called after map loading to reset timers (restores state from save).
*   **Parameters:** `ents`, `data` — Save/load arguments (unused).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:**  
    - `yotb_contest_abort` (via `inst:ListenForEvent`) → calls `AbortContest`  
    - `yotb_advance_queue` → calls `AdvanceQueue`  
    - `timerdone` → calls `EndContest("toolate")` or encourages prize collection  
    - `attacked`, `death` → aborts contest on player/beefalo attack/death (via `onattacked`)  
- **Pushes:**  
    - `contestenabled`, `contestdisabled`  
    - `conteststarted`, `contestdisabled`  
    - `onflourishstart`, `onflourishend`  
    - `yotb_throwprizes`, `yotb_onabortcontest`, `yotb_oncontestfinshed`  
    - `trader_arrives`, `trader_leaves`
