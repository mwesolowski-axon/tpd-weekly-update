param(
  [Parameter(Mandatory = $true)]
  [string]$ConfigPath
)

$config = Get-Content -Raw -Encoding UTF8 -Path $ConfigPath | ConvertFrom-Json

$outlook = New-Object -ComObject Outlook.Application
$mail = $outlook.CreateItem(0)
$mail.To = $config.To
$mail.CC = $config.Cc
$mail.Subject = $config.Subject
$mail.HTMLBody = Get-Content -Raw -Encoding UTF8 -Path $config.HtmlPath
$mail.Display() | Out-Null
