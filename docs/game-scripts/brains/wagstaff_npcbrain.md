---
id: wagstaff_npcbrain
title: Wagstaff Npcbrain
description: Controls the behavior tree and state machine of the Wagstaff NPC, managing quest progression, clue-following, arena interactions, and dialogue triggers across different game contexts.
tags: [ai, brain, npc, quest, combat]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: brain
system_scope: brain
source_hash: e55d0c16
---

# Wagstaff Npcbrain

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This component defines the AI behavior for the Wagstaff NPC, a non-player character that guides players through the lunar arena and moon storm experiment progression in Don't Starve Together. It implements a behavior tree (`BT`) to handle context-sensitive actions across multiple distinct states: arena gameplay (`wagstaff_npc_wagpunk_arena`), junkyard hints, machine hints, and hunt phases involving clue locations. The behavior tree prioritizes interactions based on environment state, known locations, and internal flags (e.g., `hunt_stage`, `oneshot`, `busy`). The component relies heavily on the `knownlocations`, `inventory`, `npc_talker`, and `wagpunk_arena_manager` components to coordinate actions, dialogue, and interaction logic.

## Usage example

```lua
-- Typically added to the Wagstaff entity during prefab instantiation
inst:AddComponent("npc_talker")
inst:AddComponent("knownlocations")
inst:AddComponent("inventory")
inst:AddComponent("timer")

-- The brain component is added via the base Brain class mechanism (e.g., in prefabs/wagstaff_common.lua)
inst:AddComponent("brain")
inst.components.brain:SetBrain("wagstaff_npcbrain")
```

## Dependencies & tags

**Components used:**
- `inventory` (`GetFirstItemInAnySlot`)
- `inventoryitem` (`IsHeldBy`, via `inventoryitem` component on held items)
- `knownlocations` (`GetLocation`, `ForgetLocation`)
- `lunaralterguardianspawner` (`GetGuardian`)
- `moonstormmanager` (`FailExperiment`, `GetCelestialChampionsKilled`)
- `npc_talker` (`Chatter`, `donextline`, `haslines`, `resetqueue`)
- `talker` (`Chatter`, `ShutUp`)
- `timer` (`StartTimer`, `TimerExists`)
- `trader` (`IsTryingToTradeWithMe`)
- `wagpunk_arena_manager` ( queried directly via `TheWorld.components.wagpunk_arena_manager` )

**Tags:**
- `gestalt_cage_filled`
- `irreplaceable`

## Properties

| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.busy` | number | `nil` | Tracks time remaining before Wagstaff becomes idle again (decremented on experiment start). |
| `inst.hunt_count` | number | `0` | Number of clue encounters completed during hunt phase. |
| `inst.hunt_stage` | string | `nil` | Current phase: `"hunt"` (seek clue), `"experiment"` (run experiment), or `nil`. |
| `inst.meetingplayer` | Entity | `nil` | Player target during trade interaction. |
| `inst.playerwasnear` | boolean | `nil` | Indicates whether the player was near the clue location when found. |
| `inst.static` | Entity | `nil` | Reference to the spawned `moonstorm_static` prefab during experiment phase. |
| `inst.hunt_stage` | string | `nil` | Current phase: `"hunt"`, `"experiment"`, or `nil`. |
| `inst.wagstaff_experimenttime` | number | `nil` | Timestamp indicating when experiment timing is active. |
| `inst.wagstaff_experimentcallback` | function | `nil` | Callback registered for experiment completion. |
| `inst.avoid_erodeout` | boolean | `nil` | Flag to prevent erode-out (fade-out) during socketing interactions. |
| `inst.desiredlocation` | Vector3 | `nil` | Target position to move toward (arena mode). |
| `inst.desiredlocationdistance` | number | `nil` | Distance threshold for movement to `desiredlocation`. |
| `inst.itemstotoss` | table/array | `nil` | List of items queued for disposal (arena mode). |
| `inst.tiedtolever` | boolean | `nil` | Whether Wagstaff is required to remain near the arena lever. |
| `inst.wantingcage` | boolean | `nil` | Flag indicating Wagstaff is waiting for `gestalt_cage_filled3`. |
| `inst.oneshot` | boolean | `nil` | If `true`, Wagstaff fades out after a time in idle state. |
| `inst.erodingout` | boolean | `nil` | Set when Wagstaff is currently fading out (eroding). |
| `inst.dofadeoutintask` | DoTaskInTime | `nil` | Task for scheduled fade-out; may be canceled. |
| `inst.levernagcooldowntime` | number | `nil` | Next allowed time to nag near the arena lever (seconds since epoch). |
| `inst.in_arena`, `inst.in_junk`, etc. | BehaviorNode | `nil` | Behavior tree subnodes (internal use). |
| `inst.bt` | BT | `nil` | The active behavior tree instance. |

## Main functions

### `GetTraderFn(inst)`
* **Description:** Identifies a player currently attempting to trade with this NPC within `TRADE_DIST` (20 units), using the `trader` component's `IsTryingToTradeWithMe` method.
* **Parameters:** `inst` (Entity): The Wagstaff entity instance.
* **Returns:** Entity (player) if a trade attempt is in progress; otherwise `nil`.
* **Error states:** Returns `nil` if the `trader` component is absent.

### `KeepTraderFn(inst, target)`
* **Description:** Verifies if the given `target` entity is still in a trade interaction state with this NPC.
* **Parameters:** `inst` (Entity), `target` (Entity).
* **Returns:** Boolean (`true` if `target` is trying to trade).
* **Error states:** Returns `false` if the `trader` component is absent.

### `failexperiment(static)`
* **Description:** Called when the `moonstorm_static` entity (spawned during experiment) is removed or killed; notifies the `moonstormmanager` to fail the experiment if not already complete.
* **Parameters:** `static` (Entity, optional, passed via event listener).
* **Returns:** None.
* **Error states:** Safely handles cases where `TheWorld.components.moonstormmanager` is `nil` or `static.experimentcomplete` is `true`.

### `face_final_position(inst, final)`
* **Description:** Forces Wagstaff to rotate toward the `final` Vector3 position using `ForceFacePoint`.
* **Parameters:** `inst` (Entity), `final` (Vector3).
* **Returns:** None.

### `initiate_experiment(inst, pos)`
* **Description:** Starts the moon storm experiment by setting the NPC's position, potentially spawning `moonstorm_static`, scheduling fade-out or movement timers, and incrementing `hunt_count` for arena mechanics.
* **Parameters:** `inst` (Entity), `pos` (Vector3 or table with `x`, `y`, `z`).
* **Returns:** None.

### `ShouldGoToClue(inst)`
* **Description:** Initiates a path to the known `"clue"` location if available. Updates `hunt_count`, erodes state, and schedules the experiment. Removes the location from `knownlocations` after use.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` for walking to clue; `nil` if no clue location exists.
* **Error states:** Returns `nil` if `knownlocations:GetLocation("clue")` is `nil`.

