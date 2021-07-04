<script>
import { he } from "date-fns/locale";
export default {
  props: {
    selected: Boolean,
    newBlock: Boolean,
    children: Array,
    type: String
  },

  data: function(vm) {
    return {
      focused: false,
      hovered: false
    };
  },

  mounted() {
    console.log(this.$children);
  },
  render(h) {
    const visible =
      this.hovered || this.focused || this.selected || this.newBlock;
    let items = [
      ...this.$slots.default.filter(vnode => vnode.tag !== undefined)
    ];

    items = items.map(vnode => vnode.children);
    console.log(items);
    return (
      <v-container
        selected={this.selected}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        type={this.type}
      >
        <v-card>
          <v-card-title
            type={this.type}
            v-model={this.focused}
            height="40px"
            class="text-body-2 rounded"
          >
            {
              h("v-card-title", items)
            }
          </v-card-title>
          <v-card-text
            onFocus={this.handleFocus}
            OnBlur={this.handleBlur}
            focused={this.focused}
            class={visible ? "visibleLines" : null}
            type={this.type}
          ></v-card-text>
        </v-card>
      </v-container>
    );
  },

  methods: {
    handleFocus() {
      this.focused = true;
    },
    handleBlur() {
      this.focused = false;
    },
    handleMouseEnter() {
      this.hovered = true;
    },
    handleMouseLeave() {
      this.hovered = false;
    }
  }
};
</script>

<style></style>
