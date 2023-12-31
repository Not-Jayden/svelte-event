# ⚡️ svelte-event

svelte-event provides a set of wrapper functions for adding modifiers to event handlers and a versatile `event` action for comprehensive event listener management in Svelte.

This package is primarily intended to address [the upcoming changes to events in Svelte 5](https://svelte-5-preview.vercel.app/docs/event-handlers), though is entirely compatible with Svelte 3 and 4 as well.

> 🚧 NOTE: This plugin is still in early development, use at your own risk.

## 🚀 Installation

```bash
# Using npm
npm install svelte-event

# Using yarn
yarn add svelte-event

# Using pnpm
pnpm add svelte-event

# Using bun
bun add svelte-event
```

## 💡 Usage

### Modifier Wrapper Functions
`svelte-event` provides several wrapper functions for modifying event behavior:

- `preventDefault`
- `stopPropagation`
- `stopImmediatePropagation`
- `self`
- `trusted`
- `once`

Note: `passive` requires use of the `event` action, as it requires access to the event listener options which is not possible using wrapper functions.

#### Using Wrapper Functions
Apply modifiers directly to event handlers:

```javascript
<script>
  import { once, preventDefault } from 'svelte-event';

  function handleClick(event) {
    // Click event logic
  }
</script>

<div onclick={once(preventDefault(handleClick))} />
```

#### Combining Modifiers with `withModifiers`
Use `withModifiers` to apply multiple modifiers using a configuration object:

```javascript
<script>
  import { withModifiers } from 'svelte-event';

  function handleClick(event) {
    // Click event logic
  }

  const modifiedHandler = withModifiers(handleClick, {
    preventDefault: true,
    stopPropagation: true
  });
</script>

<div onclick={modifiedHandler} />
```

#### Key Modifier
The `key` modifier allows you to specify a key that must be pressed for the event handler to execute:

```javascript
<script>
  import { key } from 'svelte-event/key';

  function handleKeydown(event) {
    // Keydown event logic
  }
</script>

<div onkeydown={key(handleKeydown, 'Enter')} />
```

You can also specify the set of modifier keys (`altKey`, `ctrlKey`, `metaKey`, `shiftKey`) that must be pressed for the event handler to execute:

```javascript
<script>
  import { key } from 'svelte-event/key';

  function handleKeydown(event) {
    // Keydown event logic
  }
</script>

<div onkeydown={key(handleKeydown, 'Enter', { ctrlKey: true, exact: true })} />
```

If the `exact` modifier is set to `true`, then the event handler will only execute if the specified key is pressed and no other modifier keys are pressed.


#### Mouse Modifiers
The package also provides `left`, `right`, and `middle` modifiers for mouse events, which only execute the event handler if the left, right, or middle mouse button is pressed, respectively:

```javascript
<script>
  import { left, right, middle } from 'svelte-event/mouse';

  function handleClick(event) {
    // Click event logic
  }
</script>

<div onclick={left(handleClick)} />
```
You can also specify the set of modifier keys (`altKey`, `ctrlKey`, `metaKey`, `shiftKey`) that must be pressed for the event handler to execute, as well as the `exact` modifier in the same way as the `key` modifier.


#### Compose Function
The `compose` function allows you to combine multiple wrapper functions into a single function:

```javascript
import { compose } from 'svelte-event';

const handler = compose(
  handler1,
  handler2,
);

// Use the composed handler in your Svelte component
<div onclick={handler} />
```

### Event Action
The `event` action in `svelte-event` allows you to attach event listeners to DOM elements, enabling detailed control through various modifiers.

#### Basic Example
```svelte
<script>
  import { event } from 'svelte-event';

  function handleClick() {
    // Click event logic
  }
</script>

<div use:event={{ click: handleClick }} />
```

#### Advanced Configuration
You can provide detailed configuration for event listeners, including multiple handlers, various modifiers, and specific event phases.

- **Multiple Handlers:**
  Attach several handlers to the same event:
  ```svelte
  <div use:event={{ click: { handlers: [handleClick1, handleClick2] } }} />
  ```

- **Event Modifiers:**
  Customize event behavior with modifiers such as `preventDefault`, `stopPropagation`, `passive`, and more:
  ```svelte
  <div use:event={{ click: { handler: handleClick, modifiers: { preventDefault: true } } }} />
  ```

- **Performance Optimization with `passive`:**
  Improve scrolling performance for touch and wheel events:
  ```svelte
  <div use:event={{ wheel: { modifiers: { passive: true } } }} />
  ```

- **Capture Phase with `capture`:**
  Execute event handler during the capture phase:
  ```svelte
  <div use:event={{ click: { modifiers: { capture: true } } }} />
  ```

## 📜 License
`svelte-event` is open source, licensed under the MIT License. For more information, see the [LICENSE](LICENSE) file.