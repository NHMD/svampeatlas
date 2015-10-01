//checkbox
angular.module('xeditable').directive('editableMdCheckbox', ['editableDirectiveFactory',
  function(editableDirectiveFactory) {
    return editableDirectiveFactory({
      directiveName: 'editableMdCheckbox',
      inputTpl: '<md-checkbox md-no-ink aria-label="Present in DK"></md-checkbox>',
      render: function() {
        this.parent.render.call(this);
        if(this.attrs.eTitle) {
         // this.inputEl.wrap('<label></label>');
          this.inputEl.append(this.attrs.eTitle);
        }
      },
      autosubmit: function() {
        var self = this;
        self.inputEl.bind('change', function() {
          setTimeout(function() {
            self.scope.$apply(function() {
              self.scope.$form.$submit();
            });
          }, 500);
        });
      }
    });
}]);