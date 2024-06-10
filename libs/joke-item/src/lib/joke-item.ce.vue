<template>
  <Card v-if="joke">
    <template #content>
      <div class="flex flex-column p-3">
        <div class="flex mb-2 pt-2 justify-content-between">
          <div class="flex gap-2 mt-2 mb-2">
            <Tag :value="joke.type"></Tag>
          </div>
          <div class="flex gap-2">
            <Button icon="pi" rounded text raised @click="emitEvent('listen')">
              <i class="pi pi-volume-up"></i>
            </Button>
            <Button icon="pi pi-trash" rounded text raised @click="emitEvent('remove')">
              <i class="pi pi-trash"></i>
            </Button>
          </div>
        </div>
        <p class="mb-1">{{ joke.setup }}</p>
        <Divider />
        <p class="mt-1">{{ joke.punchline }}</p>
      </div>
    </template>
  </Card>
  <Card v-else>
    <template #content>
      Loading...
    </template>
  </Card>
</template>

<script>
import { ref, toRefs,  } from 'vue';
import Card from 'primevue/card';
import Tag from 'primevue/tag';
import Button from 'primevue/button';
import Divider from 'primevue/divider';

export default {
  name: 'JokeItemComponent',
  props: {
    joke: {
      type: Object
    },
  },
  components: {
    Card,
    Tag,
    Button,
    Divider
  },
  emits: ['listen', 'edit', 'remove'],
  setup(props, { emit }) {
    const { joke } = toRefs(props);

    const emitEvent = (eventName) => {
      emit(eventName, joke.value);
    };

    return {
      joke,
      emitEvent
    };
  },
};
</script>

<style scoped>
@import 'primevue/resources/themes/lara-light-blue/theme.css';
@import 'primevue/resources/primevue.min.css';
@import 'primeflex/primeflex.css';
@import 'primeicons/primeicons.css';
</style>
