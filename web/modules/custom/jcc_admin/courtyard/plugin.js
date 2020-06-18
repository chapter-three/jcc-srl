(function () {
  CKEDITOR.plugins.add('courtyard', {
    lang: ['en'],
    init: function (editor) {
      editor.addCommand('courtyard', new CKEDITOR.dialogCommand('courtyard', {
        allowedContent: 'div(jcc-*, usa-*, cke-*);'
      }));
      
      editor.ui.addButton('courtyard', {
        label: editor.lang.courtyard.button,
        toolbar: 'insert',
        command: 'courtyard',
        icon: this.path + 'images/icon.png'
      });
      
      CKEDITOR.dialog.add('courtyard', function (instance) {

        return {
          title: editor.lang.courtyard.title,
          minWidth: 510,
          minHeight: 200,
          onShow: function () {

            var selection = editor.getSelection();
            var wrapper = selection.getStartElement()

            if (wrapper.$.classList.contains('cke-rm-wrapper')) {
  
              let title = wrapper.getChild(1).getText();
              let body = wrapper.getChild(3).getText();
  
              this._.contents.courtyard.txtTitle.setValue(title);
              this._.contents.courtyard.txtBody.setValue(body);
              
            }
          },
          contents:
            [{
              id: 'courtyard',
              expand: true,
              elements:
                [{
                  id: 'txtTitle',
                  type: 'text',
                  label: editor.lang.courtyard.txtTitle,
                },
                {
                  id: 'txtBody',
                  type: 'textarea',
                  label: editor.lang.courtyard.txtEmbed,
                }]
            }
            ],
          onOk: function () {
  
            const title = this.getValueOf('courtyard', 'txtTitle');
            const body = this.getValueOf('courtyard', 'txtBody');
            const randomId = +new Date();
            const content = `<div class="jcc-read-more jcc-read-more--block cke-rm-wrapper">
                <button class="jcc-read-more__trigger usa-button usa-button--unstyled" data-a11y-toggle="read-more-${randomId}">${title}<svg class="icon icon-expand_more" role="img" title="Expand"><use href="#i-expand_more"></use></svg>
                </button>
                <div class="jcc-read-more__content" id="read-more-${randomId}">${body}</div>
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
          if (ancestor.$.classList.contains('cke-rm-wrapper')) {
            wrapper = ancestors[index]
          }
        });
    
        if(wrapper != null) {
          editor.getSelection().selectElement(wrapper);
          editor.getCommand('courtyard').exec();
        }
      });
    }
  });
})();
