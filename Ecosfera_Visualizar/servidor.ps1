# Servidor local de archivos. No requiere Node ni Python.
$ErrorActionPreference = 'Stop'
$raiz = $PSScriptRoot
$puerto = 8123
$servidor = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Loopback, $puerto)
try { $servidor.Start() } catch { Write-Host 'El puerto 8123 esta ocupado. Cierra la ventana anterior y vuelve a abrir ABRIR_PAGINA.bat.'; exit 1 }
Write-Host 'Ecosfera: http://127.0.0.1:8123/'
Write-Host 'Deja esta ventana abierta mientras usas la pagina. Para terminar, cierra la ventana.'
Start-Process "http://127.0.0.1:$puerto/"
try {
 while ($true) {
  $cliente = $servidor.AcceptTcpClient()
  try {
   $flujo = $cliente.GetStream()
   $flujo.ReadTimeout = 5000
   $lector = [System.IO.StreamReader]::new($flujo)
   $linea = $lector.ReadLine()
   if (-not $linea) { continue }
   while ($lector.ReadLine()) { }
   $ruta = [System.Uri]::UnescapeDataString(($linea.Split(' ')[1].Split('?')[0])).TrimStart('/')
   if (-not $ruta) { $ruta = 'index.html' }
   $archivo = [System.IO.Path]::GetFullPath((Join-Path $raiz $ruta))
   $permitido = $archivo.StartsWith($raiz + [System.IO.Path]::DirectorySeparatorChar, [System.StringComparison]::OrdinalIgnoreCase)
   $estado = '200 OK'
   $tipo = 'application/octet-stream'
   if ($permitido -and (Test-Path -LiteralPath $archivo -PathType Leaf)) {
    $tipos = @{ '.html'='text/html; charset=utf-8'; '.js'='text/javascript; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.json'='application/json; charset=utf-8'; '.png'='image/png'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml'; '.ico'='image/x-icon' }
    $ext = [System.IO.Path]::GetExtension($archivo).ToLowerInvariant()
    if ($tipos.ContainsKey($ext)) { $tipo = $tipos[$ext] }
    $datos = [System.IO.File]::ReadAllBytes($archivo)
   } else { $estado = '404 Not Found'; $datos = [System.Text.Encoding]::UTF8.GetBytes('Archivo no encontrado') }
   $cabecera = [System.Text.Encoding]::ASCII.GetBytes("HTTP/1.1 $estado`r`nContent-Type: $tipo`r`nContent-Length: $($datos.Length)`r`nConnection: close`r`nCache-Control: no-store`r`n`r`n")
   $flujo.Write($cabecera,0,$cabecera.Length)
   $flujo.Write($datos,0,$datos.Length)
   $flujo.Flush()
  } catch { Write-Host 'Conexion cerrada; el servidor continua disponible.' }
  finally { $cliente.Close() }
 }
} finally { $servidor.Stop() }
