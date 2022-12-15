$headers = New-Object "System.Collections.Generic.Dictionary[[String],[String]]"
$headers.Add("Content-Type", "application/json")
$headers.Add("Authorization", ${env:basicAuth})

$body = "{
`n    `"definitionId`": { `"id`": 186 },
`n    `"templateParamenters`": [
`n        { `"azureServiceConnection`": `"`" },
`n        { `"siteEnvPrefixLocal`": `"`" },
`n        { `"siteFarmId`": `"`" },
`n        { `"siteId`": `"`" },
`n        { `"uniqueMod`": `"`" },
`n        { `"containerRegistry`": `"`" },
`n        { `"tag`": `"`" },
`n        { `"sourceBranchName`": `"`" }
`n    ]
`n}
`n"

$response = Invoke-RestMethod 'https://dev.azure.com/calcourtsdevops/Hosted-Court-Web-Services-Non-Prod/_apis/pipelines/186/runs?&api-version=6.1-preview.1' -Method 'POST' -Headers $headers -Body $body
$response | ConvertTo-Json
