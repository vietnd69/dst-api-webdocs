---
id: crafting-overview
title: Crafting Systems Overview
description: Overview of crafting mechanics and recipe management systems in DST API
sidebar_position: 0
slug: game-scripts/core-systems/game-mechanics/crafting
last_updated: 2025-06-21
build_version: 676042
change_status: stable
category_type: gameplay-system
system_scope: item creation and recipe management
---

# Crafting Systems Overview

## Build Information
Current documentation based on build version: **676042**
Last updated: **2025-06-21**

## System Purpose

The Crafting Systems category implements the complete item creation and recipe management infrastructure in Don't Starve Together. These systems transform raw materials into useful items through structured recipes, technology requirements, and user interface interactions that define the core survival gameplay loop.

### Key Responsibilities
- Define and manage all crafting recipes and their requirements
- Control technology tree progression and prototyper unlocks
- Provide filtering and organization for crafting menu interface
- Handle user preferences and recipe customization
- Support character-specific and station-based crafting restrictions
- Manage item trading and upgrade systems

### System Scope
This category includes all crafting-related mechanics but excludes raw material gathering (handled by World Systems) and tool usage mechanics (handled by Fundamentals).

## Architecture Overview

### System Components
Crafting systems are implemented as interconnected modules that handle recipe definitions, user interface organization, technology progression, and player preferences through a layered architecture.

### Data Flow
```
Recipe Definition → Tech Validation → UI Organization → User Interaction
       ↓                ↓               ↓                ↓
   Ingredient Check → Station Check → Filter Display → Craft Action
       ↓                ↓               ↓                ↓
   Resource Cost → Builder Ability → Menu Profile → Item Creation
```

### Integration Points
- **Character Systems**: Builder capabilities and character-specific recipes
- **Fundamentals**: Action system and entity creation framework
- **Data Management**: Recipe data persistence and user preferences
- **User Interface**: Crafting menu displays and interaction handling
- **World Systems**: Resource availability and crafting station placement

## Recent Changes

| Build | Date | Component | Change Type | Description |
|----|---|-----|----|----|
| 676042 | 2025-06-21 | [Recipe System Core](./recipe.md) | stable | Current recipe and ingredient framework |
| 676042 | 2025-06-21 | [Crafting Sorting](./crafting_sorting.md) | stable | Recipe organization and prioritization |
| 676042 | 2025-06-21 | [Crafting Menu Profile](./craftingmenuprofile.md) | stable | User preferences and customization |
| 675312 | 2023-11-15 | [Tech Tree](./techtree.md) | enhanced | Extended technology categories |
| 675312 | 2023-11-15 | [Recipe Filters](./recipes_filter.md) | enhanced | Improved categorization system |

## Core Crafting Modules

