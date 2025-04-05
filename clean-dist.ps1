Write-Host "Removing compiled dist files..."

# Remove app dist files
Get-ChildItem -Path src\app -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

# Remove components dist files
Get-ChildItem -Path src\components -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

# Remove hooks dist files
Get-ChildItem -Path src\hooks -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

# Remove lib dist files
Get-ChildItem -Path src\lib -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

# Remove providers dist files
Get-ChildItem -Path src\providers -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

# Remove services dist files
Get-ChildItem -Path src\services -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

# Remove store dist files
Get-ChildItem -Path src\store -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

# Remove utils dist files
Get-ChildItem -Path src\utils -Recurse -Filter dist -Directory | ForEach-Object {
    Write-Host "Cleaning $($_.FullName)"
    Remove-Item -Path "$($_.FullName)\*.js" -Force
}

Write-Host "Cleaning complete!"
