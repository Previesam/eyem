import Vue from "vue";
import VueFroala from "vue-froala-wysiwyg";
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins/align.min.js";
import "froala-editor/js/plugins/char_counter.min.js";
import "froala-editor/js/plugins/code_beautifier.min.js";
import "froala-editor/js/plugins/code_view.min.js";
import "froala-editor/js/plugins/colors.min.js";
import "froala-editor/js/plugins/draggable.min.js";
import "froala-editor/js/plugins/emoticons.min.js";
import "froala-editor/js/plugins/font_family.min.js";
import "froala-editor/js/third_party/font_awesome.min.js";
import "froala-editor/js/plugins/font_size.min.js";
import "froala-editor/js/plugins/image.min.js";
import "froala-editor/js/plugins/image_manager.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/lists.min.js";
import "froala-editor/js/plugins/paragraph_format.min.js";
import "froala-editor/js/plugins/paragraph_style.min.js";
import "froala-editor/js/plugins/quick_insert.min.js";
import "froala-editor/js/third_party/spell_checker.min.js";
import "froala-editor/js/plugins/entities.min.js";
import "froala-editor/js/plugins/inline_style.min.js";
import "froala-editor/js/plugins/quote.min.js";
import "froala-editor/js/plugins/special_characters.min.js";
import "froala-editor/js/plugins/line_breaker.min.js";
import "froala-editor/js/plugins/inline_style.min.js";
import "froala-editor/js/plugins/table.min.js";
import "froala-editor/js/plugins/url.min.js";
import "froala-editor/js/plugins/video.min.js";
import "froala-editor/js/plugins/word_paste.min.js";
import "froala-editor/js/plugins/inline_class.min.js";
import "froala-editor/js/plugins/line_height.min.js";
import "froala-editor/js/plugins/link.min.js";
import "froala-editor/js/plugins/url.min.js";
// import "froala-editor/js/plugins/block_styles.min.js";
// import FroalaEditor from "froala-editor";
// FroalaEditor.DefineIcon("insert", { NAME: "plus", SVG_KEY: "add" });
// FroalaEditor.RegisterCommand("insert", {
//   title: "Insert HTML",
//   focus: true,
//   undo: true,
//   refreshAfterCallback: true,
//   callback: function() {
//     this.html.insert(
//       '<p><strong><span style="color: rgb(255, 0, 0);">My New HTML</span></strong></p>'
//     );
//   }
// });
// FroalaEditor.TOOLBAR_BUTTONS.moreRich.buttons.unshift("insert");

Vue.use(VueFroala);