### [Recipe System Core](./recipe.md)
Foundation classes for defining crafting recipes and ingredients.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Recipe Classes](./recipe.md#recipe-class) | stable | Core recipe and ingredient definitions | Recipe2 constructor, ingredient validation |
| [Helper Functions](./recipe.md#helper-functions) | stable | Recipe validation and utility functions | Character/tech ingredient detection |
| [Global Functions](./recipe.md#global-functions) | stable | Recipe retrieval and management | GetValidRecipe, validation checks |

### [Recipes System](./recipes.md)
Complete recipe definitions and implementation framework.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Recipe Definitions](./recipes.md#recipe-class) | stable | All base game crafting recipes | Comprehensive recipe database |
| [Tech Integration](./recipes.md#tech-tree) | stable | Technology requirement system | Prototyper integration, tech levels |
| [Character Recipes](./recipes.md#character-specific-recipes) | stable | Character-exclusive crafting | Builder tags, skill tree integration |

### [Technology Tree](./techtree.md)
Technology progression and research level management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Tech Types](./techtree.md#available_tech) | stable | Available technology categories | Science, magic, ancient, celestial |
| [Bonus System](./techtree.md#bonus_tech) | stable | Technology bonus mechanics | Temporary research bonuses |
| [Tech Tree Creation](./techtree.md#create) | stable | Technology tree initialization | Default value setup |

### [Recipe Filters](./recipes_filter.md)
Crafting menu categorization and organization system.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Filter Definitions](./recipes_filter.md#crafting_filter_defs) | stable | Recipe category definitions | Tools, weapons, armor, magic |
| [Character Filters](./recipes_filter.md#character-specific-recipes) | stable | Character-specific recipe organization | Character avatars, builder tags |
| [Special Event Filters](./recipes_filter.md#special-event-recipes) | stable | Seasonal and event recipe categories | Winter's Feast, Halloween, yearly events |

### [Crafting Sorting](./crafting_sorting.md)
Recipe organization and prioritization system for the crafting menu.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Default Sort](./crafting_sorting.md#defaultsort-class) | stable | Filter-based recipe organization | Category-based sorting |
| [Craftable Sort](./crafting_sorting.md#craftablesort-class) | stable | Craftability prioritization | Buffered, craftable, uncraftable categories |
| [Favorite Sort](./crafting_sorting.md#favoritesort-class) | stable | User preference ordering | Favorite recipe prioritization |
| [Alpha Sort](./crafting_sorting.md#alphasort-class) | stable | Alphabetical organization | Consistent alphabetical listing |

### [Crafting Menu Profile](./craftingmenuprofile.md)
User preferences and customization management.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Profile Management](./craftingmenuprofile.md#craftingmenuprofile) | stable | User preference persistence | Save/load functionality |
| [Favorites System](./craftingmenuprofile.md#add-favorite) | stable | Recipe favorite management | Add, remove, check favorites |
| [Pinned Recipes](./craftingmenuprofile.md#set-pinned-recipe) | stable | Quick access recipe pinning | Multiple pages, navigation |
| [Sort Preferences](./craftingmenuprofile.md#set-sort-mode) | stable | Sorting mode customization | User-defined sort order |

### [Trade Recipes](./trade_recipes.md)
Item trading and upgrade recipe configuration.

| Module | Status | Description | Key Features |
|-----|-----|----|-----|
| [Trade Definitions](./trade_recipes.md#trade_recipes) | stable | Item upgrade configurations | Rarity-based trading system |
| [Upgrade Recipes](./trade_recipes.md#recipe-definitions) | stable | Specific upgrade requirements | Common, Classy, Spiffy upgrades |

## Common Crafting Patterns

### Basic Recipe Creation
```lua
-- Standard crafting recipe pattern
Recipe2("spear",
    {
        Ingredient("twigs", 2),
        Ingredient("flint", 1),
        Ingredient("rope", 1)
    },
    TECH.NONE,
    {
        atlas = "images/inventoryimages.xml",
        image = "spear.tex"
    }
)
```

### Character-Specific Crafting
```lua
-- Character-restricted recipe
Recipe2("lighter",
    {
        Ingredient("twigs", 2),
        Ingredient("flint", 1)
    },
    TECH.NONE,
    {
        builder_tag = "pyromaniac", -- Willow only
        atlas = "images/inventoryimages.xml",
        image = "lighter.tex"
    }
)
```

### Technology-Gated Crafting
```lua
-- Science station requirement
Recipe2("alchemy_engine",
    {
        Ingredient("boards", 4),
        Ingredient("cutstone", 2),
        Ingredient("goldnugget", 6)
    },
    TECH.SCIENCE_ONE,
    {
        placer = "alchemy_engine_placer",
        min_spacing = 3.2
    }
)
```

### User Preference Management
```lua
-- Crafting menu profile usage
local profile = CraftingMenuProfile()
profile:Load()

-- Manage favorites
profile:AddFavorite("torch")
profile:SetPinnedRecipe(1, "spear", "spear_wathgrithr")
profile:SetSortMode(CRAFTING_SORT_MODE.CRAFTABLE)

-- Save changes
profile:Save()
```

## Crafting System Dependencies

### Required Systems
- [Fundamentals](../fundamentals/index.md): Action system and entity framework for item creation
- [Character Systems](../character-systems/index.md): Builder capabilities and character restrictions
- [Data Management](../data-management/index.md): Recipe data persistence and user preferences

### Optional Systems
- [World Systems](../world-systems/index.md): Resource availability and crafting station placement
- [User Interface](../user-interface/index.md): Crafting menu displays and interaction handling
- [Networking](../networking-communication/index.md): Multiplayer recipe synchronization

## Performance Considerations

### Memory Usage
- Recipe definitions are cached for fast lookup during crafting validation
- Sorting systems use lazy evaluation to minimize unnecessary calculations
- User preferences are persisted efficiently with delta compression
- Filter systems optimize recipe categorization through indexed lookups

### Performance Optimizations
- Recipe validation uses fast hash table lookups for ingredient checking
- Crafting menu updates batch UI operations to reduce frame drops
- Sort systems cache intermediate results to avoid repeated calculations
- Technology tree lookups are optimized through pre-computed bonus tables

### Scaling Considerations
- Recipe system supports unlimited custom recipes through mod integration
- Sorting algorithms handle large recipe databases efficiently
- User preference system scales to accommodate extensive customization
- Filter system maintains performance with growing recipe counts

## Development Guidelines

### Best Practices
- Always validate recipe ingredients and technology requirements before crafting
- Use Recipe2 constructor for new recipes to ensure proper initialization
- Implement character restrictions through builder tags rather than custom logic
- Cache frequently accessed recipe data to improve crafting menu performance
- Test recipe sorting and filtering with large datasets to ensure scalability

### Common Pitfalls
- Bypassing recipe validation can lead to invalid item creation
- Direct Recipe class usage is deprecated; use AddRecipe2 for mod compatibility
- Forgetting to update recipe filters when adding new recipes
- Not considering multiplayer synchronization for user preference changes
- Implementing custom sorting logic without leveraging existing framework

### Testing Strategies
- Test all recipe combinations with proper ingredient availability
- Verify technology requirements work correctly with all prototyper types
- Test character-specific recipes with appropriate and inappropriate characters
- Validate crafting menu performance with maximum recipe database size
- Test user preference persistence across save/load cycles

## Crafting Integration Patterns

### With Character Systems
Crafting integrates deeply with character capabilities:
- Builder component validates recipe requirements against character abilities
- Character tags restrict access to specialized recipes
- Skill tree progression unlocks advanced crafting options
- Character stats may be consumed as crafting ingredients

### With World Systems
Crafting interacts with the game world through:
- Crafting stations provide technology level access
- Resource nodes supply raw materials for recipes
- Placement systems validate structure crafting locations
- Environmental conditions may affect crafting availability

### With User Interface
Crafting drives user interface elements:
- Recipe browsers display available crafting options with proper filtering
- Sorting systems organize recipes based on user preferences
- Progress indicators show crafting completion status
- Error messages communicate crafting requirement failures

## Balancing Considerations

### Recipe Economy
- Ingredient costs balance resource scarcity with item utility
- Technology requirements create meaningful progression paths
- Character restrictions encourage diverse team composition
- Crafting station placement creates strategic world planning

### Progression Pacing
- Recipe unlocks follow logical difficulty progression
- Technology tree advancement matches exploration milestones
- Character-specific recipes provide meaningful specialization
- Advanced recipes require investment in infrastructure

## Troubleshooting Crafting Issues

### Common Crafting Problems
| Issue | Symptoms | Solution |
|----|----|----|
| Recipes not appearing | Missing from crafting menu | Check tech requirements and builder tags |
| Ingredients not recognized | Crafting fails with available items | Verify ingredient type and amount specification |
| Sorting not working | Recipes appear in wrong order | Check sorting system configuration and cache state |
| Preferences not saving | Settings reset on reload | Verify profile save/load functionality |
| Character restrictions failing | Wrong characters can craft | Check builder tag assignments and validation |

### Debugging Crafting Systems
- Use recipe debug commands to verify ingredient requirements
- Check technology tree state with debug overlays
- Inspect crafting menu profile data for corruption
- Review recipe filter assignments for proper categorization
- Test multiplayer synchronization for preference changes

## Performance Monitoring

### Key Metrics
- Recipe lookup time during crafting validation
- Crafting menu update frequency and duration
- Sorting system performance with large recipe sets
- User preference save/load operation timing
- Memory usage for recipe and filter data structures

### Optimization Strategies
- Cache frequently accessed recipe data structures
- Batch crafting menu updates to reduce UI refresh overhead
- Optimize sorting algorithms for common usage patterns
- Minimize preference data serialization overhead
- Use lazy loading for recipe filter initialization

## Future Development

### Extensibility Design
- Recipe system supports unlimited mod-added recipes
- Filter framework accommodates new categorization schemes
- Sorting system allows custom prioritization algorithms
- User preference system extends to new customization options

### Integration Planning
- New crafting mechanics should leverage existing recipe framework
- Consider multiplayer implications for all user preference features
- Plan for mod compatibility when extending core crafting systems
- Design for backward compatibility when modifying recipe structures

## Related Systems

| System | Relationship | Integration Points |
|-----|-----|----|
| [Achievements](../achievements/index.md) | Crafting milestone tracking | Recipe craft counters, first-time crafting |
| [Containers](../containers/index.md) | Ingredient storage management | Inventory access, item retrieval |
| [Cooking](../cooking/index.md) | Food preparation system | Shared ingredient types, cooking recipes |
| [Special Events](../special-events/index.md) | Seasonal recipe availability | Event-gated recipes, temporary unlock |

## Contributing to Crafting Systems

### Adding New Recipes
1. Define recipe using Recipe2 constructor with proper ingredients and tech requirements
2. Assign appropriate filter category for crafting menu organization
3. Test character restrictions and technology requirements thoroughly
4. Update related documentation and provide usage examples

### Modifying Recipe Systems
1. Understand current recipe dependencies and integration points
2. Maintain backward compatibility with existing recipes
3. Update related sorting and filtering systems as needed
4. Test performance impact with large recipe databases

### Documentation Standards
- Document all recipe parameters and their effects
- Provide clear examples for common crafting patterns
- Explain integration with character and technology systems
- Include troubleshooting guidance for common issues
