---
id: rider
title: Rider
description: Manages entity mounting and dismounting logic, including animation, physics, damage redirection, and interaction with rideable mounts.
sidebar_position: 1

last_updated: 2026-02-26
build_version: 714014
change_status: stable
category_type: component
system_scope: entity
source_hash: 07720704
---

# Rider

## Overview
The `Rider` component enables an entity (typically a player) to mount and ride compatible entities (e.g., Beefalo, Pig Guards) by managing state transitions, visual overrides (animations, saddle skins), physics synchronization, and communication with the mount's `rideable` component and game systems. It handles both normal gameplay mounting/dismounting and save/load persistence.

## Dependencies & Tags
- **Components relied on:**  
  - `self.inst.components.health` (accessed, but not added by this component)  
  - `self.inst.components.combat` (accessed and modified)  
  - `self.inst.components.sheltered` (accessed)  
  - `self.inst.components.pinnable` (accessed)  
  - `self.inst.replica.rider` (RPC target for network state sync)  
  - `mount.components.rideable` (required on mount entity)  
  - `mount.components.combat` (accessed for damage redirection)  
  - `mount.components.brain` (Hibernate/Wake via BrainManager)  
  - `mount.SoundEmitter` (optional, for sound muting)  
  - `saddle.components.saddler` (optional, for saddle rendering)  
- **Tags affected:** None directly added/removed, but `canbepinned` is toggled based on mounting state.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst` | `Entity` | — | Reference to the entity the component is attached to. |
| `target_mount` | `Entity?` | `nil` | Temporary reference to a pending mount during `Mount()` process. Cleared after successful mount. |
| `mount` | `Entity?` | `nil` | The currently mounted entity. `nil` when not riding. |
| `saddle` | `Entity?` | `nil` | The saddle currently equipped on the mount, if any. Populated during mount tracking. |
| `_mountannouncetask` | `Task?` | `nil` | Delayed task used to announce mount wound status (e.g., “mountwounded” event) after mounting. |
| `_onSaddleChanged` | `function` | — | Event handler callback for `"saddlechanged"` events on the mount. |

## Main Functions
### `Rider:Mount(target, instant)`
* **Description:** Initiates the mounting process on the given `target` entity. Validates mountability, applies visual/audio/physics adjustments, redirects combat, and triggers `"mounted"` upon completion.  
* **Parameters:**  
  - `target` (`Entity`): The rideable entity to mount. Must have the `rideable` component.  
  - `instant` (`boolean`): If `true`, skips the `"mount"` state transition and goes directly to `"idle"`. Used during loading/reconnection.

### `Rider:Dismount()`
* **Description:** Initiates a clean dismount by pushing the `"dismount"` event. The actual dismount logic is deferred to the state graph (`SGState`), or for internal/cleanup use, `ActualDismount()` can be called directly.  
* **Parameters:** None.

### `Rider:ActualDismount()`
* **Description:** Performs the complete dismount sequence, restoring the entity’s state (animations, physics, shadow, shielding, pinning, etc.), clearing saddle overrides, unhibernating the mount, and reparenting it back to the scene. Triggers `"dismounted"` with the dismounted mount as payload.  
* **Parameters:** None.

### `Rider:StartTracking(mount)`
* **Description:** Begins listening for `"saddlechanged"` events on the given `mount` to keep the local `saddle` property in sync. Also initializes `self.saddle` from the mount’s current saddle.  
* **Parameters:**  
  - `mount` (`Entity?`): The mount entity to track. `nil` is allowed (no-op).

### `Rider:StopTracking(mount)`
* **Description:** Stops listening for `"saddlechanged"` events on the mount and clears `self.saddle`.  
* **Parameters:**  
  - `mount` (`Entity?`): The mount entity to stop tracking. `nil` is allowed.

### `Rider:GetSaddle()`
* **Description:** Returns the current saddle entity equipped on the mount, or `nil`.  
* **Parameters:** None.

### `Rider:GetMount()`
* **Description:** Returns the currently mounted entity, or `nil` if not riding.  
* **Parameters:** None.

### `Rider:IsRiding()`
* **Description:** Returns `true` if the entity is currently mounted.  
* **Parameters:** None.

### `Rider:OnSave()`
* **Description:** Prepares serialization data for the mount entity, including saving its record if it supports persistence (`rideable:ShouldSave()`).  
* **Parameters:** None.  
* **Returns:** `table` — Save data with optional `mount` key containing the save record.

### `Rider:OnLoad(data)`
* **Description:** Restores the mounted state during load by spawning and re-mounting the saved mount entity.  
* **Parameters:**  
  - `data` (`table?`): Save data that may contain a `mount` record.

### `Rider:OnRemoveFromEntity()`
* **Description:** Cleans up upon component removal: cancels pending health announcement tasks and stops tracking the current mount.  
* **Parameters:** None.

## Events & Listeners
- **Listens for:**
  - `"saddlechanged"` (on mount entity) → Triggers `self._onSaddleChanged` to update `self.saddle`
- **Pushes:**
  - `"mounted"` → Fired when mounting completes (payload: `{target = <mount_entity>}`)
  - `"dismount"` → Fired at start of dismount process (no payload)
  - `"dismounted"` → Fired after full dismount completes (payload: `{target = <ex_mount_entity>}`)
  - `"refusedmount"` → Fired when mount refusal occurs (payload: `{rider=self.inst, rideable=target}`)
  - `"mountwounded"` → Fired if mount health drops below 20% ~2–4 seconds after mounting (no payload)