import { defineComponent } from "vue"
import { ImportImages } from "../../utils/ImportImages"

const svg = ImportImages(require.context('./assets/svg/', false, /\.(png|jpe?g|svg)$/));

export default defineComponent({
  data() {
    return {
      svg,
    }
  }
  
});