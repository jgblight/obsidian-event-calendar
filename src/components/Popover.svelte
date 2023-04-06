<script>
    import Portal from "svelte-portal/src/Portal.svelte";
    import { createPopper } from '@popperjs/core';
	import { afterUpdate } from 'svelte';
    export let isVisible;
    export let referenceElement;
    let popperElement;
    let popperInstance;
    let previousReference = null;
    $: popperOptions = {
        modifiers: [
        { name: "offset", options: { offset: [20, 20] } },
        { name: "hide", enabled: true },
        { name: "flip", options: { fallbackPlacements: ['left', 'bottom'] } },
        ],
        placement: "right",
    };

	afterUpdate(() => {
        if (referenceElement != previousReference) {
            if (!!popperInstance) {
                // Destroy exisitng element if it exists
                popperInstance.destroy();
                popperInstance = null;
            }
            if (!!referenceElement) {
                // Create a new popper instace
                popperInstance = createPopper(referenceElement, popperElement, popperOptions);
            }
        }
	});

</script>
  
<Portal target=".app-container">
    <div
        class="popper"
        class:visible={!!referenceElement && isVisible}
        bind:this={popperElement}
    >
        <slot />
    </div>
</Portal>

  
<style>
.popper {
    transition: opacity 0.1s ease-in;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    z-index: var(--layer-popover);
}
/* Hide the popper when the reference is hidden */
.popper.visible {
    opacity: 1;
}
</style>