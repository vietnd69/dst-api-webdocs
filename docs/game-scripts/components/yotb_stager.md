---
id: yotb_stager
title: Yotb Stager
description: Manages the.Yotb minigame contest flow, including stage setup, participant judging, scoring, winner declaration, and prize distribution.
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 2fe894af
---

# Yotb Stager

## Overview
The `YOTB_Stager` component orchestrates the Yeti of the Bayou (YOTB) minigame contest. It handles stage initialization (e.g., checking arena safety and contestant readiness), contest phases (target parameter announcement, building suspense, marking, and declaring winners), prize tossing, cleanup, and optional doll appraisal. It manages temporary entities like trainers, beefalo, and voice FX, and coordinates timing via the stage entity's timer system and queue-based task execution.

## Dependencies & Tags
- **Components accessed:**
  - `inst.components.timer` — used for deadline and panic timers; requires existence at startup.
  - `inst.components.talker` — used for dialog speech.
  - `inst.components.workable` — toggled to disable/enable the stage.
  - `inst.components.hitcher` — on posts to manage hitched beefalo.
  - `inst.components.markable` / `inst.components.markable_proxy` — tracks players who marked posts.
  - `inst.components.named` — reads beefalo names.
  - `inst.components.skinner_beefalo` — applies and queries clothing parts for scoring.
  - `inst.components.follower` — sets beefalo leader (trainer).

- **Tags added on contest start:** `"yotb_contestenabled"`, `"yotb_conteststartable"` (removed at start), `"nomagic"`.
- **Tags removed on contest end:** `"yotb_contestenabled"`, `"nomagic"`.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | The stage entity the component is attached to. |
| `tasks` | `table` | `{}` | List of scheduled tasks (e.g., timers, delayed functions) for cancellation. |
| `choice` | `string` | `"far"` | Strategy used to pick which category to highlight when giving comments (`"close"`, `"far"`, or `"random"`). |
| `queue` | `table` | `{}` | Queue of functions executed sequentially via `AdvanceQueue`. |
| `posts` | `table` | `nil` | Array of stage posts found during contest start. |
| `temp_trainers` | `table` | `nil` | List of temporary NPC trainers spawned for the contest. |
| `temp_beefalo` | `table` | `nil` | List of temporary beefalo spawned during the contest. |
| `starter` | `Entity?` | `nil` | Player who initiated the contest (for UI context). |
| `current_post` | `number?` | `nil` | Index of the post currently highlighted or awarded. |
| `target_values` | `table` | `{ FEARSOME=0, FESTIVE=0, FORMAL=0 }` | Randomly generated target scores for each category. |
| `victors` | `table` | `nil` | List of players who marked the winning post. |
| `others` | `table` | `nil` | List of players who marked non-winning posts. |
| `patterns` | `number?` | `nil` | Number of pattern fragments to award. |
| `prizes` | `number?` | `nil` | Number of victors, used to look up prize amount. |
| `doll_values` | `table?` | `nil` | Evaluated doll stats (used in appraisal mode only). |
| `voice` | `Entity?` | `nil` | `yotb_stage_voice` entity used for speech FX. |
| `light` | `Entity?` | `nil` | Spotlight entity for the current post. |
| `contest_ending` | `boolean?` | `nil` | Flag to prevent duplicate end-contest logic. |

## Main Functions

### `TestStartContest(starter)`
* **Description:** Validates conditions before starting a contest (arena safety, player count, time until night, posts count, and presence of hitched beefalo).
* **Parameters:** `starter` (`Entity?`) — unused in validation but passed via queue.
* **Returns:** `nil` if OK; string reason (`"unsafe"`, `"notime"`, `"notenoughposts"`, `"nocontestants"`) otherwise.

### `StartContest(starter)`
* **Description:** Initiates the contest flow if validation passes; otherwise queues a failure message.
* **Parameters:** `starter` (`Entity?`) — player who triggered the contest.

### `Start_phase2()`
* **Description:** Finds posts, sets them workable=false, sorts posts by angle around the stage, and initializes random target values per category. Ends with queuing `Start_phase3`.

### `Start_phase3()`
* **Description:** Announces contest start, spawns extra beefalo if needed, locks posts, and schedules parameter announcement after delays.

### `GetParameterLine(category)`
* **Description:** Returns appropriate target comment string based on `target_values[category]` using `target_thresholds`.
* **Parameters:** `category` (`string`) — one of `"FEARSOME"`, `"FESTIVE"`, `"FORMAL"`.

