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
                  id: 'txtEmbed',
                  type: 'textarea',
                  label: editor.lang.youtube.txtEmbed,
                },
                  {
                    type: 'hbox',
                    widths: ['70%', '15%', '15%'],
                    children:
                      [
                        {
                          id: 'txtUrl',
                          type: 'text',
                          label: editor.lang.youtube.txtUrl,
                          onChange: function (api) {
                            handleLinkChange(this, api);
                          },
                          onKeyUp: function (api) {
                            handleLinkChange(this, api);
                          },
                        },
                        {
                          type: 'text',
                          id: 'txtWidth',
                          width: '60px',
                          label: editor.lang.youtube.txtWidth,
                          'default': editor.config.youtube_width != null ? editor.config.youtube_width : '640',
                        },
                        {
                          type: 'text',
                          id: 'txtHeight',
                          width: '60px',
                          label: editor.lang.youtube.txtHeight,
                          'default': editor.config.youtube_height != null ? editor.config.youtube_height : '360',
                        }
                      ]
                  },
                  {
                    type: 'hbox',
                    widths: ['55%', '45%'],
                    children:
                      [
                        {
                          id: 'chkResponsive',
                          type: 'checkbox',
                          label: editor.lang.youtube.txtResponsive,
                          'default': editor.config.youtube_responsive != null ? editor.config.youtube_responsive : false
                        },
                        {
                          id: 'chkNoEmbed',
                          type: 'checkbox',
                          label: editor.lang.youtube.txtNoEmbed,
                          'default': editor.config.youtube_noembed != null ? editor.config.youtube_noembed : false
                        }
                      ]
                  },
                  {
                    type: 'hbox',
                    widths: ['55%', '45%'],
                    children:
                      [
                        {
                          id: 'chkRelated',
                          type: 'checkbox',
                          'default': editor.config.youtube_related != null ? editor.config.youtube_related : true,
                          label: editor.lang.youtube.chkRelated
                        },
                        {
                          id: 'chkOlderCode',
                          type: 'checkbox',
                          'default': editor.config.youtube_older != null ? editor.config.youtube_older : false,
                          label: editor.lang.youtube.chkOlderCode
                        }
                      ]
                  },
                  {
                    type: 'hbox',
                    widths: ['55%', '45%'],
                    children:
                      [
                        {
                          id: 'chkPrivacy',
                          type: 'checkbox',
                          label: editor.lang.youtube.chkPrivacy,
                          'default': editor.config.youtube_privacy != null ? editor.config.youtube_privacy : false
                        },
                        {
                          id: 'chkAutoplay',
                          type: 'checkbox',
                          'default': editor.config.youtube_autoplay != null ? editor.config.youtube_autoplay : false,
                          label: editor.lang.youtube.chkAutoplay
                        }
                      ]
                  },
                  {
                    type: 'hbox',
                    widths: ['55%', '45%'],
                    children:
                      [
                        {
                          id: 'txtStartAt',
                          type: 'text',
                          label: editor.lang.youtube.txtStartAt,
                        },
                        {
                          id: 'chkControls',
                          type: 'checkbox',
                          'default': editor.config.youtube_controls != null ? editor.config.youtube_controls : true,
                          label: editor.lang.youtube.chkControls
                        }
                      ]
                  }
                ]
            }
            ],
          onOk: function () {
            var content = '';
  
            if (this.getContentElement('youtubePlugin', 'txtEmbed').isEnabled()) {
              const body = this.getValueOf('youtubePlugin', 'txtEmbed');
              const randomId = +new Date();
              content += `<div class="jcc-read-more jcc-read-more--block">
                  <button class="jcc-read-more__trigger usa-button usa-button--unstyled" data-a11y-toggle="read-more-${randomId}">
                    Read More
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
