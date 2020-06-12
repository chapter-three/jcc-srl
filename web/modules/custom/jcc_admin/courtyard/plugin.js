/*
* Youtube Embed Plugin
*
* @author Jonnas Fonini <jonnasfonini@gmail.com>
* @version 2.1.14
*/
(function () {
  CKEDITOR.plugins.add('youtube', {
    lang: ['en', 'bg', 'pt', 'pt-br', 'ja', 'hu', 'it', 'fr', 'tr', 'ru', 'de', 'ar', 'nl', 'pl', 'vi', 'zh', 'el', 'he', 'es', 'nb', 'nn', 'fi', 'et', 'sk', 'cs', 'ko', 'eu', 'uk'],
    init: function (editor) {
      editor.addCommand('youtube', new CKEDITOR.dialogCommand('youtube', {
        allowedContent: 'div{*}(*); iframe{*}[!width,!height,!src,!frameborder,!allowfullscreen,!allow]; object param[*]; a[*]; img[*]'
      }));
      
      editor.ui.addButton('Youtube', {
        label: editor.lang.youtube.button,
        toolbar: 'insert',
        command: 'youtube',
        icon: this.path + 'images/icon.png'
      });
      
      CKEDITOR.dialog.add('youtube', function (instance) {
        var video,
          disabled = editor.config.youtube_disabled_fields || [];
        
        return {
          title: editor.lang.youtube.title,
          minWidth: 510,
          minHeight: 200,
          onShow: function () {
            for (var i = 0; i < disabled.length; i++) {
              this.getContentElement('youtubePlugin', disabled[i]).disable();
            }
          },
          contents:
            [{
              id: 'youtubePlugin',
              expand: true,
              elements:
                [{
                  id: 'txtTitle',
                  type: 'text',
                  label: editor.lang.youtube.txtTitle,
                },
                {
                  id: 'txtEmbed',
                  type: 'textarea',
                  label: editor.lang.youtube.txtEmbed,
                }]
            }
            ],
          onOk: function () {
            var content = '';
  
            if (this.getContentElement('youtubePlugin', 'txtEmbed').isEnabled()) {
              const title = this.getValueOf('youtubePlugin', 'txtTitle');
              const body = this.getValueOf('youtubePlugin', 'txtEmbed');
              const randomId = +new Date();
              content += `<div class="jcc-read-more jcc-read-more--block cke-rm-wrapper">
                  <button class="jcc-read-more__trigger usa-button usa-button--unstyled" data-a11y-toggle="read-more-${randomId}">
                    ${title}
                    <svg class="icon icon-expand_more" role="img" title="Expand"><use href="#i-expand_more"></use></svg>
                  </button>
                  <div class="jcc-read-more__content" id="read-more-${randomId}">
                    ${body}
                  </div>
                </div>`
            }
            
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
          editor.getCommand('youtube').exec();
        }
      });
    }
  });
})();

function handleLinkChange(el, api) {
  var video = ytVidId(el.getValue());
  var time = ytVidTime(el.getValue());
  
  if (el.getValue().length > 0) {
    el.getDialog().getContentElement('youtubePlugin', 'txtEmbed').disable();
  }
  else if (!disabled.length || !disabled.includes('txtEmbed')) {
    el.getDialog().getContentElement('youtubePlugin', 'txtEmbed').enable();
  }
  
  if (video && time) {
    var seconds = timeParamToSeconds(time);
    var hms = secondsToHms(seconds);
    el.getDialog().getContentElement('youtubePlugin', 'txtStartAt').setValue(hms);
  }
}

/**
 * JavaScript function to match (and return) the video Id
 * of any valid Youtube Url, given as input string.
 * @author: Stephan Schmitz <eyecatchup@gmail.com>
 * @url: http://stackoverflow.com/a/10315969/624466
 */
function ytVidId(url) {
  var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  return (url.match(p)) ? RegExp.$1 : false;
}

/**
 * Matches and returns time param in YouTube Urls.
 */
function ytVidTime(url) {
  var p = /t=([0-9hms]+)/;
  return (url.match(p)) ? RegExp.$1 : false;
}

/**
 * Converts time in hms format to seconds only
 */
function hmsToSeconds(time) {
  var arr = time.split(':'), s = 0, m = 1;
  
  while (arr.length > 0) {
    s += m * parseInt(arr.pop(), 10);
    m *= 60;
  }
  
  return s;
}

/**
 * Converts seconds to hms format
 */
function secondsToHms(seconds) {
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds / 60) % 60);
  var s = seconds % 60;
  
  var pad = function (n) {
    n = String(n);
    return n.length >= 2 ? n : "0" + n;
  };
  
  if (h > 0) {
    return pad(h) + ':' + pad(m) + ':' + pad(s);
  }
  else {
    return pad(m) + ':' + pad(s);
  }
}

/**
 * Converts time in youtube t-param format to seconds
 */
function timeParamToSeconds(param) {
  var componentValue = function (si) {
    var regex = new RegExp('(\\d+)' + si);
    return param.match(regex) ? parseInt(RegExp.$1, 10) : 0;
  };
  
  return componentValue('h') * 3600
    + componentValue('m') * 60
    + componentValue('s');
}

/**
 * Converts seconds into youtube t-param value, e.g. 1h4m30s
 */
function secondsToTimeParam(seconds) {
  var h = Math.floor(seconds / 3600);
  var m = Math.floor((seconds / 60) % 60);
  var s = seconds % 60;
  var param = '';
  
  if (h > 0) {
    param += h + 'h';
  }
  
  if (m > 0) {
    param += m + 'm';
  }
  
  if (s > 0) {
    param += s + 's';
  }
  
  return param;
}
