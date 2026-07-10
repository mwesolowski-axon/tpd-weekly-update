param(
  [Parameter(Mandatory = $true)]
  [string]$ConfigPath
)

$config = Get-Content -Raw -Path $ConfigPath | ConvertFrom-Json

$outlook = New-Object -ComObject Outlook.Application
$mail = $outlook.CreateItem(0)
$mail.To = $config.To
$mail.CC = $config.Cc
$mail.Subject = $config.Subject
$mail.HTMLBody = Get-Content -Raw -Path $config.HtmlPath
$mail.Display() | Out-Null
