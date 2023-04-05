<script lang="ts">
  export let color: string;
</script>

<svg
  class="dot"
  style="color:{color}"
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
    height: 12px;
    width: 12px;
    margin: 1px;
    vertical-align: text-top;
  }
</style>