---
id: batbrain
title: Batbrain
description: AI brain responsible for controlling bat behavior, including foraging, stealing nitre, escaping caves, and following team/formation rules.
tags: [ai, locomotion, combat, inventory]
sidebar_position: 1

last_updated: 2026-03-03
build_version: 714014
change_status: stable
category_type: brain
source_hash: 9e27ff13
system_scope: brain
---

# Batbrain

> Based on game build **714014** | Last updated: 2026-03-03

## Overview
`BatBrain` implements the decision-making logic for bat entities in Don't Starve Together. It uses a Behavior Tree (`BT`) to manage actions such as eating, escaping from the cave, chasing targets, and interacting with team mechanics. The brain integrates with multiple components—including `teamattacker`, `acidinfusible`, `eater`, `homeseeker`, and `knownlocations`—to coordinate behavior based on environmental state (day/night, cave/daytime), team orders, and entity inventory.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("brain")
inst:AddComponent("teamattacker")
inst:AddComponent("acidinfusible")
inst:AddComponent("eater")
inst:AddComponent("homeseeker")
inst:AddComponent("knownlocations")
-- ... other setup ...
inst.components.brain:SetBrainClass("batbrain")
```

## Dependencies & tags
**Components used:** `teamattacker`, `acidinfusible`, `eater`, `homeseeker`, `knownlocations`, `inventory`, `container`, `childspawner`, `hideout`, `inventoryitem`  
**Tags:** Checks for tags `batdestination`, `player`, `_container`, `playerghost`, `fire`, `burnt`, `INLIMBO`, `outofreach`, `FX`, `NOCLICK`, `DECOR`, `inlimbo`. Does not add or remove tags directly.

## Properties
No public properties are defined in this brain. State is encapsulated internally within the Behavior Tree and via external component state.

## Main functions
### `BatBrain:OnStart()`
* **Description:** Initializes and constructs the Behavior Tree root node, incorporating panic responses, day/night navigation, team formation logic, and acid-infusion behavior.
* **Parameters:** None.
* **Returns:** Nothing.
* **Error states:** None; assumes required components exist. Behavior may not function correctly if key components (`teamattacker`, `eater`, `homeseeker`, `acidinfusible`, `knownlocations`) are missing.

### `BatBrain:OnInitializationComplete()`
* **Description:** Records the entity’s current position as the "home" location in `knownlocations`, preventing overwriting if already set.
* **Parameters:** None.
* **Returns:** Nothing.

### `GoHomeAction(inst)`
* **Description:** Returns an `ACTION.GOHOME` action targeting the bat’s home if valid and not in a team.
* **Parameters:** `inst` (Entity) — the bat entity.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `homeseeker` or `home` is invalid, or if the entity is in a team.

### `EscapeAction(inst)`
* **Description:** Returns an action to escape to a sinkhole (`batdestination`) at night, or to `GOHOME` if in cave day.
* **Parameters:** `inst` (Entity) — the bat entity.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if no valid `batdestination` is found or the destination lacks `childspawner`/`hideout`.

### `EatFoodAction(inst)`
* **Description:** Prioritizes eating food from inventory; if none available, attempts to pick up edible items within range (`SEE_FOOD_DIST = 30`).
* **Parameters:** `inst` (Entity) — the bat entity.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if `inventory` or `eater` component is missing or no edible food found. Skips if state has `busy` tag.

### `StealNitreAction(inst)`
* **Description:** Scans nearby entities and containers for `"nitre"` items to steal. Prioritizes equipped inventory (e.g., backpack) over direct slots.
* **Parameters:** `inst` (Entity) — the bat entity.
* **Returns:** `BufferedAction` with `ACTIONS.STEAL` or `nil`.
* **Error states:** Returns `nil` if no nitre found or if `inventoryitem.owner` is `nil` for target item.

### `AcidBatAction(inst)`
* **Description:** Selects an action (`EatFood`, `StealNitre`, or fallback) based on `teamattacker` orders. Always leaves formation if an action is chosen.
* **Parameters:** `inst` (Entity) — the bat entity.
* **Returns:** `BufferedAction` or `nil`.
* **Error states:** Returns `nil` if no valid action found or components (`teamattacker`, `eater`, `inventory`) missing.

### `LeaveFormation(inst)`
* **Description:** Instructs `teamattacker` to ignore formation restrictions.
* **Parameters:** `inst` (Entity) — the bat entity.
* **Returns:** Nothing.

### `LeaveTeam(inst)`
* **Description:** Instructs `teamattacker` to leave the team; notifies leader if present.
* **Parameters:** `inst` (Entity) — the bat entity.
* **Returns:** Nothing.

## Events & listeners
- **Listens to:** `"panic"` (via `EventNode`) — triggers panic behavior and forces formation/team exit.
- **Pushes:** None directly. Delegates to action system and Behavior Tree for event propagation.
