---
id: about-game-scripts
title: About Don't Starve Together Game Scripts
description: Introduction to DST's Lua-based game scripts and their role in defining gameplay mechanics, UI systems, and mod support
sidebar_position: 2

last_updated: 2026-05-04
build_version: 676042
change_status: stable
---

# About Don't Starve Together Game Scripts

:::note[AI-Generated Documentation]
This documentation is generated from the base scripts of Don't Starve Together, located at:

`SteamLibrary\steamapps\common\Don't Starve Together\data\databundles\scripts.zip`

**Disclaimer:** The information here may not be fully accurate and should be verified against the actual game files.

- A regularly updated and cleaned-up fork of the DST scripts: [github.com/vietnd69/dst-scripts](https://github.com/vietnd69/dst-scripts)
- Contributions and fixes are welcome at: [github.com/vietnd69/dst-api-webdocs](https://github.com/vietnd69/dst-api-webdocs)
:::

## What Are DST Game Scripts?

Don't Starve Together is built on a comprehensive Lua scripting system that defines virtually every aspect of the game — mechanics, UI, AI, world generation, and mod support. Rather than a closed binary engine, DST exposes its logic through readable, moddable Lua scripts.

The scripts serve two roles simultaneously:
- **Game Logic**: The actual implementation of how DST works
- **Mod Framework**: The foundation community mods build on

## Script System Architecture

### Core Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| [Components](../category/components) | Reusable behaviors attached to entities | `health`, `inventory`, `combat`, `edible` |
| [Prefabs](../category/perfabs) | Complete entity definitions (templates) | Characters, items, structures, creatures |
| [Stategraphs](../category/stategraphs) | Animation and behavioral state machines | Player actions, creature movement |
| [Brains](../category/brains) | AI decision-making and goal selection | Creature AI, NPC behaviors |
| [Behaviours](../category/behaviours) | Reusable atomic AI actions | Approach, flee, wander, attack |
| [Widgets](../category/widgets) | UI elements rendered in-game | Buttons, panels, HUD displays |
| [Screens](../category/screens) | Full-screen UI interfaces | Main menu, crafting UI, settings |

### How Scripts Relate

```
Prefab (entity template)
├── Components          ← what the entity CAN do
│   ├── health
│   ├── inventory
│   └── combat
├── Stategraph          ← what the entity LOOKS like doing it
│   ├── idle
│   ├── walk
│   └── attack
└── Brain               ← what the entity DECIDES to do
    └── Behaviours      ← individual AI actions
```

### Interconnection Patterns

DST scripts are coupled through four mechanisms:

1. **Entity-Component**: Prefabs compose behavior by attaching components
2. **Event System**: Components communicate via `PushEvent` / `ListenForEvent`, avoiding direct references
3. **State Management**: Stategraphs drive animations and trigger logic at specific animation frames
4. **AI Framework**: Brains run a priority tree of Behaviours each tick to decide the entity's current action

### File Organization

```
dst-scripts/
├── components/       # ~200+ reusable behaviors
├── prefabs/          # entity templates
├── stategraphs/      # animation state machines
├── brains/           # AI controllers
├── behaviours/       # atomic AI actions
├── widgets/          # HUD and UI elements
├── screens/          # full-screen interfaces
├── map/              # world generation
└── util/             # shared helpers
```

## Common Patterns

### Component

```lua
local MyComponent = Class(function(self, inst)
    self.inst = inst
    self.value = 0
end)

function MyComponent:SetValue(val)
    self.value = val
    self.inst:PushEvent("valuechanged", {value = val})
end
```

### Event-Driven Communication

```lua
inst:ListenForEvent("healthdelta", function(inst, data)
    if data.newpercent <= 0.25 then
        inst:AddTag("lowhealth")
    end
end)
```

### Prefab Construction

```lua
local function fn()
    local inst = CreateEntity()

    inst.entity:AddTransform()
    inst.entity:AddAnimState()
    inst.entity:AddNetwork()

    inst.entity:SetPristine()
    if not TheWorld.ismastersim then return inst end

    inst:AddComponent("health")
    inst:AddComponent("inventory")
    inst:AddComponent("combat")

    inst.components.health:SetMaxHealth(100)

    return inst
end

return Prefab("myentity", fn, assets)
```

## Learning Path

Work through DST scripts in this order for the fastest mental model:

1. **Components** — understand what behaviors exist and how they're structured
2. **Prefabs** — see how components combine into complete entities; learn the `ismastersim` server/client split
3. **Stategraphs** — understand how animations and code interact via timeline events
4. **Brains + Behaviours** — learn how AI decisions are layered and prioritized

## Contributing

Found inaccurate information or missing coverage? The documentation is open for contributions:

- Open an issue or PR at [github.com/vietnd69/dst-api-webdocs](https://github.com/vietnd69/dst-api-webdocs)
- Reference the actual script source to verify correctness
- Practical examples and edge-case notes are especially valuable
