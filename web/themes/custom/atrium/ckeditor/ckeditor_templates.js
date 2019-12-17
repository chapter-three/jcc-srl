// Override the default template set
CKEDITOR.addTemplates('default', {
	// The name of sub folder which hold the shortcut preview images of the
	// templates.  Determine base path of drupal installation if any
	// (ckeditor could possibly be loaded w/o drupalSettings).
	imagesPath: ((drupalSettings && drupalSettings.path) ? drupalSettings.path.baseUrl : '/') + 'themes/custom/atrium/ckeditor/',

	// The templates definitions.
	templates: [
    {
      title: 'List group',
      image: 'list-group.png',
      description: 'The "List group" component from Courtyard. Each item contains a title and paragraph.',
      html: '<ul class="jcc-list-group">' +
              '<li>' +
                '<p><strong>List item 1</strong></p>' +
                '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' +
              '</li>' +
              '<li>' +
                '<p><strong>List item 2</strong></p>' +
                '<p>Pellentesque non nunc quis sem malesuada bibendum.</p>' +
              '</li>' +
              '<li>' +
                '<p><strong>List item 3</strong></p>' +
                '<p>Etiam a est in est mollis fringilla tristique gravida leo.</p>' +
              '</li>' +
              '<li>' +
                '<p><strong>List item 4</strong></p>' +
                '<p>Fusce tempor nunc vel tellus suscipit scelerisque sed sit amet neque.</p>' +
              '</li>' +
              '<li>' +
                '<p><strong>List item 5</strong></p>' +
                '<p>Integer commodo ex nec lorem ullamcorper, a tristique neque efficitur.</p>' +
              '</li>' +
            '</ul>'
    },
    {
      title: 'Action list',
      image: 'action-list.png',
      description: 'The "Action list" component from Courtyard. Each item contains a title and brief description, followed by a button link.',
      html: '<ul class="jcc-action-list">' +
              '<li>' +
                '<div class="jcc-action-list__content">' +
                  '<p><strong>First brief sentence describing the action</strong></p>' +
                  '<p>One to two sentences providing addition details about the action link.</p>' +
                '</div>' +
                '<div class="jcc-action-list__action">' +
                  '<a class="usa-button usa-button--secondary" href="#">Button text</a>' +
                '</div>' +
              '</li>' +
              '<li>' +
                '<div class="jcc-action-list__content">' +
                  '<p><strong>Second brief sentence describing the action</strong></p>' +
                  '<p>One to two sentences providing addition details about the action link.</p>' +
                '</div>' +
                '<div class="jcc-action-list__action">' +
                  '<a class="usa-button usa-button--secondary" href="#">Button text longer</a>' +
                '</div>' +
              '</li>' +
              '<li>' +
                '<div class="jcc-action-list__content">' +
                  '<p><strong>Third brief sentence describing the action</strong></p>' +
                  '<p>One to two sentences providing addition details about the action link.</p>' +
                '</div>' +
                '<div class="jcc-action-list__action">' +
                  '<a class="usa-button usa-button--secondary" href="#">Button text</a>' +
                '</div>' +
              '</li>' +
              '<li>' +
                '<div class="jcc-action-list__content">' +
                  '<p><strong>Third brief sentence describing the action</strong></p>' +
                  '<p>One to two sentences providing addition details about the action link.</p>' +
                '</div>' +
                '<div class="jcc-action-list__action">' +
                  '<a class="usa-button usa-button--secondary" href="#">Button text</a>' +
                '</div>' +
              '</li>' +
              '<li>' +
                '<div class="jcc-action-list__content">' +
                  '<p><strong>Third brief sentence describing the action</strong></p>' +
                  '<p>One to two sentences providing addition details about the action link.</p>' +
                '</div>' +
                '<div class="jcc-action-list__action">' +
                  '<a class="usa-button usa-button--secondary" href="#">Button text</a>' +
                '</div>' +
              '</li>' +
            '</ul>'
    },
  ]
} );