### `ShouldGoToMachine(inst)`
* **Description:** Initiates movement to the known `"machine"` location. Triggers a hint dialogue and erodes state with delays.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` for walking to machine; `nil` if no machine location exists.

### `ShouldGoToJunkYard(inst)`
* **Description:** Initiates movement to the known `"junk"` location (used during hinting). Triggers a high-priority dialogue and erodes state with delays.
* **Parameters:** `inst` (Entity).
* **Returns:** `BufferedAction` for walking to junkyard; `nil` if no junk location exists.

### `OnFinishExperiment_gestaltcage(inst, item, socketable)`
* **Description:** Handles the completion of socketing a `gestalt_cage_filled` item into a socketable entity (e.g., `wagdrone_spot_marker` or `wagboss_robot`). Updates arena drone tracking, spawns sound notifications, and triggers arena completion state changes.
* **Parameters:** `inst` (Entity), `item` (Entity), `socketable` (Entity).
* **Returns:** None.

### `DoArenaActions(inst)`
* **Description:** Central logic hub for arena-state behavior. Prioritizes: movement to `desiredlocation`, NPC speech queue processing, experiment triggering, socketing gestalt cages, item tossing, and lever-nagging. Manages fade-out and idle state transitions.
* **Parameters:** `inst` (Entity).
* **Returns:** None (may return a `BufferedAction` via internal calls).

### `Wagstaff_NPCBrain:OnStart()`
* **Description:** Constructs the behavior tree root node by composing context-specific sub-trees (arena, junkyard, hint, hunt, trade, idle) using `WhileNode`, `PriorityNode`, `DoAction`, and `ChattyNode`. The tree prioritizes actions based on dynamic conditions (e.g., presence of locations, flags).
* **Parameters:** `self` (Brain component instance).
* **Returns:** None.

## Events & listeners

- **Listens to:**
  - `"onremove"` on `self.static` (sent via `inst:ListenForEvent("onremove", failexperiment, static)`) — triggers experiment failure.
  - `"death"` on `self.static` (sent via `inst:ListenForEvent("death", failexperiment, static)`) — triggers experiment failure.
  - `"talk"` — internal event used to trigger speech execution in stategraph.
  - `"doexperiment"` — internal event used to trigger experiment phase state transitions.
  - `"tossitem"` — internal event used to toss queued items.

- **Pushes:**
  - `"onremove"` and `"death"` (on `self.static`, via event propagation).
  - `"ms_wagpunk_constructrobot"` (in `OnFinishExperiment_gestaltcage`, after socketing).
  - Internal `"talk"`, `"doexperiment"`, and `"tossitem"` events in `DoArenaActions` and related callbacks.