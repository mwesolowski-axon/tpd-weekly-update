param(
  [Parameter(Mandatory = $true)]
  [string]$HtmlPath,
  [Parameter(Mandatory = $true)]
  [string]$PlainPath
)

Add-Type -AssemblyName System.Windows.Forms

$cfHtml = Get-Content -Raw -Path $HtmlPath
$plain = Get-Content -Raw -Path $PlainPath
$dataObject = New-Object System.Windows.Forms.DataObject
$dataObject.SetData([System.Windows.Forms.DataFormats]::Html, $cfHtml)
$dataObject.SetData([System.Windows.Forms.DataFormats]::Text, $plain)
[System.Windows.Forms.Clipboard]::SetDataObject($dataObject, $true)
