<script>
    import Portal from "svelte-portal/src/Portal.svelte";
    import { createPopper, popper } from '@popperjs/core';
	import { afterUpdate, onDestroy } from 'svelte';
    export let isVisible;
    export let referenceElement;
    let popperElement;
    let popperInstance;
    let previousReference = null;
    $: popperOptions = {
        modifiers: [
        { name: "offset", options: { offset: [30, -25] } },
        { name: "hide", enabled: true },
        { name: "flip", options: { fallbackPlacements: ['left', 'bottom'] } },
        ],
        placement: "right",
    };

    $: {
        if (!!popperElement) {
            console.log(popperElement);
            popperElement.addEventListener("click", (event) => {console.log(event)});
            console.log("created listener");
        }
    }

	afterUpdate(() => {
        if (referenceElement != previousReference) {
            if (!!popperInstance) {
                // Destroy element if it exists
                popperInstance.destroy();
                popperInstance = null;
            }
            if (!!referenceElement) {
                // Create a new popper instace
                popperInstance = createPopper(referenceElement, popperElement, popperOptions);
            }
        }
	});

    onDestroy(() => {
        if (!!popperInstance) {
                popperInstance.destroy();
            } 
    });

    

</script>

    <div
        class="popper"
        class:visible={!!referenceElement && isVisible}
        bind:this={popperElement}
    >
        <slot />
    </div>

  
<style>
.popper {
    transition: opacity 0.1s ease-in;
    opacity: 0;
    position: absolute;
    z-index: var(--layer-popover);
}
/* Hide the popper when the reference is hidden */
.popper.visible {
    opacity: 1;
}
</style>