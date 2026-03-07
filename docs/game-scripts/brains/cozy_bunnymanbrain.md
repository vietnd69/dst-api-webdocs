---
id: cozy_bunnymanbrain
title: Cozy Bunnymanbrain
description: Manages the AI behavior of the Cozy Bunnyman during minigames and normal gameplay, including pillow fights, carrot-spinning contests, and home management.
tags: [ai, minigame, combat, inventory, locomotion]
sidebar_position: 10

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 66cf2101
system_scope: brain
---

# Cozy Bunnymanbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`CozyBunnymanBrain` defines the behavior tree for the Cozy Bunnyman entity, orchestrating actions such as pillow-arena participation in the Pillow Fight Minigame, hosting carrot-spinning contests during the Year of the Rabbit (YOTR) event, and routine activities like sleeping, chatting, and pillow handling. It integrates heavily with components like `combat`, `minigame_participator`, `inventory`, `entitytracker`, `sleeper`, `knownlocations`, and `hauntable`. This brain uses priority-based behavior nodes from `behaviour` to dynamically switch between minigame logic, panic states, and idle behavior.

## Usage example
```lua
local inst = CreateEntity()
inst:AddTag("bunnyman")
inst:AddComponent("cozybunnymanbrain")
-- The brain is automatically initialized on entity spawn via its prefab file.
-- No direct instantiation is needed; modders extend behavior by listening to events
-- (e.g., `cheer`, `question`, `disappoint`) or overriding minigame states.
```

## Dependencies & tags
**Components used:** `combat`, `entitytracker`, `hauntable`, `health`, `homeseeker`, `inventory`, `inventoryitem`, `knownlocations`, `minigame`, `minigame_participator`, `minigame_spectator`, `sleeper`, `timer`, `trader`.  
**Tags:** Checks `player`, `notarget`, `playerghost`; adds none directly.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `shouldquestion` | boolean or `nil` | `nil` | If `true`, triggers a "danger question" event in the next idle state. |
| `shouldhide` | boolean or `nil` | `nil` | If `true`, triggers a "hide" event. |
| `sayspoilsport` | boolean or `nil` | `nil` | If `true`, triggers disappointment when the minigame times out. |
| `isleaveing` | boolean | `false` | Set when the bunny returns to the cave (e.g., after YOTR event). |
| `needspillow` | boolean | `false` | Indicates the bunny needs to pick up its floor pillow. |
| `carrotgamestatus` | string or `nil` | `nil` | Tracks state in the carrot-spinning minigame (e.g., `"home"`, `"start"`, `"winnercheer"`). |
| `gamehost` | boolean | `false` | Set to `true` if this bunny is hosting the carrot-spinning minigame. |
| `fightprizes` | array | `{}` | List of prizes (with `winner` and `prize` fields) to be dropped after a pillow fight. |
| `_return_to_pillow_spot` | boolean | `nil` | Internal flag to trigger returning to the original pillow ring location. |
| `_clear_target` | function or `nil` | `nil` | Callback to clear combat target after a pillow swing. |

## Main functions
### `OnStart()`
* **Description:** Constructs and assigns the behavior tree (`self.bt`) for the bunny. This function is called automatically by the brain system when the entity spawns or the brain is installed.
* **Parameters:** None (part of constructor).
* **Returns:** Nothing.
* **Error states:** None. The behavior tree is always built; however, specific nodes may return `nil` if conditions are not met.

### `checkforcarrotgame(inst)`
* **Description:** Determines whether the Cozy Bunnyman should host or join the carrot-spinning minigame. Returns `true` if conditions are met (e.g., it has a carrot, not already in a minigame, appropriate time of day).
* **Parameters:** `inst` (entity instance) — the bunny entity.
* **Returns:** `true` if the minigame should begin, `nil` otherwise.

### `carrotgamemanager(inst)`
* **Description:** Handles the full lifecycle of the carrot-spinning minigame when the bunny is the host: starts the game, drops and spins the carrot, detects the winner, awards the goop prize, and manages delivery logic.
* **Parameters:** `inst` (entity instance).
* **Returns:** A `BufferedAction` (e.g., walk or drop actions) or `nil` if no immediate action is needed.

### `carrotgameplayer(inst)`
* **Description:** Handles participation logic for a non-host bunny in the carrot-spinning minigame (e.g., cheer at the start, wait for winner announcement, celebrate the winner).
* **Parameters:** `inst` (entity instance).
* **Returns:** `nil` (this function does not return a `BufferedAction`; actions are triggered via events).

### `shouldgobacktocave(inst)`
* **Description:** Initiates return to the cave after a YOTR shrine event concludes (e.g., if no floor pillow remains).
* **Parameters:** `inst` (entity instance).
* **Returns:** `nil`.

### `plantpillow(inst)`
* **Description:** Plans a buffered action to drop the equipped bodypillow at the pillow-dropping spot (`pillowSpot`), unless the bunny is busy, sleepy, or already at home.
* **Parameters:** `inst` (entity instance).
* **Returns:** A `BufferedAction` or `nil`.

### `gotopillowlocation(inst)`
* **Description:** If no pillow is equipped, walks toward the pillow-dropping location (`pillowSpot`) if sufficiently far away.
* **Parameters:** `inst` (entity instance).
* **Returns:** A `BufferedAction` (walk to location) or `nil`.

### `dropprizeforplayer(inst)`
* **Description:** Creates a buffered action to drop the next prize in `fightprizes` at a calculated offset around the bunny, then removes the prize from the queue.
* **Parameters:** `inst` (entity instance).
* **Returns:** A `BufferedAction` or `nil`.

### `randompillowswing(inst)`
* **Description:** In non-minigame or cooldown-free states, randomly selects another bunny in the fight ring and attacks it with a pillow if `math.random() < 0.2`.
* **Parameters:** `inst` (entity instance).
* **Returns:** A `BufferedAction` (attack) or `nil`.

### `GetFaceTargetFn(inst)`
* **Description:** Returns the closest player within start face distance (`START_FACE_DIST = 4`) if the bunny is idle and not holding a carrot. Starts a `facetime` timer on success.
* **Parameters:** `inst` (entity instance).
* **Returns:** A player entity or `nil`.

### `KeepFaceTargetFn(inst, target)`
* **Description:** Continues facing the target if both entities are valid, within `KEEP_FACE_DIST = 6`, and the `facetime` timer is still active.
* **Parameters:** `inst` (entity instance), `target` (entity instance).
* **Returns:** `true` if target should be kept, `false` otherwise.

### `PanicChat(inst)`
* **Description:** Returns an appropriate panic string based on current danger state: `hauntable.panic`, `health.takingfiredamage`, or `"shouldhide"` timer active.
* **Parameters:** `inst` (entity instance).
* **Returns:** A string key from `STRINGS` (e.g., `"RABBIT_PANICHAUNT"`) or `nil`.

## Events & listeners
- **Listens to:**  
  - `onpickup` (on carrot) — triggers `OnAttacked()` if pickup is by another entity.  
  - `oneaten` (on goop/prize) — triggers `gookeaten()` if eaten by the designated winner.  
  - `onremove` (on tracked entities) — via `entitytracker:TrackEntity()`.  
- **Pushes:**  
  - `question`, `cheer`, `dance`, `disappoint`, `hide`, `digtolocation`, `raiseobject`, `setupprizes`, `gobacktocave`.
