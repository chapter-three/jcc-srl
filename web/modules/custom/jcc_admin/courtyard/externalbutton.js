(function () {
  const buttonLabel = 'Courtyard';
  const titleLabel = 'Add component';
  const textInputLabel = 'Title';
  const urlInputLabel = 'Url';
  const wrapperClass = 'cke-eb-wrapper';

  CKEDITOR.plugins.add('externalbutton', {
    lang: ['en'],
    init: function (editor) {
      editor.addCommand('externalbutton', new CKEDITOR.dialogCommand('externalbutton', {
        allowedContent: 'a[!href](usa-button, usa-button--external, external-button);div(cke-eb-wrapper)'
      }));
      
      editor.ui.addButton('externalbutton', {
        label: buttonLabel,
        toolbar: 'insert',
        command: 'externalbutton',
        icon: this.path + 'images/externalbutton.png'
      });
      
      CKEDITOR.dialog.add('externalbutton', function (instance) {

        return {
          title: titleLabel,
          minWidth: 510,
          minHeight: 200,
          onShow: function () {

            var selection = editor.getSelection();
            var wrapper = selection.getStartElement()

            if (wrapper.$.classList.contains(wrapperClass)) {
  
              let text = wrapper.getChild(1).getText();
              let url = wrapper.getChild(3).getText();
  
              this._.contents.externalbutton.text.setValue(text);
              this._.contents.externalbutton.url.setValue(url);
              
            }
          },
          contents:
            [{
              id: 'externalbutton',
              expand: true,
              elements:
                [{
                  id: 'text',
                  type: 'text',
                  label: textInputLabel,
                },
                {
                  id: 'url',
                  type: 'text',
                  label: urlInputLabel,
                }]
            }
            ],
          onOk: function () {
  
            const text = this.getValueOf('externalbutton', 'text');
            const url = this.getValueOf('externalbutton', 'url');
            const content = `<div class="cke-eb-wrapper">
<a class="usa-button usa-button--external external-button" href="${url}">${text}</a>
</div>`
            

            var element = CKEDITOR.dom.element.createFromHtml(content);
            var instance = this.getParentEditor();
            instance.insertElement(element);
          }
        };
      });
  
      // editor.on('doubleclick', function (evt) {
      //   const element = evt.data.element;
      //   const ancestors = element.getParents()
      //   let wrapper = null;
      //
      //   ancestors.forEach((ancestor, index) => {
      //     if (ancestor.$.classList.contains(wrapperClass)) {
      //       wrapper = ancestors[index]
      //     }
      //   });
      //
      //   if(wrapper != null) {
      //     editor.getSelection().selectElement(wrapper);
      //     editor.getCommand('externalbutton').exec();
      //   }
      // });
    }
  });
})();
