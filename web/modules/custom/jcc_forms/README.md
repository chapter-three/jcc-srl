# JCC Forms

## Form Info Pages

## Forms Search API

## How-tos

### How to publish updates to forms

1) In the jcc-srl repo, update [`web/modules/custom/jcc_forms/jcc_forms.csv`](jcc_forms.csv). Commit your change, push to github, and deploy to live.

2) Log in with `terminus`:

```
terminus auth:login
```

3) Run the migration:

Replace `<env>` with the name of the environment where you want to run the migration. E.g. `live` or `develop` or `pr-187`.

```
terminus drush -- jcc-srl.<env> migrate-import jcc_form_prefix --update
terminus drush -- jcc-srl.<env> migrate-import jcc_form_category --update
terminus drush -- jcc-srl.<env> migrate-import jcc_form --update
```

### How to add links to translated forms 

### How to add form descriptions 

### How to update an existing form category 

### How to add a new form category 

### How to add new elements to the Form Info pages

### How to change the way form search results are sorted