# Download Project Script
# This script creates a zip file of the entire project for offline use

$projectName = "WishOne"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$zipFileName = "${projectName}_backup_${timestamp}.zip"

Write-Host "Creating backup of $projectName project..."
Write-Host "Zip file will be created as: $zipFileName"

# Create a temporary directory to copy files to before zipping
$tempDir = ".\temp_backup_$timestamp"
New-Item -ItemType Directory -Path $tempDir -Force | Out-Null

# Copy all files except excluded directories
Write-Host "Copying project files (excluding node_modules, .git, etc.)..."
Get-ChildItem -Path .\ -Exclude "node_modules", ".git", "dist", "build", "temp_backup_*" | 
    Copy-Item -Destination $tempDir -Recurse -Force

# Create the zip file
Write-Host "Creating zip file..."
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFileName -Force

# Clean up the temporary directory
Write-Host "Cleaning up temporary files..."
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Backup completed successfully!"
Write-Host "Your project has been saved to: $zipFileName"
Write-Host "You can now download this file for offline use." 