<script lang="ts">
  export let items: string;
</script>

<div class="agenda">
  <ul>
    {#each items as item}
        <li>{item}</li>
    {/each}
  </ul>
</div>

<style>
  .number {
    color: red;
  }
</style>