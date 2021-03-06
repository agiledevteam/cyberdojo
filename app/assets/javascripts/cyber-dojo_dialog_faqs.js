/*global $,cyberDojo*/

var cyberDojo = (function(cd, $) {
  "use strict";

  cd.dialog_faqs = function() {

    var noListen =
      cd.divPanel(
          'No. Listen. Stop trying to go faster, start trying to go <em>slower</em>.<br/>'
        + "Don't think about finishing, think about <em>improving</em>.<br/>"
        + 'Think about <em>practising</em> as a <em>team</em>.<br/>'
        + "That's what cyber-dojo is built for."
      );

    var add = "Why don't you add ";
    var hilight = add + "syntax highlighting ?";
    var refactor = add + "simple auto-refactoring ?";
    var any = add + "... ?";

    var faqs = $(cd.makeTable(hilight,noListen,refactor,noListen,any,noListen));
      
    cd.dialog(faqs.html(), 550, 'faqs');
  };

  return cd;
})(cyberDojo || {}, $);



