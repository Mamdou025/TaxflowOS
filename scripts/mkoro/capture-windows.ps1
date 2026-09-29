$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Windows.Forms
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class MkoroDesktop {
    [DllImport("user32.dll")] public static extern IntPtr OpenInputDesktop(uint flags, bool inherit, uint access);
    [DllImport("user32.dll")] public static extern bool CloseDesktop(IntPtr desktop);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern bool GetUserObjectInformation(IntPtr handle, int index, StringBuilder info, int length, out int needed);
    [DllImport("user32.dll")] public static extern bool SetProcessDPIAware();
}
'@

$desktop = [IntPtr]::Zero
$bitmap = $null
$graphics = $null
$scaled = $null
$scaledGraphics = $null
$stream = $null
$parameters = $null
try {
    if (-not [Environment]::UserInteractive) { throw 'Desktop unavailable' }
    $desktop = [MkoroDesktop]::OpenInputDesktop(0, $false, 1)
    if ($desktop -eq [IntPtr]::Zero) { throw 'Desktop unavailable' }
    $name = New-Object System.Text.StringBuilder 256
    $needed = 0
    if (-not [MkoroDesktop]::GetUserObjectInformation($desktop, 2, $name, 512, [ref]$needed) -or $name.ToString() -ne 'Default') {
        throw 'Desktop unavailable'
    }
    [void][MkoroDesktop]::SetProcessDPIAware()
    $bounds = [System.Windows.Forms.SystemInformation]::VirtualScreen
    if ($bounds.Width -lt 1 -or $bounds.Height -lt 1 -or $bounds.Width -gt 16384 -or $bounds.Height -gt 16384 -or ([long]$bounds.Width * $bounds.Height) -gt 32000000) {
        throw 'Desktop dimensions unsupported'
    }
    $bitmap = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
    $ratio = [Math]::Min(1.0, 1600.0 / [Math]::Max($bounds.Width, $bounds.Height))
    $width = [Math]::Max(1, [int][Math]::Floor($bounds.Width * $ratio))
    $height = [Math]::Max(1, [int][Math]::Floor($bounds.Height * $ratio))
    $scaled = New-Object System.Drawing.Bitmap $width, $height
    $scaledGraphics = [System.Drawing.Graphics]::FromImage($scaled)
    $scaledGraphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $scaledGraphics.DrawImage($bitmap, 0, 0, $width, $height)
    $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' } | Select-Object -First 1
    $stream = New-Object System.IO.MemoryStream
    $parameters = New-Object System.Drawing.Imaging.EncoderParameters 1
    foreach ($quality in @(65, 40, 20)) {
        $stream.SetLength(0)
        $stream.Position = 0
        if ($parameters.Param[0]) { $parameters.Param[0].Dispose() }
        $parameters.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), ([long]$quality)
        $scaled.Save($stream, $codec, $parameters)
        if ($stream.Length -le 524288) { break }
    }
    if ($stream.Length -gt 524288) { throw 'Desktop image too large' }
    @{
        mimeType = 'image/jpeg'
        data = [Convert]::ToBase64String($stream.ToArray())
        width = $width
        height = $height
        capturedAt = [DateTime]::UtcNow.ToString('o')
    } | ConvertTo-Json -Compress
} catch {
    # Never print captured contents, local account details, or arbitrary exception messages.
    [Console]::Error.WriteLine('SCREEN_UNAVAILABLE')
    exit 1
} finally {
    if ($parameters) { $parameters.Dispose() }
    if ($stream) { $stream.Dispose() }
    if ($scaledGraphics) { $scaledGraphics.Dispose() }
    if ($scaled) { $scaled.Dispose() }
    if ($graphics) { $graphics.Dispose() }
    if ($bitmap) { $bitmap.Dispose() }
    if ($desktop -ne [IntPtr]::Zero) { [void][MkoroDesktop]::CloseDesktop($desktop) }
}
