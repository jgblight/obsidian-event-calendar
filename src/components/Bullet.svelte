<script lang="ts">
  export let color: string;
  export let size: number;
</script>

<svg
  class="dot"
  style="color:{color}; height:{size}px; width:{size}px;"
  viewBox="0 0 6 6"
  xmlns="http://www.w3.org/2000/svg"
>
  <circle
    stroke="none"
    fill="currentColor"
    cx="3"
    cy="3"
    r="2"></circle>
</svg>

<style>
  .dot {
    display: inline-block;
    margin: 1px;
    vertical-align: text-top;
  }
</style>