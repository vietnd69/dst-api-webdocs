---
id: trap_teeth
title: Trap Teeth
description: A deployable mine trap that springs on entity contact, deals damage, and consumes one use per trigger.
tags: [combat, trap, mine, deployable, infinite-uses]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 48f5ca02
system_scope: world
---

# Trap Teeth

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `trap_teeth` prefab implements a deployable spring-loaded trap used in the game's world. It is a passive combat asset that activates upon entity collision (via the `mine` component), deals fixed damage to the trigger target, and consumes one use. It supports multiple variants: standard (multiple uses) and Maxwell variant (single use). The trap interacts with `deployable`, `mine`, `finiteuses`, `hauntable`, and `inventoryitem` components to provide full gameplay integration, including reset functionality, hauntable behavior, and placement behavior.

## Usage example
```lua
local inst = CreateEntity()
-- Typically created via Prefab functions, not manually
inst:AddComponent("mine")
inst:AddComponent("finiteuses")
inst:AddComponent("deployable")
inst:AddComponent("hauntable")
inst:AddComponent("inventoryitem")

-- Standard initialization handled internally by MakeTeethTrapNormal()
```

## Dependencies & tags
**Components used:** `combat`, `deployable`, `finiteuses`, `hauntable`, `inventoryitem`, `mine`  
**Tags:** Adds `trap` to instance (`inst:AddTag("trap")`)

## Properties
No public properties are initialized or exposed. All internal state is managed via component properties (e.g., `inst.components.mine.radius`, `inst.components.finiteuses.current`).

## Main functions
### `MakeTeethTrapNormal()`
*   **Description:** Constructs a standard trap teeth prefab instance with multiple uses, inventory compatibility, and standard reset/deactivation logic.
*   **Parameters:** None.
*   **Returns:** A fully initialized `Entity` instance.
*   **Error states:** Returns the entity early on the client without master simulation components.

### `MakeTeethTrapMaxwell()`
*   **Description:** Constructs a Maxwell-specific variant with one use, special hauntable behavior (no alignment to player), and faster visual reset.
*   **Parameters:** None.
*   **Returns:** A fully initialized `Entity` instance.
*   **Error states:** Returns the entity early on the client without master simulation components.

### `common_fn(bank, build, isinventoryitem)`
*   **Description:** Shared constructor logic for all trap teeth variants. Sets up core components, animations, physics, and callbacks.
*   **Parameters:**  
    `bank` (string) – Animation bank name.  
    `build` (string) – Build name for the anim state.  
    `isinventoryitem` (boolean) – Whether the trap is stackable/droppable (true for normal variant).
*   **Returns:** An initialized `Entity` instance.
*   **Error states:** Returns client-side entity prematurely if not master; no side effects on client.

### `OnExplode(inst, target)`
*   **Description:** Triggered when the mine is sprung (e.g., entity steps on it). Plays the trap animation, emits sound, deals damage via `combat:GetAttacked()`, and decrements finite uses.
*   **Parameters:**  
    `inst` (Entity) – The trap entity instance.  
    `target` (Entity or nil) – The entity that triggered the trap.
*   **Returns:** Nothing.
*   **Error states:** If `target` is `nil`, only the visual/audio effects and use decrement occur.

### `OnReset(inst)`
*   **Description:** Resets the trap to an active, ready state (only for normal variant). Enables minimap, plays reset animation/sound, and ensures the trap is ready to be triggered again.
*   **Parameters:** `inst` (Entity) – The trap entity instance.
*   **Returns:** Nothing.

### `OnResetMax(inst)`
*   **Description:** Special reset function for Maxwell variant (no animation; only minimap and idle state).
*   **Parameters:** `inst` (Entity) – The trap entity instance.
*   **Returns:** Nothing.

### `SetSprung(inst)`
*   **Description:** Sets the trap to the "sprung" visual state (`trap_idle`) after being triggered, and ensures minimap visibility.
*   **Parameters:** `inst` (Entity) – The trap entity instance.
*   **Returns:** Nothing.

### `SetInactive(inst)`
*   **Description:** Deactivates the trap visually and hides it from the minimap (used when placed inactive).
*   **Parameters:** `inst` (Entity) – The trap entity instance.
*   **Returns:** Nothing.

### `OnDropped(inst)`
*   **Description:** Handler called when the trap is dropped from inventory. Deactivates the mine component.
*   **Parameters:** `inst` (Entity) – The trap entity instance.
*   **Returns:** Nothing.

### `ondeploy(inst, pt, deployer)`
*   **Description:** Callback for the deployable component. Resets the mine on deployment and snaps the trap to the placement grid.
*   **Parameters:**  
    `inst` (Entity) – The trap entity instance.  
    `pt` (table) – Grid position wrapper with `Get()` method.  
    `deployer` (Entity) – The entity placing the trap.
*   **Returns:** Nothing.

### `OnHaunt(inst, haunter)`
*   **Description:** Haunt reaction logic. For inactive/triggers that haven’t sprung: small haunt with launch. For sprung traps: chance to reset with small haunt.
*   **Parameters:**  
    `inst` (Entity) – The trap entity instance.  
    `haunter` (Entity) – The entity triggering haunt.
*   **Returns:** `true` if haunt succeeded and triggered effects; `false` otherwise.
*   **Error states:** Returns `false` if trap is sprung and random chance fails.

## Events & listeners
- **Listens to:** `percentusedchange` (internal via `finiteuses` component) — triggers tag updates and finishing logic.  
- **Pushes:** No custom events. Relies on events from `mine` (`onexplode`, `onreset`, `onsprung`, `ondeactivate`), `finiteuses` (`percentusedchange`), and `deployable` (`ondeploy`).  
- **Component event callbacks:** Used for all handlers (see `SetOn*Fn` methods in `mine` and `finiteuses`).