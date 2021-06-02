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
import FroalaEditor from "froala-editor";
FroalaEditor.DefineIcon("my_dropdown", { NAME: "plus", SVG_KEY: "add" });

FroalaEditor.RegisterCommand("my_dropdown", {
  title: "Insert Blocks",
  type: "dropdown",
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  options: {
    "<p class='fr-class-footer' style='text-align: center;'>Eyemasters Limited<br>35, Freedom Way, Ikate Lagos.<br><a href='https://eyemastersng.com' target='_blank'><span style='color: rgb(255, 255, 255);'>www.eyemastersng.com</span></a><br><span style='color: rgb(255, 255, 255);font-size: 18px;'><a href='https://facebook.com/eyemastersnigeria' target='_blank'><i class='fa  fa-facebook-square fr-deletable'></i></a>&nbsp; <a href='https://twitter.com/eye_mastersng' target='_blank'><i class='fa  fa-twitter-square fr-deletable'>&nbsp;</i></a> <a href='https://instagram.com/eyemasters' target='_blank'><i class='fa  fa-instagram fr-deletable'>&nbsp;</i></a></span><br><span style='color: rgb(255, 255, 255);'><a href='https://twitter.com/eye_mastersng' target='_blank'></a><a href='https://instagram.com/eyemasters' target='_blank'></a></span></p>":
      "Footer Section",
    "<span style='color: rgb(255, 255, 255);font-size: 18px;'><a href='https://facebook.com/eyemastersnigeria' target='_blank'><i class='fa  fa-facebook-square fr-deletable'></i></a>&nbsp; <a href='https://twitter.com/eye_mastersng' target='_blank'><i class='fa  fa-twitter-square fr-deletable'>&nbsp;</i></a> <a href='https://instagram.com/eyemasters' target='_blank'><i class='fa  fa-instagram fr-deletable'>&nbsp;</i></a></span>":
      "Social Links",
    "<a target='_blank' href='https://eyemastersng.com'>www.eyemastersng.com</a>":
      "Website",
    "<a class='fr-class-button' href='' target='_blank'><span style='color: rgb(255, 255, 255);'><strong>Activate</strong></span></a>": "Button",
    "<p><a href='http://www.eyemastersng.com' rel='noopener noreferrer' target='_blank'><img src='https://eyemastersng.com/wp-content/uploads/2020/02/Logo-New.png' style='width: 300px;' class='fr-fic fr-dib'></a></p>":
      "Logo"
  },
  callback: function(cmd, val) {
    this.html.insert(val);
  },
  // Callback on refresh.
  refresh: function($btn) {
    // console.log("do refresh");
  },
  // Callback on dropdown show.
  refreshOnShow: function($btn, $dropdown) {
    // console.log("do refresh when show");
  }
});

FroalaEditor.DefineIcon("placeholders", {
  NAME: "fontAwesome",
  SVG_KEY: "fontAwesome"
});

FroalaEditor.RegisterCommand("placeholders", {
  title: "Insert Placeholder",
  type: "dropdown",
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  options: {
    "{{ receiver_name }}": "Receiver Name",
    "{{ sender_name }}": "Sender Name",
    "{{ receiver_email }}": "Receiver Email",
    "{{ sender_email }}": "Sender Email",
    "<a class='fr-class-button' href='{{ user_activation }}' target='_blank'>Activate</a>":
      "User Activation Link",
    "{{ current_user_name }}": "Current User Name"
  },
  callback: function(cmd, val) {
    this.html.insert(val);
  },
  // Callback on refresh.
  refresh: function($btn) {
    // console.log("do refresh");
  },
  // Callback on dropdown show.
  refreshOnShow: function($btn, $dropdown) {
    // console.log("do refresh when show");
  }
});

FroalaEditor.TOOLBAR_BUTTONS.moreRich.buttons.unshift("my_dropdown");

FroalaEditor.TOOLBAR_BUTTONS.moreRich.buttons.unshift("placeholders");

Vue.use(VueFroala);
