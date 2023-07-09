<template>
  <div></div>
</template>

<script lang="ts">
interface Person {
  name: string;
}

type Xiaoming = Person & {
  age: number;
}

export interface Animal {
  fly: () => void;
}

export default {
  name: 'Test'
}
</script>