### `StateParameters()`
* **Description:** Begins phase to announce target parameters; schedules `StateParameters_Phase2()` via queue.

### `StateParameters_Phase2()`
* **Description:** Announces target lines for each category in sequence (FORMAL → FESTIVE → FEARSOME) with timed speech, then starts `BuildSuspense`.

### `BuildSuspense()`
* **Description:** Enables markable proxy on beefalo, plays contest music, adds panic timers to trainers (to randomly assign a target post), and cues “Guess Who” dialogue sequence.

### `GetComment(post)`
* **Description:** Evaluates a beefalo's clothing score against `target_values`, selects a category based on `choice`, and returns a matching comment string (`lines[category][key]`) based on score deviation.
* **Parameters:** `post` (`Entity`) — post entity with a hitched beefalo.

### `GetBeefScore(beefalo)`
* **Description:** Sums category scores (`FEARSOME`, `FESTIVE`, `FORMAL`) for all clothing items on the beefalo using `set_data.parts`.
* **Parameters:** `beefalo` (`Entity`) — the beefalo entity.

### `GetClosest(values)`
* **Description:** Returns the category with the smallest absolute difference between `values[cat]` and `target_values[cat]` (used when `choice == "close"`).

### `GetFurthest(values)`
* **Description:** Returns the category with the largest absolute difference between `values[cat]` and `target_values[cat]` (used when `choice == "far"`).

### `GetRandom(values)`
* **Description:** Returns a random category (used when `choice == "random"`). *Note:* The parameter `values` is unused.

### `DeclareWinner()`
* **Description:** Computes score per post (sum of absolute diffs for each category), sorts posts, and announces 3rd/2nd/1st places with voice comments and spotlight highlighting.

### `Tossprize(target, pattern, other)`
* **Description:** Spawns and launches a prize pouch or pattern fragment using `LaunchGameItem`.
* **Parameters:**  
  - `target` (`Entity?`) — player/NPC to toss toward.  
  - `pattern` (`boolean?`) — if truthy, launches a pattern fragment instead of pouch.  
  - `other` (`boolean?`) — if truthy, awards gold nugget (for non-winners).  

### `AwardVictors()`
* **Description:** Populates `victors` and `notvictors` lists from marks on the winning/non-winning posts, sets `prizes`, and triggers prize tossing and console/pattern allocation queues.

### `EndContest(reason)`
* **Description:** Performs contest cleanup: stops timers, clears marks, unlocks posts, removes callbacks, plays end speech, and queues `EndContest_phase2()`.

### `EndContest_phase2()`
* **Description:** Disables contest mode, spawns exits FX, removes temporary NPCs/players and FX, and re-enables contest if needed.

### `appraisedoll(doll)`
* **Description:** Initializes doll appraisal flow (sets `doll_values`, plays opening speech, queues `appraisedoll2`).

### `appraisedoll2()`, `appraisedoll3()`
* **Description:** Handles appraisal announcement of doll's stats across categories, culminating in `Endppraisedoll()`.

### `Endppraisedoll()`
* **Description:** Clears appraisal state, re-enables stage for future contests.

### `cleartimers()`
* **Description:** Stops and removes `prizedeadline` and `warndeadline` timers.

### `AdvanceQueue(data)`
* **Description:** Executes the next queued function and removes it from `self.queue`.

### `AbortContest(data)`
* **Description:** Called on `yotb_contest_abort`. Cancels timers, clears tasks, removes temporary entities, and eventually triggers `EndContest(data.reason)`.

## Events & Listeners
- **Listens for:**
  - `"yotb_contest_abort"` → calls `AbortContest(data)`
  - `"yotb_advance_queue"` → calls `AdvanceQueue(data)`
  - `"timerdone"` → handles deadline warnings and prize deadlines (`prizedeadline`, `warndeadline`)
  - `"attacked"` (on beefalo via `Start_phase2`) → calls `onplayerbeefattacked`, triggering `AbortContest({reason="attack"})`
  - `"death"` (on beefalo via `Start_phase2`) → same as above
  - `"onremove"` (on temp trainers and beefalo via `SpawnVoiceName` logic) → calls `RemoveTempTrainer` / `RemoveTempBeef` for cleanup
- **Pushes:**
  - `"contestenabled"`, `"contestdisabled"`, `"conteststarted"`, `"trader_arrives"`, `"trader_leaves"`, `"onflourishstart"`, `"onflourishend"`, `"yotb_onabortcontest"`, `"yotb_oncontestfinshed"`, `"yotb_throwprizes"`, `"win_yotb"` (on NPCs)