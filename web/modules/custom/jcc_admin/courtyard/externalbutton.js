(function () {
  CKEDITOR.plugins.add('externalbutton', {
    lang: ['en'],
    init: function (editor) {
      editor.addCommand('externalbutton', new CKEDITOR.dialogCommand('externalbutton', {
        allowedContent: 'div{*}(*); iframe{*}[!width,!height,!src,!frameborder,!allowfullscreen,!allow]; object param[*]; a[*]; img[*]'
      }));
      
      editor.ui.addButton('externalbutton', {
        label: editor.lang.courtyard.button,
        toolbar: 'insert',
        command: 'externalbutton',
        icon: this.path + 'images/externalbutton.png'
      });
      
      CKEDITOR.dialog.add('externalbutton', function (instance) {

        return {
          title: editor.lang.courtyard.title,
          minWidth: 510,
          minHeight: 200,
          onShow: function () {

            var selection = editor.getSelection();
            var wrapper = selection.getStartElement()

            if (wrapper.$.classList.contains('cke-eb-wrapper')) {
  
              let title = wrapper.getChild(1).getText();
              let body = wrapper.getChild(3).getText();
  
              this._.contents.externalbutton.txtTitle.setValue(title);
              this._.contents.externalbutton.txtBody.setValue(body);
              
            }
          },
          contents:
            [{
              id: 'externalbutton',
              expand: true,
              elements:
                [{
                  id: 'txtTitle',
                  type: 'text',
                  label: editor.lang.courtyard.txtTitle,
                },
                {
                  id: 'url',
                  type: 'text',
                  label: editor.lang.courtyard.txtUrl,
                }]
            }
            ],
          onOk: function () {
  
            const title = this.getValueOf('externalbutton', 'txtTitle');
            const url = this.getValueOf('externalbutton', 'url');
            const content = `<div class="cke-eb-wrapper">
<a class="usa-button usa-button--external external-button" href="${url}">${title}</a>
</div>`
            

            var element = CKEDITOR.dom.element.createFromHtml(content);
            var instance = this.getParentEditor();
            instance.insertElement(element);
          }
        };
      });
  
      editor.on('doubleclick', function (evt) {
        const element = evt.data.element;
        const ancestors = element.getParents()
        let wrapper = null;
  
        ancestors.forEach((ancestor, index) => {
          if (ancestor.$.classList.contains('cke-eb-wrapper')) {
            wrapper = ancestors[index]
          }
        });
    
        if(wrapper != null) {
          editor.getSelection().selectElement(wrapper);
          editor.getCommand('externalbutton').exec();
        }
      });
    }
  });
})();
