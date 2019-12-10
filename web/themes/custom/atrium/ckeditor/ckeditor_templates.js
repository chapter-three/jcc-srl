// Override the default template set
CKEDITOR.addTemplates('default', {
	// The name of sub folder which hold the shortcut preview images of the
	// templates.  Determine base path of drupal installation if any
	// (ckeditor could possibly be loaded w/o drupalSettings).
	imagesPath: ((drupalSettings && drupalSettings.path) ? drupalSettings.path.baseUrl : '/') + 'themes/custom/atrium/ckeditor/',

	// The templates definitions.
	templates: [ {
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
	} ]
} );
