#!/bin/bash

# Merge Reports
npx mochawesome-merge test/cypress/reports/mocha/*.json > test/cypress/reports/mocha/index.json
npx marge test/cypress/reports/mocha/index.json -f cypress-report.html -o test/cypress/reports

# Message Slack with artifacts.

# Set an empty diff message block.
read -r -d '' reportBlock <<-EOF
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "End to End Report: Not Available :confounded:"
  }
}
EOF

if [ -f "test/cypress/reports/cypress-report.html" ] ; then
  # Set the artifact url.
  report=${CIRCLE_BUILD_URL}/artifacts/${CIRCLE_NODE_INDEX}/reports/cypress-report.html
  # We have a report so set the reportBlock with the new message and link.
  read -r -d '' reportBlock <<-EOF
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "End to End Report"
  },
  "accessory": {
    "type": "button",
    "text": {
      "type": "plain_text",
      "text": "View Report :page_facing_up:",
      "emoji": true
    },
    "value": "report",
    "url": "${report}",
    "action_id": "button-action"
  }
}
EOF

fi

# Set an empty diff message block.
read -r -d '' diffBlock <<-EOF
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "Visual Regression Testing: No Diffs :tada:"
  }
}
EOF

if [[ "$vrtFail" == true && -f "test/cypress/reports/cypress-report.html" ]] ; then
  # We have diffs so set the diffBlock with the new message and link.
  read -r -d '' diffBlock <<-EOF
{
  "type": "section",
  "text": {
    "type": "mrkdwn",
    "text": "Visual Regression Testing"
  },
  "accessory": {
    "type": "button",
    "text": {
      "type": "plain_text",
      "text": "See Diffs :eyes:",
      "emoji": true
    },
    "value": "diffs",
    "url": "${report}",
    "action_id": "button-action"
  }
}
EOF

fi

read -r -d '' MESSAGE <<-EOF
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Cypress Tests: ${baseUrl}",
        "emoji": true
      }
    },
    ${reportBlock},
    ${diffBlock}
  ]
}
EOF

if [ $CALVIN_SLACK ] ; then
  curl -s -i -d "$MESSAGE" $CALVIN_SLACK #> /dev/null
  echo -e "\nPinged Slack.\n"
fi
